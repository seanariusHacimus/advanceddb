import React, { useState, useEffect, useContext, useCallback, Suspense, lazy, useRef, useMemo } from 'react';
import { StyledMembersList } from '../../styles/messaging';
import { List, Avatar, Input, Dropdown, Menu, Divider, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { CommunicationsContext } from './index';
import moment from 'moment';
import Loader from '../UI/SpinnerLocal';
import AvatarInitials from '../UI/AvatarInitials';
import { PlusCircleOutlined } from '@ant-design/icons';
import Spinner from '../UI/Spinner';
import groupImage from '../../assets/messaging/group.svg';
import { useLocale } from "../../utils/locale";
import { Button } from 'antd';
import newMessageSound from '../../assets/messaging/messenger_sound.mp3';

const GroupModal = lazy(() => import('./CreateGroup'));
const DirectChatModal = lazy(() => import('./CreateDirectChat'));

export default function MembersList(props) {
  const myAccount = useSelector(state => state.auth.account);
  const { loading = true } = props;
  const [activeList, setActiveList] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isDirectChatVisible, setIsDirectChatVisible] = useState(false);
  const [query, setQuery] = useState('');
  const { selectUser, selectedUser, conversations, searchResults, setSearchResults, isSearchActive, setIsSearchActive, allMembersById = {}, allAccountsById = {} } = useContext(CommunicationsContext);
  const parentRef = useRef('');
  const audioRef = useRef();
  const [t] = useLocale();

  useEffect(() => {
    setActiveList(selectedUser.rid);
  }, [selectedUser]);

  const handleSearch = useCallback((event) => {
    const { value } = event.target;
    const searchValue = value.toLowerCase();
    const result = conversations.filter(item => {
      return item.fname.toLowerCase().includes(searchValue)
    });
    setIsSearchActive(true);
    setSearchResults(result);
  }, [conversations])

  const isThereNewMessage = useMemo(() => conversations.some(item => item.alert && item.unread));
  if (isThereNewMessage.length) {
    audioRef.current.play();
  }

  const menu = (
    <Menu style={{ padding: '10px 5px' }}>
      <Menu.Item onClick={() => setIsDirectChatVisible(true)} style={{ margin: '5px 0' }}>
        <a href="#">
          {t("Select a member")}
        </a>
      </Menu.Item>
      <Menu.Item onClick={() => setModalVisible(true)}>
        <a href="#">
          {t("Select a working group")}
        </a>
      </Menu.Item>
    </Menu>
  )

  return (
    <StyledMembersList ref={parentRef}>
      <div id="members-list-head">
        <div id="inner-search-wrapper" style={{ width: '100%' }}>
          <Input
            type="search"
            value={query}
            id="search-title"
            autoComplete="off"
            style={{ width: 'calc(100% - 5px)' }}
            placeholder={t('Search all messages')}
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
        <Divider type="vertical" style={{ height: 34, borderWidth: 2 }} />
        <Dropdown overlay={menu} placement="bottomLeft" getPopupContainer={el => parentRef.current} trigger={["click"]}>
          <Button
            type="link"
            style={{ padding: 0, marginLeft: 4 }}
          >
            <PlusCircleOutlined style={{ fontSize: 32, color: '#e7e7e7', color: "var(--blue)" }} />
          </Button>
        </Dropdown>
      </div>
      <div className="scrollable-area">
        {
          loading ?
            <Loader style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, 50%)' }} />
            :
            <List
              itemLayout="horizontal"
              dataSource={isSearchActive ? searchResults : conversations}
              className="accounts-ul"
              renderItem={(item, index) => {
                if (item.t === 'p') {
                  return (
                    <List.Item
                      key={item.rid}
                      className={activeList === item.rid ? 'active' : ''}
                      onClick={(event) => {
                        selectUser(item);
                      }}
                    >
                      <List.Item.Meta
                        avatar={<Avatar style={{ border: "1px solid #333", padding: 2, }} src={groupImage} size={'35px'} />}
                        title={<div>
                          <Typography.Paragraph
                            ellipsis={{
                              rows: 1,
                              expandable: false,
                            }}
                            title={item.fname}
                          >
                            {item.fname}
                          </Typography.Paragraph>

                          <time className="time-ago">{moment(item.ls).fromNow()}</time>
                        </div>}
                        description={<div>
                          {item.lastMessage?.msg?.slice(0, 24)}
                          {(item.alert && item.unread) ? <span className="new-message">{item.unread}</span> : null}
                        </div>}
                      />
                    </List.Item>
                  )
                }

                const systemUser = item.t === 'd' ? allMembersById[item.name] : { name: '', _id: '', status: 'away' };

                return (
                  <List.Item
                    key={item.rid}
                    className={activeList === item.rid ? 'active' : ''}
                    onClick={(event) => {
                      selectUser(item);
                    }}
                  >
                    <List.Item.Meta
                      avatar={systemUser?.photo?.url ?
                        <Avatar src={systemUser?.photo?.url} size={'35px'} />
                        : <AvatarInitials name={item.fname} />
                      }
                      title={<div className="">
                        <Typography.Paragraph
                          ellipsis={{
                            rows: 1,
                            expandable: false,
                          }}
                          title={item.fname}
                        >
                          {item.fname}
                        </Typography.Paragraph>
                        <time className="time-ago">{moment(item.ls || item._updatedAt).fromNow()}</time>
                      </div>}
                      description={<div>
                        {item.lastMessage?.msg?.slice(0, 24)}
                        {(item.alert && item.unread) ? <span className="new-message">{item.unread}</span> : null}
                      </div>}
                    />
                  </List.Item>
                )
              }}
            />
        }
      </div>
      {
        modalVisible &&
        <Suspense fallback={<Spinner />}>
          <GroupModal
            visible={modalVisible}
            handleModal={() => setModalVisible(state => !state)}
          />
        </Suspense>
      }
      {
        isDirectChatVisible &&
        <Suspense fallback={<Spinner />}>
          <DirectChatModal
            visible={isDirectChatVisible}
            handleModal={() => setIsDirectChatVisible(state => !state)}
          />
        </Suspense>
      }
      <audio src={newMessageSound} ref={audioRef} hidden></audio>
    </StyledMembersList>
  )
}
