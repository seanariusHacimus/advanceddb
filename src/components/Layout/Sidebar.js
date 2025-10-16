import React, { useMemo } from "react";
import { Link, withRouter } from "react-router-dom";
import { Layout, Menu, Divider } from "antd";
import { useSelector } from "react-redux";
import { ReactComponent as IconDashboard } from "../../assets/header/dashboard.svg";
import { ReactComponent as IconCommon } from "../../assets/header/indicatorIcons/common.svg";
import { SettingOutlined } from "@ant-design/icons";
import logo from "../../assets/logo.svg";
import icons from "../../constants/icons";
import { groupTitleToUrl } from "../../utils";
import { useLocale } from "../../utils/locale";

const { Sider } = Layout;

function Sidebar(props) {
  const [t] = useLocale();

  const {
    user: { role, leader_groups, member_groups },
    indicators = [],
  } = useSelector((state) => ({
    user: state.auth.account,
    indicators: state.workingGroups.data,
  }));

  const links = props.location.pathname.split("/");

  const enabledWorkingGroups = useMemo(
    () => indicators.filter((item) => item.sidebar_visible),
    [indicators]
  );

  const disabledWorkingGroups = useMemo(
    () => indicators.filter((item) => !item.sidebar_visible),
    [indicators]
  );

  const myGroups = useMemo(() => {
    return [...leader_groups, ...member_groups].map((item) => item.id);
  }, [leader_groups, member_groups]);

  const sidebar = useMemo(
    () => links.slice(1, 3).reduce((acc, str) => `${acc}/${str}`, ""),
    [links]
  );

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      style={{
        ...styles.sidebar,
        display: window.location?.pathname?.includes("messaging")
          ? "none"
          : "block",
      }}
      zeroWidthTriggerStyle={{ width: "auto", minWidth: "auto" }}
      theme="light"
      className="sidebar"
      collapsible={false}
      width={256}
    >
      {/* ----- LOGO ------ */}
      <Link to="/home" className="logo">
        <img src={logo} alt={t("AdvancedDB")} />
      </Link>

      {/* ----- SIDEBAR MENU --- */}
      <Menu
        theme="light"
        className="side-bar-menu"
        mode="inline"
        selectedKeys={[sidebar, `/${links[1]}`]}
      >
        <Menu.Item
          key="/dashboard"
          icon={<IconDashboard className="menu-icon" />}
        >
          <Link to="/dashboard">{t("Dashboard")}</Link>
        </Menu.Item>

        {enabledWorkingGroups.map((item) => {
          const url = groupTitleToUrl(item.title);
          const isMember = myGroups.includes(item.id);
          if (item.sidebar_visible) {
            return (
              <Menu.Item
                key={`/working-group/${url}`}
                disabled={!item.sidebar_visible}
                className={isMember && "is-assigned-group"}
                icon={
                  item.removable ? (
                    item.icon ? (
                      <img
                        src={item.icon.url}
                        className="menu-icon"
                        alt={item.title}
                      />
                    ) : (
                      <IconCommon className="menu-icon" />
                    )
                  ) : (
                    icons[url] || <IconCommon className="menu-icon" />
                  )
                }
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
        })}

        {disabledWorkingGroups.length ? (
          <Divider style={{ margin: "0 0 12 0" }} />
        ) : null}

        {disabledWorkingGroups.map((item) => {
          const url = groupTitleToUrl(item.title);
          if (!item.sidebar_visible) {
            return (
              <Menu.Item
                key={`/working-group/${url}`}
                disabled={!item.sidebar_visible}
                icon={
                  item.removable ? (
                    item.icon ? (
                      <img
                        src={item.icon.url}
                        className="menu-icon"
                        alt={item.title}
                      />
                    ) : (
                      <IconDashboard className="menu-icon" />
                    )
                  ) : (
                    icons[url]
                  )
                }
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
        })}

        <Divider key="divider" style={{ margin: "0 0 12 0" }} />

        {["superuser", "coordinator"].includes(role) && (
          <Menu.Item
            key="/working-group-settings"
            icon={<SettingOutlined className="menu-icon" />}
          >
            <Link to="/working-group-settings" exact style={{ fontSize: 14 }}>
              {t("Working Group Settings")}
            </Link>
          </Menu.Item>
        )}
      </Menu>
    </Sider>
  );
}

const styles = {
  sidebar: {
    maxHeight: "100vh",
    height: "100",
    minHeight: "100vh",
    position: "sticky",
    top: 0,
    borderRight: "1px solid var(--border-grey)",
  },
};

export default withRouter(Sidebar);
