import { Divider, Popover } from "antd";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import defaultProfile from "../../assets/startBusiness/user.svg";
import { colors } from "../../constants";
import iconUser from "../../assets/header/profile/user.svg";
import iconExit from "../../assets/header/profile/exit.svg";
import { ProfileNotification } from "../../styles/profile";
import { roleNames } from "../../utils";
import { useLocale } from "../../utils/locale";
import { USER_ROLES } from "../../constants/userRoles";
import { signOutAction } from "../../store/Auth/actions";
import { SettingOutlined } from "@ant-design/icons";

export default function Profile(props) {
  const dispatch = useDispatch();
  const [t] = useLocale();

  const signOutHandler = async () => {
    dispatch(signOutAction());
  };

  const currentUser = useSelector((state) => state.auth);
  const mainRoles = [USER_ROLES.SUPERUSER, USER_ROLES.COORDINATOR];
  const {
    role,
    photo: profileImg,
    first_name,
    last_name,
  } = currentUser.account || {};
  const title = (
    <div>
      <h3>{`${first_name} ${last_name}`}</h3>
      {mainRoles.includes(role) ? <span>{roleNames[role]}</span> : null}
    </div>
  );

  const content = (
    <div style={{ gap: 14 }}>
      <Link to="/settings/profile">
        <img src={iconUser} className="icon" alt="User" />
        {t("Profile")}
      </Link>
      <Link to="/settings/profile">
        <SettingOutlined className="icon" />
        {t("Settings")}
      </Link>
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
        id="profile-popover"
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
