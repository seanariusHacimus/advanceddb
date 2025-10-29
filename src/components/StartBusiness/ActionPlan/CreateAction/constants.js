import { notEmptyErrorConfig } from "../../../../utils";

export const errorsConfig = {
  name: {
    ...notEmptyErrorConfig,
    "should be unique": {
      alert: "Action with this name already exist",
      msg: "should be unique",
    },
  },
  start_at: {
    "should not be after any sub action start_at": {
      alert: "Action should not conflict with subaction deadlines",
      msg: "should not be after subaction start",
    },
    "should be valid": {
      msg: "invalid",
      alert: false,
    },
    "should not be before parent-action start_at": {
      alert: "Action should not exceed parent action deadlines",
      msg: "should be after parent start",
    },
    "should not be after end_at": {
      alert: "Action cannot end before start",
      msg: "should be before end",
    },
  },
  end_at: {
    "should be valid": {
      msg: "invalid",
      alert: false,
    },
    "should not be after parent-action end_at": {
      alert: "Action should not exceed parent action deadlines",
      msg: "should be before parent end",
    },
    "should not be before any sub action end_at": {
      alert: "Action should not conflict with subaction deadlines",
      msg: "should not be before subaction end",
    },
    "should not be before start_at": {
      alert: "Action cannot end before start",
      msg: "should be after start",
    },
  },
  action_id: {
    "should be related to your account": {
      alert: "Insufficient permissions for this group",
      msg: false,
    },
  },
  sub_action_id: {
    "should be related to your account": {
      alert: "Insufficient permissions for this group",
      msg: false,
    },
  },
  description: {},
  number: {},
  group_id: {
    "should be related to your account": {
      alert: "Insufficient permissions for this group",
      msg: false,
    },
  },
  responsive_account_ids: {
    "should be active": {
      msg: "Responsive account should be invited or activated",
      alert: "should be invited or activated",
    },
    "should be related to responsive account": {
      msg: "is not related to this group",
      alert:
        "Responsible account is not allowed to be responsible in this working group",
    },
  },
};

export const initialState = {
  end_at: "",
  name: "",
  description: "",
  number: 0,
  responsive_account_ids: [],
  allAccounts: [],
  allOrganizations: [],
  start_at: "",
  entitiesByValue: {},
  errors: {},
  alerts: [],
  accountSearch: "",
  organizationSearch: "",
  showDummyModal: false,
  isStartAtFocused: false,
  isEndAtFocused: false,
  responsive_tags: [],
  tagSearch: "",
  allTags: [],
  attachments: [],
  category: undefined,
  sub_category: undefined,
  pillar_number: undefined,
  isActionNameSelected: false,
};
