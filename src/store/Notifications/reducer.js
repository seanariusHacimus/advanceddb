import * as types from './actionTypes';

const initialState = {
  list: [],
  status: 'created'
};

export default (state = initialState, action) => {
  switch (action.type) {
    // TODO implement read all notifications
    // case types.READ_NOTIFICATIONS:
    case types.FETCH_NOTIFICATIONS: {
      return {
        ...state,
        list: action.payload
      };
    }
    case types.CHANGE_NOTIFICATION_STATUS: {
      return {
        ...state,
        status: action.payload
      }
    }
    case types.ADD_NEW_NOTIFICATION: {
      return {
        ...state,
        list: [action.payload, ...state.list]
      }
    }

    default: {
      return state;
    }
  }
};
