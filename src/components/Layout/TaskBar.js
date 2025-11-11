import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Bell, Globe, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { Badge, Avatar, Separator } from '../UI/shadcn';
import { useLocale } from '../../utils/locale';
import { signOutAction } from '../../store/Auth/actions';
import defaultProfile from '../../assets/startBusiness/user.svg';
import MessagingNotification from './MessagingNotification';

const TaskBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  height: 100%;
`;

const TaskBarItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s ease;
  color: hsl(var(--muted-foreground));

  &:hover {
    background: hsl(var(--accent));
    color: hsl(var(--foreground));
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const LanguageSelect = styled.select`
  padding: 8px 12px;
  border-radius: var(--radius);
  border: 1px solid hsl(var(--border));
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;

  &:hover {
    background: hsl(var(--accent));
    border-color: hsl(var(--accent-foreground) / 0.2);
  }

  &:focus {
    border-color: hsl(var(--primary));
    box-shadow: 0 0 0 2px hsl(var(--primary) / 0.1);
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 220px;
  padding: 8px;
  background: hsl(var(--popover));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  box-shadow: 0 4px 12px hsl(var(--foreground) / 0.1);
  z-index: 1200;
  opacity: ${props => props.$visible ? 1 : 0};
  visibility: ${props => props.$visible ? 'visible' : 'hidden'};
  transform: ${props => props.$visible ? 'translateY(0)' : 'translateY(-8px)'};
  transition: all 0.2s ease;

  & > div {
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: hsl(var(--muted-foreground) / 0.3);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: hsl(var(--muted-foreground) / 0.5);
    }
  }
`;

const DropdownHeader = styled.div`
  padding: 12px;
  border-bottom: 1px solid hsl(var(--border));
  margin-bottom: 8px;

  h3 {
    font-size: 14px;
    font-weight: 600;
    color: hsl(var(--foreground));
    margin: 0 0 4px 0;
  }

  span {
    font-size: 12px;
    color: hsl(var(--muted-foreground));
  }
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius);
  text-decoration: none;
  color: hsl(var(--foreground));
  font-size: 14px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: hsl(var(--accent));
  }

  svg {
    width: 18px;
    height: 18px;
    color: hsl(var(--muted-foreground));
  }
`;

const DropdownButton = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius);
  color: hsl(var(--foreground));
  font-size: 14px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: hsl(var(--accent));
  }

  svg {
    width: 18px;
    height: 18px;
    color: hsl(var(--muted-foreground));
  }
`;

const ProfileButton = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px 4px 4px;
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: hsl(var(--accent));
  }
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background: hsl(var(--destructive));
  color: hsl(var(--destructive-foreground));
  font-size: 11px;
  font-weight: 600;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 2px hsl(var(--background));
`;

export const TaskBar = () => {
  const [t, code, setCode, codeList] = useLocale();
  const dispatch = useDispatch();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const currentUser = useSelector((state) => state.auth.account);
  const notifications = useSelector((state) => state.notifications);
  
  const { role, photo: profileImg, first_name, last_name } = currentUser || {};
  const newNotificationsCount = notifications.list?.filter(n => n.status === 'created').length || 0;

  const signOutHandler = () => {
    dispatch(signOutAction());
    setProfileOpen(false);
  };

  return (
    <TaskBarContainer>
      {/* Language Selector */}
      <LanguageSelect value={code} onChange={(e) => setCode(e.target.value)}>
        {codeList.map((langCode) => (
          <option key={langCode} value={langCode}>
            {t(langCode).toUpperCase()}
          </option>
        ))}
      </LanguageSelect>

      {/* Messaging Notifications */}
      <MessagingNotification />

      {/* Notifications */}
      <div style={{ position: 'relative' }}>
        <TaskBarItem onClick={() => setNotificationsOpen(!notificationsOpen)}>
          <Bell />
          {newNotificationsCount > 0 && (
            <NotificationBadge>{newNotificationsCount}</NotificationBadge>
          )}
        </TaskBarItem>

        <Dropdown $visible={notificationsOpen} style={{ minWidth: '360px', maxWidth: '400px' }}>
          <DropdownHeader>
            <h3>{t("Notifications")}</h3>
            <span>{newNotificationsCount > 0 ? `${newNotificationsCount} ${t("new")}` : t("No new notifications")}</span>
          </DropdownHeader>

          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {notifications.list?.length > 0 ? (
              notifications.list.slice(0, 5).map((notification) => (
                <DropdownButton
                  key={notification.id}
                  onClick={() => {
                    setNotificationsOpen(false);
                    // Handle notification click if needed
                  }}
                  style={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '4px',
                    opacity: notification.status === 'read' ? 0.6 : 1,
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '13px' }}>{notification.title || t(notification.type)}</div>
                  <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                    {notification.text}
                  </div>
                </DropdownButton>
              ))
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', color: 'hsl(var(--muted-foreground))' }}>
                {t("No notifications")}
              </div>
            )}
          </div>

          {notifications.list?.length > 5 && (
            <>
              <Separator style={{ margin: '8px 0' }} />
              <DropdownItem to="/settings/notification-settings" onClick={() => setNotificationsOpen(false)}>
                {t("View all notifications")}
              </DropdownItem>
            </>
          )}
        </Dropdown>
      </div>

      {/* Profile Dropdown */}
      <ProfileButton onClick={() => setProfileOpen(!profileOpen)}>
        <Avatar
          src={profileImg?.url}
          alt={`${first_name} ${last_name}`}
          fallback={`${first_name?.substring(0, 1) || ''}${last_name?.substring(0, 1) || ''}`}
          size="sm"
        />
        <ChevronDown size={16} style={{ color: 'hsl(var(--muted-foreground))' }} />
        
        <Dropdown $visible={profileOpen}>
          <DropdownHeader>
            <h3>{`${first_name} ${last_name}`}</h3>
            <span>{t(role)}</span>
          </DropdownHeader>

          <DropdownItem to="/settings/profile" onClick={() => setProfileOpen(false)}>
            <User />
            {t("Profile")}
          </DropdownItem>

          <DropdownItem to="/settings/profile" onClick={() => setProfileOpen(false)}>
            <Settings />
            {t("Settings")}
          </DropdownItem>

          <Separator style={{ margin: '8px 0' }} />

          <DropdownButton onClick={signOutHandler}>
            <LogOut />
            {t("Logout")}
          </DropdownButton>
        </Dropdown>
      </ProfileButton>

      {/* Click outside to close */}
      {(profileOpen || notificationsOpen) && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1199,
          }}
          onClick={() => {
            setProfileOpen(false);
            setNotificationsOpen(false);
          }}
        />
      )}
    </TaskBarContainer>
  );
};

export default TaskBar;
