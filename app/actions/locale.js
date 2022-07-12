// @flow
import { REQUEST_SET_LOCALE, REQUEST_SET_LOCALE_SUCCESS } from "./actionTypes";

type payload = {
  +lang: string,
  +dir: string
}

export const requestSetLocale = payload => {
  return {
    type: REQUEST_SET_LOCALE,
    payload
  }
}

export const requestSetLocaleSuccess = payload => ({
  type: REQUEST_SET_LOCALE_SUCCESS,
  payload
})