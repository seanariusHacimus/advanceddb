import * as types from "./actionTypes";

const initialState = {
  actions: { total: 0 },
  sub_actions: { total: 0 },
  count: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_APPROVALS: {
      return {
        ...state,
        ...action.payload,
      };
    }

    default: {
      return state;
    }
  }
};
