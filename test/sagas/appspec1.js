import { call, put } from "redux-saga/effects";
import { spy } from "sinon";
import { delay } from "redux-saga";

import * as localStorage from "../../app/utils/localStorage";
import { callNFIQQualityThreshold, watchRequestNFIQQualityThreshold } from "../../app/sagas/app";
import {
  requestNFIQQualityThreshold,
  requestUpdateNFIQQualityThreshold,
  requestUpdateServerStatus
} from "../../app/actions/app"
// import {
//   requestSetLocale,
//   requestSetLocaleSuccess
// } from "../../app/actions/locale";
import { REQUEST_SET_LOCALE } from "../../app/actions/actionTypes";
import { startSpinner, stopSpinner } from "../../app/actions/spinner";


describe("app saga", () => {

});
