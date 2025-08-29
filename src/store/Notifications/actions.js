import * as types from './actionTypes';
import Axios from '../../utils/axios';
import { DELETE_NOTIFICATIONS_QUERY, NOTIFICATIONS_QUERY, READ_NOTIFICATIONS_QUERY } from "../../graphql/notifications";

export const fetchNotificationsAction = (filter) => dispatch => {
  return Axios.post('/graphql', { query: NOTIFICATIONS_QUERY, variables: { filter, pagination: { size: -1 } } })
    .then(res => {
      if (res?.data) {
        const payload = res.data.data.notifications.nodes;
        dispatch(fetchNotificationsSuccess(payload));
      }
    })
    .catch(err => {
      console.error('[Custom Catch Error]-->', err);
    })

};

export const readNotificationsAction = (ids) => (dispatch, getState) => {
  const settings = getState().auth.account.notification_settings;
  const enabledNotificationTypes = Object.keys(settings).filter(type => settings[type].push);

  return Axios.post('/graphql', {
    query: READ_NOTIFICATIONS_QUERY,
    variables: { filter: { id: ids } }
  })
    .then(res => {
      if (res?.data) {
        dispatch(fetchNotificationsAction({ type: enabledNotificationTypes }));
      }
    })
    .catch(err => {
      console.error('[Custom Catch Error]-->', err);
    })

};

export const deleteNotificationsAction = (ids) => (dispatch, getState) => {
  const settings = getState().auth.account.notification_settings;
  const enabledNotificationTypes = Object.keys(settings).filter(type => settings[type].push);

  return Axios.post('/graphql', {
    query: DELETE_NOTIFICATIONS_QUERY,
    variables: { filter: { id: ids } }
  })
    .then(res => {
      if (res?.data) {
        dispatch(fetchNotificationsAction({ type: enabledNotificationTypes }));
      }
    })
    .catch(err => {
      console.error('[Custom Catch Error]-->', err);
    })

};


export const readNotifications = (payload) => ({
  type: types.READ_NOTIFICATIONS,
  payload,
});

export const fetchNotificationsSuccess = payload => ({
  type: types.FETCH_NOTIFICATIONS,
  payload,
})

export const changeNotificationStatus = payload => ({
  type: types.CHANGE_NOTIFICATION_STATUS,
  payload,
})


export const addNewNotification = payload => ({
  type: types.ADD_NEW_NOTIFICATION,
  payload,
})

