import React, { useState, useCallback, useContext, } from 'react';
import { Modal, Select } from 'antd';
import { WorkingGroup } from '../../styles/workingGroup';
import {
  InputWrapper, Flex, Button, ButtonPrimary,
} from '../../styles';
import { CommunicationsContext } from './index';
import { useLocale } from "../../utils/locale";
import { useSelector } from 'react-redux';


function CreateGroupConversation(props) {
  const { setSelectedUser, accounts, rocketAuth, conversations, allAccountsById, setNewConversation } = useContext(CommunicationsContext);
  const [members, setMembers] = useState([]);
  const [t] = useLocale();
  const myAccount = useSelector(state => state.auth.account || {});

  const createConversation = useCallback(async () => {
    // Find if conversation is exist between 2 people
    const isConversationExist = conversations.find(item => {
      return item.rid === rocketAuth.user_id + allAccountsById[members]?._id || item.rid === allAccountsById[members]?._id + rocketAuth.user_id
    });

    props.handleModal();
    return isConversationExist?._id ?
      setSelectedUser(isConversationExist)
      :
      setNewConversation({
        _id: 'newGroup',
        id: 'newGroup',
        rid: 'newGroup',
        members: members,
        fname: allAccountsById[members[0]]?.name,
        name: allAccountsById[members[0]]?.username,
        t: 'd',
        status: 'offline'
      });
  }, [members, rocketAuth]);

  const createDirectMessages = useCallback(async () => {
    console.log(members);
    const { names, usernames } = members.reduce((acc, item) => {
      acc.names.push(allAccountsById[item].name);
      acc.usernames.push(allAccountsById[item].username);
      return acc
    }, { names: [], usernames: [] });


    console.log(names)
    props.handleModal();
    const data = {
      _id: 'newGroup',
      id: 'newGroup',
      rid: 'newGroup',
      members,
      fname: names.join(','),
      name: usernames.join(','),
      usernames: members,
      multiple: true,
      t: 'd',
      status: 'offline'
    }
    console.log(data)
    setNewConversation(data);
  }, [members, rocketAuth]);



  const handleOk = (e) => {
    setMembers([]);
    props.handleModal();
  };

  const handleCancel = (e) => {
    setMembers([]);
    props.handleModal();
  };
  console.log(members);
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
        <div style={{ padding: '5px 25px' }}>
          <h2 style={styles.title}>{t("New conversation")}</h2>
          <InputWrapper className="has-messages">
            <Select
              showSearch
              placeholder={t("Select a member *")}
              onChange={(val) => setMembers([...new Set(val)])}
              value={members}
              style={{ width: '100%' }}
              className={`custom-select`}
              optionFilterProp="children"
              allowClear
              mode="multiple"
              getPopupContainer={(node) => node.parentNode}
              dropdownStyle={{ backgroundColor: '#535263', padding: 10 }}
            >
              {
                accounts.map((item) => {
                  if (item.username === myAccount.id) {
                    return null
                  }
                  return (
                    <Select.Option
                      key={item.username}
                      className="select-item"
                      value={item.username}
                    >
                      {item.name}
                    </Select.Option>
                  )
                })
              }
            </Select>
            <label htmlFor="" className="custom-select-label">{t("Select a member *")}</label>
          </InputWrapper>

          <Flex>
            <Button type="reset" onClick={handleCancel}
              style={{ height: 51, marginRight: 12 }}>{t("Cancel")}</Button>
            <ButtonPrimary disabled={!members} onClick={members.length > 1 ? createDirectMessages : createConversation}> {t("Start messaging")}</ButtonPrimary>
          </Flex>
        </div>
      </Modal>
    </WorkingGroup >
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
