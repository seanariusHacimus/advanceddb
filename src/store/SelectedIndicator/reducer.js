import * as types from "./actionTypes";

const initialState = {
  id: "",
  title: "",
  permissions: {
    action: {
      create: false,
      delete: false,
      update: false,
      complete: false,
    },

    meeting_minute: {
      create: false,
      delete: false,
      update: false,
    },

    member: {
      create: false,
      delete: false,
    },

    methodology: {
      update: false,
    },

    what_to_reform: {
      update: false,
    },
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SELECT_WORKING_GROUP: {
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
