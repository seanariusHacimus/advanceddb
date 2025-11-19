import * as types from './actionTypes';
import Axios from '../../utils/axios';
import { ROCKET_SIGN_IN } from '../../graphql/rocket';

const rocketLogin = () => async dispatch => {
  try {
    const { data } = await Axios.post('/graphql', {
      query: ROCKET_SIGN_IN,
    }, { hideSpinner: true })
    
    if (data?.data?.rocket_sign_in) {
      console.log('Rocket login successful:', data);
      return dispatch({ type: types.CREATE_ROCKET_AUTh, payload: data.data.rocket_sign_in });
    } else {
      console.warn('Rocket login - no data received');
      return {};
    }
  } catch (err) {
    console.warn('Rocket login failed (non-critical):', err.message);
    // Return empty object instead of throwing - messaging is optional
    return {}
  }
}

const rocketUpdate = () => async dispatch => {
  try {
    const { data } = await Axios.post('/graphql', {
      query: ROCKET_SIGN_IN,
    }, { hideSpinner: true })
    
    if (data?.data?.rocket_sign_in) {
      return dispatch({ type: types.UPDATE_ROCKET_AUTH, payload: data.data.rocket_sign_in });
    } else {
      console.warn('Rocket update - no data received');
      return {};
    }
  } catch (err) {
    console.warn('Rocket update failed (non-critical):', err.message);
    // Return empty object instead of throwing - messaging is optional
    return {}
  }
}




export { rocketLogin, rocketUpdate };
