import * as types from './actionTypes';
import Axios from '../../utils/axios';
import { FETCH_WORKING_GROUPS } from '../../graphql/workingGroups';

export const fetchWorkingGroupsAction = (config = {}) => dispatch => {
  return Axios.post('/graphql', {query: FETCH_WORKING_GROUPS}, config)
    .then(res => {
      if (res?.data?.data?.indicator_groups?.nodes) {
        const payload = res.data.data.indicator_groups.nodes;
        return dispatch(fetchWorkingGroupSuccess(payload));
      } else {
        console.warn('No working groups data received');
        return dispatch(fetchWorkingGroupSuccess([]));
      }
    })
    .catch(err => {
      console.error('Failed to fetch working groups:', err.message);
      // Dispatch empty array on error to prevent app crash
      return dispatch(fetchWorkingGroupSuccess([]));
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


