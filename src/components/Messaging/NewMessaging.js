import React, { useCallback, useState, useEffect, useContext, useRef, Suspense } from 'react';
import { StyledChatArea, StyledChatHeader } from '../../styles/messaging';
import { Avatar } from '../../styles';
import { Input, Progress } from 'antd';
import { SendOutlined, PaperClipOutlined, FileImageOutlined, DeleteOutlined, MoreOutlined, LogoutOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { CommunicationsContext } from './index';
import { useSelector } from 'react-redux';
import AvatarInitials from '../UI/AvatarInitials';
import StartMessaging from './StartMessaging';
import { useLocale } from "../../utils/locale";
import groupImage from '../../assets/messaging/group.svg';
import { rocketAxios } from "../../utils/axios";

export default function MembersList(props) {
  const myAccount = useSelector(state => state.auth.account);
  const [allMesssages, setAllMessages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const parentRef = useRef('');
  const { allMembersById = {}, allAccountsById = {}, rocketAuth, setSelectedUser, newConversation, setNewConversation, } = useContext(CommunicationsContext);
  const attachmentRef = useRef(null);
  const [t] = useLocale();

  const sentMessage = useCallback(async (text) => {
    const room = newConversation.t === 'd' ? await createRoom() : await createGroup();
    const roomId = newConversation.t === 'd' ? room.rid : room._id
    const { token, user_id: userId } = rocketAuth;
    await rocketAxios.post('/chat.postMessage',
      { roomId, text },
      {
        headers: { 'X-Auth-Token': `${token}`, 'X-User-Id': userId }
      });
    setMessage('');
    setSelectedUser({ ...newConversation, ...room, rid: roomId, name: newConversation.members[0], });
    setNewConversation({});
  }, [newConversation, rocketAuth, setMessage]);

  const createRoom = useCallback(async () => {
    const { token, user_id: userId } = rocketAuth;
    const { members } = newConversation;

    const chatConfigs = members.length > 1 ? { usernames: members.join(',') } : { username: members[0] };
    const res = await rocketAxios.post('/im.create', chatConfigs,
      {
        headers: { 'X-Auth-Token': `${token}`, 'X-User-Id': userId }
      });

    if (res.data.success) {
      return res.data.room;
    } else {
      return {};
    }

  }, [rocketAuth, newConversation]);

  const createGroup = useCallback(async () => {
    const { token, user_id: userId } = rocketAuth;
    const { members, name } = newConversation;
    try {
      const { data } = await rocketAxios.post('/groups.create',
        { members, name: name.replace(/\s/g, '-') },
        {
          headers: { 'X-Auth-Token': `${token}`, 'X-User-Id': userId }
        });

      if (data.success) {
        return data.group;
      }
    } catch (err) {
      return err.response.data
    }
  }, [rocketAuth, newConversation]);


  const uploadFile = useCallback(async () => {
    const { token, user_id: userId } = rocketAuth;
    const file = attachmentRef.current.files[0];
    const formData = new FormData();
    formData.append('file', file);

    const res = await rocketAxios.post(`/rooms.upload/${newConversation._id}`,
      formData,
      {
        headers: { 'X-Auth-Token': `${token}`, 'X-User-Id': userId },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100 / progressEvent.total));
          setProgress(progress)
        }
      });
    setProgress(0)
    attachmentRef.current.value = '';
  }, [newConversation, rocketAuth]);

  const currentFile = attachmentRef?.current?.files[0];
  const fileSize = (currentFile?.size / 1024 / 1024);
  const currentUser = newConversation.t === 'p' ? newConversation : newConversation.multiple ? newConversation : allMembersById[newConversation?.members[0]] ?? {};
  console.log(currentUser);
  return (
    <StyledChatArea ref={parentRef}>
      <StyledChatHeader>
        <div id="chat-header">
          {
            newConversation.t === 'p' ?
              <Avatar img={groupImage} size={'35px'} />
              : <AvatarInitials name={`${currentUser.first_name} ${currentUser.last_name}`} />
          }
          <div className="meta-wrapper">
            <div>{newConversation.t === 'd' && !newConversation.multiple ? `${currentUser.first_name} ${currentUser.last_name}` : currentUser.fname}</div>
            {newConversation.t === 'p' ?
              <small>{currentUser.members.length} {t('members')}</small>
              :
              <small style={{ color: currentUser.status === 'online' ? '#4CAF50' : '#f58baf' }}>{newConversation.status}</small>
            }
          </div>
        </div>
      </StyledChatHeader>
      <div className={`conversation scrollable-area ${loading ? 'loading' : ''}`}>
        {progress > 0 ?
          <div className="upload-progress">
            <FileImageOutlined size={60} color="#eee" />
            <div className="meta-info">
              <p>{currentFile?.name?.slice(0, 110) || 'N/A'} - <b>{fileSize >= 1 ? `${Math.round(fileSize)} MB` : `${Math.round(fileSize * 1000)} kb`}</b></p>
              <Progress percent={progress} status="active" />
            </div>
          </div>
          :
          null
        }
        {!allMesssages.length && <StartMessaging />}
      </div>

      <Input.TextArea
        autoSize
        value={message}
        onChange={val => setMessage(val.currentTarget.value)}
        placeholder=""
        onPressEnter={e => {
          e.preventDefault();
          sentMessage(e.currentTarget.value);
        }}
      />
      <button onClick={() => sentMessage(message)} className="send-button"><SendOutlined /> </button>
      <input
        hidden
        type="file"
        accept="image/*, .pdf, .doc, .docs, .csv, text/html, .xlsx, .xls"
        ref={attachmentRef}
        onChange={uploadFile}
      />
      <button onClick={() => attachmentRef.current.click()} className="attachment-button"><PaperClipOutlined /></button>
    </StyledChatArea>
  )
}
