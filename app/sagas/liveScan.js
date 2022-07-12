import { call, put, takeLatest, select, takeEvery } from "redux-saga/effects";
import { push } from "react-router-redux";
import * as localStorage from "../utils/localStorage";
import { reg_annotation } from "../utils/regEx";
import { delay } from "redux-saga";
import { requestShowNotification } from "../actions/notifications";
import Api, { url } from "../api/";
import { startSpinner, stopSpinner } from "../../app/actions/spinner";
import { requestShowModal } from "../actions/modal";
import { NEW_ACTION } from "../components/Modal/ModalRoot";
import MuhshotImage from "../images/mugshot.jpg";
const LivescanAPI = require("../hardwareSDK/biocoreSdk/livescan/livescan");
import {
  captureFromCamera,
  startLiveView,
  stopLiveView,
  dispose
} from "../hardwareSDK/canon/index";

import { requestActiveJobs } from "../actions/jobs";
import {
  REQUEST_SELECT_FINGER,
  REQUEST_SELECT_FINGER_SUCCESS,
  REQUEST_CAPTURE_DATA_CANON,
  REQUEST_STORE_COMPLETED_DATA,
  REQUEST_STORE_COMPLETED_DATA_SUCCESS,
  REQUEST_SAVE_LIVESCAN_FINGERPRINTS,
  REQUEST_STORE_CANON_DATA,
  REQUEST_START_CANON_LIVE_VIEW,
  REQUEST_STOP_CANON_LIVE_VIEW,
  REQUEST_SAVE_LIVESCAN_FINGERPRINTS_RESUMABLE,
  REQUEST_SAVE_LIVESCAN_FINGERPRINTS_RESUMABLE_SUCCESS
} from "../actions/actionTypes";
import { selectedJobSelector } from "../selectors/jobs";
import { requestTableRowClicked } from "../actions/global";
import {
  VerifyannotatedFingersSelector,
  canonDataSelector,
  completedRolledFPSelector,
  palmScanSelector,
  liveScanSelector,
  webcamImageSelector
} from "../selectors/liveScan";
import { usernameSelector } from "../selectors/auth";
import {
  requestSelectFinger,
  requestSelectFingerSuccess,
  // requestStartScan,
  requestStoreInitialLivescanData,
  // requestStopScan,
  requestStoreCompletedData,
  requestStoreCompletedDataSuccess,
  requestSaveLivescanFingerprints,
  requestClearLivescanData,
  requestStoreCanonData,
  liveScanWorkflow,
  requestCloseLiveScanProgress
} from "../actions/liveScan";
import { displayError } from "../components/Notification/PortalNotification";

import { setTimeout } from "timers";

import * as liveScanHelper from "./helpers/liveScanHelper";
import { store } from "../index";

import { settings as _settings } from "../utils/electron";

import fs from "fs";
import { translate, translateRes } from "../utils/intl";
export function* watchrequestSelectFinger() {
  yield takeLatest(REQUEST_SELECT_FINGER, callrequestSelectFinger);
}
export function* watchRequestGetCanonData() {
  yield takeLatest(REQUEST_CAPTURE_DATA_CANON, callRequestGetCanonData);
}

export function* watchRequestStartCanonLiveView() {
  yield takeLatest(
    REQUEST_START_CANON_LIVE_VIEW,
    callRequestStartCanonLiveView
  );
}

export function* watchRequestStopCanonLiveView() {
  yield takeLatest(REQUEST_STOP_CANON_LIVE_VIEW, callRequestStopCanonLiveView);
}

// export function* watchRequestStartScan() {
//   yield takeLatest(REQUEST_START_SCAN, callRequestStartScan);
// }
// export function* watchRequestStopScan() {
//   yield takeLatest(REQUEST_STOP_SCAN, callRequestStopScan);
// }
export function* watchRequestStoreCompletedData() {
  yield takeLatest(REQUEST_STORE_COMPLETED_DATA, callRequestStoreCompletedData);
}
export function* watchRequestSaveLivescanFingerprints() {
  yield takeLatest(
    REQUEST_SAVE_LIVESCAN_FINGERPRINTS,
    callRequestSaveLivescanFingerprints
  );
}
export function* watchRequestSaveLivescanFingerprintsResumable() {
  yield takeLatest(
    REQUEST_SAVE_LIVESCAN_FINGERPRINTS_RESUMABLE,
    callRequestSaveLivescanFingerprintsResumable
  );
}

export function* watchRequestSaveLivescanFingerprintsResumableSuccess() {
  yield takeLatest(
    REQUEST_SAVE_LIVESCAN_FINGERPRINTS_RESUMABLE_SUCCESS,
    callRequestSaveLivescanFingerprintsResumableSuccess
  );
}

export function* callRequestStartCanonLiveView(action) {
 
  // let imagedata = yield call(startLiveView);
  // canonWebsocket.connectSocketServer( onData => {
  //   //Can be used as img.src
  //   console.log(onData);
  // });
}

export function* callRequestStopCanonLiveView(action) {
  // console.log("callRequestStopCanonLiveView");
  // stopLiveView
}

export function* callRequestGetCanonData(action) {
  try {
    yield put(startSpinner());
    let imagedata = yield call(captureFromCamera);
    // let imagedata = yield call(startLiveView);
    if (imagedata) {
      // console.log("CAMERA got image data ", imagedata && imagedata.length);
      // console.log("type of image data is ", typeof imagedata);
      if (
        typeof imagedata === "object" ||
        imagedata === "undefined" ||
        imagedata.length < 10000
      ) {
        displayError(
          "Capture error occurred, Please check if your camera is connected and switched on."
        );
        // console.log("CANON ERROR: try", imagedata);
        yield put(stopSpinner());
      } else {
        // console.log("got image, saving it in store");
        yield put(requestStoreCanonData(imagedata));
      }
    }
    yield put(stopSpinner());
  } catch (e) {
    // console.log("CANON ERROR: catch");
    displayError(
      "Capture error occurred, Please check if your camera is connected and switched on."
    );
    console.log("Capture errrorr", e);
    yield put(stopSpinner());
  }
}

export function* callRequestSaveLivescanFingerprints(action) {
  try {
    yield put(startSpinner());

    const liveScan = yield select(liveScanSelector);
    const live = liveScan.data;
    const palm = yield select(palmScanSelector);
    const mugshot = yield select(canonDataSelector);
    const webcam = yield select(webcamImageSelector);
    let user = yield select(usernameSelector);
    const setting = _settings();

    let output = {
      jobID: "",
      biometrics: []
    };

    let quality = [];


    const annotationReason = finger => {
      if (finger && finger.annotation && finger.annotation.Reason) {
        if (finger.annotation.Reason === "NotAnnotated") {
          return "";
        }
        if (finger.annotation.Reason === "Handicaped") {
          return "Handicapped";
        }
        return (
          finger.annotation &&
          finger.annotation.Reason &&
          finger.annotation.Reason.replace(reg_annotation, " $1").trim()
        );
      }
      return "";
    };

    if (live.length > 0) {
      live.map(finger => {
        let fingerQuality = 1;
        if (
          finger.image &&
          finger.image.Quality &&
          finger.image.Quality.NativeScore
        ) {
          fingerQuality = finger.image.Quality.NativeScore;
        }

        output.biometrics.push({
          type: "Finger",
          impression: finger.impression === "LivescanPlain" ? "Flat" : "Roll",
          position: finger.position.replace(reg_annotation, " $1").trim(),
          encoding: "PNG",
          image:
            finger.image && finger.image.Base64Data
              ? finger.image.Base64Data
              : "",
          hashValue: "",
          isTemplate: false,
          patternType: "Radial Loops",
          referencePatternType: "",
          quality: fingerQuality,
          minutiaCount: 17,
          annotation: annotationReason(finger),
          annotationNote: finger.annotation.Info,
          createdBy: user,
          modifiedBy: user
        });

        quality.push({
          type: "Finger",
          impression: "Flat",
          position: finger.position.replace(reg_annotation, " $1").trim(),
          encoding: "PNG",
          image: "",
          hashValue: "",
          isTemplate: false,
          patternType: "Radial Loops",
          referencePatternType: "",
          quality: fingerQuality,
          minutiaCount: 0,
          annotation: "",
          annotationNote: "",
          createdBy: user,
          modifiedBy: user
        });
      });
    }

    // save aplm scan data
    if (palm.data.length > 0) {
      Object.entries(palm.data).map((key, value) => {
        const finger = key[1];
        if ( ! finger ) { return; }

        let annotationReason = finger && finger.Annotation.Reason;
        if (annotationReason === "Handicaped") {
          annotationReason = "Handicapped";
        }
        output.biometrics.push({
          type: "Palm",
          impression: "Flat",
          position: finger.Position.replace(reg_annotation, " $1").trim(),
          encoding: "PNG",
          image:
            finger.Image && finger.Image.Base64Data
              ? finger.Image.Base64Data
              : "",
          hashValue: "",
          isTemplate: false,
          patternType: "Radial Loops",
          referencePatternType: "",
          // quality: fingerQuality,
          minutiaCount: 17,
          annotation:
            annotationReason === "NotAnnotated"
              ? ""
              : annotationReason.replace(reg_annotation, " $1").trim(),
          annotationNote: finger && finger.Annotation.Info,
          createdBy: user,
          modifiedBy: user
        });

        quality.push({
          type: "Palm",
          impression: "Flat",
          position: finger.Position.replace(reg_annotation, " $1").trim(),
          encoding: "PNG",
          image: "",
          hashValue: "",
          isTemplate: false,
          patternType: "Radial Loops",
          referencePatternType: "",
          // quality: fingerQuality,
          minutiaCount: 0,
          annotation: "",
          annotationNote: "",
          createdBy: user,
          modifiedBy: user
        });
      });
    }

    // save mugshot data
    if (setting.captureDevice && setting.captureDevice === "webcam") {
      if (webcam) {
        // console.log("adding mugshot for saving mugshot", mugshot);
        output.biometrics.push({
          type: "Mugshot",
          impression: "Face Photo",
          position: "Front Face",
          encoding: "PNG",
          hashValue: "",
          image: webcam,
          isTemplate: false,
          patternType: "Radial Loops",
          referencePatternType: "",
          quality: 1,
          minutiaCount: 17,
          annotation: "",
          annotationNote: "",
          createdBy: user
        });
      }
    } else {
      if (mugshot.ImageData) {
        // console.log("adding mugshot for saving mugshot", mugshot);
        output.biometrics.push({
          type: "Mugshot",
          impression: "Face Photo",
          position: "Front Face",
          encoding: "PNG",
          hashValue: "",
          image: mugshot.ImageData,
          isTemplate: false,
          patternType: "Radial Loops",
          referencePatternType: "",
          quality: 1,
          minutiaCount: 17,
          annotation: "",
          annotationNote: "",
          createdBy: user
        });
      }
    }

    const jobnum = yield select(selectedJobSelector);
    output.jobID = jobnum;

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
        // console.log(
        //   "callRequestSaveLivescanFingerprints::verifyRes",
        //   verifyRes
        // );
        // console.log(
        //   "response received from verifybiometricsquality",
        //   verifyRes
        // );

        if (verifyRes.error) {
          yield put(stopSpinner());
          yield put(
            requestShowNotification({
              // message: verifyRes.error,
              message: translate("qualityCheckFail"),
              type: "is-danger"
            })
          );
        } else {
          // console.log("data being sent to the updateFingerprintData", output);

          // save the data in middleware
          const res = yield call(Api, {
            url: url.job.updateFingerprintData,
            method: "POST",
            isJwtRequired: true,
            data: output
          });
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
            } else if (res.message) {
              yield put(requestCloseLiveScanProgress());
              yield put(
                requestShowNotification({
                  message: translateRes(res.message),
                  type: "is-success"
                })
              );

              yield put(requestClearLivescanData());
              yield put(requestShowModal({ modalType: NEW_ACTION }));
              yield put(requestActiveJobs());

              yield put(
                requestTableRowClicked(
                  yield select(selectedJobSelector),
                  "jobQueue",
                  "Ready",
                  "Tenprint"
                )
              );
              yield put(push("/authenticated/jobqueue"));
            }
          }
        } // quality test passed
      } else {
        yield put(stopSpinner());
      }
    } // else ends here
  } catch (e) {
    // try block ends here
    console.log("catch, error occoured", e);
    yield put(requestCloseLiveScanProgress());
    yield put(stopSpinner());
  }
}

export function* callRequestStoreCompletedData(action) {
  try {
    let finalFPData = {};
    let finalRolledFPData = {};
    const { payload: imageData } = action;
    imageData.forEach(element => {
      let positionData = element.position;
      let impressionData = element.impression;
      function decideFPData(presentobj, FPImpression, FPPosition) {
        if (FPImpression.indexOf("LivescanPlain") >= 0) {
          finalFPData[FPPosition] = presentobj;
        } else {
          finalRolledFPData[FPPosition] = presentobj;
        }
      }
      switch (positionData) {
        case "LeftIndex":
          decideFPData(element, impressionData, positionData);
          // finalFPData["LeftIndex"] = element;
          break;

        case "LeftMiddle":
          // finalFPData["LeftMiddle"] = element;
          decideFPData(element, impressionData, positionData);
          break;

        case "LeftRing":
          // finalFPData["LeftRing"] = element;
          decideFPData(element, impressionData, positionData);
          break;

        case "LeftLittle":
          // finalFPData["LeftLittle"] = element;
          decideFPData(element, impressionData, positionData);
          break;

        case "LeftThumb":
          // finalFPData["LeftThumb"] = element;
          decideFPData(element, impressionData, positionData);
          break;

        case "RightIndex":
          // finalFPData["RightIndex"] = element;
          decideFPData(element, impressionData, positionData);
          break;

        case "RightMiddle":
          // finalFPData["RightMiddle"] = element;
          decideFPData(element, impressionData, positionData);
          break;

        case "RightRing":
          // finalFPData["RightRing"] = element;
          decideFPData(element, impressionData, positionData);
          break;

        case "RightLittle":
          // finalFPData["RightLittle"] = element;
          decideFPData(element, impressionData, positionData);
          break;

        case "RightThumb":
          // finalFPData["RightThumb"] = element;
          decideFPData(element, impressionData, positionData);
          break;

        case "LeftFourFingers":
          // finalFPData["LeftFourFingers"] = element;
          decideFPData(element, impressionData, positionData);
          break;

        case "RightFourFingers":
          // finalFPData["RightFourFingers"] = element;
          decideFPData(element, impressionData, positionData);
          break;

        case "BothThumbs":
          // finalFPData["BothThumbs"] = element;
          decideFPData(element, impressionData, positionData);
          break;

        default:
          console.log("none of the above");
      }
    });
    yield put(requestStoreCompletedDataSuccess(finalFPData, finalRolledFPData));
  } catch (e) {
    console.log(e);
  }
}
export function* callrequestSelectFinger(action) {
  try {
    const { payload: Position } = action;
    let annotatedData = yield select(VerifyannotatedFingersSelector);

    let sendingdata = {
      annotationPosition: Position.position,
      annotationFinger: Position.finger
    };

    yield put(requestSelectFingerSuccess(sendingdata));
  } catch (e) {
    console.log(e);
  }
}

export function gatherAllData(live, palm, mugshot, webcam, jobNum) {
  let output = {
    jobID: jobNum,
    biometrics: []
  };
  let quality = [];

  const setting = _settings();

  const anootationReason = finger => {
    if (finger.annotation && finger.annotation.Reason) {
      if (finger.annotation.Reason === "NotAnnotated") {
        return "";
      }
      if (finger.annotation.Reason === "Handicaped") {
        return "Handicapped";
      }
      return (
        finger.annotation &&
        finger.annotation.Reason &&
        finger.annotation.Reason.replace(reg_annotation, " $1").trim()
      );
    }
    return "";
  };

  if (live.length > 0) {
    live.map(finger => {
      let fingerQuality = 1;
      if (
        finger.image &&
        finger.image.Quality &&
        finger.image.Quality.NativeScore
      ) {
        fingerQuality = finger.image.Quality.NativeScore;
      }

      output.biometrics.push({
        type: "Finger",
        impression: finger.impression === "LivescanPlain" ? "Flat" : "Roll",
        position: finger.position.replace(reg_annotation, " $1").trim(),
        encoding: "WSQ", // PNG
        image:
          finger.image && finger.image.Base64Data
            ? finger.image.Base64Data
            : "",
        hashValue: "",
        isTemplate: false,
        patternType: "Radial Loops",
        referencePatternType: "",
        quality: fingerQuality,
        minutiaCount: 17,
        annotation: anootationReason(finger),
        annotationNote: finger.annotation.Info,
        createdBy: "Operator 1",
        modifiedBy: "Operator 1"
      });

      quality.push({
        type: "Finger",
        impression: finger.impression === "LivescanPlain" ? "Flat" : "Roll",
        position: finger.position.replace(reg_annotation, " $1").trim(),
        encoding: "PNG",
        image: "",
        hashValue: "",
        isTemplate: false,
        patternType: "Radial Loops",
        referencePatternType: "",
        quality: fingerQuality,
        minutiaCount: 0,
        annotation: "",
        annotationNote: "",
        createdBy: "Operator 1",
        modifiedBy: "Operator 1"
      });
    });
  }

  // save aplm scan data
  if (palm.data.length > 0) {
    Object.entries(palm.data).map((key, value) => {
      const finger = key[1];

      if ( ! finger ) { return; }
      // let fingerQuality = 1;
      // if ( finger.Image && finger.Image.Quality && finger.Image.Quality.NativeScore ) { fingerQuality = finger.Image.Quality.NativeScore; }
      let annotationReason = finger && finger.Annotation.Reason;
      if (annotationReason === "Handicaped") {
        annotationReason = "Handicapped";
      }

      output.biometrics.push({
        type: "Palm",
        impression: "Flat",
        position: finger.Position.replace(reg_annotation, " $1").trim(),
        encoding: "PNG",
        image:
          finger.Image && finger.Image.Base64Data
            ? finger.Image.Base64Data
            : "",
        hashValue: "",
        isTemplate: false,
        patternType: "Radial Loops",
        referencePatternType: "",
        // quality: fingerQuality,
        minutiaCount: 17,
        annotation:
          annotationReason === "NotAnnotated"
            ? ""
            : annotationReason.replace(reg_annotation, " $1").trim(),
        annotationNote: finger.Annotation.Info,
        createdBy: "Operator 1",
        modifiedBy: "Operator 1"
      });

      quality.push({
        type: "Palm",
        impression: "Flat",
        position: finger.Position.replace(reg_annotation, " $1").trim(),
        encoding: "PNG",
        image: "",
        hashValue: "",
        isTemplate: false,
        patternType: "Radial Loops",
        referencePatternType: "",
        // quality: fingerQuality,
        minutiaCount: 0,
        annotation: "",
        annotationNote: "",
        createdBy: "Operator 1",
        modifiedBy: "Operator 1"
      });
    });
  }

  // save mugshot data
  if (setting.captureDevice && setting.captureDevice === "webcam") {
    if (webcam) {
      // console.log("adding mugshot for saving mugshot", mugshot);
      output.biometrics.push({
        type: "Mugshot",
        impression: "Face Photo",
        position: "Front Face",
        encoding: "PNG",
        hashValue: "",
        image: webcam,
        isTemplate: false,
        patternType: "Radial Loops",
        referencePatternType: "",
        quality: 1,
        minutiaCount: 17,
        annotation: "",
        annotationNote: "",
        createdBy: "Operator 1"
      });
    }
  } else {
    if (mugshot.ImageData) {
      // console.log("adding mugshot for saving mugshot", mugshot);
      output.biometrics.push({
        type: "Mugshot",
        impression: "Face Photo",
        position: "Front Face",
        encoding: "PNG",
        hashValue: "",
        image: mugshot.ImageData,
        isTemplate: false,
        patternType: "Radial Loops",
        referencePatternType: "",
        quality: 1,
        minutiaCount: 17,
        annotation: "",
        annotationNote: "",
        createdBy: "Operator 1"
      });
    }
  }

  return {
    output,
    quality
  };
}

// this will generate a zip file containing all the data and send that to server for processing.
export function* callRequestSaveLivescanFingerprintsResumable(action) {

  try {
    // start the spinner
    yield put(startSpinner());

    // gather all the data.
    const liveScan = yield select(liveScanSelector);
    const live = liveScan.data;
    const palm = yield select(palmScanSelector);
    const mugshot = yield select(canonDataSelector);
    const jobNum = yield select(selectedJobSelector);
    const webcam = yield select(webcamImageSelector);

    // combine all these data
    const generatedData = gatherAllData(live, palm, mugshot, webcam, jobNum);

    const quality = generatedData.quality;
    const output = generatedData.output;

    // fs.writeFileSync( 'JSON_DUMP.json', JSON.stringify(output) );

    // check the fingerprints quality.
    const verifyRes = yield call(Api, {
      url: url.job.verifybiometricsquality,
      method: "POST",
      isJwtRequired: true,
      data: quality
    });

    if (verifyRes) {
      if (verifyRes.error) {
        // console.log("Quality check failed!!!");
        yield put(
          requestShowNotification({
            message: translate("qualityCheckFail"),
            type: "is-danger"
          })
        );

        return;
      }

      // quality check was successful.

      const wsqConverted = liveScanHelper.convertBase64ToWSQ(output);
      const convertedData = yield wsqConverted;

      // convert data into BSON Buffer
      const bson = liveScanHelper.convertToBSON(convertedData);

      // generate a filename
      const fileName = liveScanHelper.generateFileName(output.jobID);

      const fullFilePath = liveScanHelper.getPath(fileName);

      const gzip = liveScanHelper.generateGzipFile(
        fullFilePath,
        bson,
        callback
      );
      yield put(
        liveScanWorkflow({ type: "UPDATE_LOADING", data: { visible: true } })
      );
      function callback(checksum, error) {
        // const checksum = gzip;
        if (error) {
          showError("Checksum generation failed, Please try again.");
          return;
        }

        store.dispatch(
          liveScanWorkflow({
            type: "UPDATE_LOADING",
            data: {
              filePath: fullFilePath,
              fileName: fileName,
              checksum: checksum
            }
          })
        );
        liveScanHelper.uploadFile(fullFilePath, fileName, checksum);
      }

      function* showError(error) {
        yield put(
          requestShowNotification({
            message: error || translate("errorOccured"),
            type: "is-danger"
          })
        );
      }

    }
  } catch (e) {
    console.log("catch, error occoured", e);
  } finally {
    yield put(stopSpinner());
  }
}

// this will be called after file upload is successful., either on first try or on retries.
export function* callRequestSaveLivescanFingerprintsResumableSuccess(action) {
  // console.log("callRequestSaveLivescanFingerprintsResumableSuccess", action);

  yield put(
    requestShowNotification({
      message: translate("Fingeprints updated successfully"),
      type: "is-success"
    })
  );

  yield put(requestClearLivescanData());
  yield put(requestShowModal({ modalType: NEW_ACTION }));
  yield put(requestActiveJobs());

  yield put(
    requestTableRowClicked(
      yield select(selectedJobSelector),
      "jobQueue",
      "Ready",
      "Tenprint"
    )
  );
  yield put(push("/authenticated/jobqueue"));
}
