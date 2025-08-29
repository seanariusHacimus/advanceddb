import React, { useEffect, useState } from 'react';
import { Popover, Button, Radio } from 'antd';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment-timezone';
import { colors } from '../../constants';
import { ReactComponent as IconChecked } from '../../assets/header/notifications/checked.svg';
import { ReactComponent as IconCanceled } from '../../assets/header/notifications/block.svg';
import { ReactComponent as IconAdd } from '../../assets/header/notifications/add.svg';
import { ReactComponent as IconBell } from '../../assets/header/bell.svg';
import { ReactComponent as IconClear } from '../../assets/header/notifications/clear.svg';
import { ReactComponent as IconArchive } from '../../assets/header/notifications/archive.svg';
import { ReactComponent as IconSetting } from '../../assets/header/settings.svg';
import { NotificationWidget } from '../../styles/notification';
import { AiOutlineExclamationCircle, AiOutlineCloseCircle, AiOutlineCheckCircle, } from 'react-icons/ai'
import { Flex } from '../../styles';
import {
  addNewNotification,
  changeNotificationStatus,
  deleteNotificationsAction,
  fetchNotificationsAction,
  readNotificationsAction,
} from '../../store/Notifications/actions';
import { messaging, firebase } from '../../store';
import { indexBy } from "../../utils";
import { useLocale } from "../../utils/locale";


const NotificationIcon = (props) => {
  switch (props.type) {
    case 'action_created':
      return <IconAdd className="notification-type-icon" />;
    case 'action_updated':
      return <IconBell className="notification-type-icon" />;
    case 'action_completed':
      return <IconChecked className="notification-type-icon" />;
    case 'action_deleted':
      return <IconArchive className="notification-type-icon" />;
    case 'action_requested':
      return <AiOutlineExclamationCircle style={{ color: "rgb(255, 193, 7)", fontSize: 30 }} className="notification-type-icon" />;
    case 'action_approved':
      return <AiOutlineCheckCircle style={{ color: "#4CAF50", fontSize: 30 }} className="notification-type-icon" />;
    case 'action_rejected':
    case 'action_canceled':
      return <AiOutlineCloseCircle style={{ color: "#e91f62", fontSize: 30 }} className="notification-type-icon" />;
    case 'action_almost_expired':
      return <IconBell className="notification-type-icon" />;
    case 'action_expired':
      return <IconBell className="notification-type-icon" />;
    case 'access_requested':
      return <IconBell className="notification-type-icon" />;
    case 'action_review_requested':
      return <AiOutlineExclamationCircle style={{ color: "#FFC107", fontSize: 30 }} className="notification-type-icon" />;
    default:
      return null;
  }
};

function Notifications() {
  const dispatch = useDispatch();
  const [t] = useLocale();
  const settings = useSelector((state) => state.auth.account.notification_settings);
  const notifications = useSelector((state) => state.notifications);
  const [toggler, rerender] = useState(true);
  const enabledNotificationTypes = [...Object.keys(settings).filter((type) => settings[type].push), 'access_requested'];
  const showOnlyNew = notifications.status !== 'all';
  const indexedNewNotifications = indexBy(notifications.list?.filter((notify) => notify.status === 'created'), 'id');
  const indexedAllNotifications = indexBy(notifications.list, 'id');
  const enabledNotificationTypesToStr = enabledNotificationTypes.join(',');
  let indexedNotificationList = {};
  if (enabledNotificationTypes.length > 0) {
    indexedNotificationList = showOnlyNew ? indexedNewNotifications : indexedAllNotifications;
  }
  const hasPermission = ('Notification' in window) && Notification.permission === 'granted';

  const hasNotifications = Object.keys(indexedNotificationList).length > 0 || !hasPermission;

  useEffect(() => firebase.messaging.isSupported() && messaging.onMessage(({ notification }) => {
    dispatch(addNewNotification({ text: notification.body, ...notification.data }));
  }), [dispatch]);

  useEffect(() => {
    dispatch(fetchNotificationsAction({ type: enabledNotificationTypesToStr.split(',') }));
  }, [dispatch, enabledNotificationTypesToStr]);

  const newNotificationsLength = Object.keys(indexedNewNotifications).length;

  const title = (
    <div>
      <h3>
        {t("Notifications")}
        <Radio.Group
          size="small"
          buttonStyle="default"
          className="custom-switch"
          onChange={(e) => dispatch(changeNotificationStatus(e.target.value))}
        >
          <Radio.Button
            shape="circle"
            value="all"
            className={`notification-stats ${!showOnlyNew && 'active'}`}
          >
            {t('All(%s)', Object.keys(indexedAllNotifications).length)}
          </Radio.Button>
          <Radio.Button
            shape="circle"
            value="created"
            className={`notification-stats ${showOnlyNew && 'active'}`}
          >
            {t('New(%s)', Object.keys(indexedNewNotifications).length)}
          </Radio.Button>
        </Radio.Group>
      </h3>
    </div>
  );

  const content = (
    <>
      {hasPermission && (
        <div id="notification-group">
          {Object.keys(indexedNotificationList).map((key) => (
            <Link to={indexedNotificationList[key].link?.relative_url}
              key={indexedNotificationList[key].id}
              className="notification-item ant-popover-title">
              <NotificationIcon type={indexedNotificationList[key].type} />
              <div>
                <span>{moment(indexedNotificationList[key].created_at).format('DD MMM YYYY')}</span>
                <h3>{indexedNotificationList[key].text}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}
      {!hasPermission && (
        <div className="no-permissions">
          <h3>{t('Notifications are blocked')}</h3>
        </div>
      )}

      <Flex className="footer" jc="space-between">
        {!hasPermission && (
          <Button
            type="primary"
            onClick={() => Notification.requestPermission().then(() => rerender(!toggler))}
            style={{ width: '100%' }}
            icon={<IconSetting size={18} />}
            block
          >
            {t('Request permissions')}
          </Button>
        )}
        {hasPermission && (
          showOnlyNew
            ? (
              <Button
                disabled={Object.keys(indexedNewNotifications).length === 0}
                onClick={() => dispatch(readNotificationsAction(Object.keys(indexedNewNotifications)))}
                style={{ width: '100%' }}
                icon={<IconClear size={18} />}
                block
              >
                {t("Mark as read")}
              </Button>
            )
            : (
              <Button
                disabled={Object.keys(indexedAllNotifications).length === 0}
                onClick={() => dispatch(deleteNotificationsAction(Object.keys(indexedAllNotifications)))}
                style={{ width: '100%' }}
                icon={<IconClear size={18} />}
                block
              >
                {t('Clear all')}
              </Button>
            )

        )}
      </Flex>
    </>
  );

  return (
    <NotificationWidget className="profile-wrapper">
      <Popover
        content={content}
        title={title}
        placement="bottomRight"
        trigger="click"
        overlayClassName="profile-popover"
        className="bell-icon-parent"
        color={colors.dark}
        arrowPointAtCenter
        getPopupContainer={(trigger) => trigger.parentNode}
      >
        <IconBell className={`notification-icon ${hasNotifications ? 'active' : ''}`} />
        {
          newNotificationsLength ? <div className="notifications-length">{newNotificationsLength}</div> : null
        }

      </Popover>
    </NotificationWidget>
  );
}

export default Notifications;
