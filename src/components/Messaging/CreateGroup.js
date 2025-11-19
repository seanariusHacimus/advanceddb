import React, { useState, useCallback, useRef, useEffect, useContext, useMemo, } from 'react';
import { Modal, Select, Table, Radio, Divider } from 'antd'; // Using Ant components for messaging forms
import { WorkingGroup } from '../../styles/workingGroup';
import {
  Input, InputWrapper, Flex, Button, ButtonPrimary,
} from '../../styles';
import { CommunicationsContext } from './index';
import { useLocale } from "../../utils/locale";
import { fetchWorkingGroupMemberIDs } from '../../graphql/workingGroups';
import { indexBy } from '../../utils';
import { rocketAxios } from "../../utils/axios";

function CreateGroupConversation(props) {
  const { setSelectedUser, accounts, rocketAuth, conversations, allAccountsById, setNewConversation } = useContext(CommunicationsContext);
  const [members, setMembers] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [groups, setGroups] = useState([]);
  const [errors, setErrors] = useState({});
  const [title, setTitle] = useState('');
  const titleRef = useRef(null);
  const [t] = useLocale();

  const columns = [
    {
      title: 'Working group',
      dataIndex: 'title',
      render: (text) => <a>{t(text)}</a>,
    },
    {
      title: 'Members',
      dataIndex: 'members',
      render: (val, record) => `${[...record.members, ...record.leaders].length} ${t('members')}`
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      let allMemberIds = [];
      selectedRows.forEach(item => {
        [...item.leaders, ...item.members].map(i => {
          allMemberIds.push(i.id);
        });
      });
      setSelectedRowKeys(selectedRowKeys);
      setMembers(allMemberIds);
    },
  };

  useEffect(() => {
    async function getGroups() {
      const res = await fetchWorkingGroupMemberIDs();
      if (res.success) {
        return setGroups(res.data);
      }
      return setGroups([]);
    }
    getGroups();
  }, []);

  const checkGroupIsExist = useCallback(async () => {
    try {
      const groupTitle = title.trim().length ? title : titleRef.current.value;
      const { token, user_id: userId } = rocketAuth;
      const { data } = await rocketAxios.get(`/groups.list`,
        {
          headers: { 'X-Auth-Token': `${token}`, 'X-User-Id': userId }
        });
      const filterByName = data.groups.filter(item => item.name.toLowerCase() === groupTitle.toLowerCase().replace(/\s/g, '-'));
      return filterByName.length === 0;
    }
    catch (err) {
      return false;
    }
  }, [rocketAuth, title]);


  const createNewGroup = useCallback(async () => {
    const isNewGroup = await checkGroupIsExist();
    if (isNewGroup) {
      setNewConversation({
        id: 'newGroup',
        rid: 'newGroup',
        fname: title,
        roles: ["owner"],
        name: title,
        usersCount: members.length + 1,
        members: [...new Set(members)],
        t: 'p',
      });
      props.handleModal();
    } else {
      setErrors({ 'error-duplicate-channel-name': t('The group name exists. Choose another name') });
    }

  }, [members, title, rocketAuth])

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

  console.log(groups);

  return (
    <WorkingGroup>
      <Modal
        title={null}
        footer={null}
        zIndex={1080}
        onOk={handleOk}
        destroyOnClose={true}
        onCancel={handleCancel}
        visible={props.visible}
      >
        <h2 style={styles.title}>{t("New conversation")}</h2>
        <InputWrapper className="has-messages">
          <Input
            required
            type="text"
            name="title"
            value={title}
            ref={titleRef}
            id="wg-title"
            autoComplete="off"
            className={`dynamic-input ${(title) ? 'has-value' : ''} ${(errors['error-duplicate-channel-name'] || errors.isRequired) ? 'input-error' : ''}`}
            onChange={e => setTitle(e.target.value)}
          />
          <label htmlFor="" onClick={() => titleRef.current.focus()}>{t("Add subject *")}</label>
          {
            (errors['error-duplicate-channel-name'] || errors.isRequired) &&
            <span className="input-msg error-msg" style={{ alignSelf: 'flex-start' }}>
              {errors['error-duplicate-channel-name'] || errors.isRequired}
            </span>
          }

        </InputWrapper>

        <Table
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
          key="id"
          rowKey="id"
          style={{
            marginBottom: 15,
            height: '100%',
            maxHeight: 300,
            overflow: 'scroll',
          }}
          columns={columns}
          dataSource={groups}
          pagination={{
            pageSize: groups.length,
            hideOnSinglePage: true
          }}
        />
        {members.length ? <p><b>{[...new Set(members)].length}</b> {t('members selected')}</p> : null}
        <Flex style={{ marginTop: 10 }}>
          <Button type="reset" onClick={handleCancel}
            style={{ height: 51, marginRight: 12 }}>{t("Cancel")}</Button>
          <ButtonPrimary disabled={(!title)} onClick={createNewGroup}>{t("Start messaging")}</ButtonPrimary>
        </Flex>
      </Modal>
    </WorkingGroup>
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
