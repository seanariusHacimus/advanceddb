import React from 'react';
import { Popover } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import defaultProfile from '../../assets/startBusiness/user.svg';
import { colors } from '../../constants';
import { SIGN_OUT_MUTATION } from '../../graphql/auth';
import iconUser from '../../assets/header/profile/user.svg';
import iconBell from '../../assets/header/profile/bell.svg';
import iconLock from '../../assets/header/profile/lock.svg';
import iconExit from '../../assets/header/profile/exit.svg';
import { ProfileNotification } from '../../styles/profile';
import Axios from '../../utils/axios';
import { roleNames } from '../../utils';
import { useLocale } from "../../utils/locale";

export default function Profile(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [t] = useLocale();
  const signOutHandler = async () => {
    try {
      const { data } = await Axios.post('/graphql', { query: SIGN_OUT_MUTATION });
      if (data) {
        dispatch({ type: 'SIGN_OUT_SUCCESS' });
      }
    } catch (err) {
      console.error('[Custom Catch Error]-->', err);
    } finally {
      history.push('/')
    }
  };
  const currentUser = useSelector((state) => state.auth);
  const profileImg = currentUser.account?.photo;
  const mainRoles = ['superuser', 'coordinator'];
  const title = (
    <div>
      <h3>{`${currentUser?.account?.first_name} ${currentUser?.account?.last_name}`}</h3>
      {
        mainRoles.includes(currentUser?.account?.role) ?
          <span>{roleNames[currentUser?.account?.role]}</span>
          :
          null
      }
    </div>
  );

  const content = (
    <div>
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
        {t("Change your password")}
      </Link>
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
        <img src={profileImg ? profileImg.url : defaultProfile} onError={(e) => e.target.src = defaultProfile} alt="profile" className="profile-img" />
      </Popover>
    </ProfileNotification>
  );
}
