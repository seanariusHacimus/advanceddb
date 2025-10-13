import { useMemo } from "react";
import { Link, withRouter } from "react-router-dom";
import { Layout, Menu } from "antd";
import { useSelector } from "react-redux";
import { colors } from "../../constants";
import logo from "../../assets/logo.svg";
import Languages from "./Languages";
import Notifications from "../Notifications/Notifications";
import ProfilePopover from "../Profile/ProfilePopover";
import { groupTitleToUrl } from "../../utils";
import { useLocale } from "../../utils/locale";

const { Header } = Layout;

// Constants
const MENU_CONFIG = {
  WORKING_GROUP: {
    METHODOLOGY: "methodology",
    HISTORICAL_DATA: "historical-data",
    WHAT_TO_REFORM: "what-to-reform",
    BUSINESS_COMPARISON: "business-comparison",
  },
  PROFILE: {
    PROFILE: "profile",
    NOTIFICATION_SETTINGS: "notification-settings",
    SECURITY: "security",
  },
  DASHBOARD: {
    HOME: "home",
    DB_RANKING_SIMULATOR: "db-ranking-simulator",
    REFORM_UPDATE: "reform-update-for-db-team",
    MEMBERS: "members",
    AUDIT: "audit",
    APPROVALS: "approvals",
  },
};

const ROUTES = {
  WORKING_GROUP: "working-group",
  PROFILE: "profile",
  MESSAGING: "messaging",
};

const WorkingGroupMenu = ({
  selectedWorkingGroup,
  workingGroupUrl,
  sidebar,
  t,
}) => {
  const menuItems = useMemo(() => {
    const defaultMenuItems = [
      {
        key: `/working-group/${workingGroupUrl}`,
        link: sidebar,
        label: t(selectedWorkingGroup.title),
      },
    ];

    if (!selectedWorkingGroup.removable) {
      const additionalItems = [
        {
          key: `/working-group/${workingGroupUrl}/${MENU_CONFIG.WORKING_GROUP.METHODOLOGY}`,
          link: `/working-group/${workingGroupUrl}/${MENU_CONFIG.WORKING_GROUP.METHODOLOGY}`,
          label: t("Methodology"),
        },
        {
          key: `/working-group/${workingGroupUrl}/${MENU_CONFIG.WORKING_GROUP.HISTORICAL_DATA}`,
          link: `/working-group/${workingGroupUrl}/${MENU_CONFIG.WORKING_GROUP.HISTORICAL_DATA}`,
          label: t("Historical data"),
          hidden: true,
        },
        {
          key: `/working-group/${workingGroupUrl}/${MENU_CONFIG.WORKING_GROUP.WHAT_TO_REFORM}`,
          link: `/working-group/${workingGroupUrl}/${MENU_CONFIG.WORKING_GROUP.WHAT_TO_REFORM}`,
          label: t("What to reform"),
          hidden: true,
        },
        {
          key: `/working-group/${workingGroupUrl}/${MENU_CONFIG.WORKING_GROUP.BUSINESS_COMPARISON}`,
          link: `/working-group/${workingGroupUrl}/${MENU_CONFIG.WORKING_GROUP.BUSINESS_COMPARISON}`,
          label: t("Compare with other countries"),
          hidden: true,
        },
      ];
      defaultMenuItems.push(...additionalItems);
    }

    return defaultMenuItems.filter((item) => !item.hidden);
  }, [selectedWorkingGroup, workingGroupUrl, sidebar]);

  return (
    <Menu
      style={styles.headerMenu}
      selectedKeys={[window.location.pathname]}
      mode="horizontal"
      className="custom-menu header"
      id="header-menu"
    >
      {menuItems.map((item) => (
        <Menu.Item key={item.key}>
          <Link to={item.link}>{item.label}</Link>
        </Menu.Item>
      ))}
    </Menu>
  );
};

const ProfileMenu = ({ links, t }) => {
  const menuItems = [
    {
      key: links[2] ? "/edit" : "/profile",
      link: "/profile",
      label: t("Profile"),
    },
    {
      key: "/notification-settings",
      link: "/profile/notification-settings",
      label: t("Notification settings"),
    },
    {
      key: "/security",
      link: "/profile/security",
      label: t("Security"),
    },
  ];

  return (
    <Menu
      style={styles.headerMenu}
      selectedKeys={[links[2] ? `/${links[2]}` : `/${links[1]}`]}
      mode="horizontal"
      className="custom-menu header"
      id="header-menu"
    >
      {menuItems.map((item) => (
        <Menu.Item key={item.key}>
          <Link to={item.link}>{item.label}</Link>
        </Menu.Item>
      ))}
    </Menu>
  );
};

const DashboardMenu = ({ role, leaderGroups, workingGroupUrl, t }) => {
  const menuItems = [
    {
      key: "/dashboard/home",
      link: "/dashboard/home",
      label: t("Home"),
    },
    {
      key: "/dashboard/db-ranking-simulator",
      link: "/dashboard/db-ranking-simulator",
      label: t("DB Ranking Simulator"),
      hidden: true,
    },
    {
      key: "/dashboard/reform-update-for-db-team",
      link: "/dashboard/reform-update-for-db-team",
      label: t("Reform Update for DB Team"),
      hidden: true,
    },
  ];

  const visibleMenuItems = useMemo(() => {
    return menuItems.filter((item) => !item.hidden);
  }, [menuItems]);

  return (
    <Menu
      style={styles.headerMenu}
      selectedKeys={[window.location.pathname]}
      mode="horizontal"
      className="custom-menu header"
      id="header-menu"
    >
      {window.location.pathname.includes(ROUTES.MESSAGING) && (
        <Menu.Item key={`/working-group/${workingGroupUrl}`}>
          <Link
            to="/home"
            className="logo"
            style={{ backgroundColor: "transparent" }}
          >
            <img src={logo} alt={t("AdvancedDB")} />
          </Link>
        </Menu.Item>
      )}

      {visibleMenuItems.map((item) => (
        <Menu.Item
          key={item.key}
          style={item.key === "/dashboard/home" ? { minWidth: 50 } : {}}
        >
          <Link to={item.link}>{item.label}</Link>
        </Menu.Item>
      ))}
    </Menu>
  );
};

function HeaderRC(props) {
  const [t] = useLocale();

  const {
    user: { role, leader_groups },
    selectedWorkingGroup = {},
    workingGroups = [],
  } = useSelector((state) => ({
    user: state.auth.account,
    selectedWorkingGroup: state.selectedWorkingGroup,
    workingGroups: state.workingGroups?.data || [],
  }));

  const links = props.location.pathname.split("/");

  // Extract working group title from URL when selectedWorkingGroup is empty
  const getWorkingGroupTitle = () => {
    if (selectedWorkingGroup.title) {
      return selectedWorkingGroup.title;
    }

    // Extract title from URL for working group routes
    if (links[1] === ROUTES.WORKING_GROUP && links[2]) {
      const urlTitle = links[2];
      // Find the working group that matches this URL title
      const matchingGroup = workingGroups.find(
        (group) => groupTitleToUrl(group.title) === urlTitle
      );
      return matchingGroup?.title || urlTitle;
    }

    return "";
  };

  const workingGroupTitle = getWorkingGroupTitle();
  const workingGroupUrl = groupTitleToUrl(workingGroupTitle);
  const sidebar = useMemo(
    () => links.slice(1, 3).reduce((acc, str) => `${acc}/${str}`, ""),
    [links]
  );

  const renderMenu = () => {
    const currentRoute = links[1];

    switch (currentRoute) {
      case ROUTES.WORKING_GROUP:
        return (
          <WorkingGroupMenu
            selectedWorkingGroup={{
              ...selectedWorkingGroup,
              title: workingGroupTitle,
            }}
            workingGroupUrl={workingGroupUrl}
            sidebar={sidebar}
            t={t}
          />
        );
      case ROUTES.PROFILE:
        return <ProfileMenu links={links} t={t} />;
      default:
        return (
          <DashboardMenu
            role={role}
            leaderGroups={leader_groups}
            workingGroupUrl={workingGroupUrl}
            t={t}
          />
        );
    }
  };

  return (
    <Header className="site-layout-sub-header-background" style={styles.header}>
      {renderMenu()}

      {/* ------- User Profile ------ */}
      <div id="task-bar">
        <Languages />
        <Notifications />
        <ProfilePopover />
      </div>
    </Header>
  );
}

const styles = {
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: 64, // Fixed typo: was "hight"
    background: colors.background,
  },
  headerMenu: {
    padding: "0 40px",
    background: colors.background,
  },
  wrapper: {
    background: colors.background,
  },
};

export default withRouter(HeaderRC);
