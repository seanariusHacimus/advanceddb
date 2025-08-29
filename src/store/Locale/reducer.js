import * as types from './actionTypes';

const initialState = {
  code: undefined,
  dictionary: {},
  list: []
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case types.SET_LOCALE_CODE: {
      return {
        ...state,
        code: payload.code,
        dictionary: state.list.find(locale => locale.code === payload.code)?.dictionary
      };
    }
    case types.SET_LOCALE_LIST: {
      return {
        ...state,
        code: payload.list[0]?.code,
        list: payload.list,
        dictionary: payload.list.find(locale => locale.code === state.code)?.dictionary
      };
    }

    default: {
      return state;
    }
  }
};
