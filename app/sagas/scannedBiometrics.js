import { call, put, takeLatest, select, takeEvery } from "redux-saga/effects";
import { push } from "react-router-redux";
import * as localStorage from "../utils/localStorage";
import { delay } from "redux-saga";
import { requestShowNotification } from "../actions/notifications";
import Api, { url } from "../api/";
import { startSpinner, stopSpinner } from "../../app/actions/spinner";
import { requestShowModal } from "../actions/modal";
import { requestSaveBiometricMugshot } from "../actions/scannedBiometrics";
import {
  REQUEST_SCANNED_IMAGE_MODAL,
  REQUEST_BIOMETRICS_MUGSHOT,
  REQUEST_UPDATE_JOB_BIOMETRICS
} from "../actions/actionTypes";
import {
  jobsTypeSelector,
  jobsByIdStateSelector,
  selectedJobSelector
} from "../selectors/jobs";
const regex = /($[a-z])|[A-Z][^A-Z]+/g;
export function* watchRequestScannedImageModal() {
  yield takeLatest(REQUEST_SCANNED_IMAGE_MODAL, callRequestScannedImageModal);
}
export function* watchRequestBiometricMugshot() {
  yield takeLatest(REQUEST_BIOMETRICS_MUGSHOT, callRequestBiometricMugshot);
}
export function* watchRequestUpdateJobBiometrics() {
  yield takeLatest(
    REQUEST_UPDATE_JOB_BIOMETRICS,
    callRequestUpdateJobBiometrics
  );
}
export function* callRequestScannedImageModal(action) {
  const { payload: imageDetails } = action;
  try {
    const res = yield call(Api, {
      url: url.action.getMatchedBiometricsImage,
      method: "POST",
      isJwtRequired: true,
      data: imageDetails
    });

    if (res) {
      yield put(
        requestShowModal({
          modalType: "LIVESCAN_PROBE",
          modalProps: {
            image: res.probe.image,
            position: res.probe.position.match(regex).join(" ")
          }
        })
      );
    }
  } catch (e) {
    console.log(e);
  }
}
export function* callRequestBiometricMugshot(action) {
  const { payload: imageMugshot } = action;
  try {
    yield put(startSpinner());
    const res = yield call(Api, {
      url: url.action.getMatchedBiometricsImage,
      method: "POST",
      isJwtRequired: true,
      data: imageMugshot
    });

    if (res) {
      yield put(requestSaveBiometricMugshot(res.probe.image));
    }
    yield put(stopSpinner());
  } catch (e) {
    yield put(stopSpinner());
    console.log(e);
  }
}

export function* callRequestUpdateJobBiometrics(action) {
  let jobType = yield select(jobsTypeSelector);
  if (jobType !== undefined && jobType === "Tenprint") {
    const selectedJob = yield select(selectedJobSelector);
    const jobList = yield select(jobsByIdStateSelector);
    let sourceType = jobList[selectedJob].sourceType;
    if (sourceType === "Cardscan") {
      yield put(push("/authenticated/tenprint/card"));
    } else if (sourceType === "Livescan") {
      yield put(push("/authenticated/tenprint/livescan"));
    } else {
      yield put(push("/authenticated/tenprint"));
    }
  } else if (jobType !== undefined && jobType === "Latent") {
    yield put(push("/authenticated/latent"));
  }
}
