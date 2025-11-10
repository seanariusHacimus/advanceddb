import { useMemo } from "react";
import { Link, withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import { ReactComponent as IconDashboard } from "../../assets/header/dashboard.svg";
import { ReactComponent as IconCommon } from "../../assets/header/indicatorIcons/common.svg";
import { Settings } from "lucide-react";
import logo from "../../assets/logo.svg";
import { IconComponents } from "../../constants/icons";
import { groupTitleToUrl } from "../../utils";
import { useLocale } from "../../utils/locale";
import appData from "../../../package.json";
import {
  Sidebar as ShSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarDivider,
  SidebarNavItem,
  SidebarNavLink,
} from "../UI/shadcn/sidebar";
import { ThemeToggle } from "../UI/ThemeToggle";

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

  const currentPath = useMemo(() => {
    return sidebar || `/${links[1]}`;
  }, [sidebar, links]);

  const isMessagingPage = window.location?.pathname?.includes("messaging");

  if (isMessagingPage) {
    return null;
  }

  const renderIcon = (item, url) => {
    if (item.removable) {
      if (item.icon) {
        return <img src={item.icon.url} className="menu-icon" alt={item.title} />;
      }
      return <IconCommon className="menu-icon" />;
    }
    
    // Try to find icon component by URL
    const IconComponent = IconComponents[url];
    
    // If component found and it's a valid React component
    if (IconComponent && typeof IconComponent === 'function') {
      // Check if this icon should have stroke class (for Utility Services and International Trade)
      const hasStroke = url === "utility-services" || url === "international-trade";
      return <IconComponent className={`menu-icon ${hasStroke ? "stroke" : ""}`} />;
    }
    
    // Fallback to common icon
    return <IconCommon className="menu-icon" />;
  };

  return (
    <ShSidebar className={isMessagingPage ? "collapsed" : ""}>
      <SidebarHeader>
        <Link to="/dashboard" style={{ display: "flex", alignItems: "center" }}>
          <img src={logo} alt={t("AdvancedDB")} />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarNavItem>
          <SidebarNavLink
            to="/dashboard"
            className={currentPath === "/dashboard" ? "active" : ""}
          >
            <IconDashboard className="menu-icon" />
            <span>{t("Dashboard")}</span>
          </SidebarNavLink>
        </SidebarNavItem>

        {enabledWorkingGroups.map((item) => {
          const url = groupTitleToUrl(item.title);
          const path = `/working-group/${url}`;
          const isMember = myGroups.includes(item.id);
          const isActive = currentPath === path || sidebar === path;

          if (item.sidebar_visible) {
            return (
              <SidebarNavItem key={path}>
                <SidebarNavLink
                  to={path}
                  className={`${isActive ? "active" : ""} ${isMember ? "is-assigned" : ""}`}
                >
                  {renderIcon(item, url)}
                  <span>{t(item.title)}</span>
                  {isMember && <div className="more-icons" />}
                </SidebarNavLink>
              </SidebarNavItem>
            );
          }
          return null;
        })}

        {disabledWorkingGroups.length > 0 && <SidebarDivider />}

        {disabledWorkingGroups.map((item) => {
          const url = groupTitleToUrl(item.title);
          const path = `/working-group/${url}`;
          const isActive = currentPath === path || sidebar === path;

          if (!item.sidebar_visible) {
            return (
              <SidebarNavItem key={path}>
                <SidebarNavLink
                  to={path}
                  className={`${isActive ? "active" : ""} disabled`}
                >
                  {renderIcon(item, url)}
                  <span>{t(item.title)}</span>
                </SidebarNavLink>
              </SidebarNavItem>
            );
          }
          return null;
        })}

        {["superuser", "coordinator"].includes(role) && (
          <>
            <SidebarDivider />
            <SidebarNavItem>
              <SidebarNavLink
                to="/working-group-settings"
                className={currentPath === "/working-group-settings" ? "active" : ""}
              >
                <Settings className="menu-icon" size={20} />
                <span>{t("Working Group Settings")}</span>
              </SidebarNavLink>
            </SidebarNavItem>
          </>
        )}
      </SidebarContent>

      <SidebarFooter>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
          <span>{t("Theme")}</span>
          <ThemeToggle />
        </div>
        <div style={{ fontSize: '11px', opacity: 0.7 }}>
          {t("App version")}: v{appData.version}
        </div>
      </SidebarFooter>
    </ShSidebar>
  );
}

export default withRouter(Sidebar);
