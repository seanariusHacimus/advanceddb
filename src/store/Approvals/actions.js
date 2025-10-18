import * as types from "./actionTypes";
import Axios from "../../utils/axios";
import { FETCH_APPROVAL_ACTIONS_NUMBER } from "../../graphql/approvals";
import { USER_ROLES } from "../../constants/userRoles";

export const fetchNumberOfApprovals = (payload) => ({
  type: types.FETCH_APPROVALS,
  payload,
});

const defaultFilter = { status: "on_review" };

export const fetchApprovalsActionNumber =
  (filter = defaultFilter) =>
  (dispatch, getState) => {
    try {
      const state = getState();
      const account = state.auth?.account || {};
      const currentUserRole = account.role;
      const leaderGroups = (account.leader_groups || []).map((i) => i.id);

      if (currentUserRole === USER_ROLES.PARTICIPANT) {
        filter = {
          status: "on_review",
          group_id: leaderGroups,
        };
      }

      return Axios.post(
        "/graphql",
        {
          query: FETCH_APPROVAL_ACTIONS_NUMBER,
          variables: {
            filter,
            filterSubAction: filter,
          },
        },
        { hideSpinner: true }
      )
        .then((res) => {
          if (res?.data) {
            const { actions = { total: 0 }, sub_actions = { total: 0 } } =
              res.data.data;

            dispatch(
              fetchNumberOfApprovals({
                ...res.data.data,
                count: parseInt(actions.total + sub_actions.total),
              })
            );
            return actions.total + sub_actions.total;
          }
          return 0;
        })
        .catch((err) => {
          console.error("[Custom Catch Error]-->", err);
          throw err;
        });
    } catch (err) {
      console.error("[Custom Catch Error]-->", err);
      return Promise.reject(err);
    }
  };
