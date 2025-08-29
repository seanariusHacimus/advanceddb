import { useDispatch, useSelector } from "react-redux";
import { setCode } from "../store/Locale/actions";
import React from "react";
import { sprintf } from 'sprintf-js'


function t(dictionary = {}, str, ...params) {
  let translation;
  if (dictionary) {
    translation = dictionary[str];
    if (translation === '') {
      // console.warn('MISSING_TRANSLATION', 'Translation is missing: ' + str);
    } else if (!translation) {
      // translation = "*" + str;
      // console.warn('MISSING_TRANSLATION', 'Translation is not found at all: ' + str);
    }
  }
  return sprintf((translation || str)?.replaceAll('% ', '%%'), ...params);
}


function tFn(dictionary) {
  return (str, ...params) => t(dictionary, str, ...params)
}


export function useLocale() {
  const { code, dictionary, list } = useSelector(state => state.locales)
  const dispatch = useDispatch()
  const setLocale = (locale) => dispatch(setCode(locale));
  const localeList = list.map(l => l.code)
  return [tFn(dictionary), code, setLocale, localeList]
}


export function withLocale(LocalizedComponent) {
  return function (props) {
    const { code, dictionary, list } = useSelector(state => state.locales)
    const dispatch = useDispatch()
    const setLocale = (locale) => dispatch(setCode(locale));
    const localeList = list.map(l => l.code)
    return <LocalizedComponent
      {...props}
      code={code}
      t={tFn(dictionary)}
      setLocale={setLocale}
      localeList={localeList}
    />
  }
}


export {
  t
}
