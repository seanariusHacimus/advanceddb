import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Table, List } from 'antd'; // Using Ant components for data display
import { StyledWorkingGroup } from '../../styles/workingGroup';
import { Flex, TitleH1, ButtonPrimary } from '../../styles';
import { fetchOrganizations } from '../../graphql/organizations';
import NewOrganization from './NewOrganization';
import EditableArea from './EditableArea';
import {useLocale} from "../../utils/locale";


function WorkingGroupList(props) {
  const user = useSelector(state => state.auth.account || { r77ole: 'member' });
  const [organizations, setOrganizations] = useState([]);
  const [newOrganization, setNewOrganization] = useState(false);
  const [t] = useLocale()

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => fetchOrganizations().then(data => {
    setOrganizations(data);
  });

  const modalHandler = useCallback(() => {
    setNewOrganization(status => !status);
  }, [setNewOrganization]);

  const sortedOrganizations = useMemo(() => organizations.sort((a, b) => {
    if (a.title.toLowerCase() > b.title.toLowerCase()) {
      return 1
    } else if (a.title.toLowerCase() < b.title.toLowerCase()) {
      return -1
    }
    return 0
  }))
  return (
    <StyledWorkingGroup>
      <Flex>
        <TitleH1 margin="20px 0">{t("Organizations")}</TitleH1>
        <ButtonPrimary className="small" style={{ marginLeft: 'auto' }} onClick={modalHandler}>{t("New Organization")}</ButtonPrimary>
      </Flex>

      <List
        size="large"
        grid={{ gutter: 20, column: 1, md: 2, lg: 2, xl: 3, xxl: 3, }}
        dataSource={sortedOrganizations}
        className="organization-list"
        rowKey="id"
        renderItem={item => {
          const isAuthorized = ['superuser', 'coordinator'].includes(user.role);
          return (
            <List.Item className="icons-set">
              <div className="item-title">
                {
                  isAuthorized ?
                    <EditableArea title={item.title} id={item.id} fetchOrganizations={fetchData} />
                    :
                    <div>{item.title}</div>
                }
              </div>
            </List.Item>
          )
        }}
      />
      <NewOrganization visible={newOrganization} modalHandler={modalHandler} fetchOrganizations={fetchData} />
    </StyledWorkingGroup>
  );
}


export default withRouter(WorkingGroupList);
