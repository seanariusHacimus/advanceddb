import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
import { Popconfirm } from '../UI/shadcn';
import { StyledChatHeader } from '../../styles/messaging';
import { Avatar, Flex } from '../../styles';
import { DeleteOutlined, LogoutOutlined, InfoCircleOutlined } from '@ant-design/icons';
import AvatarInitials from '../UI/AvatarInitials';
import { useLocale } from "../../utils/locale";
import groupImage from '../../assets/messaging/group.svg';
import { rocketAxios } from '../../utils/axios';

export default function ChatHeader(props) {
  const [t] = useLocale();
  const { selectedUser, systemUser, leaveRoom, rocketAuth, currentUser, removeRoom, setShowGroupInfo, deleteConversationRoom, myAccount } = props;
  const [info, setInfo] = useState(selectedUser || {});

  useEffect(() => {
    if (selectedUser.t === 'p') {
      async function getGroupInfo() {
        const res = await rocketAxios.get('/groups.info?roomId=' + selectedUser.rid,
          {
            headers: { 'X-Auth-Token': `${rocketAuth.token}`, 'X-User-Id': rocketAuth.user_id }
          });

        const isOwner = myAccount.id === res.data.group.u.username ? { roles: ['owner'] } : {};
        if (res.data.success) {
          setInfo(info => ({ ...res.data.group, ...isOwner }));
        }
      }
      getGroupInfo();
    } else {
      setInfo(selectedUser);
    }
  }, [selectedUser, rocketAuth]);

  return (
    <StyledChatHeader>
      <div id="chat-header">

        {
          (systemUser?.photo?.url && info.t === 'd') ?
            <Avatar img={systemUser?.photo?.url} size={'35px'} />
            : info.t === 'p' ? <Avatar img={groupImage} size={'35px'} /> : <AvatarInitials name={selectedUser.fname} />
        }
        <div className="meta-wrapper" style={{ maxWidth: 600 }}>
          <Typography.Paragraph
            ellipsis={{
              rows: 1,
              expandable: false,
            }}
            title={info.t === 'p' ? currentUser.fname : selectedUser.fname.split(',').length > 1 ? selectedUser.fname : currentUser.name}
          >
            {info.t === 'p' ? currentUser.fname : selectedUser.fname.split(',').length > 1 ? selectedUser.fname : currentUser.name}
          </Typography.Paragraph>

          {info.t === 'p' || selectedUser.fname.split(',').length > 1 ?
            <small>{info.t === 'p' ? info.usersCount : selectedUser.fname.split(',').length + 1} {t('members')}</small>
            :
            <small style={{ color: currentUser.status === 'online' ? '#4CAF50' : '#f58baf' }}>{currentUser.status}</small>
          }
        </div>
        {
          info.t === 'p' ?
            (
              <Flex className="actions-wrapper">
                {
                  info.roles?.includes('owner') ?
                    <Popconfirm placement="topLeft" title={t('Are you sure?')} overlayStyle={{ width: 300 }} onConfirm={removeRoom} okText="Yes" cancelText="No">
                      <div className="danger clickable">
                        <DeleteOutlined /> {t("Delete")}
                      </div>
                    </Popconfirm>

                    :
                    <div onClick={leaveRoom} className="clickable">
                      <LogoutOutlined /> {t("Leave")}
                    </div>
                }

                <div onClick={() => setShowGroupInfo(true)} className="clickable">
                  <InfoCircleOutlined /> {t("Info")}
                </div>
              </Flex>
            )
            :
            <Popconfirm placement="topLeft" title={t('Are you sure?')} overlayStyle={{ marginLeft: 'auto' }} onConfirm={deleteConversationRoom} okText={t("Yes")} cancelText={t("No")}>
              <div className="danger clickable" style={{ marginLeft: 'auto' }}>
                <DeleteOutlined /> {t("Delete")}
              </div>
            </Popconfirm>
        }
      </div>
    </StyledChatHeader>
  )
}