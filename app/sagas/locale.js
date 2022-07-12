import { call, put, takeLatest } from "redux-saga/effects";
import * as localStorage from "../utils/localStorage";
import { delay } from "redux-saga";

import {
  REQUEST_SET_LOCALE,
  REQUEST_SET_LOCALE_SUCCESS
} from "../actions/actionTypes";
import { requestSetLocale, requestSetLocaleSuccess } from "../actions/locale";
import { startSpinner, stopSpinner } from "../../app/actions/spinner";

export function* watchRequestSetLocale() {
  yield takeLatest(REQUEST_SET_LOCALE, callSetLocale);
}

export function* callSetLocale(action) {
  yield put(startSpinner());
  try {
    yield call(delay, 200);
    const { dir, lang } = action.payload;
    document.dir = dir;
    yield call(localStorage.set, "lang", lang);
    yield put(requestSetLocaleSuccess(action.payload));
  } catch (e) {
  } finally {
    yield put(stopSpinner());
  }
}
