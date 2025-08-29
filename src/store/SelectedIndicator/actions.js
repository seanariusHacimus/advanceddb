import * as types from './actionTypes';
import Axios from '../../utils/axios';
import { FETCH_WORKING_GROUPS } from '../../graphql/workingGroups';
import { groupTitleToUrl } from "../../utils";

export const selectWorkingGroupAction = payload => ({
  type: types.SELECT_WORKING_GROUP,
  payload,
});

function calculatePermissions(selectedWorkingGroup, user) {
  const accountBelongToGroup = [...user.leader_groups, ...user.member_groups].find(group => group.id === selectedWorkingGroup.id);
  const isGroupLeader = selectedWorkingGroup.my_role === 'leader';

  return {
    action: {
      create: ['superuser', 'coordinator'].includes(user.role) || accountBelongToGroup,
      delete: ['superuser', 'coordinator'].includes(user.role) || accountBelongToGroup,
      update: ['superuser', 'coordinator'].includes(user.role) || accountBelongToGroup,
      complete: ['superuser', 'coordinator'].includes(user.role) || accountBelongToGroup,
    },

    meeting_minute: {
      create: ['superuser', 'coordinator'].includes(user.role) || accountBelongToGroup,
      delete: ['superuser', 'coordinator'].includes(user.role) || accountBelongToGroup,
      update: ['superuser', 'coordinator'].includes(user.role) || accountBelongToGroup,
    },

    member: {
      create: ['superuser', 'coordinator'].includes(user.role) || (accountBelongToGroup && isGroupLeader),
      delete: ['superuser', 'coordinator'].includes(user.role) || (accountBelongToGroup && isGroupLeader),
    },

    methodology: {
      update: ['superuser'].includes(user.role),
    },

    what_to_reform: {
      update: ['superuser'].includes(user.role)
    }
  }
}

export const fetchCurrentIndicatorGroupAction = (title, hideSpinner) => (dispatch, getState) => {
  const currentIndicator = title ? getState().workingGroups?.data.find(group => {
    if (groupTitleToUrl(group.title) === title) {
      return group
    }
  }) : getState().selectedWorkingGroup;
  return Axios.post('/graphql', {
    query: FETCH_WORKING_GROUPS,
    variables: { filter: { id: currentIndicator?.id } }
  }, { hideSpinner }).then(({ data }) => {
    const { nodes } = data.data.indicator_groups;
    const workingGroup = nodes[0];
    return dispatch(selectWorkingGroupAction({
      ...workingGroup,
      permissions: calculatePermissions(workingGroup, getState().auth.account)
    }));
  }).catch(err => {
    console.log(err);
    return err;
  })
}


