import React, { useState, useCallback, useRef, useEffect, useContext, useMemo, } from 'react';
import { Modal, Collapse, Button, Input, } from 'antd';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { StyledProfileInfo } from '../../styles/messaging';
import { Avatar, Flex, } from '../../styles';
import AvatarInitials from '../UI/AvatarInitials'
import Axios, { rocketAxios } from '../../utils/axios';
import { CommunicationsContext } from './index';
import { useLocale } from "../../utils/locale";
import { fetchWorkingGroups } from '../../graphql/workingGroups';
import { indexBy, roleNames, groupTitleToUrl, } from '../../utils';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

const memberSchema = { role: '', member_groups: [], leader_groups: [], img: '' }

function CreateGroupConversation(props) {
  const myAccount = useSelector(state => state.auth.account || {});
  const { selectedUser, accounts, rocketAuth, allMembersById, allAccountsById, setSelectedUser } = useContext(CommunicationsContext);
  const [members, setMembers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [memberIds, setMemberIds] = useState(props.selectedMembers.map(item => item._id) || []);
  const [errors, setErrors] = useState({});
  const [title, setTitle] = useState('');
  const [t] = useLocale();

  const handleSearch = useCallback((e) => {
    const data = members.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
    setIsSearchActive(true);
    setSearchResults(data);
  }, [query, members]);

  const fetchUsers = useCallback(async () => {
    const { token, user_id: userId } = rocketAuth;
    const res = await rocketAxios.get('/users.list',
      {
        headers: { 'X-Auth-Token': `${token}`, 'X-User-Id': userId }
      });
    if (res.data.success) {
      setMembers(res.data.users)
    }
  }, [setMembers, rocketAuth]);

  const addToGroup = useCallback(async (id) => {
    try {
      const { token, user_id: userId } = rocketAuth;
      const res = await rocketAxios.post('/groups.invite',
        { roomId: selectedUser.rid, userId: id },
        {
          headers: { 'X-Auth-Token': `${token}`, 'X-User-Id': userId }
        });
      if (res.data.success) {
        setMemberIds(members => [...members, id]);
        props.fetchGroupMembers();
      }
    }
    catch (err) {
      console.log(err.response);
    }
  }, [rocketAuth, selectedUser]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOk = (e) => {
    setTitle('');
    setMembers([]);
    props.handleModal();
  };

  const handleCancel = (e) => {
    setTitle('');
    setMembers([]);
    props.handleModal();
  };

  const allMembers = isSearchActive ? searchResults : members;

  return (
    <Modal
      title={null}
      footer={null}
      zIndex={1080}
      onOk={handleOk}
      destroyOnClose={true}
      onCancel={handleCancel}
      visible={props.visible}
    >
      <StyledProfileInfo>
        <h2 style={styles.title}>{t("Add new members")}</h2>
        <Flex jc="space-between" style={{ padding: "0 0 20px 0", borderBottom: '1px solid #e7e7e7', }}>
          <div id="inner-search-wrapper" style={{ width: '100%' }}>
            <Input
              type="search"
              value={query}
              id="search-title"
              autoComplete="off"
              style={{ width: '100%' }}
              placeholder={t('Search member')}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.which === 13) {
                  return handleSearch(e);
                };
              }}
            />
            {query &&
              <span onClick={() => {
                setQuery('');
                setIsSearchActive(false);
                setSearchResults([])
              }}>x</span>}
          </div>
          <Button
            onClick={handleSearch}
            type="link"
            style={{ marginLeft: 7 }}
            icon={<SearchOutlined />}
            shape="round"
            type="primary"
          />
        </Flex>
        <ul className="group-members" style={{ height: '100%', maxHeight: 300, overflow: 'auto' }}>
          {allMembers.map(item => {
            const img = allAccountsById[item.username]?.photo;
            const data = allMembersById[item.username] ?? memberSchema;

            if (!memberIds.includes(item._id)) {
              return (
                <li key={item._id} className="group-members__item">
                  { img ? <Avatar img={img.url} className="group-members__item__img" />
                    : <AvatarInitials name={item.name} className="group-members__item__img" />
                  }
                  <div className="group-members__item__name">
                    <div className="member-title">{item.name}</div>
                    <Collapse expandIconPosition="right" className="collapse-wrapper" activeKey={item.username} bordered={false}>
                      <Collapse.Panel
                        key={item.username}
                        header={<span className="text-capitalize">{roleNames[data.role]}</span>}
                        // showArrow={[...data.member_groups, ...data.leader_groups].length > 0}
                        showArrow={false}
                        disabled={[...data.member_groups, ...data.leader_groups].length === 0}
                      >
                        <ul>
                          {
                            data.leader_groups.map(group => {
                              return <li key={group.id}><Link to={`/working-group/${groupTitleToUrl(group.title)}`}>{group?.title}</Link> - {t("as a leader")}</li>
                            })
                          }
                          {
                            data.member_groups.map(group => {
                              return <li key={group.title}><Link to={`/working-group/${groupTitleToUrl(group.title)}`}>{group?.title}</Link></li>
                            })
                          }
                        </ul>

                      </Collapse.Panel>
                    </Collapse>
                  </div>
                  <Button
                    disabled={item.username === myAccount.id}
                    onClick={() => addToGroup(item._id)}
                    shape="round"
                    type="primary"
                    icon={<PlusOutlined />}
                  >
                    {t('Add')}
                  </Button>
                </li>
              )
            }
            return null
          })}
        </ul>
      </StyledProfileInfo>
    </Modal >
  );
}

const styles = {
  title: {
    fontSize: 24,
    fontWeight: 400,
    lineHeight: '30px',
    color: '#252A32',
  },
};

export default CreateGroupConversation;
