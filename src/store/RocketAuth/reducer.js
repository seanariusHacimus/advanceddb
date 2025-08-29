import * as types from './actionTypes';

const initialState = {
  token: '',
  user_id: '',
  isUpdated: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.CREATE_ROCKET_AUTh: {
      return {
        ...state,
        ...action.payload,
      };
    }

    case types.UPDATE_ROCKET_AUTH: {
      return {
        ...state,
        ...action.payload,
        isUpdated: true
      };
    }

    case types.DESTROY_ROCKET_AUTH: {
      return {
        ...state,
        isUpdated: false,
        token: '',
        user_id: '',
      };
    }

    default: {
      return state;
    }
  }
};