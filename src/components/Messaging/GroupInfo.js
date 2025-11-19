import React, { useContext, useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Collapse, Button, message } from 'antd'; // Using Ant components for messaging
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { StyledProfileInfo, StyledChatHeader } from '../../styles/messaging';
import { useLocale } from '../../utils/locale';
import { Avatar } from '../../styles';
import { CommunicationsContext } from './index';
import groupImage from '../../assets/messaging/group.svg';
import AvatarInitials from '../UI/AvatarInitials';
import { Trash2, UserPlus, LogOut, ChevronLeft } from 'lucide-react';
import { groupTitleToUrl, roleNames } from '../../utils';
import Loader from '../UI/SpinnerLocal';
import { rocketAxios } from "../../utils/axios";

const AddMemberToGroup = lazy(() => import('./AddMemberToGroup'));
const memberSchema = { role: '', member_groups: [], leader_groups: [], img: '' }

export default function MembersList(props) {
  const [t] = useLocale()
  const myAccount = useSelector(state => state.auth.account);
  const { allMembersById = {}, selectedUser, rocketAuth, allAccountsById = {}, setSelectedUser, setConversations } = useContext(CommunicationsContext);
  const [members, setMembers] = useState([]);
  const [showMemberModal, setShowMemberModal] = useState(false);

  const fetchGroupMembers = useCallback(async () => {
    const { token, user_id: userId } = rocketAuth;
    if (selectedUser.rid) {
      const res = await rocketAxios.get(`/groups.members?roomId=${selectedUser.rid}`,
        {
          headers: { 'X-Auth-Token': `${token}`, 'X-User-Id': userId }
        });
      const info = await rocketAxios.get(`/groups.info?roomId=${selectedUser.rid}`,
        {
          headers: { 'X-Auth-Token': `${token}`, 'X-User-Id': userId }
        });
      console.log(info);
      console.log(res.data);
      if (res.data.success) {
        setMembers(res.data.members)
      }
    };
  }, [setMembers, selectedUser, rocketAuth]);

  const removeMember = useCallback(async (id) => {
    const { token, user_id: userId } = rocketAuth;
    if (selectedUser.rid) {
      const res = await rocketAxios.post(`/groups.kick`,
        { roomId: selectedUser.rid, userId: id },
        {
          headers: { 'X-Auth-Token': `${token}`, 'X-User-Id': userId }
        });
      if (res.data.success) {
        setMembers(state => state.filter(item => item._id !== id));
      }
    };
  }, [setMembers, selectedUser, rocketAuth]);

  const removeRoom = useCallback(async (msgId) => {
    const { token, user_id: userId } = rocketAuth;
    const { data } = await rocketAxios.post(`/groups.delete`,
      { roomId: selectedUser.rid },
      {
        headers: { 'X-Auth-Token': `${token}`, 'X-User-Id': userId }
      });

    if (data.success) {

      message.success({
        content: t('Room has been removed successfully'),
        duration: 5,
        style: {
          right: 30,
          top: 120,
          position: 'fixed',
          fontSize: 16,
        },
      });

      props.hideGroup();

      setSelectedUser({
        _id: '',
        _updatedAt: '',
        usernames: ['', ''],
        lastMessage: { msg: '', u: { name: '', username: '' } }
      });
      setConversations(state => state.filter(i => i.rid !== selectedUser.rid));
    }

  }, [selectedUser, rocketAuth]);

  const leaveRoom = useCallback(async (msgId) => {
    const { token, user_id: userId } = rocketAuth;
    const { data } = await rocketAxios.post(`/groups.leave`,
      { roomId: selectedUser.rid },
      {
        headers: { 'X-Auth-Token': `${token}`, 'X-User-Id': userId }
      });

    if (data.success) {

      message.success({
        content: t('You have left the room successfully'),
        duration: 5,
        style: {
          right: 30,
          top: 120,
          position: 'fixed',
          fontSize: 16,
        },
      });

      props.hideGroup();

      setSelectedUser({
        rid: '',
        _updatedAt: '',
        usernames: ['', ''],
        lastMessage: { msg: '', u: { name: '', username: '' } }
      });
      setConversations(state => state.filter(i => i.rid !== selectedUser.rid));
    }
  }, [selectedUser, rocketAuth]);

  useEffect(() => {
    fetchGroupMembers();
  }, [selectedUser]);

  return (
    <StyledProfileInfo>
      <StyledChatHeader>
        <div id="chat-header">
          <Button type="text" onClick={props.hideGroup} icon={<ChevronLeft size={20} />} size={'large'}>
            Back
          </Button>
        </div>
      </StyledChatHeader>
      <div className="inner-scroll-area">
        <div id="profile-avatar" className="profile-wrapper" style={{ height: 220 }}>
          <Avatar style={{ border: "1px solid #f7f7f7", padding: 3, marginTop: 10, }} img={groupImage} size={'60px'} />
          <div className="group-title">{selectedUser.t === 'd' ? selectedUser.name : selectedUser.fname}</div>
          <small className="group-sub-title">{members.length} {t('members')}</small>
          <div className="group-actions">
            {
              selectedUser.roles?.includes('owner') &&
              <div onClick={() => setShowMemberModal(true)}>
                <Button type="primary" shape="circle" icon={<UserPlus size={20} />} size={'large'} />
                <div>{t("Add")}</div>
              </div>
            }

            {
              selectedUser.roles?.includes('owner') ?
                <div>
                  <Button type="primary" shape="circle" onClick={removeRoom} icon={<Trash2 size={20} />} size={'large'} />
                  <div>{t("Delete")}</div>
                </div>
                :
                <div>
                  <Button type="primary" shape="circle" onClick={leaveRoom} icon={<LogOut size={20} />} size={'large'} />
                  <div>{t("Leave")}</div>
                </div>
            }

          </div>
        </div>
        <ul className="group-members">
          {members.map(item => {
            const img = allAccountsById[item.username]?.photo;
            const data = allMembersById[item.username] ?? memberSchema;

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
                {
                  selectedUser.roles?.includes('owner') ?
                    <Button
                      className="group-members__item__remove"
                      disabled={item.username === myAccount.id}
                      onClick={() => removeMember(item._id)}
                      icon={<Trash2 size={16} />}
                    >
                      {t("Remove")}
                    </Button>
                    :
                    item.username === selectedUser.u.username ? t('Owner') : null
                }
              </li>
            )
          })}
        </ul>
      </div>

      {
        showMemberModal &&
        <Suspense fallback={<Loader />}>
          <AddMemberToGroup
            selectedMembers={members}
            visible={showMemberModal}
            handleModal={() => setShowMemberModal(false)}
            fetchGroupMembers={fetchGroupMembers}
          />
        </Suspense>
      }
    </StyledProfileInfo>
  )
}
