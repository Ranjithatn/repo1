import { call, put, takeLatest, select, all } from "redux-saga/effects";
import { push } from "react-router-redux";
import { settings as _settings } from "../utils/electron";
import {
  selectedJobSelector,
  jobsPagingSelector,
  jobsPageSizeSelector,
  jobsListSelector,
  jobsTotalPagesSelector,
  jobsCurrentPageSelector,
  jobsMaxPagesSelector,
  jobsPagesSelector,
  jobsFilterTitleSelector,
  FilterTitleSelector,
  totalJobsSelector,
  cardSegmentedPrintsSelector,
  fullCardScanImageSelector,
  cardScanAnnotationsSelector,
  wildcardSearchTextSelector
} from "../selectors/jobs";
import {
  newCrimeTypeSelector,
  linkDatalSelector
} from "../selectors/updateCriminalModal";
import { usernameSelector } from "../selectors/auth";
import { customSearchDataSelector } from "../selectors/customSearch";
import * as localStorage from "../utils/localStorage";
import { delay } from "redux-saga";
import { cardScanReset } from "../actions/cardScan";
import { tenprintSelector } from "../selectors/tenprint";
import { MatchedPersonInfoSelector } from "../selectors/tenprint";
import {
  REQUEST_ACTIVE_JOBS,
  REQUEST_ACTIVE_JOBS_SUCCESS,
  REQUEST_ACTIVE_JOBS_FAILED,
  REQUEST_CREATE_JOB,
  REQUEST_CREATE_JOB_SUCCESS,
  REQUEST_CREATE_JOB_FAILED,
  REQUEST_ACTION_HISTORY,
  REQUEST_ACTION_HISTORY_SUCCESS,
  REQUEST_ACTION_HISTORY_FAILED,
  REQUEST_TABLE_ROW_CLICKED,
  REQUEST_SPINNER_START,
  REQUEST_SPINNER_STOP,
  REQUEST_REMOVE_JOB,
  REQUEST_REMOVE_JOB_SUCCESS,
  REQUEST_REMOVE_JOB_FAILED,
  REQUEST_NEW_ACTION,
  REQUEST_NEW_ACTION_SUCCESS,
  REQUEST_NEW_ACTION_FAILED,
  REQUEST_REMOVE_FILTER,
  REQUEST_SHOW_FILTERED_DATA,
  REQUEST_ASC_SORT,
  REQUEST_ACTION_SUCCESS,
  REQUEST_OPEN_JOB,
  REQUEST_SHOW_JOB_FILTERED_DATA,
  REQUEST_HISTORY_SORT,
  REQUEST_CLOSE_FILTER,
  REQUEST_CLOSE_FILTER_SUCCESS,
  REQUEST_CLOSE_ACTION_FILTER,
  REQUEST_JOB_AUDIT_LOGS,
  REQUEST_UPDATE_JOB,
  REQUEST_SET_ADD_NEW,
  REQUEST_START_SCAN_TYPE,
  REQUEST_WILDCARD_SEARCH,
  REQUEST_SYSTEM_PERMISSION,
  REQUEST_SHOW_MODAL_WITH_DATA
} from "../actions/actionTypes";
import {
  requestActiveJobs,
  requestActiveJobsSuccess,
  requestActiveJobsFailed,
  requestCreateJobSuccess,
  requestCreateJobFailed,
  requestActionHistory,
  requestActionHistorySuccess,
  requestActionHistoryFailed,
  requestRemoveJob,
  requestRemoveJobSuccess,
  requestRemoveJobFailed,
  requestNewAction,
  requestNewActionSuccess,
  requestNewActionFailed,
  requestAscSort,
  requestRemoveFilter,
  requestActionSuccess,
  requestShowFilteredData,
  requestOpenJob,
  requestShowJobFilteredData,
  requestHistorySort,
  setJobTypeFilter,
  requestCloseFilterSucess,
  requestCloseActionFilterSucess,
  requestFilteredActiveJobsSuccess,
  requestJobAuditLogsSucess,
  requestUpdateBiometricDetails,
  requestUpdateJobFailed,
  requestClearLatentEditorData,
  requestSetNewCrimeTypeSuccess,
  requestClearTransactionHistory,
  requestSystemPermissionsFailed,
  requestSystemPermissions,
  requestSystemPermissionsSuccess,
  requestActionStart
} from "../actions/jobs";
import {
  resetCustomSearchData,
  requestSetCustomSearchID
} from "../actions/customSearch";
import { requestTableRowClicked, requestPageChanged } from "../actions/global";
import { requestShowNotification } from "../actions/notifications";
import Api, { url } from "../api/";
import { startSpinner, stopSpinner } from "../../app/actions/spinner";
import { requestHideModal, requestShowModal } from "../actions/modal";
import { UPDATE_CRIMINAL, NEW_ACTION } from "../components/Modal/ModalRoot";
import { translate, translateRes } from "../utils/intl";
import {requestUnMatch} from "../actions/tenprint";
import _ from 'lodash';


const maxPageLinksToDisplay = 11; // this includes the ellipses

export function* watchRequestStartScanType() {
  yield takeLatest(REQUEST_START_SCAN_TYPE, callRequestStartScanType);
}
export function* watchRequestUpdateTenprintCardJob() {
  yield takeLatest(REQUEST_UPDATE_JOB, callUpdateTenprintCardJob);
}
export function* watchRequestSetNewCrimeType() {
  yield takeLatest(REQUEST_SET_ADD_NEW, callRequestSetNewCrimeType);
}

export function* watchCallShowActionHistoryFilteredData() {
  yield takeLatest(
    REQUEST_SHOW_FILTERED_DATA,
    callRequestShowActionHistoryFilteredData
  );
}
export function* watchCallRequestShowJobFilteredData() {
  yield takeLatest(
    REQUEST_SHOW_JOB_FILTERED_DATA,
    callrequestShowJobFilteredData
  );
}
export function* watchRequestHistorySort() {
  yield takeLatest(REQUEST_HISTORY_SORT, callRequestHistorySort);
}
export function* watchRequestActiveJobs() {
  yield takeLatest(REQUEST_ACTIVE_JOBS, callRequestActiveJobs);
}
export function* watchRequestCloseFilter() {
  yield takeLatest(REQUEST_CLOSE_FILTER, callRequestCloseFilter);
}
export function* watchRequestCloseActionFilter() {
  yield takeLatest(REQUEST_CLOSE_ACTION_FILTER, callRequestCloseActionFilter);
}

export function* watchRequestCreateJob() {
  yield takeLatest(REQUEST_CREATE_JOB, callRequestCreateJob);
}

export function* watchAscSort() {
  yield takeLatest(REQUEST_ASC_SORT, jobsAscSort);
}
export function* watchOpenJobs() {
  yield takeLatest(REQUEST_OPEN_JOB, callopenjobs);
}

export function* watchRequestActionHistory() {
  yield takeLatest(REQUEST_ACTION_HISTORY, callRequestActionHistory);
}

export function* watchRequestRemoveJob() {
  yield takeLatest(REQUEST_REMOVE_JOB, callRequestRemoveJob);
}

export function* watchRequestNewAction() {
  yield takeLatest(REQUEST_NEW_ACTION, callRequestNewAction);
}
export function* watchRequestRemoveFilter() {
  yield takeLatest(REQUEST_REMOVE_FILTER, callRequestRemoveFilter);
}

export function* callRequestSetNewCrimeType(action) {
  try {
    const newCrimeType = yield select(newCrimeTypeSelector);
    yield put(requestSetNewCrimeTypeSuccess(newCrimeType));
  } catch (e) {
    console.log(e, "error");
  }
}

export function* watchRequestShowModal() {
  yield takeLatest(REQUEST_SHOW_MODAL_WITH_DATA, callRequestShowModalFunction);
}



function* callRequestShowModalFunction(action) {
  console.log("callRequestShowModalFunction", action);

  if ( (action.payload && action.payload.modalType === "LINK_LATENT_MODAL") || (action.payload && action.payload.modalType === "DELINK_LATENT_MODAL") || (action.payload && action.payload.modalType === "IGNORE_LATENT_MODAL") ) {

    yield put(startSpinner());

    const state = yield select( (state) => state );

    const ahData = state.jobs.ahData;
    const registerLatentJob = _.find( ahData, { actionType: "Register Latent" }  );

    if ( ! registerLatentJob || ! registerLatentJob.id ) {
      yield put(
        requestShowNotification({
          message: translate("latentIdNotFound"),
          type: "is-danger"
        })
      );
    }


    const res = yield call(Api, {
      url: url.action.actionResult,
      method: "POST",
      isJwtRequired: true,
      data: registerLatentJob.id
    });

    try {
      if ( res.note ) {
        let latentID = res.note && res.note.split('LatentId');
            latentID = latentID[latentID.length-1].trim();
        const lid = latentID.substr(1, latentID.length-3);

        yield put(stopSpinner());

        if ( ! registerLatentJob || ! registerLatentJob.id || ! lid ) {
          yield put(
            requestShowNotification({
              message: translate("latentIdNotFound"),
              type: "is-danger"
            })
          );
        } else {
          yield put(requestShowModal({ modalType: action.payload.modalType, latentId: lid }));
        }

      }

    } catch (e) {
      console.log("error occoured", e);
      yield put(stopSpinner());
    }

  }




}









export function* callRequestHistorySort(action) {
  const { payload: historydata } = action;

  historydata.jobsdata.sort((data1, data2) => {
    if (historydata.sorttype === "desc") {
      if (
        historydata.rowsdata === historydata.formatMessage({ id: "actionType" })
      ) {
        let nameA = data1.actionType.toLowerCase(),
          nameB = data2.actionType.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      } else if (
        historydata.rowsdata ===
        historydata.formatMessage({ id: "actionState" })
      ) {
        let nameA = data1.status.toLowerCase(),
          nameB = data2.status.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      } else if (
        historydata.rowsdata === historydata.formatMessage({ id: "tcn" })
      ) {
        let nameA = data1.tcn.toLowerCase(),
          nameB = data2.tcn.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      } else if (
        historydata.rowsdata === historydata.formatMessage({ id: "dateTime" })
      ) {
        let nameA = data1.createdOn,
          nameB = data2.createdOn;
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      } else if (
        historydata.rowsdata === historydata.formatMessage({ id: "userId" })
      ) {
        let nameA = data1.by.toLowerCase(),
          nameB = data2.by.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      }
    } else if (historydata.sorttype === "asc") {
      if (
        historydata.rowsdata === historydata.formatMessage({ id: "actionType" })
      ) {
        let nameA = data1.actionType.toLowerCase(),
          nameB = data2.actionType.toLowerCase();
        if (nameA < nameB) return 1;
        if (nameA > nameB) return -1;
        return 0; //default return value (no sorting)
      } else if (
        historydata.rowsdata ===
        historydata.formatMessage({ id: "actionState" })
      ) {
        let nameA = data1.status.toLowerCase(),
          nameB = data2.status.toLowerCase();
        if (nameA < nameB) return 1;
        if (nameA > nameB) return -1;
        return 0; //default return value (no sorting)
      } else if (
        historydata.rowsdata === historydata.formatMessage({ id: "tcn" })
      ) {
        let nameA = data1.tcn.toLowerCase(),
          nameB = data2.tcn.toLowerCase();
        if (nameA < nameB) return 1;
        if (nameA > nameB) return -1;
        return 0;
      } else if (
        historydata.rowsdata === historydata.formatMessage({ id: "dateTime" })
      ) {
        let nameA = data1.createdOn,
          nameB = data2.createdOn;
        if (nameA < nameB) return 1;
        if (nameA > nameB) return -1;
        return 0; //default return value (no sorting)
      } else if (
        historydata.rowsdata === historydata.formatMessage({ id: "userId" })
      ) {
        let nameA = data1.by.toLowerCase(),
          nameB = data2.by.toLowerCase();
        if (nameA < nameB) return 1;
        if (nameA > nameB) return -1;
        return 0;
      }
    }
  });

  yield put(startSpinner());
  yield put(requestActionSuccess(historydata.jobsdata));
  yield put(stopSpinner());
}

export function* callrequestShowJobFilteredData(action) {
  try {
    const { payload: data } = action;
    const jobnum = yield select(selectedJobSelector);
    let keydata = yield select(FilterTitleSelector);
    let totaldata = yield select(totalJobsSelector);

    if (keydata === "JOB TYPE") {
      keydata = "type";
    } else if (keydata === "OPERATOR ID") {
      keydata = "createdBy";
    } else if (keydata === "TERMINAL ID") {
      keydata = "terminalID";
    } else if (keydata === "JOB ID") {
      keydata = "id";
    } else if (keydata === "USER ID") {
      keydata = "createdBy";
    } else if (keydata === "LOCATION ID") {
      keydata = "locationID";
    }

    //isFilterByJobType
    let pageNo = 1;
    let pageSize = 10;
    let filterValue = data.value
      ? data.value
      : yield select(wildcardSearchTextSelector);
    if (typeof data.JobTypeFilter !== "undefined") {
      pageNo = data.pageNo;
      pageSize = data.pageSize;
      filterValue = data.JobTypeFilter;
    } else {
      yield put(setJobTypeFilter({ value: filterValue }));
    }

    let pageData = {
      pagingOn: {
        pageNo: pageNo,
        pageSize: pageSize
      },
      filters: [
        {
          key: keydata,
          value: filterValue
        }
      ]
    };

    const res = yield call(Api, {
      url: url.job.serachActivJob,
      method: "POST",
      isJwtRequired: true,
      data: pageData
    });

    if (res) {
      if (
        res.totalCount == null ||
        pageData.pagingOn.pageSize == null ||
        res.currentPage == null
      ) {
        res.totalPages = "1";
        res.pages = ["1"];
        res.maxPages = "10";
        res.currentPage = "1";
      } else {
        res.totalPages = getTotalPagesCount(
          res.totalCount,
          pageData.pagingOn.pageSize
        );
        res.pages = makePages(
          res.totalPages,
          res.currentPage,
          pageData.pageSize
        );
        res.maxPages = maxPageLinksToDisplay;
      }

      yield put(requestFilteredActiveJobsSuccess(res));
      yield put(requestClearTransactionHistory());
    }
  } catch (e) {
    console.log(e);
  }
}

export function* callRequestShowActionHistoryFilteredData(action) {
  try {
    const { payload: data } = action;

    const jobnum = yield select(selectedJobSelector);
    let keydata = yield select(jobsFilterTitleSelector);
    if (keydata === "ACTION STATE") {
      keydata = "status";
    } else if (keydata === "USER ID") {
      keydata = "CreatedBy";
    } else if (keydata === "ACTION TYPE") {
      keydata = "actionType";
    }

    let pageData = {
      pagingOn: {
        pageNo: 1,
        pageSize: 10
      },
      filters: [
        {
          key: "jobID",
          value: jobnum
        },
        {
          key: keydata,
          value: data.value
        }
      ]
    };

    const res = yield call(Api, {
      url: url.job.searchJobHistory,
      method: "POST",
      isJwtRequired: true,
      data: pageData
    });

    yield put(requestActionSuccess(res.results));
  } catch (e) {
    console.log(e);
  }
}
export function* callRequestStartScanType(action) {
  try {
    const { payload: data } = action;

    const jobnum = yield select(selectedJobSelector);

    const setting = _settings();
    const terminalID = setting.workstationName;

    const jobRes = yield call(Api, {
      url: url.job.getJobById + jobnum,
      method: "GET",
      isJwtRequired: true
    });
    if (jobRes) {
      jobRes.sourceType = data;
      const res = yield call(Api, {
        url: url.job.updateJob,
        method: "POST",
        isJwtRequired: true,
        data: jobRes
      });

      if (data === "Cardscan") {
        yield put(push("/authenticated/tenprint/card"));
      } else if (data === "Livescan") {
        yield put(push("/authenticated/tenprint/livescan"));
      } else {
        return;
      }
    }

    // yield put(requestActionSuccess(res.results));
  } catch (e) {
    console.log(e);
  }
}
export function* callUpdateTenprintCardJob(action) {
  yield put(startSpinner());
  yield call(delay, 0);
  try {
    // const jobId = action.payload;
    const jobId = yield select(selectedJobSelector);
    const username = yield select(usernameSelector);
    const segmentedPrints = yield select(cardSegmentedPrintsSelector);
    const annotations = yield select(cardScanAnnotationsSelector);
    const b64CardImage = yield select(fullCardScanImageSelector);
    const payload = yield call(
      makeCardJobPayload,
      jobId,
      segmentedPrints,
      b64CardImage,
      username,
      annotations
    );
    const res = yield call(Api, {
      url: url.job.updateFingerprintData,
      method: "POST",
      isJwtRequired: true,
      data: payload
    });
    if (res) {
      let resMessage;
      if (res.message) {
        resMessage = res.message;
      } else {
        resMessage = res.result;
      }

      if (res.error) {
        yield put(
          requestShowNotification({
            message: res.error.key,
            type: "is-danger"
          })
        );
      }
      if (resMessage) {
        yield put(requestClearLatentEditorData());
        yield put(
          requestShowNotification({
            message: translateRes(resMessage),
            type: "is-success"
          })
        );
        yield put(
          requestTableRowClicked(
            yield select(selectedJobSelector),
            "jobQueue",
            "Ready",
            "Tenprint"
          )
        );
        yield put(
          requestShowModal({
            modalType: NEW_ACTION
          })
        );
        yield put(push("/Authenticated/jobqueue"));
        yield put(requestActiveJobs());

        yield put(cardScanReset());
      }
    }
  } catch (e) {
    yield put(requestUpdateJobFailed());
  } finally {
    yield put(stopSpinner());
  }
}

export function* callRequestActiveJobs(action) {
  yield put(startSpinner());
  try {
    let pageData;
    const selectedJob = yield select(selectedJobSelector);
    const { currentPage, pageSize } = yield select(jobsPagingSelector);
    if (!action || !action.payload) {
      pageData = { pageNo: currentPage, pageSize };
    } else {
      pageData = action.payload;
    }
    const res = yield call(Api, {
      url: url.job.getActive,
      method: "POST",
      isJwtRequired: true,
      data: pageData
    });
    if (res) {
      res.totalPages = getTotalPagesCount(res.totalCount, pageData.pageSize); //Math.ceil(res.totalCount / pageSize);
      res.pages = makePages(res.totalPages, res.currentPage, pageData.pageSize);
      res.maxPages = maxPageLinksToDisplay;
      yield put(requestActiveJobsSuccess(res));

      if (selectedJob) {
        yield put(requestActionHistory(selectedJob));
      }
    }
  } catch (e) {
    yield put(requestActiveJobsFailed());
  } finally {
    yield put(stopSpinner());
  }
}

export function* callopenjobs(action) {
  try {
    yield put(startSpinner());
    const { payload: JobDetails } = action;

    if (JobDetails.jobStatus === "New" && JobDetails.jobType === "Tenprint") {
      yield put(stopSpinner());
      yield put(push("/authenticated/tenprint"));
    } else if (
      JobDetails.jobStatus === "New" &&
      JobDetails.jobType === "Latent"
    ) {
      yield put(stopSpinner());
      yield put(push("/authenticated/latent"));
    } else if (
      JobDetails.jobStatus !== "New" &&
      JobDetails.jobType !== "Custom"
    ) {
      const res = yield call(Api, {
        url: url.job.getBiometrics,
        method: "POST",
        isJwtRequired: true,
        data: {
          jobId: JobDetails.jobID,
          fullImage: false,
          thumbNail: true,
          includeTemplate: false,
          biometricsList: null
        }
      });
      if (res) {
        yield put(stopSpinner());

        let FlatFingers = {
          Fingers: {
            LThumb: [],
            LIndex: [],
            LMiddle: [],
            LRing: [],
            LLittle: [],
            RThumb: [],
            RIndex: [],
            RMiddle: [],
            RRing: [],
            RLittle: [],
            Unknown: []
          }
        };
        let RolledFingers = {
          Fingers: {
            LThumb: [],
            LIndex: [],
            LMiddle: [],
            LRing: [],
            LLittle: [],
            RThumb: [],
            RIndex: [],
            RMiddle: [],
            RRing: [],
            RLittle: []
          }
        };
        let FlatFour = { Fingers: { LFour: [], Both: [], RFour: [] } };
        let RollFour = {
            Fingers: { LFour: [], LThumb: [], RThumb: [], RFour: [] }
          },
          Palm = [],
          MugShot = [];

        res.biometrics &&
          res.biometrics.forEach((PresentObject, index) => {
            let temp_data = PresentObject.position;
            temp_data = temp_data.replace(/\s/g, "");
            if (temp_data.toLowerCase().includes("palm")) {
              Palm.push(PresentObject);
            }
            switch (temp_data) {
              case "LeftThumb":
                if (PresentObject.impression === "Flat") {
                  FlatFingers.Fingers.LThumb.push(PresentObject);
                  RollFour.Fingers.LThumb.push(PresentObject);
                } else {
                  RolledFingers.Fingers.LThumb.push(PresentObject);
                }
                break;
              case "LeftIndex":
                if (PresentObject.impression === "Flat") {
                  FlatFingers.Fingers.LIndex.push(PresentObject);
                } else {
                  RolledFingers.Fingers.LIndex.push(PresentObject);
                }
                break;
              case "LeftMiddle":
                if (PresentObject.impression === "Flat") {
                  FlatFingers.Fingers.LMiddle.push(PresentObject);
                } else {
                  RolledFingers.Fingers.LMiddle.push(PresentObject);
                }
                break;
              case "LeftRing":
                if (PresentObject.impression === "Flat") {
                  FlatFingers.Fingers.LRing.push(PresentObject);
                } else {
                  RolledFingers.Fingers.LRing.push(PresentObject);
                }
                break;
              case "LeftLittle":
                if (PresentObject.impression === "Flat") {
                  FlatFingers.Fingers.LLittle.push(PresentObject);
                } else {
                  RolledFingers.Fingers.LLittle.push(PresentObject);
                }
                break;
              case "RightThumb":
                if (PresentObject.impression === "Flat") {
                  FlatFingers.Fingers.RThumb.push(PresentObject);
                  RollFour.Fingers.RThumb.push(PresentObject);
                } else {
                  RolledFingers.Fingers.RThumb.push(PresentObject);
                }
                break;
              case "RightIndex":
                if (PresentObject.impression === "Flat") {
                  FlatFingers.Fingers.RIndex.push(PresentObject);
                } else {
                  RolledFingers.Fingers.RIndex.push(PresentObject);
                }
                break;
              case "RightMiddle":
                if (PresentObject.impression === "Flat") {
                  FlatFingers.Fingers.RMiddle.push(PresentObject);
                } else {
                  RolledFingers.Fingers.RMiddle.push(PresentObject);
                }
                break;
              case "RightRing":
                if (PresentObject.impression === "Flat") {
                  FlatFingers.Fingers.RRing.push(PresentObject);
                } else {
                  RolledFingers.Fingers.RRing.push(PresentObject);
                }
                break;
              case "RightLittle":
                if (PresentObject.impression === "Flat") {
                  FlatFingers.Fingers.RLittle.push(PresentObject);
                } else {
                  RolledFingers.Fingers.RLittle.push(PresentObject);
                }
                break;
              case "UnknownFinger":
                FlatFingers.Fingers.Unknown.push(PresentObject);
                break;
              case "LeftFourFingers":
                FlatFour.Fingers.LFour.push(PresentObject);
                RollFour.Fingers.LFour.push(PresentObject);

                break;
              case "RightFourFingers":
                FlatFour.Fingers.RFour.push(PresentObject);
                RollFour.Fingers.RFour.push(PresentObject);
                break;
              case "BothThumbs":
                FlatFour.Fingers.Both.push(PresentObject);
                break;
              case "FrontFace":
                MugShot.push(PresentObject);
                break;
            }
          });



        let isRolled = false;

        const rolledBiometrics = res.biometrics.filter(
          item => item.impression === "Roll"
        );

        if (rolledBiometrics.length > 0) {
          isRolled = true;
        }



        yield put(
          requestUpdateBiometricDetails({
            FingerImages: isRolled ? RolledFingers : FlatFingers,
            MugShotImage: MugShot,
            PalmImages: Palm,
            FourFingersImages: isRolled ? RollFour : FlatFour,
            data: res
          })
        );

        // yield put(requestUpdateBiometricDetails(res));
      }
      yield put(stopSpinner());
      yield put(push("/authenticated/ScannedBiometrics/Scanned"));
    } else if (
      JobDetails.jobStatus === "New" &&
      JobDetails.jobType === "Custom"
    ) {
      yield put(stopSpinner());
      yield put(resetCustomSearchData());
      yield put(push("/authenticated/customsearch/search"));
    } else if (
      JobDetails.jobStatus !== "New" &&
      JobDetails.jobType === "Custom"
    ) {
      let IdList = [];
      yield put(stopSpinner());
      const res = yield call(Api, {
        url: url.job.getSearchTexts,
        method: "POST",
        isJwtRequired: true,
        data: JobDetails.jobID
      });
      if (res) {
        if (res.props) {
          yield put(stopSpinner());
        } else {
          yield put(requestSetCustomSearchID(res));
          yield put(push("/authenticated/customsearch/ShowCustomSearchId"));
        }
      }
    } else {
      yield put(stopSpinner());
    }
  } catch (e) {
    yield put(stopSpinner());
    console.log(e);
  }
}

export function* jobsAscSort(action) {
  try {
    const { payload: reciveddata } = action;
    const totalpages = yield select(jobsTotalPagesSelector);
    const page = yield select(jobsPagesSelector);
    const maxpages = yield select(jobsMaxPagesSelector);
    const currentpage = yield select(jobsCurrentPageSelector);
    const pageSize = yield select(jobsPageSizeSelector);
    reciveddata.jobsdata.sort((data1, data2) => {
      if (reciveddata.sorttype === "desc") {
        if (
          reciveddata.rowsdata === reciveddata.formatMessage({ id: "jobId" })
        ) {
          return data2.id - data1.id;
        } else if (
          reciveddata.rowsdata === reciveddata.formatMessage({ id: "jobType" })
        ) {
          let nameA = data1.type.toLowerCase(),
            nameB = data2.type.toLowerCase();
          if (nameA < nameB) return 1;
          if (nameA > nameB) return -1;
          return 0;
        } else if (
          reciveddata.rowsdata === reciveddata.formatMessage({ id: "status" })
        ) {
          let nameA = data1.status.toLowerCase(),
            nameB = data2.status.toLowerCase();
          if (nameA < nameB) return 1;
          if (nameA > nameB) return -1;
          return 0;
        } else if (
          reciveddata.rowsdata === reciveddata.formatMessage({ id: "userId" })
        ) {
          let nameA = data1.createdBy.toLowerCase(),
            nameB = data2.createdBy.toLowerCase();
          if (nameA < nameB) return 1;
          if (nameA > nameB) return -1;
          return 0;
        } else if (
          reciveddata.rowsdata ===
          reciveddata.formatMessage({ id: "terminalId" })
        ) {
          let nameA = data1.terminalID.toLowerCase(),
            nameB = data2.terminalID.toLowerCase();
          if (nameA < nameB) return 1;
          if (nameA > nameB) return -1;
          return 0;
        } else if (
          reciveddata.rowsdata ===
          reciveddata.formatMessage({ id: "inputDateTime" })
        ) {
          let nameA = data1.createdOn,
            nameB = data2.createdOn;
          // return new Date(data2.createdOn) - new Date(data1.createdOn);
          if (nameA < nameB) return 1;
          if (nameA > nameB) return -1;
          return 0;
        }
      } else if (reciveddata.sorttype === "asc") {
        if (
          reciveddata.rowsdata === reciveddata.formatMessage({ id: "jobId" })
        ) {
          return data1.id - data2.id;
        } else if (
          reciveddata.rowsdata === reciveddata.formatMessage({ id: "jobType" })
        ) {
          let nameA = data1.type.toLowerCase(),
            nameB = data2.type.toLowerCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        } else if (
          reciveddata.rowsdata === reciveddata.formatMessage({ id: "status" })
        ) {
          let nameA = data1.status.toLowerCase(),
            nameB = data2.status.toLowerCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        } else if (
          reciveddata.rowsdata === reciveddata.formatMessage({ id: "userId" })
        ) {
          let nameA = data1.createdBy.toLowerCase(),
            nameB = data2.createdBy.toLowerCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        } else if (
          reciveddata.rowsdata ===
          reciveddata.formatMessage({ id: "terminalId" })
        ) {
          let nameA = data1.terminalID.toLowerCase(),
            nameB = data2.terminalID.toLowerCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        } else if (
          reciveddata.rowsdata ===
          reciveddata.formatMessage({ id: "inputDateTime" })
        ) {
          let nameA = data1.createdOn,
            nameB = data2.createdOn;
          // return new Date(data1.createdOn) - new Date(data2.createdOn);
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        }
      }
    });
    let Jobs = {
      results: reciveddata.jobsdata
    };
    Jobs.totalPages = page.length;
    Jobs.currentPage = currentpage;
    Jobs.pages = makePages(page.length, currentpage, pageSize);
    Jobs.maxPages = maxpages;
    yield put(requestActiveJobsSuccess(Jobs));
  } catch (e) {
    console.log(e);
  }
}

export function* callRequestCreateJob(action) {
  yield put(startSpinner());
  try {
    const { transactionType, number, start } = action.payload;

    const setting = _settings();
    const terminalID = setting.workstationName;
    const payload = {
      number,
      type: transactionType,
      crimeType: "criminal",
      terminalID: terminalID
    };
    const res = yield call(Api, {
      url: url.job.create,
      method: "POST",
      isJwtRequired: true,
      data: payload
    });

    if (res.id) {
      yield put(requestCreateJobSuccess(res.id));
      yield call(delay, 500);
      yield put(
        requestShowNotification({
          message: translate("Job created successfully"),
          type: "is-success"
        })
      );

      if (start) {
        if (transactionType === "Tenprint") {
          yield put(requestActiveJobs());
          yield put(push("/authenticated/tenprint"));
        } else if (transactionType === "Latent") {
          yield put(requestActiveJobs());
          yield put(push("/authenticated/latent"));
        } else {
          yield put(requestActiveJobs());
          yield put(resetCustomSearchData());
          yield put(push("/authenticated/customsearch/search"));
        }
        yield put(requestHideModal());
        yield put(
          requestPageChanged(
            { target: { tagName: "A", innerText: "1" } },
            "jobQueue"
          )
        ); //redirect to first page
        yield put(
          requestTableRowClicked(res.id, "jobQueue", "Ready", "Tenprint")
        );
        return;
      }

      if (!start) {
        yield put(requestActiveJobs());
        yield put(
          requestPageChanged(
            { target: { tagName: "A", innerText: "1" } },
            "jobQueue"
          )
        ); //redirect to first page
        yield put(
          requestTableRowClicked(res.id, "jobQueue", "Ready", "Tenprint")
        );
      }
      yield put(requestHideModal());
    }
  } catch (e) {
    console.error("-------- error creating job", e);
    yield put(requestCreateJobFailed());
  } finally {
    yield put(stopSpinner());
  }
}

export function* callRequestActionHistory(action) {
  yield put(startSpinner());
  try {
    const { payload: jobId } = action;
    const res = yield call(Api, {
      url: url.job.actionHistory,
      method: "POST",
      isJwtRequired: true,
      data: jobId
    });
    if (res) {
      const pageSize = yield select(jobsPageSizeSelector);
      res.totalPages = getTotalPagesCount(res.totalCount, pageSize); //Math.ceil(res.totalCount / pageSize);
      res.pages = makePages(res.totalPages, res.currentPage, pageSize);
      res.maxPages = maxPageLinksToDisplay;
      yield put(requestActionHistorySuccess(res));
      // yield put(requestRemoveFilter());
    }
  } catch (e) {
    // console.error("-------- error fetching action history", e);
    yield put(requestActionHistoryFailed());
  } finally {
    yield put(stopSpinner());
  }
}

export function* callRequestRemoveJob(action) {
  yield put(startSpinner());
  try {
    const { payload: jobId } = action;
    const res = yield call(Api, {
      url: url.job.remove + jobId,
      method: "DELETE",
      isJwtRequired: true
    });
    if (res && res.message) {
      yield put(requestRemoveJobSuccess(jobId)); //removes job from store in reducer
      yield put(requestHideModal());
      yield put(
        requestShowNotification({
          message: translateRes(res.message),
          type: "is-success"
        })
      );
      const jobsIdList = yield select(jobsListSelector);
      let { currentPage, pageSize } = yield select(jobsPagingSelector);
      // check if removing current job will result in 0 in the current jobs list so we can get the correct page number to request new data for
      if (currentPage > 1 && (!jobsIdList || jobsIdList.length <= 0)) {
        currentPage -= 1;
      }
      yield put(requestActiveJobs({ pageNo: currentPage, pageSize: pageSize }));
    } else {
      if (res.error) {
        yield put(requestRemoveJobFailed());
        yield put(
          requestShowNotification({ message: res.error, type: "is-warning" })
        );
      }
    }
  } catch (e) {
    console.error("-------remove job failed:", e);
    yield put(requestRemoveJobFailed());
  } finally {
    yield put(stopSpinner());
  }
}

export function* callRequestNewAction(action) {
  yield put(startSpinner());
  try {
    console.log("callRequestNewAction::action.payload",action.payload);
    const {
      newAction,
      job,
      username,
      tcn,
      refActionID,
      verifyAction,
      Note,
      typeOfAction,
    } = action.payload;
    let Database = "";
    // let SelectedAction = yield select(SelectedActionTypeSelector);
    let actiondata = newAction;
    if (typeOfAction === "search") {
      const jobs = [];
      actiondata.forEach((item, index) => {
        if (newAction[index] === "Search Criminal") {
          Database = "Criminal";
        } else if (newAction[index] === "Search Latent") {
          Database = "Latent";
        } else if (newAction[index] === "Search Civil") {
          Database = "Civil";
        } else {
          Database = "Civil";
        }

        jobs.push({
          jobId: job,
          note: Note,
          database: Database,
          referenceActionId: refActionID,
          actionType: newAction[index],
          tcn: tcn || new Date().getTime(), //todo: remove
          by: username
        });
      });

      const apiCallsResponse = yield jobs.map(item =>
        call(makeActionApiCall, item, job)
      );

      yield put(push("/Authenticated/jobqueue"));
    } else if (typeOfAction === "Custom Search") {
      for (let i = 0; i < actiondata.length; i++) {
        let newAction = actiondata[i];
        let actionType = "";
        if (newAction === "Search Criminal") {
          Database = "Criminal";
          actionType = "Custom Search Criminal";
        } else if (newAction === "Search Civil") {
          Database = "Civil";
          actionType = "Custom Search Civil";
        } else if (newAction === "Search Latent") {
          Database = "Latent";
          actionType = "Custom Search Latent";
        } else {
          Database = "Civil";
          actionType = "Custom Search Civil";
        }
        let parameters = [];
        let customSearchData = yield select(customSearchDataSelector);
        console.log("customSearchData",customSearchData);



        if ( customSearchData.latentID ) {
          parameters.push({
            key: "LatentID",
            value: customSearchData.latentID
          });
        }
        if ( customSearchData.SAMISID ) {
          parameters.push({
            key: "SAMISID",
            value: customSearchData.SAMISID
          });
        }
        if ( customSearchData.fileNo ) {
          parameters.push({
            key: "File Number",
            value: customSearchData.fileNo
          });
        }




        // if (customSearchData.SAMISID !== "" && customSearchData.fileNo !== "") {
        //   parameters.push(
        //     {
        //       key: "SAMISID",
        //       value: customSearchData.SAMISID
        //     },
        //     {
        //       key: "File Number",
        //       value: customSearchData.fileNo
        //     }
        //   );
        // } else if (
        //   customSearchData.SAMISID === "" &&
        //   customSearchData.fileNo !== ""
        // ) {
        //   parameters.push({
        //     key: "File Number",
        //     value: customSearchData.fileNo
        //   });
        // } else if (
        //   customSearchData.fileNo === "" &&
        //   customSearchData.SAMISID !== ""
        // ) {
        //   parameters.push({
        //     key: "SAMISID",
        //     value: customSearchData.SAMISID
        //   });
        // }else if (
        //   customSearchData.latentID&&customSearchData.latentID !== "" 
        // ) {
        //   parameters.push({
        //     key: "LatentID",
        //     value: customSearchData.latentID
        //   });

        // }






        const data = {
          jobId: job,
          note: Note,
          database: Database,
          referenceActionId: refActionID,
          actionType: actionType,
          tcn: tcn || new Date().getTime(), //todo: remove
          by: username,
          parameters: parameters
        };

        const res = yield call(Api, {
          url: url.action.create,
          method: "POST",
          isJwtRequired: true,
          data
        });
        if (res && res.id) {
          yield put(requestNewActionSuccess(res.id));
          yield put(requestHideModal());
          yield put(
            requestShowNotification({
              message: translate("Successfully added an action"),
              type: "is-success"
            })
          );

          yield put(requestClearLatentEditorData());
        }
        yield put(requestActionHistory(job));
      }

      yield put(
        requestTableRowClicked(
          yield select(selectedJobSelector),
          "jobQueue",
          "Ready",
          "Custom"
        )
      );
      yield put(requestActiveJobs());
      yield put(resetCustomSearchData());
      yield put(push("/Authenticated/jobqueue"));
    } else if (typeOfAction === "LatentsubsequentAction") {
      const linkData = yield select(linkDatalSelector);

      Database = "Latent";
      let parameters = [
        // { key: "LatentID", value: linkData.latentId },
        { key: "LatentID", value: action.payload.latentID },
        { key: "BioID", value: action.payload.bioId },
        { key: "MatchedPersonId", value: action.payload.matchedPersonId },
        { key: "parentReferenceID", value: refActionID },
        { key: "referenceId", value: refActionID },
        { key: "parentSearchReferenceId", value: refActionID },
        { key: "SAMISID", value: action.payload.samisid },
      ];
      const data = {
        jobId: job,
        note: Note,
        database: Database,
        referenceActionId: refActionID,
        parentReferenceID: refActionID,
        parentSearchReferenceId: refActionID,
        referenceId: refActionID,
        actionType: newAction,
        tcn: tcn || new Date().getTime(), //todo: remove
        by: username,
        parameters: parameters
      };

      const res = yield call(Api, {
        url: url.action.create,
        method: "POST",
        isJwtRequired: true,
        data
      });
      // yield put(requestUnMatch())
      if (res.error) {
        yield put(
          requestShowNotification({
            message: translateRes(res.error),
            type: "is-danger"
          })
        );
      }

      if (res.message) {
        // yield put(requestUnMatch())
        return;
        yield put(
          requestShowNotification({
            message: translateRes(res.message),
            type: "is-success"
          })
        );
        yield put(requestActiveJobs());
        yield put(requestActionHistory(job));
        yield put(requestHideModal());
        yield put(push("/Authenticated/jobqueue"));
      } else if (res.id) {
        yield put(
          requestShowNotification({
            message: translate("successfullyCreatedAction"),
            type: "is-success"
          })
        );
        yield put(requestActiveJobs());
        yield put(requestActionHistory(job));
        yield put(requestHideModal());
        yield put(push("/Authenticated/jobqueue"));
      }
    } else {
      if (newAction === "Search Criminal") {
        Database = "Criminal";
      } else if (newAction === "Search Latent") {
        Database = "Latent";
      } else if (newAction === "Search Civil") {
        Database = "Civil";
      } else {
        Database = "Civil";
      }

      // const fingerprintID = yield select(fingerprintIDSelector);

      if (newAction === "Mark Action Completed") {
        // setActionStatus
        let data = {
          actionId: refActionID,
          status: "Completed"
        };
        const res = yield call(Api, {
          url: url.action.setActionStatus,
          method: "PUT",
          isJwtRequired: true,
          data
        });

        if (res.message) {
          yield put(
            requestShowNotification({
              message: translateRes(res.message),
              type: "is-success"
            })
          );
          yield put(requestActiveJobs());
          yield put(requestActionHistory(job));
          yield put(requestHideModal());
          yield put(push("/Authenticated/jobqueue"));
        }
        if (res.error) {
          yield put(
            requestShowNotification({
              message: translateRes(res.eroor),
              type: "is-danger"
            })
          );
        }
      } else if (newAction === "Register Latent") {
        Database = "Latent";
        const tenprintData = yield select(tenprintSelector);
        const matchedPerson = yield select(MatchedPersonInfoSelector);
        let latentId = matchedPerson
          ? matchedPerson.person
            ? matchedPerson.person.extendedData
              ? matchedPerson.person.extendedData && Array.isArray(matchedPerson.person.extendedData) && matchedPerson.person.extendedData.find(
                  data => data.key === "Latent Identifier"
                )
                ? matchedPerson.person.extendedData && Array.isArray(matchedPerson.person.extendedData) && matchedPerson.person.extendedData.find(
                    data => data.key === "Latent Identifier"
                  ).value
                : ""
              : ""
            : ""
          : "";
        // const latentIdState = action.payload.state.data.latentidentifier || latentId;

          const stateData = action.payload.state.data || {};
          const bioData = tenprintData.probe && tenprintData.probe.biometrics[0] || {};
          let eventClassCode = "";
          if ( stateData.eventClassCode && stateData.eventClassCode.length > 0 ) {
            eventClassCode = stateData && stateData.eventClassCode && stateData.eventClassCode.split("|");
          }

        let parameters = [
          // { key: "LatentID", value: stateData.latentidentifier },
          // { key: "BioID", value: stateData.bioId || "123" },

          // { key: "FingerImage", value: bioData.thumbNail },
          // { key: "LatentTemplate", value: "" },
          { key: "FingerPosition", value: bioData.position },
          { key: "FingerID", value: bioData.id },

            { key: "CrimeRegion", value: stateData.crimeRegion },
            { key: "CrimeCity", value: stateData.crimeCity },
          { key: "CrimePlace", value: stateData.crimePlace },

          // { key: "CrimeType", value: stateData.crimeType },
            { key: "EventCode", value: eventClassCode[0] },
            { key: "ClassCode", value: eventClassCode[1] },

          { key: "CrimeDate", value: stateData.crimeDate },
          { key: "CaseFileNumber", value: stateData.caseFileNumber },
          { key: "InvestigationDepartment", value: stateData.caseInvestigationDepartment },
          { key: "Note", value: stateData.crimeNoteLong },
          { key: "ImageFormat", value: "PNG" },
        ];

        // if ( stateData.crimeRegion ) { parameters.push({ key: "CrimeRegion", value: stateData.crimeRegion }); }
        // if ( stateData.CrimeCity ) { parameters.push({ key: "CrimeCity", value: stateData.CrimeCity }); }
        // if ( eventClassCode[0] ) { parameters.push({ key: "EventCode", value: eventClassCode[0] }); }
        // if ( eventClassCode[1] ) { parameters.push({ key: "ClassCode", value: eventClassCode[1] }); }


        // console.log("parameters",parameters);

        const data = {
          jobId: job,
          note: Note,
          database: Database,
          referenceActionId: refActionID,
          actionType: newAction,
          tcn: tcn || new Date().getTime(), //todo: remove
          by: username,
          parameters: parameters
        };

        const res = yield call(Api, {
          url: url.action.create,
          method: "POST",
          isJwtRequired: true,
          data
        });
        if (res && res.id) {
          yield put(requestNewActionSuccess(res.id));
          yield put(requestActiveJobs());
          yield put(requestHideModal());
          yield put(push("/authenticated/jobqueue"));
          yield put(
            requestShowNotification({
              message: translate("Successfully added an action"),
              type: "is-success"
            })
          );

          yield put(requestActionHistory(job));
          yield put(requestClearLatentEditorData());
        } else {
          if (res.error) {
            yield put(requestNewActionFailed());
            yield put(
              requestShowNotification({
                message: translateRes(res.error),
                type: "is-warning"
              })
            );
          }
        }
      } else if (newAction === "Update Latent") {
        Database = "Latent";
        const tenprintData = yield select(tenprintSelector);
        console.log("tenprintData",tenprintData);
          const stateData = action.payload.state.data || {};
          const bioData = tenprintData && tenprintData.probe && tenprintData.probe.biometrics[0] || {};
          let eventClassCode = [
            stateData.eventCode,
            stateData.classCode,
          ];
          if ( stateData.eventClassCode && stateData.eventClassCode.length > 0 ) {
            eventClassCode = stateData && stateData.eventClassCode && stateData.eventClassCode.split("|");
          }
        let parameters = [
          { key: "LatentID", value: action.payload.latentidentifier },
          // { key: "FingerPosition", value: bioData.position },
          // { key: "FingerID", value: bioData.id },
          { key: "CrimeRegion", value: stateData.crimeRegion },
          { key: "CrimeCity", value: stateData.crimeCity },
          { key: "CrimePlace", value: stateData.crimePlace },
          { key: "EventCode", value: eventClassCode[0] },
          { key: "ClassCode", value: eventClassCode[1] },
          { key: "CrimeDate", value: stateData.crimeDate },
          { key: "CaseFileNumber", value: stateData.caseFileNumber },
          { key: "InvestigationDepartment", value: stateData.caseInvestigationDepartment },
          { key: "Note", value: stateData.crimeNoteLong },
          // { key: "ImageFormat", value: "PNG" },
        ];

        // console.log("parameters",parameters);

        const data = {
          id: "",
          jobId: job,
          note: Note,
          database: Database,
          referenceActionId: refActionID,
          actionType: newAction,
          tcn: tcn || new Date().getTime(),
          by: username,
          parameters: parameters
        };

        const res = yield call(Api, {
          url: url.action.create,
          method: "POST",
          isJwtRequired: true,
          data
        });
        if (res && res.id) {
          yield put(requestNewActionSuccess(res.id));
          yield put(requestActiveJobs());
          yield put(requestHideModal());
          yield put(push("/authenticated/jobqueue"));
          yield put(
            requestShowNotification({
              message: translate("Successfully added an action"),
              type: "is-success"
            })
          );

          yield put(requestActionHistory(job));
          yield put(requestClearLatentEditorData());
        } else {
          if (res.error) {
            yield put(requestNewActionFailed());
            yield put(
              requestShowNotification({
                message: translateRes(res.error),
                type: "is-warning"
              })
            );
          }
        }
      } else if (newAction === "Delete Latent") {

        Database = "Latent";
        const tenprintData = yield select(tenprintSelector);
          const bioData = tenprintData && tenprintData.probe && tenprintData.probe.biometrics[0] || {};
        let parameters = [
          { key: "LatentID", value: action.payload.latendID },
        ];

        // console.log("parameters",parameters);

        const data = {
          id: "",
          jobId: job,
          note: Note,
          database: Database,
          referenceActionId: refActionID,
          actionType: newAction,
          tcn: tcn || new Date().getTime(),
          by: username,
          parameters: parameters
        };

        const res = yield call(Api, {
          url: url.action.create,
          method: "POST",
          isJwtRequired: true,
          data
        });
        if (res && res.id) {
          yield put(requestNewActionSuccess(res.id));
          yield put(requestActiveJobs());
          yield put(requestHideModal());
          yield put(push("/authenticated/jobqueue"));
          yield put(
            requestShowNotification({
              message: translate("Successfully added an action"),
              type: "is-success"
            })
          );

          yield put(requestActionHistory(job));
          yield put(requestClearLatentEditorData());
        } else {
          if (res.error) {
            yield put(requestNewActionFailed());
            yield put(
              requestShowNotification({
                message: translateRes(res.error),
                type: "is-warning"
              })
            );
          }
        }
      }




      else {

        let parameters = [
          { key: "LatentID", value: action.payload.latendID || action.payload.latentidentifier || '' },
        ];

        const data = {
          jobId: job,
          note: Note,
          database: Database,
          referenceActionId: refActionID,
          actionType: newAction,
          tcn: tcn || new Date().getTime(), //todo: remove
          by: username,
          parameters: parameters
        };

        const res = yield call(Api, {
          url: url.action.create,
          method: "POST",
          isJwtRequired: true,
          data
        });
        if (res && res.id) {
          yield put(requestNewActionSuccess(res.id));
          yield put(requestActiveJobs());
          yield put(requestHideModal());
          yield put(push(history.push("/authenticated/jobqueue")));
          yield put(
            requestShowNotification({
              message: translate("Successfully added an action"),
              type: "is-success"
            })
          );

          yield put(requestActionHistory(job));
          yield put(requestClearLatentEditorData());
        } else {
          if (res.error) {
            yield put(requestNewActionFailed());
            yield put(
              requestShowNotification({
                message: translateRes(res.error),
                type: "is-warning"
              })
            );
          }
        }
      }
    }
  } catch (e) {
    console.error("-------new action failed:", e);
    yield put(requestNewActionFailed());
  } finally {
    yield put(requestActionStart(false))
    yield put(stopSpinner());
  }
}

export function* callRequestRemoveFilter(action) {}

function makePages(totalPages, currentPage, pageSize) {
  // let totalPages = getTotalPages(totalCount, pageSize); // Math.ceil(totalCount / pageSize); // pageSize refers to how many per page => todo: make dynamic
  let startPage = Math.max(
    currentPage - Math.floor(maxPageLinksToDisplay / 2),
    1
  );
  let endPage = startPage + maxPageLinksToDisplay - 1;
  if (endPage > totalPages) {
    startPage = endPage - maxPageLinksToDisplay + 1;
    endPage = totalPages;
  }
  let pages = [];
  for (let number = startPage; number <= endPage; number++) {
    pages.push(number);
  }
  return pages;
}

const getTotalPages = (totalCount, pageSize) =>
  Math.ceil(totalCount / pageSize);

const mappings = {
  "R. ROLLED THUMB": "Right Thumb",
  "R. ROLLED INDEX": "Right Index",
  "R. ROLLED MIDDLE": "Right Middle",
  "R. ROLLED RING": "Right Ring",
  "R. ROLLED LITTLE": "Right Little",
  "L. ROLLED THUMB": "Left Thumb",
  "L. ROLLED INDEX": "Left Index",
  "L. ROLLED MIDDLE": "Left Middle",
  "L. ROLLED RING": "Left Ring",
  "L. ROLLED LITTLE": "Left Little",
  "L. SLAP": "Left Four Fingers",
  "L. PLAIN THUMB": "Left Thumb",
  "R. PLAIN THUMB": "Right Thumb",
  "R. SLAP": "Right Four Fingers",
  "R. PLAIN THUMB": "Right Thumb",
  "R. PLAIN INDEX": "Right Index",
  "R. PLAIN MIDDLE": "Right Middle",
  "R. PLAIN RING": "Right Ring",
  "R. PLAIN LITTLE": "Right Little",
  "L. PLAIN THUMB": "Left Thumb",
  "L. PLAIN INDEX": "Left Index",
  "L. PLAIN MIDDLE": "Left Middle",
  "L. PLAIN RING": "Left Ring",
  "L. PLAIN LITTLE": "Left Little",
  "left upper palm": "Left Upper Palm",
  "left lower palm": "Left Lower Palm",
  "left righter palm": "Left Righter Palm",
  "right upper palm": "Right Upper Palm",
  "right lower palm": "Right Lower Palm",
  "right righter palm": "Right Righter Palm",

  "R. FULL PALM": "Right Full Palm",
  "R. UPPER PALM": "Right Upper Palm",
  "L. FULL PALM": "Left Full Palm",
  "L. UPPER PALM": "Left Upper Palm",

  "L. LOWER PALM": "Left Lower Palm",
  "L. WRITER PALM": "Left Writer Palm",
  "R. LOWER PALM": "Right Lower Palm",
  "R. WRITER PALM": "Right Writer Palm",

};

const getTotalPagesCount = (totalCount, pageSize) =>
  Math.ceil(totalCount / pageSize);

export function* callRequestCloseFilter(action) {
  yield put(requestCloseFilterSucess());
  yield put(requestActiveJobs());
}
export function* callRequestCloseActionFilter(action) {
  const selectedJob = yield select(selectedJobSelector);
  yield put(requestCloseActionFilterSucess());

  if (selectedJob) {
    yield put(requestActionHistory(selectedJob));
  }
}

export function* callRequestJobAuditLogs(action) {
  try {
    const { payload: JobId } = action;

    const res = yield call(Api, {
      url: url.job.auditLog,
      method: "POST",
      isJwtRequired: true,
      data: JobId
    });
    if (res) {
      yield put(requestJobAuditLogsSucess(res));
    } else {
      // console.log("DATA NOT RECIEVED");
    }
  } catch (e) {
    console.error(e);
  }
}

export function makeCardJobPayload(
  jobId,
  segmentedPrints,
  b64CardImage,
  createdBy,
  annotations
) {
  try {
    // console.log("makeCardJobPayload :: segmentedPrints, annotations, mappings", segmentedPrints, annotations, mappings);
    let biometrics = segmentedPrints.map(print => {
      const { impression, type } = makeConfig(print.name);
      const mappedPosition = mappings[print.name];

      let annotationsObj = undefined;

      if ( mappedPosition ) {
        let finalPos = "";
        let pos = mappedPosition && mappedPosition.split(' ');
        pos.forEach( (item, index) => {
          if ( item && index !== 0 ) { finalPos = `${ finalPos }-${ item.toLowerCase() }`; }
          else if ( item ) { finalPos = item.toLowerCase(); }
        });
        annotationsObj =
          annotations[finalPos] ||
          undefined;
      }


      const annotationReason =
        (annotationsObj &&
          annotationsObj["reason"].replace(/([A-Z])/g, " $1").trim()) ||
        "";
      // console.log("annotationReason", annotationReason);
      const annotationsNote = (annotationsObj && annotationsObj["note"]) || "";

      const output = {
        type,
        impression,
        position: mappedPosition,
        encoding: "PNG",
        image:
          annotationReason === "Permanent Missing" ||
          annotationReason === "Unable To Acquire"
            ? ""
            : print && print.b64Image && print.b64Image.split(",")[1],
        hashValue: "",
        isTemplate: false,
        patterType: "",
        referencePatterType: "",
        quality: 1,
        minutiaCount: 0,
        // annotation: annotationReason,
        // annotationNote: annotationsNote,
        annotation:
          annotationReason === "Not Annotated" || annotationReason == "0"
            ? ""
            : annotationReason,
        annotationNote: annotationReason == "0" ? "" : annotationsNote,
        createdBy
      };

      return output;
    });
    const finalData = {
      jobId,
      biometrics
    };

    return finalData;
  } catch (error) {
    console.log("ERROR OCCOURED", error);
  }
}

export function makeConfig(name) {
  let config = {};
  let nameLower = name.toLowerCase();

  if (nameLower.indexOf("rolled") > 0) {
    config.type = "Finger";
    config.impression = "Roll";
  }
  if (nameLower.indexOf("slap") > 0) {
    config.type = "Slap";
    config.impression = "Flat";
  }
  if (nameLower.indexOf("plain") > 0) {
    config.type = "Finger";
    config.impression = "Flat";
  }
  if (nameLower.indexOf("palm") > 0) {
    config.type = "Palm";
    config.impression = "Flat";
  }

  // console.log("config", config);
  return config;
}

export function* makeActionApiCall(data, job) {
  const res = yield call(Api, {
    url: url.action.create,
    method: "POST",
    isJwtRequired: true,
    data
  });

  if (res && res.id) {
    // console.log("makeActionApiCall::response", res);

    yield put(requestNewActionSuccess(res.id));
    yield put(requestHideModal());
    yield put(
      requestShowNotification({
        message: translate("Successfully added an action"),
        type: "is-success"
      })
    );
    yield put(requestClearLatentEditorData());
    yield put(requestActiveJobs());

    yield put(requestActionHistory(job));

    return true;
  }
}


/**
 * new permistion api request starts here.
 * request for system permision api
 */
export function* watchSystemPermissionRequest() {
  // console.log("watchSystemPermissionRequest : called");
  yield takeLatest(REQUEST_SYSTEM_PERMISSION, callSystemPermissionRequest);
}

export function* callSystemPermissionRequest(action){

  try {
    const apiCall = yield call(Api,{
      url: url.systeminfo.getnicLookupMenuRoles,
      method: "GET",
      isJwtRequired: true,
      data: {},
    });

    if ( apiCall ) {
      yield put(requestSystemPermissionsSuccess(apiCall))
    }
  } catch (error) {
    console.error(error);
    yield put(requestSystemPermissionsFailed())
  }

}
