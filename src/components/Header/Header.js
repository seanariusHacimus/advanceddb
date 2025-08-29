import React, { useMemo, useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
  Layout, Menu, Divider, Alert, Badge,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkingGroupsAction } from '../../store/WorkingGroups/actions';
import { ReactComponent as IconDashboard } from '../../assets/header/dashboard.svg';
import { ReactComponent as IconWGsettings } from '../../assets/header/settings.svg';
import { fetchCurrentIndicatorGroupAction } from '../../store/SelectedIndicator/actions';
import { colors } from '../../constants';
import { SettingOutlined, UserOutlined } from '@ant-design/icons'
import { FETCH_APPROVAL_ACTIONS_NUMBER } from '../../graphql/approvals';

import ProfilePopover from '../Profile/ProfilePopover';
import Notifications from '../Notifications/Notifications';
import MessagingNotifications from './MessagingNotification';
// -------- Assets ---------------
import logo from '../../assets/logo.png';
import icons from '../../constants/icons';
import Style from '../../styles/header';
import Languages from './Languages';
import { groupTitleToUrl } from "../../utils";
import { refreshMyAccount } from "../../store/Auth/actions";
import useInterval from '@use-it/interval';
import { useLocale } from "../../utils/locale";
import { useCallback } from 'react';
import Axios from '../../utils/axios';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

function HeaderPage(props) {
  const dispatch = useDispatch();
  const myAccount = useSelector(state => state.auth.account || {});
  const [approvalsCount, setApprovalsCount] = useState(0);
  const leaderGroups = useMemo(() => myAccount.leader_groups.map(i => i.id), [myAccount.leader_groups])
  const [t] = useLocale();
  const { user: { role, request_password_change, leader_groups, member_groups, }, indicators = [], selectedWorkingGroup = {}, } = useSelector(state => ({
    user: state.auth.account, indicators: state.workingGroups.data, selectedWorkingGroup: state.selectedWorkingGroup,
  }
  ));

  const fetchApprovals = useCallback(async () => {
    try {
      let filter = { status: 'on_review' };
      if (myAccount.role === 'participant') {
        filter = {
          status: 'on_review',
          group_id: leaderGroups,
        }
      }
      const res = await Axios.post('/graphql', {
        query: FETCH_APPROVAL_ACTIONS_NUMBER,
        variables: {
          filter,
          filterSubAction: filter,
        },
      });
      if (res?.data) {
        const { actions, sub_actions } = res.data.data;
        setApprovalsCount(actions.total + sub_actions.total);
      }
    } catch (err) {
      console.error('[Custom Catch Error]-->', err);
    }
  }, []);

  useInterval(() => {
    dispatch(refreshMyAccount({ hideSpinner: true }));
    fetchApprovals();
    const links = pathname.split("/");
    if (links[1] === 'working-group') {
      dispatch(fetchCurrentIndicatorGroupAction(links[2] || 'starting-a-business', true))
    }
  }, 30000);

  useEffect(() => {
    dispatch(refreshMyAccount({ hideSpinner: true }));
    dispatch(fetchWorkingGroupsAction({ hideSpinner: true }));
    fetchApprovals();
    if (links[1] === 'working-group') {
      dispatch(fetchCurrentIndicatorGroupAction(links[2] || 'starting-a-business', true))
    }
  }, []);

  const links = props.location.pathname.split("/");
  const pathname = props.location.pathname;
  useEffect(() => {
    const links = pathname.split("/");
    if (links[1] === 'working-group') {
      dispatch(fetchCurrentIndicatorGroupAction(links[2] || 'starting-a-business'))
    }
  }, [pathname]);

  const enabledWorkingGroups = useMemo(() => indicators.filter(item => item.sidebar_visible))
  const disabledWorkingGroups = useMemo(() => indicators.filter(item => !item.sidebar_visible))
  const myGroups = useMemo(() => [...leader_groups, ...member_groups].map(item => item.id));
  const workingGroupUrl = groupTitleToUrl(selectedWorkingGroup.title);

  const sidebar = links
    .slice(1, 3)
    .reduce((acc, str) => `${acc}/${str}`, '');


  return (
    <Style style={{ minHeight: '100vh' }} hasSider id="main-content">
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        style={{ ...styles.sidebar, display: window.location?.pathname?.includes('messaging') ? 'none' : 'block' }}
        zeroWidthTriggerStyle={{ width: 'auto', minWidth: 'auto' }}
        theme="light"
        className="sidebar"
        collapsible={false}
        width={256}
      >
        {/* ----- LOGO ------ */}
        <Link to="/home" className="logo">
          <img src={logo} alt={t("AdvancedDB")} />
        </Link>
        {/* ----- SIDEBAR --- */}
        <Menu
          theme="light"
          className="side-bar-menu"
          mode="inline"
          selectedKeys={[sidebar, `/${links[1]}`]}
        >
          <Menu.Item key="/dashboard" icon={<IconDashboard className="menu-icon" />}>
            <Link to="/dashboard">{t("Dashboard")}</Link>
          </Menu.Item>
          {
            enabledWorkingGroups.map((item) => {
              const url = groupTitleToUrl(item.title);
              const isMember = myGroups.includes(item.id);
              if (item.sidebar_visible) {
                return (
                  <Menu.Item
                    key={`/working-group/${url}`}
                    disabled={!item.sidebar_visible}
                    className={isMember && 'is-assigned-group'}
                    icon={item.removable ? item.icon
                      ? <img src={item.icon.url} className="menu-icon" alt={item.title} />
                      : <IconDashboard className="menu-icon" />
                      : icons[url]}
                  >
                    <Link
                      to={`/working-group/${url}`}
                      key={`/working-group/${url}`}
                    >
                      {t(item.title)}
                    </Link>
                    {isMember && <div className="more-icons" />}

                  </Menu.Item>
                );
              }
              return null;

            })
          }
          <Menu.Item style={{ minHeight: 10 }}>
            {
              disabledWorkingGroups.length ? <Divider style={{ margin: 0 }} /> : null
            }
          </Menu.Item>

          {
            disabledWorkingGroups.map((item) => {
              const url = groupTitleToUrl(item.title);
              if (!item.sidebar_visible) {
                return (
                  <Menu.Item
                    key={`/working-group/${url}`}
                    disabled={!item.sidebar_visible}
                    icon={item.removable ? item.icon
                      ? <img src={item.icon.url} className="menu-icon" alt={item.title} />
                      : <IconDashboard className="menu-icon" />
                      : icons[url]}
                  >
                    <Link
                      to={`/working-group/${url}`}
                      key={`/working-group/${url}`}
                    >
                      {t(item.title)}
                    </Link>
                  </Menu.Item>
                );
              }
              return null;

            })
          }
          <Menu.Item style={{ minHeight: 10 }}>
            <Divider style={{ margin: 0 }} />
          </Menu.Item>
          {
            ['superuser', 'coordinator'].includes(role)
            &&
            <Menu.Item key="/dashboard/working-groups" icon={<SettingOutlined className="menu-icon" />}>
              <Link to="/dashboard/working-groups" style={{ fontSize: 14 }}>{t("Edit Working Groups")}</Link>
            </Menu.Item>
          }
        </Menu>

      </Sider>
      {/* ----- Main Section ----- */}
      <Layout style={styles.wrapper}>
        <Header className="site-layout-sub-header-background" style={styles.header}>
          {
            links[1] === 'working-group'
              ? (
                <Menu
                  style={styles.headerMenu}
                  selectedKeys={[pathname]}
                  mode="horizontal"
                  className="custom-menu header"
                  id="header-menu"
                >
                  <Menu.Item key={`/working-group/${workingGroupUrl}`}>
                    <Link to={sidebar}>{t(selectedWorkingGroup.title)}</Link>
                  </Menu.Item>
                  {
                    !selectedWorkingGroup.removable
                    && (
                      [
                        <Menu.Item key={`/working-group/${workingGroupUrl}/methodology`}>
                          <Link to={`/working-group/${workingGroupUrl}/methodology`}>{t("Methodology")}</Link>
                        </Menu.Item>,
                        <Menu.Item key={`/working-group/${workingGroupUrl}/historical-data`}>
                          <Link to={`/working-group/${workingGroupUrl}/historical-data`}>{t("Historical data")}</Link>
                        </Menu.Item>,
                        <Menu.Item key={`/working-group/${workingGroupUrl}/what-to-reform`}>
                          <Link to={`/working-group/${workingGroupUrl}/what-to-reform`}>{t("What to reform")}</Link>
                        </Menu.Item>,
                        <Menu.Item key={`/working-group/${workingGroupUrl}/business-comparison`}>
                          <Link
                            to={`/working-group/${workingGroupUrl}/business-comparison`}>{t("Compare with other countries")}</Link>
                        </Menu.Item>
                      ]
                    )
                  }

                </Menu>
              )
              : (links[1] === 'profile')
                ? (
                  <Menu
                    style={styles.headerMenu}
                    selectedKeys={links[2] ? `/${links[2]}` : `/${links[1]}`}
                    mode="horizontal"
                    className="custom-menu header"
                    id="header-menu"
                  >
                    <Menu.Item key={links[2] ? "/edit" : "/profile"}>
                      <Link to="/profile">{t("Profile")}</Link>
                    </Menu.Item>
                    <Menu.Item key="/notification-settings">
                      <Link to="/profile/notification-settings">{t("Notification settings")}</Link>
                    </Menu.Item>
                    <Menu.Item key="/security">
                      <Link to="/profile/security">{t("Security")}</Link>
                    </Menu.Item>
                  </Menu>
                )
                : (
                  <Menu
                    style={styles.headerMenu}
                    selectedKeys={[pathname]}
                    mode="horizontal"
                    className="custom-menu header"
                    id="header-menu"
                  >
                    {
                      window.location.pathname.includes('messaging') &&
                      <Menu.Item key={`/working-group/${workingGroupUrl}`}>
                        <Link to="/home" className="logo" style={{ backgroundColor: 'transparent' }}>
                          <img src={logo} alt={t("AdvancedDB")} />
                        </Link>
                      </Menu.Item>
                    }

                    <Menu.Item style={{ minWidth: 50 }} key="/dashboard/home">
                      <Link to="/dashboard/home">{t("Home")}</Link>
                    </Menu.Item>
                    <Menu.Item key="/dashboard/db-ranking-simulator">
                      <Link to="/dashboard/db-ranking-simulator">{t("DB Ranking Simulator")}</Link>
                    </Menu.Item>
                    <Menu.Item key="/dashboard/reform-update-for-db-team">
                      <Link to="/dashboard/reform-update-for-db-team">{t("Reform Update for DB Team")}</Link>
                    </Menu.Item>
                    <SubMenu key="SubMenu" title={t("Manage Users")}>
                      {
                        !['member', 'observer'].includes(role) ?
                          <Menu.Item key="/dashboard/members">
                            <Link to="/dashboard/members">{t("Manage Users")}</Link>
                          </Menu.Item>
                          :
                          null
                      }
                      {
                        ['superuser', 'coordinator'].includes(role) ?
                          <Menu.Item key="/dashboard/audit">
                            <Link to="/dashboard/audit">{t("Audit log")}</Link>
                          </Menu.Item>
                          :
                          null
                      }
                    </SubMenu>


                    {
                      ['superuser'].includes(role) || leader_groups.length ?
                        <Menu.Item key="/dashboard/approvals">
                          <Link to="/dashboard/approvals">
                            <Badge count={approvalsCount}>{t("Approval inbox")}</Badge>
                          </Link>
                        </Menu.Item>
                        :
                        null
                    }

                  </Menu>
                )
          }
          {/* ------- User Profile ------ */}
          <div id="task-bar">
            <Languages />
            <Notifications />
            <MessagingNotifications />
            <ProfilePopover />
          </div>

        </Header>

        {/* ---------- MAIN SECTION ------------------ */}
        <Content style={{ ...styles.content, background: window.location.pathname.includes('/home') ? '#f5f8fc' : colors.background, }}>
          {request_password_change && !['profile', 'notification-settings', 'password-change'].includes(links[1]) && (
            <Link to="/profile/security" style={{ display: 'block', margin: '0 -20px' }}>
              <Alert message={t("Please change your password")} type="warning" style={{ marginBottom: 20 }} />
            </Link>
          )}
          {props.children}
        </Content>
      </Layout>
    </Style>
  );

}

const styles = {
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    hight: 80,
    background: colors.background,
  },
  headerMenu: {
    padding: '0 40px',
    background: colors.background,
  },
  wrapper: {
    background: colors.background,
  },
  content: {
    padding: '93px 40px 25px',
  },
  sidebar: {
    maxHeight: '100vh',
    height: '100',
    minHeight: '100vh',
    position: 'sticky',
    top: 0,
    borderRight: '1px solid var(--border-grey)',
  },
};


export default withRouter(HeaderPage);
