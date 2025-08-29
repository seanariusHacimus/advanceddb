import * as types from './actionTypes';
import Axios from "../../utils/axios";
import {FETCH_LOCALE_VERSIONS, FETCH_LOCALES} from "../../graphql/locale";
import {indexBy} from "../../utils";
import moment from "moment-timezone";

export const setCode = (code) => {
  moment.locale(code);
  return ({
    type: types.SET_LOCALE_CODE,
    payload: {code},
  });
};


export const setList = list => ({
  type: types.SET_LOCALE_LIST,
  payload: {list},
});


export const refreshLocales = () => (dispatch, getState) => {
  const {list, code} = getState().locales
  moment.locale(code);
  Axios
    .post('/graphql', {
      query: FETCH_LOCALE_VERSIONS,
    })
    .then((res) => {
      const {locales} = res?.data.data;
      const savedLocalesByCode = indexBy(list, 'code');
      const missingLocales = locales.filter(locale => {
        return savedLocalesByCode[locale.code]?.version !== locale.version
      });
      if (missingLocales.length > 0) {
        console.warn("Refreshing locales")
        Axios.post('/graphql', {
          query: FETCH_LOCALES,
        }).then((res) => {
          const {locales} = res?.data.data;
          dispatch(setList(locales))
        })
      } else {
        console.log('Locales are upto date')
      }
    });
};
