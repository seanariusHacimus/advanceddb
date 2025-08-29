import * as types from './actionTypes';
import Axios from '../../utils/axios';
import { FETCH_ACTIONS } from '../../graphql/actions';

export const fetchActions = (payload) => ({
  type: types.FETCH_ACTIONS,
  payload,
});

export const fetchActionPlans = (id) => (dispatch) => {
  Axios.post('/graphql', {
    query: FETCH_ACTIONS,
    variables: {
      filter: {
        group_id: id,
      },
      order: {
        key: 'created_at',
        direction: 'asc',
      },
    },
  }).then(({ data }) => dispatch(fetchActions(data.data.actions.nodes))).catch((err) => console.log(err));
};
