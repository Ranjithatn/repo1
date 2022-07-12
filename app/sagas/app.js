import { call, put, takeLatest } from "redux-saga/effects";
import Api, { url } from "../api/";
import { startSpinner, stopSpinner } from "../../app/actions/spinner";

import {
  REQUEST_NFIQ_QUALITY_THRESHOLD
  // CHECK_SERVER_CONNECTION_STATUS,
} from "../actions/actionTypes";

import { requestUpdateNFIQQualityThreshold } from "../actions/app";

export function* watchRequestNFIQQualityThreshold() {
  yield takeLatest(REQUEST_NFIQ_QUALITY_THRESHOLD, callNFIQQualityThreshold);
}

export function* callNFIQQualityThreshold(action) {
  yield put(startSpinner());

  const res = yield call(Api, {
    url: url.systeminfo.getsystemsettings,
    method: "POST",
    isJwtRequired: true
    // data: "ImageQuality.FingerprintQualityThreshold.NFIQ",
  });

  // console.log("response", res);

  if (res) {
    // console.log("res[0].value",res[0].value);
    if (res.length > 0 && res[0].value) {
      // yield put( requestUpdateNFIQQualityThreshold(res[0].value) );
      yield put(requestUpdateNFIQQualityThreshold(res));
    }
    yield put(stopSpinner());
  } else {
    yield put(stopSpinner());
  }
}
