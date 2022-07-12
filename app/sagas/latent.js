import { call, put, takeLatest, select, takeEvery } from "redux-saga/effects";
import { push } from "react-router-redux";
import { delay } from "redux-saga";
import { requestShowNotification } from "../actions/notifications";
import Api, { url } from "../api/";
import { selectedJobSelector } from "../selectors/jobs";
import { startSpinner, stopSpinner } from "../../app/actions/spinner";
import { requestShowModal } from "../actions/modal";
import { requestTableRowClicked } from "../actions/global";
import {
  REQUEST_RECEIVED_IMAGE,
  REQUEST_SAVE_LATENT_EDITED_IMAGE,
  REQUEST_SAVE_SUD
} from "../actions/actionTypes";
import { NEW_ACTION } from "../components/Modal/ModalRoot";
import { requestReceivedImage, requestSaveSUDSuccess } from "../actions/latent";
import { requestClearLatentEditorData } from "actions/jobs";
import { requestActiveJobs } from "../actions/jobs";
import { cardScanReset } from "../actions/cardScan";
import { setTimeout } from "timers";
import { translateRes, translate } from "../utils/intl";
export function* watchRequestRecivedImage() {
  yield takeLatest(REQUEST_RECEIVED_IMAGE, callRequestRecivedImage);
}
export function* watchRequestSaveSUD() {
  yield takeLatest(REQUEST_SAVE_SUD, callRequestSaveSUD);
}
export function* watchRequestSaveLatentEditedImage() {
  yield takeLatest(
    REQUEST_SAVE_LATENT_EDITED_IMAGE,
    callRequestSaveLatentEditedImage
  );
}

export function* callRequestSaveSUD(action) {
  try {
    const { payload: SUDData } = action;
    const basedata = new Buffer(SUDData).toString("base64");
    if (basedata) {
      yield put(requestSaveSUDSuccess(basedata));
      yield put(push("/authenticated/latent/LatentEditedImage"));
    }
  } catch (e) {
    console.log(e);
  }
}

export function* callRequestRecivedImage(action) {
  const { payload: imgdata } = action;
  var Base64Data = "";
  var savingdata = {};
  yield put(startSpinner());

  yield put(push("/authenticated/latent/latentinnov"));
  yield put(stopSpinner());
}

export function* callRequestSaveLatentEditedImage(action) {
  const { payload: imgdata, extra: meta } = action;

  const jobnum = yield select(selectedJobSelector);
  const jobID = jobnum;

  const output = {
    jobID: jobID,
    biometrics: [
      {
        type: meta.modality || "Finger",
        impression: meta.impression || "Flat",
        position: meta.position || "Unknown Finger",
        encoding: "PNG",
        image: imgdata,
        hashValue: "",
        isTemplate: false,
        patterType: "Radial Loops",
        referencePatterType: "",
        quality: 1, // hard coded
        minutiaCount: 17,
        annotation: "",
        annotationNote: "",
        createdBy: "Operator 1"
      }
    ]
  };

  const quality = [
    {
      type: meta.modality || "Finger",
      impression: meta.impression || "Flat",
      position: meta.position || "Unknown Finger",
      encoding: "PNG",
      image: "",
      hashValue: "",
      isTemplate: false,
      patterType: "Radial Loops",
      referencePatterType: "",
      quality: 1, // hard coded
      minutiaCount: 17,
      annotation: "",
      annotationNote: "",
      createdBy: "Operator 1"
    }
  ];

  yield put(startSpinner());

  if (!output.jobID) {
    yield put(stopSpinner());
    yield put(
      requestShowNotification({
        message: translate("FingerNotUpdated"),
        type: "is-danger"
      })
    );
  }
  // let's proceed to next step(s)
  else {
    // console.log("data being sent to the verifybiometricsquality", quality);

    // let's validate the fingerprint quality first
    const verifyRes = yield call(Api, {
      url: url.job.verifybiometricsquality,
      method: "POST",
      isJwtRequired: true,
      data: quality
    });
    

    if (verifyRes) {
      if (verifyRes.error) {
        yield put(stopSpinner());
        yield put(
          requestShowNotification({
            message: verifyRes.error,
            type: "is-danger"
          })
        );
      }
      else if (verifyRes && verifyRes.message && (typeof verifyRes.message === "string" ) && verifyRes.message.indexOf('Unauthorized or Token Expired') !== -1 ) {
        yield put(stopSpinner());
        yield put(
          requestShowNotification({
            message: verifyRes && verifyRes.message,
            type: "is-danger"
          })
        );
      }
      
      
      else {
        // save the data in middleware
        const res = yield call(Api, {
          url: url.job.updateFingerprintData,
          method: "POST",
          isJwtRequired: true,
          data: output
        });
        console.log("res", res);
        yield put(stopSpinner());
        // if we get the response
        if (res) {
          if (res.error) {
            yield put(stopSpinner());
            yield put(
              requestShowNotification({
                message: res.error,
                type: "is-danger"
              })
            );
          } else {
            yield put(
              requestShowNotification({
                message: translateRes(res.message),
                type: "is-success"
              })
            );

            yield put(requestShowModal({ modalType: NEW_ACTION }));
            yield put(requestActiveJobs());

            yield put(
              requestTableRowClicked(
                yield select(selectedJobSelector),
                "jobQueue",
                "Ready",
                "Latent"
              )
            );

            yield put(cardScanReset());
            yield put(push("/authenticated/jobqueue"));
          }
        }
      } // quality test passed
    } else {
      yield put(stopSpinner());
    }
  }
}
