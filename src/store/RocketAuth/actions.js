import * as types from './actionTypes';
import Axios from '../../utils/axios';
import { ROCKET_SIGN_IN } from '../../graphql/rocket';

const rocketLogin = () => async dispatch => {
  try {
    const { data } = await Axios.post('/graphql', {
      query: ROCKET_SIGN_IN,
    })
    console.log(data);
    return dispatch({ type: types.CREATE_ROCKET_AUTh, payload: data.data.rocket_sign_in });
  } catch (err) {
    console.log(err.response);
    return {}
  }
}

const rocketUpdate = () => async dispatch => {
  try {
    const { data } = await Axios.post('/graphql', {
      query: ROCKET_SIGN_IN,
    })
    return dispatch({ type: types.UPDATE_ROCKET_AUTH, payload: data.data.rocket_sign_in });
  } catch (err) {
    console.log(err.response);
    return {}
  }
}




export { rocketLogin, rocketUpdate };
