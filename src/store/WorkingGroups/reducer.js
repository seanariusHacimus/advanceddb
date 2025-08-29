import * as types from './actionTypes';

const initialState = {
  error: false,
  msg: '',
  pending: false,
  success: false,
  data: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_WORKING_GROUP:
    case types.UPDATE_WORKING_GROUP: {
      return {
        ...state,
        pending: false,
        error: false,
        success: true,
        data: action.payload
      };
    }

    default: {
      return state;
    }
  }
};