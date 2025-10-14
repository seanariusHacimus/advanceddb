import { useMemo } from "react";
import { Divider, Popover } from "antd";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import defaultProfile from "../../assets/startBusiness/user.svg";
import { colors } from "../../constants";
import { SIGN_OUT_MUTATION } from "../../graphql/auth";
import iconUser from "../../assets/header/profile/user.svg";
import iconBell from "../../assets/header/profile/bell.svg";
import iconLock from "../../assets/header/profile/lock.svg";
import iconExit from "../../assets/header/profile/exit.svg";
import iconAuditLog from "../../assets/header/profile/audit-log.svg";
import iconUserManagement from "../../assets/header/profile/user-management.svg";
import iconApprovals from "../../assets/header/profile/approvals.svg";
import { ProfileNotification } from "../../styles/profile";
import Axios from "../../utils/axios";
import { roleNames } from "../../utils";
import { useLocale } from "../../utils/locale";
import { USER_ROLES } from "../../constants/userRoles";
import { isUserRole } from "../../utils/users";
import { signOutAction } from "../../store/Auth/actions";

export default function Profile(props) {
  const dispatch = useDispatch();
  const [t] = useLocale();

  const signOutHandler = async () => {
    dispatch(signOutAction());
  };

  const currentUser = useSelector((state) => state.auth);
  const approvalsCount = useSelector((state) => state.approvals.count);
  const mainRoles = [USER_ROLES.SUPERUSER, USER_ROLES.COORDINATOR];
  const {
    role,
    photo: profileImg,
    first_name,
    last_name,
    leaderGroups = [],
  } = currentUser.account || {};
  const title = (
    <div>
      <h3>{`${first_name} ${last_name}`}</h3>
      {mainRoles.includes(role) ? <span>{roleNames[role]}</span> : null}
    </div>
  );

  const manageUsersItems = useMemo(() => {
    const menuItems = [];

    if (!isUserRole(role, [USER_ROLES.MEMBER, USER_ROLES.OBSERVER])) {
      menuItems.push({
        key: "/dashboard/members",
        link: "/dashboard/members",
        label: t("Manage Users"),
        icon: iconUserManagement,
      });
    }
    if (isUserRole(role, [USER_ROLES.SUPERUSER, USER_ROLES.COORDINATOR])) {
      menuItems.push({
        key: "/dashboard/audit",
        link: "/dashboard/audit",
        label: t("Audit log"),
        icon: iconAuditLog,
      });
    }

    if (role === USER_ROLES.SUPERUSER || leaderGroups.length > 0) {
      menuItems.push({
        key: "/dashboard/approvals",
        link: "/dashboard/approvals",
        label: `${t("Approval inbox")} ${
          approvalsCount >= 0 ? `(${approvalsCount})` : ""
        }`,
        icon: iconApprovals,
      });
    }

    return menuItems;
  }, [role, leaderGroups, t]);

  const content = (
    <div style={{ gap: 14 }}>
      <Link to="/profile">
        <img src={iconUser} className="icon" alt="User" />
        {t("Profile")}
      </Link>
      <Link to="/profile/notification-settings">
        <img src={iconBell} className="icon" alt="notification" />
        {t("Notification settings")}
      </Link>
      <Link to="/profile/security">
        <img src={iconLock} className="icon" alt="security" />
        {t("Security settings")}
      </Link>
      <Divider style={{ margin: "0", borderColor: "#72717f" }} />
      {manageUsersItems.map((item) => (
        <Link key={item.key} to={item.link}>
          <img src={item.icon} className="icon" alt="notification" />
          {item.label}
        </Link>
      ))}
      <Divider style={{ margin: "0", borderColor: "#72717f" }} />
      <div onClick={signOutHandler}>
        <img src={iconExit} className="icon" alt="exit" />
        {t("Logout")}
      </div>
    </div>
  );

  return (
    <ProfileNotification className="profile-wrapper">
      <Popover
        content={content}
        title={title}
        placement="bottomRight"
        trigger="hover"
        color={colors.dark}
        arrowPointAtCenter
        overlayClassName="profile-popover"
        getPopupContainer={(trigger) => trigger.parentNode}
      >
        <img
          src={profileImg ? profileImg.url : defaultProfile}
          onError={(e) => (e.target.src = defaultProfile)}
          alt="profile"
          className="profile-img"
        />
      </Popover>
    </ProfileNotification>
  );
}
