import React, { useCallback, useState, useEffect, useContext, useRef, Suspense } from 'react';
import axios from 'axios';
import useInterval from '@use-it/interval';
import { StyledChatArea } from '../../styles/messaging';
import { Avatar } from '../../styles';
import { Input, Progress, message as antMessage } from 'antd';
import { CloudDownloadOutlined, SendOutlined, PaperClipOutlined, FileImageOutlined, DeleteOutlined } from '@ant-design/icons';
import Loader from '../UI/SpinnerLocal';
import { CommunicationsContext } from './index';
import imgSelectUser from '../../assets/messaging/select-user.svg';
import { useSelector } from 'react-redux';
import AvatarInitials from '../UI/AvatarInitials';
import StartMessaging from './StartMessaging';
import { useLocale } from "../../utils/locale";
import GroupInfo from './GroupInfo';
import ChatHeader from './ChatHeader';
import NewMessaging from './NewMessaging';
import { rocketAxios } from "../../utils/axios";
import socket, { socketLogin } from '../../utils/socket';
import { v4 } from 'uuid';
import AttachmentViewer from './AttachmentViewer';

export default function MembersList(props) {
  const myAccount = useSelector(state => state.auth.account);
  const [allMesssages, setAllMessages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const parentRef = useRef('');
  const { rocketAuth = {} } = props;
  const { allMembersById = {}, selectedUser = {}, newConversation, allAccountsById = {}, setSelectedUser, setConversations } = useContext(CommunicationsContext);
  const attachmentRef = useRef(null);
  const messageUrl = selectedUser.t === 'p' ?
    `/groups.history?roomId=${selectedUser.rid}` :
    `/im.history?roomId=${selectedUser.rid}`;
  const [t] = useLocale();

  const syncMessages = useCallback(async () => {
    setLoading(true);
    const { token, user_id: userId } = rocketAuth;
    if (selectedUser.rid) {
      const res = await rocketAxios.get(messageUrl,
        {
          headers: { 'X-Auth-Token': `${token}`, 'X-User-Id': userId }
        });

      if (res.data.success) {
        setLoading(false);
        return setAllMessages(res.data.messages ?? []);
      }
    }

    setLoading(false);
    return setAllMessages([]);
  }, [rocketAuth, selectedUser]);

  const sentMessage = useCallback(async () => {
    console.log('STATUS-----', socket.readyState);
    if (socket.readyState === 1) {
      console.log('Socket message');
      const query = JSON.stringify({
        "msg": "method",
        "method": "sendMessage",
        "id": "sendMessage",
        "params": [
          {
            "_id": v4(),
            "rid": selectedUser.rid,
            "msg": message,
          }
        ]
      });
      socket.send(query);
      setMessage('');
    } else {
      const { token, user_id: userId } = rocketAuth;
      console.log('not authorized');
      try {
        const g = await rocketAxios.post('/chat.postMessage',
          { roomId: selectedUser.rid, text: message },
          { headers: { 'X-Auth-Token': `${token}`, 'X-User-Id': userId } });
        console.log(g);
        setMessage('');
      }
      catch (err) {
        console.log(err);
      }
    }

  }, [selectedUser, rocketAuth, message, setMessage]);

  const leaveRoom = useCallback(async (msgId) => {
    const { token, user_id: userId } = rocketAuth;
    const { data } = await rocketAxios.post(
      `/groups.leave`,
      { roomId: selectedUser.rid },
      {
        headers: { 'X-Auth-Token': `${token}`, 'X-User-Id': userId }
      });

    if (data.success) {
      setShowGroupInfo(false);
      antMessage.success({
        content: t('You have left the room successfully'),
        duration: 2,
        style: {
          right: 30,
          top: 120,
          position: 'fixed',
          fontSize: 16,
        },
      });

      setSelectedUser({
        rid: '',
        _updatedAt: '',
        usernames: ['', ''],
        lastMessage: { msg: '', u: { name: '', username: '' } }
      });
      setConversations(state => state.filter(i => i.rid !== selectedUser.rid));
    }
  }, [selectedUser, rocketAuth]);

  const removeRoom = useCallback(async (msgId) => {
    const { token, user_id: userId } = rocketAuth;
    const { data } = await rocketAxios.post(`/groups.delete`,
      { roomId: selectedUser.rid },
      {
        headers: { 'X-Auth-Token': `${token}`, 'X-User-Id': userId }
      });

    if (data.success) {
      setShowGroupInfo(false);
      antMessage.success({
        content: t('Room has been removed successfully'),
        duration: 2,
        style: {
          right: 30,
          top: 120,
          position: 'fixed',
          fontSize: 16,
        },
      });

      setSelectedUser({
        rid: '',
        _updatedAt: '',
        usernames: ['', ''],
        lastMessage: { msg: '', u: { name: '', username: '' } }
      });
      setConversations(state => state.filter(i => i.rid !== selectedUser.rid));
    }

  }, [selectedUser, rocketAuth]);

  const deleteMessage = useCallback(async (msgId) => {
    const { token, user_id: userId } = rocketAuth;
    await rocketAxios.post(
      `/chat.delete`,
      { roomId: selectedUser.rid, msgId },
      {
        headers: { 'X-Auth-Token': `${token}`, 'X-User-Id': userId }
      });
  }, [selectedUser, rocketAuth], allMesssages);

  const deleteConversationRoom = useCallback(async () => {
    const query = JSON.stringify({
      "msg": "method",
      "method": "eraseRoom",
      "id": "eraseRoom",
      "params": [selectedUser.rid]
    });
    socket.send(query);
    setSelectedUser({})
    setConversations(state => state.filter(i => i.rid !== selectedUser.rid));
  }, [selectedUser, rocketAuth]);

  const uploadFile = useCallback(async () => {
    const { token, user_id: userId } = rocketAuth;
    const file = attachmentRef.current.files[0];
    const formData = new FormData();
    formData.append('file', file);

    const res = await rocketAxios.post(`/rooms.upload/${selectedUser.rid}`,
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
  }, [selectedUser, rocketAuth]);

  useEffect(() => {
    setShowGroupInfo(false);
    syncMessages();
  }, [selectedUser.rid]);

  useInterval(async () => {
    const { token, user_id: userId } = rocketAuth;

    if (selectedUser.rid && token) {
      const res = await rocketAxios.get(messageUrl,
        {
          headers: { 'X-Auth-Token': `${token}`, 'X-User-Id': userId }
        });

      if (res.data.success) {
        return setAllMessages(res.data.messages);
      }
    }
  }, 1000);

  const currentUser = selectedUser.t === 'p' ? selectedUser : allAccountsById[selectedUser.name] ?? {};
  const currentFile = attachmentRef?.current?.files[0];
  const fileSize = (currentFile?.size / 1024 / 1024);

  const systemUser = selectedUser.t === 'd' ? allMembersById[selectedUser.name] : { name: '', _id: '', status: 'away' };

  if (showGroupInfo && selectedUser.t === 'p') {
    return (
      <Suspense fallback={<Loader />}>
        <GroupInfo hideGroup={() => setShowGroupInfo(false)} />
      </Suspense>
    )
  }

  if (newConversation.id) {
    return <NewMessaging
      selectedUser={selectedUser}
      currentUser={currentUser}
      systemUser={systemUser}
      leaveRoom={leaveRoom}
      myAccount={myAccount}
      removeRoom={removeRoom}
      setShowGroupInfo={setShowGroupInfo}
    />
  }

  return (
    <StyledChatArea ref={parentRef}>
      {
        selectedUser.rid ?
          <>
            <ChatHeader
              selectedUser={selectedUser}
              currentUser={currentUser}
              systemUser={systemUser}
              leaveRoom={leaveRoom}
              myAccount={myAccount}
              removeRoom={removeRoom}
              rocketAuth={rocketAuth}
              setShowGroupInfo={setShowGroupInfo}
              deleteConversationRoom={deleteConversationRoom}
            />
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
              {loading ?
                <Loader />
                :
                allMesssages.map(item => {
                  const systemUser = allMembersById[item?.u?.username];
                  const myMessage = myAccount.id === item.u.username;

                  if (item.file?._id) {
                    return (
                      <div className={`conversation-item ${myMessage ? 'my-message' : ''}`} key={item._id}>
                        {
                          systemUser?.photo?.url ?
                            <Avatar img={systemUser.photo?.url} size={'35px'} className="conversation-item__avatar" />
                            : <AvatarInitials name={item.u?.name} className="conversation-item__avatar" />
                        }
                        <div className="conversation-item__message">
                          <div className="conversation-item__meta">
                            <b>{item.u?.name}</b>
                            <time className="conversation-item__meta-date">{new Date(item._updatedAt).toLocaleString()}</time>
                          </div>
                          <div>
                            <div>
                              <span>{item.attachments[0].title}</span>
                              <a href={process.env.REACT_APP_ROCKET_BASE_URL + item.attachments[0].title_link + '?download'} download style={{ marginLeft: 10 }}><CloudDownloadOutlined /></a>
                            </div>
                            {
                              item.attachments[0].image_preview ?
                                // <img src={'data:image/png;base64,' + item.attachments[0].image_preview} alt="file" />
                                <img
                                  src={process.env.REACT_APP_ROCKET_BASE_URL + item.attachments[0].title_link}
                                  onClick={() => { setSelectedAttachment(item.attachments[0]); setVisible(true) }}
                                  alt="file"
                                  className="clickable attachment-file"
                                />
                                :
                                <a href={process.env.REACT_APP_ROCKET_BASE_URL + item.attachments[0].title_link + '?download'} download>
                                  <PaperClipOutlined style={{ fontSize: 20, color: '#333' }} />
                                </a>

                            }
                            <p>{item.attachments[0].description}</p>
                          </div>
                          {
                            (myAccount.id === item.u.username) && <button className="delete-button" onClick={() => deleteMessage(item._id)}><DeleteOutlined /></button>
                          }
                        </div>
                      </div>
                    )
                  }

                  if (item.t) {
                    return null
                  }
                  return (
                    <div className={`conversation-item ${myMessage ? 'my-message' : ''}`} key={item._id}>
                      {
                        systemUser?.photo?.url ?
                          <Avatar img={systemUser.photo?.url} size={'35px'} className="conversation-item__avatar" />
                          : <AvatarInitials name={item.u?.name} className="conversation-item__avatar" />
                      }
                      <div className="conversation-item__message">
                        <div className="conversation-item__meta">
                          <b>{item.u?.name}</b>
                          <time className="conversation-item__meta-date">{new Date(item._updatedAt).toLocaleString()}</time>
                        </div>
                        <div>
                          {
                            !item.t && <p>{item.msg}</p>
                          }
                        </div>
                      </div>
                      {
                        (myAccount.id === item.u.username) && <button className="delete-button" onClick={() => deleteMessage(item._id)}><DeleteOutlined /></button>
                      }
                    </div>
                  )
                })
              }
            </div>

            <Input.TextArea
              autoSize
              value={message}
              onChange={val => setMessage(val.currentTarget.value)}
              placeholder=""
              onPressEnter={e => {
                e.preventDefault();
                console.log(e.target);
                // if (message.trim().length > 0) {
                //   sentMessage(message);
                // }

              }}
            />
            <button
              onClick={() => {
                if (message.trim().length > 0) {
                  sentMessage(message);
                }
              }}
              className="send-button"
            >
              {t("Send")}
            </button>
            <input
              hidden
              type="file"
              accept="image/*, .pdf, .doc, .docs, .csv, text/html, .xlsx, .xls"
              ref={attachmentRef}
              onChange={uploadFile}
            />
            <button onClick={() => attachmentRef.current.click()} className="attachment-button"><PaperClipOutlined /></button>
          </>
          :
          <div className="empty-user">
            <img src={imgSelectUser} alt="select user" />
            <p>{t("Select a user to start a conversation")}</p>
          </div>
      }

      {
        visible &&
        <AttachmentViewer data={selectedAttachment} visible={visible} setVisible={setVisible} />
      }
    </StyledChatArea>
  )
}
