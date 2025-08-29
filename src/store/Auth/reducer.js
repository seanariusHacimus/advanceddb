import * as types from './actionTypes';

const initialState = {
  error: false,
  isLogged: false,
  msg: '',
  pending: false,
  success: false,
  account: null,
  access_token: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SIGN_IN_ERROR: {
      return {
        error: true,
        isLogged: false,
        msg: action.error,
        pending: false,
        success: false,
      };
    }
    case types.SIGN_IN_SUCCESS: {
      return {
        pending: false,
        error: false,
        isLogged: true,
        success: true,
        ...action.payload
      };
    }
    case types.SIGN_IN_PENDING: {
      return {
        error: false,
        isLogged: false,
        msg: null,
        pending: true,
        success: false,
        account: null,
        access_token: null,
      };
    }

    case types.AUTH_UPDATE: {
      return {
        ...state,
        ...action.payload
      }
    }

    case types.REFRESH_MY_ACCOUNT: {
      return {
        ...state,
        account: {
          ...state.account,
          ...action.payload
        }
      }
    }

    case types.SIGN_OUT_SUCCESS: {
      return initialState;
    }

    default: {
      return state;
    }
  }
};
