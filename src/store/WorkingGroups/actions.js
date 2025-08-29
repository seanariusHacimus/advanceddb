import * as types from './actionTypes';
import Axios from '../../utils/axios';
import { FETCH_WORKING_GROUPS } from '../../graphql/workingGroups';

export const fetchWorkingGroupsAction = () => dispatch => {
  return Axios.post('/graphql', {query: FETCH_WORKING_GROUPS})
    .then(res => {
      if (res?.data) {
        const payload = res.data.data.indicator_groups.nodes;
        return dispatch(fetchWorkingGroupSuccess(payload));
      }
    })
    .catch(err => {
      console.log(err);
    })

};

export const updateWorkingGroup = (payload) => ({
  type: types.UPDATE_WORKING_GROUP,
  payload,
});

export const fetchWorkingGroupSuccess = payload => ({
  type: types.FETCH_WORKING_GROUP,
  payload,
})


