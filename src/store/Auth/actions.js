import * as types from './actionTypes';
import Axios from '../../utils/axios';
import { MY_ACCOUNT_QUERY } from "../../graphql/profile";

// ----------- SIGN UP -----------------
export const signUpError = (err) => ({
  type: types.SIGN_UP_ERROR,
  error: err,
});

export const signUpPending = () => ({
  type: types.SIGN_UP_PENDING,
});

export const signUpSuccess = (payload) => ({
  type: types.SIGN_UP_SUCCESS,
  payload,
});

export const signUpAction = (data) => (dispatch) => {
  dispatch(signUpPending());

  return Axios.post('/auth/sign-up', data)
    .then(({ data }) => {
      if (data.success && data.payload) {
        return dispatch(signUpSuccess(data.payload));
      }
      return dispatch(signUpError(data.msg));
    })
    .catch((err) => dispatch(signUpError(err.message)));
};

// ----------- SIGN IN -----------------
export const signInError = (err) => ({
  type: types.SIGN_IN_ERROR,
  error: err,
});

export const signInPending = () => ({
  type: types.SIGN_IN_PENDING,
});

export const signInSuccess = (payload) => {
  console.log(payload);
  return {
    type: types.SIGN_IN_SUCCESS,
    payload,
  }
};

// ----------- SIGN OUT -----------------

export const signOutError = (err) => ({
  type: types.SIGN_OUT_ERROR,
  payload: err,
});

export const signOutPending = () => ({
  type: types.SIGN_OUT_PENDING,
});

export const signOutSuccess = () => ({
  type: types.SIGN_OUT_SUCCESS,
});

export const authUpdate = payload => ({
  type: types.AUTH_UPDATE,
  payload,
});


export const refreshMyAccountSuccess = (payload) => ({
  type: types.REFRESH_MY_ACCOUNT,
  payload,
});

export const refreshMyAccount = (data) => (dispatch) => {
  return Axios.post('/graphql', { query: MY_ACCOUNT_QUERY }, { hideSpinner: data?.hideSpinner })
    .then(res => {
      if (res?.data) {
        const payload = res.data.data.my_account;
        return dispatch(refreshMyAccountSuccess(payload));
      }
    })
    .catch(err => {
      console.log(err);
    })
};
