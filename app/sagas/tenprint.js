//

import { call, put, takeLatest, select, takeEvery } from "redux-saga/effects";
import { push } from "react-router-redux";
import * as localStorage from "../utils/localStorage";
import { delay } from "redux-saga";
import { requestShowNotification } from "../actions/notifications";
import Api, { url } from "../api/";
import { startSpinner, stopSpinner } from "../../app/actions/spinner";
import { requestShowModal } from "../actions/modal";
import { requestTogglePaneVisibility } from "../actions/tenprint";


import {
  setPersonData,
  setCustomSearchDatabase,
  requestSetCustomSearchID,
  setCustomSearchResponse,
} from "../actions/customSearch";
import {
  REQUEST_TENPRINT_VERIFY,
  REQUEST_SET_TENPRINT_VERIFY,
  REQUEST_SET_TENPRINT_VERIFY_HAND,
  REQUEST_SET_TENPRINT_VERIFY_STORE,
  REQUEST_SET_TENPRINT_VERIFY_MATCH,
  REQUEST_MATCHED_PERSON_CHANGED,
  REQUEST_MODAL_DATA,
  REQUEST_SHOW_ADJUDICATOR,
  REQUEST_UNMATCH
} from "../actions/actionTypes";

import {
  requestTenprintVerify,
  requestSetTenprintVerify,
  requestSetTenprintVerifyHand,
  requestSetTenprintVerifyStoreHand,
  requestSetTenprintVerifyStoreData,
  requestRemoveTenprintVerifyMatch,
  recivedMatchedPersonChanged,
  recivedModalData,
  requestStoreNote,
  requestShowAdjudicatorSuccess,
  requestSetTenprintVerifyRaw
} from "../actions/tenprint";
import { resetActionType } from "../actions/jobs";

import {
  selectedJobStatusSelector,
  selectedActionSelector,
  jobsTypeSelector,
  ActionSelector,
  selectedJobSelector
} from "../selectors/jobs";
import {
  MatchedPersonInfoSelector,
  SelectedRowSelector
} from "../selectors/tenprint";
import { translate, translateRes } from "../utils/intl";
import { setTimeout } from "timers";

export function* watchrequestUnMatch() {
  yield takeLatest(REQUEST_UNMATCH, callrequestUnMatch);
}
export function* watchRequestTenprintVerify() {
  yield takeLatest(REQUEST_TENPRINT_VERIFY, callrequestTenprintVerify);
}

export function* watchRequestTenprintVerifyHand() {
  yield takeLatest(
    REQUEST_SET_TENPRINT_VERIFY_HAND,
    callrequestTenprintVerifyHand
  );
}

export function* watchRequestTenprintVerifyMatchData() {
  yield takeLatest(
    REQUEST_SET_TENPRINT_VERIFY_MATCH,
    callrequestTenprintVerifyMatchData
  );
}

export function* watchRequestMatchedPersonChanged() {
  yield takeLatest(
    REQUEST_MATCHED_PERSON_CHANGED,
    callRequestMatchedPersonChanged
  );
}

export function* watchRequestModalData() {
  yield takeLatest(REQUEST_MODAL_DATA, callRequestModalData);
}

export function* watchRequestShowAdjudicator() {
  yield takeLatest(REQUEST_SHOW_ADJUDICATOR, callRequestShowAdjudicator);
}

export function* callrequestTenprintVerifyHand(action) {
  try {
    const { payload: verifyhand } = action;
    yield put(requestSetTenprintVerifyStoreHand(verifyhand));
    yield put(requestRemoveTenprintVerifyMatch());
  } catch (e) {
    console.log(e);
  }
}

export function* callrequestTenprintVerifyMatchData(action) {
  try {
    const { payload: matchdata } = action;
    yield put(requestSetTenprintVerifyStoreData(matchdata));
  } catch (e) {
    console.log(e);
  }
}

export function* callrequestTenprintVerify(action) {
  yield put(startSpinner());

  if (
    action.payload.status === "New" ||
    action.payload.status === "In Progress"
  ) {
    yield put(
      requestShowNotification({
        message: action.payload.formatMessage({ id: "preocessingData" }),
        type: "is-warning"
      })
    );
    yield put(stopSpinner());
    return;
  }
  if (action.payload.status === "Failed") {
    yield put(requestStoreNote(action.payload.note));
    yield put(requestShowModal({ modalType: "NOTE_SHOW_MODAL" }));

    yield put(stopSpinner());
    yield put(stopSpinner());
    return;
  }
  let jobType = yield select(jobsTypeSelector);
  if (jobType !== "Custom") {
    let TenprintData = {};
    let JobStatus = yield select(selectedJobStatusSelector);
    let ActionTpe = yield select(ActionSelector);

    if (
      ActionTpe !== "Search Criminal" &&
      ActionTpe !== "Search Latent" &&
      ActionTpe !== "Search Civil"
    ) {
      const { payload: historydata } = action;

      const res = yield call(Api, {
        url: url.action.actionResult,
        method: "POST",
        isJwtRequired: true,
        data: historydata.JOBID
      });
      if (res) {
        if (res.note !== undefined && res.note !== "" && res.note !== null) {
          yield put(requestStoreNote(res.note));
          yield put(stopSpinner());
          yield put(requestShowModal({ modalType: "NOTE_SHOW_MODAL" }));
        } else {
          yield put(stopSpinner());
        }
      }
    } else {
      let JobType = yield select(jobsTypeSelector);
   
      if (JobStatus !== "New" && JobStatus !== undefined) {
        const { payload: historydata } = action;

        let LeftFingerInfo = {
          fingers: []
        };
        let RightFingerInfo = {
          fingers: []
        };
        let Leftmatches = {
          fingers: []
        };
        let Rightmatches = {
          fingers: []
        };
        let Personinfos = {};
        let matchedData = {};
        let matchedPosition = "";

        try {
          const res = yield call(Api, {
            url: url.action.actionResult,
            method: "POST",
            isJwtRequired: true,
            data: historydata.JOBID
          });
          let impressionType;

          if (res.probe && res.probe.biometrics.length > 14) {
            impressionType = "Roll";
          } else {
            impressionType = "Flat";
          }

          res.probe &&
            res.probe.biometrics.forEach((PresentObject, index) => {
              if (
                res.fingerprintMatches &&
                res.fingerprintMatches.length !== 0
              ) {
               
                if (
                  res.fingerprintMatches[index] &&
                  res.fingerprintMatches[index].matchInfos[0] !== "" &&
                  res.fingerprintMatches[index].matchInfos[0] !== undefined
                ) {
                  matchedPosition =
                    res.fingerprintMatches[index].matchInfos[0]
                      .fingerprintPosition;
                  matchedData = res.fingerprintMatches[index].matchInfos;

                  matchFingerStore(matchedPosition, matchedData);
                }
              }
              let temp_data = PresentObject.position;
              temp_data = temp_data.replace(/\s/g, "");
              switch (temp_data) {
                case "LeftThumb":
                  // LeftFingerInfo.Thumb.push(PresentObject)
                  if (PresentObject.impression === impressionType) {
                    LeftFingerInfo.fingers.push(PresentObject);
                  }

                  break;
                case "LeftIndex":
                  // LeftFingerInfo.Index.push(PresentObject)
                  if (PresentObject.impression === impressionType) {
                    LeftFingerInfo.fingers.push(PresentObject);
                  }

                  // Leftmatches.fingers.push(PresentObject.matchInfos);
                  break;

                case "LeftMiddle":
                  // LeftFingerInfo.Middle.push(PresentObject)
                  if (PresentObject.impression === impressionType) {
                    LeftFingerInfo.fingers.push(PresentObject);
                  }

                  // Leftmatches.fingers.push(PresentObject.matchInfos);
                  break;

                case "LeftRing":
                  // LeftFingerInfo.Ring.push(PresentObject)
                  if (PresentObject.impression === impressionType) {
                    LeftFingerInfo.fingers.push(PresentObject);
                  }

                  // Leftmatches.fingers.push(PresentObject.matchInfos);
                  break;

                case "LeftLittle":
                  // LeftFingerInfo.Small.push(PresentObject)
                  if (PresentObject.impression === impressionType) {
                    LeftFingerInfo.fingers.push(PresentObject);
                  }

                  // Leftmatches.fingers.push(PresentObject.matchInfos);
                  break;

                case "RightThumb":
                  // RightFingerInfo.Thumb.push(PresentObject)
                  if (PresentObject.impression === impressionType) {
                    RightFingerInfo.fingers.push(PresentObject);
                  }

                  // Rightmatches.fingers.push(PresentObject.matchInfos);
                  break;

                case "RightIndex":
                  // RightFingerInfo.Index.push(PresentObject)
                  if (PresentObject.impression === impressionType) {
                    RightFingerInfo.fingers.push(PresentObject);
                  }

                  // Rightmatches.fingers.push(PresentObject.matchInfos);
                  break;

                case "RightMiddle":
                  // RightFingerInfo.Middle.push(PresentObject)
                  if (PresentObject.impression === impressionType) {
                    RightFingerInfo.fingers.push(PresentObject);
                  }

                  // Rightmatches.fingers.push(PresentObject.matchInfos);
                  break;

                case "RightRing":
                  // RightFingerInfo.Ring.push(PresentObject)
                  if (PresentObject.impression === impressionType) {
                    RightFingerInfo.fingers.push(PresentObject);
                  }

                  // Rightmatches.fingers.push(PresentObject.matchInfos);
                  break;

                case "RightLittle":
                  // RightFingerInfo.Small.push(PresentObject)
                  if (PresentObject.impression === impressionType) {
                    RightFingerInfo.fingers.push(PresentObject);
                  }

                  // Rightmatches.fingers.push(PresentObject.matchInfos);
                  break;
                case "UnknownFinger":
                  LeftFingerInfo.fingers.push(PresentObject);

                  break;
              }

              let latentProbeData = [];

              if (
                res.probe.biometrics.length === 1 &&
                LeftFingerInfo.fingers.length === 0 &&
                RightFingerInfo.fingers.length === 0
              ) {
                LeftFingerInfo.fingers.push(res.probe.biometrics[0]);
              }

              if (
                res.probe.biometrics.length === 1 &&
                LeftFingerInfo.fingers.length === 0
              ) {
                latentProbeData = res.probe.biometrics;
              }

              TenprintData = {
                leftfingers: LeftFingerInfo,
                rightfingers: RightFingerInfo,
                leftmatches: Leftmatches,
                rightmatches: Rightmatches,
                personinfos: res.matchPersons,
                ProbeMugshotInfo: res.probe.mugshot,
                ProbePersonInfo: res.probe.personInfo,
                database: res.database,
                latentProbeData: latentProbeData,
                matched:
                  (res.fingerprintMatches[index] &&
                    res.fingerprintMatches[index].matchInfos[0]) ||
                  ""
              };
              
              // yield put(requestSetTenprintVerify(TenprintData))
            });

          function matchFingerStore(temp_data, object) {
           
            switch (temp_data) {
              case "LeftThumb":
                Leftmatches.fingers.push(object);
                break;
              case "Left Thumb":
                Leftmatches.fingers.push(object);
                break;
              case "LeftIndex":
                Leftmatches.fingers.push(object);
                break;
              case "Left Index":
                Leftmatches.fingers.push(object);
                break;
              case "LeftMiddle":
                Leftmatches.fingers.push(object);
                break;
              case "Left Middle":
                Leftmatches.fingers.push(object);
                break;
              case "LeftRing":
                Leftmatches.fingers.push(object);
                break;
              case "Left Ring":
                Leftmatches.fingers.push(object);
                break;
              case "LeftLittle":
                Leftmatches.fingers.push(object);
                break;
              case "Left Little":
                Leftmatches.fingers.push(object);
                break;
              case "RightThumb":
                Rightmatches.fingers.push(object);
                break;
              case "Right Thumb":
                Rightmatches.fingers.push(object);
                break;
              case "RightIndex":
                Rightmatches.fingers.push(object);
                break;
              case "Right Index":
                Rightmatches.fingers.push(object);
                break;
              case "RightMiddle":
                Rightmatches.fingers.push(object);
                break;
              case "Right Middle":
                Rightmatches.fingers.push(object);
                break;
              case "RightRing":
                Rightmatches.fingers.push(object);
                break;
              case "Right Ring":
                Rightmatches.fingers.push(object);
                break;
              case "RightLittle":
                Rightmatches.fingers.push(object);
                break;
              case "Right Little":
                Rightmatches.fingers.push(object);
                break;
              case "Left Four Fingers":
                Leftmatches.fingers.push(object);
                break;
              case "Right Four Fingers":
                Leftmatches.fingers.push(object);
                break;
              case "Both Thumbs":
                Leftmatches.fingers.push(object);
                break;
              case "UnknownFinger":
                Leftmatches.fingers.push(object);
                Rightmatches.fingers.push(object);
                break;
              case "Unknown Finger":
                Leftmatches.fingers.push(object);
                Rightmatches.fingers.push(object);
                break;
            }
          }

          
          if (
            res.probe &&
            res.probe.biometrics &&
            res.probe.biometrics.length !== 0
          ) {
            yield put(stopSpinner());
            
            yield put(requestSetTenprintVerify(TenprintData));
         
            yield put(requestSetTenprintVerifyRaw(res));
            yield put(stopSpinner());
           
            if (JobType === "Tenprint") {
              yield put(push("/authenticated/tenprint/tenprintverify"));
            } else if (JobType === "Latent") {
              yield put(push("/authenticated/latent/latentverify"));
            }
          } else {
            yield put(stopSpinner());
            yield put(
              requestShowNotification({
                message: "FingerPrint matches not recived",
                type: "is-warning"
              })
            );
          }
        } catch (e) {
          console.log(e);
          yield put(stopSpinner());
        }
      } else {
        yield put(stopSpinner());
        yield put(
          requestShowNotification({
            message: "Biometrics not Scanned for the Job",
            type: "is-warning"
          })
        );
        // console.log("Please Add Fingerpints to goto tenprint Verify");
      }
    }
  } else {
    let ActionTpe = yield select(ActionSelector);

    if (
      ActionTpe !== "Custom Search Criminal" &&
      ActionTpe !== "Custom Search Civil" &&
      ActionTpe !== "Custom Search Latent"
    ) {
      const { payload: historydata } = action;

      const res = yield call(Api, {
        url: url.action.actionResult,
        method: "POST",
        isJwtRequired: true,
        data: historydata.JOBID
      });
      if (res) {
        if (res.note !== undefined && res.note !== ""&& res.note !== null) {
          yield put(requestStoreNote(res.note));
          yield put(stopSpinner());
          yield put(requestShowModal({ modalType: "NOTE_SHOW_MODAL" }));
        } else {
          yield put(stopSpinner());
        }
      }
    } else {
      yield put(stopSpinner());
      let Personinfos = {};
      const { payload: historydata } = action;
      const res = yield call(Api, {
        url: url.action.actionResult,
        method: "POST",
        isJwtRequired: true,
        data: historydata.JOBID
      });
      if (res) {
        let TenprintData = {
          leftfingers: {},
          rightfingers: {},
          leftmatches: {},
          rightmatches: {},
          personinfos: res.matchPersons,
          ProbeMugshotInfo: {},
          ProbePersonInfo: {},
          database: res.database,
        };
        yield put(requestSetTenprintVerify(TenprintData));
        yield put(setPersonData(res.matchPersons[0]));
        yield put(setCustomSearchDatabase(res.database));
        yield put(setCustomSearchResponse(res));
        const jobid = yield select(selectedJobSelector);
        const searchTextRes = yield call(Api, {
          url: url.job.getSearchTexts,
          method: "POST",
          isJwtRequired: true,
          data: jobid
        });
        if (searchTextRes) {
          yield put(requestSetCustomSearchID(searchTextRes));
        }
      }

      yield put(push("/authenticated/customsearch/searchverify"));
    }
  }
}

export function* callrequestUnMatch(){
  return true;
}

export function* callRequestMatchedPersonChanged(action) {
  const { payload: MatchedData } = action;
  let Decision = "";

  let MatchedPersonInfo = yield select(MatchedPersonInfoSelector);

  if (MatchedPersonInfo.id !== "" && MatchedPersonInfo.id !== undefined) {
    // let Send_data = {
    //   matchedPersonId: MatchedPersonInfo.id,
    //   decision: "No Matched"
    // };
    // const res = yield call(Api, {
    //   url: url.action.setMatchedPersonDecision,
    //   method: "PUT",
    //   isJwtRequired: true,
    //   data: Send_data
    // });
  }

  if (MatchedData.Selected) {
    Decision = "Matched";
  } else {
    Decision = "No Matched";
  }
  let Send_data = {
    matchedPersonId: MatchedData.userID,
    decision: Decision
  };

  // const res = yield call(Api, {
  //   url: url.action.setMatchedPersonDecision,
  //   method: "PUT",
  //   isJwtRequired: true,
  //   data: Send_data
  // });


  yield put(recivedMatchedPersonChanged(MatchedData));

  // if (res.message) {
  //   let output = {...MatchedData};
  //   if ( output.PersonInfo ) {
  //     // output.PersonInfo.decision = output.PersonInfo.decision === "No Matched" ? "Matched" : "No Matched";
  //     output.PersonInfo.decision = Decision;
  //   }
  //   yield put(recivedMatchedPersonChanged(output));
  // }

}
export function* callRequestModalData(action) {
  const ActionID = yield select(selectedActionSelector);

  let Send_data = {
    actionId: ActionID
  };
  const res = yield call(Api, {
    url: url.action.getMatchSubsequenceActions,
    method: "POST",
    isJwtRequired: true,
    data: Send_data
  });
  if (res) {
    yield put(recivedModalData(res));
    // ActionSelector
    yield put(resetActionType());
    yield put(requestShowModal({ modalType: "TENPRINT_VERIFY_CONFIRM" }));
    if (yield select(ActionSelector) === "") {
    } else {
      // yield put(push("/authenticated/jobqueue"))
    }
  }
}
export function* callRequestShowAdjudicator(action) {
  const { payload: OpenAdjudicator } = action;

  let selectedRow = yield select(SelectedRowSelector);
  let Send_data = {
    probeBiometricsId: OpenAdjudicator.imageId
  };

  if (
    OpenAdjudicator.match &&
    !Array.isArray(OpenAdjudicator.match) &&
    OpenAdjudicator.match.matchedFingerprintID
  ) {
    Send_data.matchedBiometricsId = OpenAdjudicator.match.matchedFingerprintID;
  } else if (
    Array.isArray(OpenAdjudicator.match) &&
    OpenAdjudicator.match.length > 0
  ) {
    Send_data.matchedBiometricsId =
      OpenAdjudicator.match[0].matchedFingerprintID;
  }

  const res = yield call(Api, {
    url: url.action.getMatchedBiometricsImage,
    method: "POST",
    isJwtRequired: true,
    data: Send_data
  });

  if (res) {

    if ( res.matched ) {
      let finalData = {
        Result: res,
        status: OpenAdjudicator.status,
        Data: OpenAdjudicator
      };
      yield put(requestShowAdjudicatorSuccess(finalData));
    } else {
      yield put(
        requestShowNotification({
          message:translate("noMatchReturned") ,
          type: "is-warning"
        })
      );
      yield put( requestTogglePaneVisibility({ pane: "all", visible: true }) );
    }
  }
}
