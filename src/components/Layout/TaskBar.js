import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Bell, Globe, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { Avatar, Separator } from '../UI/shadcn';
import { useLocale } from '../../utils/locale';
import { signOutAction } from '../../store/Auth/actions';

const TaskBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 20px;
  height: 100%;
`;

const Divider = styled.div`
  width: 1px;
  height: 24px;
  background: hsl(var(--border));
  margin: 0 8px;
`;

const TaskBarItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: calc(var(--radius) - 2px);
  cursor: pointer;
  transition: all 0.2s ease;
  color: hsl(var(--muted-foreground));

  &:hover {
    background: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const LanguageButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: calc(var(--radius) - 2px);
  border: 1px solid hsl(var(--border));
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;

  &:hover {
    background: hsl(var(--accent));
    border-color: hsl(var(--border));
  }

  &:focus-visible {
    border-color: hsl(var(--ring));
    box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
  }

  svg {
    width: 16px;
    height: 16px;
    color: hsl(var(--muted-foreground));
  }
`;

const LanguageDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 140px;
  padding: 4px;
  background: hsl(var(--popover));
  border: 1px solid hsl(var(--border));
  border-radius: calc(var(--radius) - 2px);
  box-shadow: 0 4px 12px hsl(var(--foreground) / 0.1);
  z-index: 1300;
  opacity: ${props => props.$visible ? 1 : 0};
  visibility: ${props => props.$visible ? 'visible' : 'hidden'};
  transform: ${props => props.$visible ? 'translateY(0)' : 'translateY(-8px)'};
  transition: all 0.2s ease;
  pointer-events: ${props => props.$visible ? 'auto' : 'none'};
`;

const LanguageOption = styled.div`
  padding: 8px 12px;
  border-radius: calc(var(--radius) - 4px);
  cursor: pointer;
  font-size: 14px;
  color: hsl(var(--foreground));
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background: hsl(var(--accent));
  }

  ${props => props.$active && `
    background: hsl(var(--primary) / 0.1);
    color: hsl(var(--primary));
    font-weight: 600;
  `}
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 240px;
  padding: 6px;
  background: hsl(var(--popover));
  border: 1px solid hsl(var(--border));
  border-radius: calc(var(--radius) - 2px);
  box-shadow: 0 8px 24px hsl(var(--foreground) / 0.12), 0 2px 6px hsl(var(--foreground) / 0.08);
  z-index: 1300;
  opacity: ${props => props.$visible ? 1 : 0};
  visibility: ${props => props.$visible ? 'visible' : 'hidden'};
  transform: ${props => props.$visible ? 'translateY(0)' : 'translateY(-8px)'};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: ${props => props.$visible ? 'auto' : 'none'};

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
  padding: 12px 12px 10px;
  border-bottom: 1px solid hsl(var(--border));
  margin-bottom: 4px;

  h3 {
    font-size: 14px;
    font-weight: 600;
    color: hsl(var(--foreground));
    margin: 0 0 2px 0;
    line-height: 1.4;
  }

  span {
    font-size: 12px;
    color: hsl(var(--muted-foreground));
    line-height: 1.4;
  }
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: calc(var(--radius) - 4px);
  text-decoration: none;
  color: hsl(var(--foreground));
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s ease;
  cursor: pointer;
  position: relative;
  z-index: 1;

  &:hover {
    background: hsl(var(--accent));
    color: hsl(var(--accent-foreground));

    svg {
      color: hsl(var(--accent-foreground));
    }
  }

  svg {
    width: 16px;
    height: 16px;
    color: hsl(var(--muted-foreground));
    transition: color 0.15s ease;
  }
`;

const DropdownButton = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: calc(var(--radius) - 4px);
  color: hsl(var(--foreground));
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s ease;
  cursor: pointer;
  position: relative;
  z-index: 1;

  &:hover {
    background: hsl(var(--accent));
    color: hsl(var(--accent-foreground));

    svg {
      color: hsl(var(--accent-foreground));
    }
  }

  svg {
    width: 16px;
    height: 16px;
    color: hsl(var(--muted-foreground));
    transition: color 0.15s ease;
  }
`;

const ProfileButton = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px 6px 6px;
  border-radius: calc(var(--radius) - 2px);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;

  &:hover {
    background: hsl(var(--accent));
    border-color: hsl(var(--border));
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 120px;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const ProfileName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: hsl(var(--foreground));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

const ProfileRole = styled.span`
  font-size: 11px;
  color: hsl(var(--muted-foreground));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background: hsl(var(--destructive));
  color: hsl(var(--destructive-foreground));
  font-size: 10px;
  font-weight: 700;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 2px hsl(var(--background));
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: .8;
    }
  }
`;

export const TaskBar = () => {
  const [t, code, setCode, codeList] = useLocale();
  const dispatch = useDispatch();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

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
      <div style={{ position: 'relative' }}>
        <LanguageButton onClick={() => setLanguageOpen(!languageOpen)}>
          <Globe />
          {t(code).toUpperCase()}
          <ChevronDown size={14} />
        </LanguageButton>

        <LanguageDropdown $visible={languageOpen}>
          {codeList.map((langCode) => (
            <LanguageOption
              key={langCode}
              $active={code === langCode}
              onClick={() => {
                setCode(langCode);
                setLanguageOpen(false);
              }}
            >
              {t(langCode)}
              {code === langCode && <span style={{ fontSize: '16px' }}>✓</span>}
            </LanguageOption>
          ))}
        </LanguageDropdown>
      </div>

      <Divider />

      {/* Notifications */}
      <div style={{ position: 'relative' }}>
        <TaskBarItem onClick={() => setNotificationsOpen(!notificationsOpen)}>
          <Bell />
          {newNotificationsCount > 0 && (
            <NotificationBadge>{newNotificationsCount}</NotificationBadge>
          )}
        </TaskBarItem>

        <Dropdown $visible={notificationsOpen} style={{ minWidth: '380px', maxWidth: '420px' }}>
          <DropdownHeader>
            <h3>{t("Notifications")}</h3>
            <span>{newNotificationsCount > 0 ? `${newNotificationsCount} ${t("new")}` : t("No new notifications")}</span>
          </DropdownHeader>

          <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '4px 0' }}>
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
                    position: 'relative',
                    paddingLeft: notification.status === 'created' ? '18px' : '10px',
                  }}
                >
                  {notification.status === 'created' && (
                    <div style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'hsl(var(--primary))',
                    }} />
                  )}
                  <div style={{ 
                    fontWeight: 600, 
                    fontSize: '13px', 
                    lineHeight: '1.4',
                    color: 'hsl(var(--foreground))',
                  }}>
                    {notification.title || t(notification.type)}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: 'hsl(var(--muted-foreground))',
                    lineHeight: '1.4',
                  }}>
                    {notification.text}
                  </div>
                </DropdownButton>
              ))
            ) : (
              <div style={{ 
                padding: '32px 24px', 
                textAlign: 'center', 
                color: 'hsl(var(--muted-foreground))',
                fontSize: '13px',
              }}>
                {t("No notifications")}
              </div>
            )}
          </div>

          {notifications.list?.length > 5 && (
            <>
              <Separator style={{ margin: '6px 0' }} />
              <DropdownItem to="/settings/notification-settings" onClick={() => setNotificationsOpen(false)}>
                {t("View all notifications")}
              </DropdownItem>
            </>
          )}
        </Dropdown>
      </div>

      <Divider />

      {/* Profile Dropdown */}
      <div style={{ position: 'relative' }}>
        <ProfileButton onClick={(e) => {
          e.stopPropagation();
          setProfileOpen(!profileOpen);
        }}>
          <Avatar
            src={profileImg?.url}
            alt={`${first_name} ${last_name}`}
            fallback={`${first_name?.substring(0, 1) || ''}${last_name?.substring(0, 1) || ''}`}
            size="sm"
          />
          <ProfileInfo>
            <ProfileName>{first_name} {last_name}</ProfileName>
            <ProfileRole>{t(role)}</ProfileRole>
          </ProfileInfo>
          <ChevronDown size={16} style={{ color: 'hsl(var(--muted-foreground))' }} />
        </ProfileButton>
        
        <Dropdown 
          $visible={profileOpen}
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownHeader>
            <h3>{`${first_name} ${last_name}`}</h3>
            <span>{t(role)}</span>
          </DropdownHeader>

          <DropdownItem to="/settings/profile" onClick={() => setProfileOpen(false)}>
            <User />
            {t("Profile")}
          </DropdownItem>

          <DropdownItem to="/settings/security" onClick={() => setProfileOpen(false)}>
            <Settings />
            {t("Settings")}
          </DropdownItem>

          <Separator style={{ margin: '8px 0' }} />

          <DropdownButton onClick={signOutHandler}>
            <LogOut />
            {t("Logout")}
          </DropdownButton>
        </Dropdown>
      </div>

      {/* Click outside to close */}
      {(profileOpen || notificationsOpen || languageOpen) && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1250,
            background: 'transparent',
          }}
          onClick={() => {
            setProfileOpen(false);
            setNotificationsOpen(false);
            setLanguageOpen(false);
          }}
        />
      )}
    </TaskBarContainer>
  );
};

export default TaskBar;
