import React, { createContext, useCallback, useEffect, useState, useMemo, useRef, } from 'react';
import { StyledCommunications } from '../../styles/messaging';
import Axios, { rocketAxios } from '../../utils/axios';
import { Row, Col } from '../UI/shadcn'; // Using shadcn grid
import ChatArea from './ChatArea';
import MembersList from './MembersList';
import { indexBy } from '../../utils';
import useInterval from '@use-it/interval';
import { FETCH_ALL_MEMBERS } from '../../graphql/members';
import socket, { socketLogin } from '../../utils/socket';
import newMessageSound from '../../assets/messaging/messenger_sound.mp3';
import { useSelector } from 'react-redux';

export const CommunicationsContext = createContext();

const userSchema = {
  _id: '',
  name: '',
  username: '',
  usernames: [],
  status: '',
}

const conversationSchema = {
  rid: '',
  _updatedAt: '',
  usernames: ['', ''],
  lastMessage: { msg: '', u: { name: '', username: '' } }
}

export default function Communications() {
  const myAccount = useSelector(state => state.auth.account || {});
  const audioRef = useRef();
  const [accounts, setAccounts] = useState([userSchema]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([userSchema]);
  const [newConversation, setNewConversation] = useState({});
  const [selectedUser, setSelectedUser] = useState(userSchema);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState(false);
  const rocketAuth = useSelector(state => state.rocketAuth);

  const fetchMembers = async () => {
    try {
      const res = await Axios.post('/graphql', {
        query: FETCH_ALL_MEMBERS,
        variables: {
          pagination: {
            size: -1
          }
        },
      });

      if (res?.data) {
        const newAccounts = res.data.data.accounts.nodes;
        setMembers(newAccounts);
      }
    }
    catch (err) {
      console.log(err);
    }
  };

  const allAccountsById = useMemo(() => indexBy(accounts, 'username'));
  const allMembersById = useMemo(() => indexBy(members, 'id'));
  const allConversationsById = useMemo(() => indexBy(conversations, 'rid'));

  const selectUser = useCallback(async (data) => {
    setSelectedUser(data);
    if (data.alert && data.unread) {
      makeRoomRead(data.rid);
    }
  }, [selectedUser, rocketAuth]);

  const createRoom = useCallback(async (username) => {
    const { token, user_id: userId } = rocketAuth;
    const res = await rocketAxios.post('/im.create',
      { username },
      {
        headers: { 'X-Auth-Token': `${token}`, 'X-User-Id': userId }
      });

    const { rid, usernames } = res.data.room;
    const roomExist = allConversationsById[rid];

    if (!roomExist) {
      const newConversation = { ...conversationSchema, rid: rid, usernames }
      setConversations(state => [newConversation, ...state]);
      setSelectedUser(newConversation);
    } else {
      setSelectedUser(roomExist);
    }
  }, [rocketAuth, setConversations, setSelectedUser, conversations]);


  const makeRoomRead = useCallback(async (rid) => {
    if (rocketAuth.token) {
      try {
        const { token, user_id: userId } = rocketAuth;
        const res = await rocketAxios.post('/subscriptions.read',
          { rid },
          {
            headers: { 'X-Auth-Token': `${token}`, 'X-User-Id': userId }
          });
        console.log(res);
      }
      catch (err) {
        console.log(err);
      }
    }
  }, [rocketAuth]);

  const fetchAccounts = useCallback(async () => {
    if (rocketAuth.token) {
      try {
        const { token, user_id: userId } = rocketAuth;
        const res = await rocketAxios.get(`/users.list`, {
          headers: {
            'X-Auth-Token': `${token}`,
            'X-User-Id': userId
          }
        });

        if (res?.data) {
          const { users } = res.data;
          return setAccounts(users);
        }
      } catch (err) {
        console.log(err.response);
        return []
      }
    }
  }, [rocketAuth]);

  const fetchConversations = useCallback(async () => {
    if (rocketAuth.token) {
      setLoading(true);
      try {
        const { token, user_id: userId } = rocketAuth;
        const sub = await rocketAxios.get('/subscriptions.get', { headers: { 'X-Auth-Token': `${token}`, 'X-User-Id': userId } });
        if (sub?.data) {
          const { update } = sub.data;
          setLoading(false);
          return setConversations(update);
        }
      } catch (err) {
        setLoading(false);
        return []
      }
    }
  }, [rocketAuth]);

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [rocketAuth]);

  useEffect(() => {
    fetchAccounts();
  }, [rocketAuth]);

  useEffect(() => {
    if (rocketAuth.token && socket.readyState === 1) {
      socketLogin(rocketAuth.token);
    }
  }, [rocketAuth]);

  useInterval(async () => {
    if (rocketAuth.token && isSearchActive === false) {
      try {
        const { token, user_id: userId } = rocketAuth;
        const sub = await rocketAxios.get('/subscriptions.get', { headers: { 'X-Auth-Token': `${token}`, 'X-User-Id': userId } });
        if (sub?.data) {
          const { update } = sub.data;

          setLoading(false);
          return setConversations(update);
        }
      } catch (err) {
        console.log(err.response);
        return []
      }
    }
  }, 10000);

  const filterConversationByType = useMemo(() => conversations.filter(item => (item.t === 'p' || item.t === 'd')));

  const converstationsSortByTime = useMemo(() => {
    return filterConversationByType.sort((a, b) => {
      if (a._updatedAt > b._updatedAt) {
        return -1
      } else if (a._updatedAt < b._updatedAt) {
        return 1
      } else {
        return 0;
      }
    });
  });

  const contextValue = {
    accounts,
    allAccountsById,
    allMembersById,
    conversations: converstationsSortByTime,
    fetchConversations,
    isSearchActive,
    makeRoomRead,
    rocketAuth,
    searchResults,
    selectedUser,
    selectUser,
    setConversations,
    setIsSearchActive,
    setSearchResults,
    setSelectedUser,
    newConversation,
    setNewConversation,
  }

  return (
    <StyledCommunications>
      <CommunicationsContext.Provider value={contextValue}>
        <Row id="chat-wrapper">
          <Col span={8} xl={6} id="members-list">
            <MembersList
              accounts={accounts}
              createRoom={createRoom}
              loading={loading}
            />
          </Col>
          <Col span={16} xl={18} id="chat-area">
            <Col span={24}>
              <ChatArea
                selectedUser={selectedUser}
                rocketAuth={rocketAuth}
              />
            </Col>
          </Col>
        </Row>
        <audio src={newMessageSound} ref={audioRef} controls hidden></audio>
      </CommunicationsContext.Provider>
    </StyledCommunications>
  )
}
