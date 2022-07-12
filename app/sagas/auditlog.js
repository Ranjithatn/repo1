import { call, put, takeLatest, select, takeEvery } from "redux-saga/effects";
import { push } from "react-router-redux";
import * as localStorage from "../utils/localStorage";
import { delay } from "redux-saga";
import { requestShowNotification } from "../actions/notifications";
import Api, { url } from "../api/";
import { startSpinner, stopSpinner } from "../actions/spinner";
import {
  REQUEST_SHOW_AUDITLOG,
  REQUEST_JOB_AUDIT_LOGS,
  REQUEST_AUDIT_LOG_SORT
} from "../actions/actionTypes";
import {
  requestOpenAudiLogSuccess,
  requestJobAuditLogsSucess,
  requestSetAuditlogSort,
  requestResetAuditlogSort
} from "../actions/auditlog";

import {
  auditPagingSelector,
  jobAuditLogFilterSelector
} from "../selectors/auditlog";
import { emit } from "cluster";

const maxPageLinksToDisplay = 11; // this includes the ellipses

export function* watchRequestShowAuditLog() {
  yield takeLatest(REQUEST_SHOW_AUDITLOG, callrequestShowAuditLog);
}

export function* watchRequestJobAuditLogs() {
  yield takeLatest(REQUEST_JOB_AUDIT_LOGS, callRequestJobAuditLogs);
}
export function* watchRequestAuditLogSort() {
  yield takeLatest(REQUEST_AUDIT_LOG_SORT, callRequestAuditLogSort);
}

export function* callrequestShowAuditLog(action) {
  try {
    const {
      jobID,
      jobStatus,
      jobStartDate,
      jobEndDate,
      PageDetails
    } = action.payload;
    const { currentPage, pageSize } = yield select(auditPagingSelector);

    let pageNo = 0;

    if (jobStartDate || jobEndDate || jobStatus) {
      pageNo = PageDetails;
    } else {
      pageNo = PageDetails === 0 ? currentPage : PageDetails;
    }

    let sendData = {
      pageOn: {
        // pageNo: PageDetails !== 0 ? PageDetails : currentPage,
        // pageNo: ( jobStartDate != '' || jobEndDate != '' || jobStatus != '' ) ? 1 : PageDetails,
        pageNo: pageNo,
        pageSize: pageSize
      },
      jobId: jobID,
      jobStatus: jobStatus,
      endDate: jobEndDate===" 23:59:59"?"":jobEndDate,
      startDate: jobStartDate===" 00:00:00"?"":jobStartDate,
      sortOn: {
        key: "createdOn",
        ascending: true,
      }
    };

    const res = yield call(Api, {
      url: url.job.getjobauditreport,
      method: "POST",
      isJwtRequired: true,
      data: sendData
    });

    if ( ! res.currentPage ) {
      return;
    } else {

      res.totalPages = getTotalPagesCount(res.totalCount, pageSize); //Math.ceil(res.totalCount / pageSize);

      res.pages = makePages(res.totalPages, res.currentPage, pageSize);
      res.maxPages = maxPageLinksToDisplay;
      res.StausObject = "";
      res.crimeTypeObject = "";

      if (
        res.results !== null &&
        res.results !== "" &&
        res.results &&
        res.results.length !== 0 &&
        res.results &&
        res.results.length !== undefined
      ) {
        let lookup = {};
        let CrimeType = [];

        let status = [];
        res.results.forEach(presentobj => {
          let crimeType = presentobj.crimeType;
          if (!(crimeType in lookup)) {
            lookup[crimeType] = 1;
            CrimeType.push(crimeType);
          }
          let objectStatus = presentobj.status;
          if (!(objectStatus in lookup)) {
            lookup[objectStatus] = 1;
            status.push(objectStatus);
          }
        });

        let newCrimeTypes = [];
        CrimeType.forEach(element => {
          let newObj = {
            value: element,
            displayName: element
          };
          newCrimeTypes.push(newObj);
        });

        res.crimeTypeObject = newCrimeTypes;

        let newStatus = [];
        status.forEach(element => {
          let newObj = {
            value: element,
            displayName: element
          };
          newStatus.push(newObj);
        });

        res.StausObject = newStatus;
      }

      yield put(requestOpenAudiLogSuccess(res));
      yield put(requestResetAuditlogSort());

      yield put(push("/authenticated/auditlog/logs"));

    }

  } catch (e) {
    console.log("error",e);
  }
}

export function* callRequestAuditLogSort(action) {
  try {
    const { column, type, page } = action.payload;

    let ascending;
    if (type === "asc") {
      ascending = true;
    } else {
      ascending = false;
    }
    const { currentPage, pageSize } = yield select(auditPagingSelector);
    const filterDetails = yield select(jobAuditLogFilterSelector);
    const jobStatus = filterDetails.status;
    const jobStartDate = filterDetails.start;
    const jobEndDate = filterDetails.end;

    let pageNo = page;

    let sendData = {
      pageOn: {
        pageNo: pageNo,
        pageSize: pageSize
      },
      sorton: {
        key: column,
        ascending: ascending
      },
      jobId: "",
      jobStatus: jobStatus,
      startDate: jobStartDate,
      endDate: jobEndDate
    };

    // console.log("callrequestShowAuditLog sendData", sendData);

    const res = yield call(Api, {
      url: url.job.getjobauditreport,
      method: "POST",
      isJwtRequired: true,
      data: sendData
    });

    res.totalPages = getTotalPagesCount(res.totalCount, pageSize); //Math.ceil(res.totalCount / pageSize);

    res.pages = makePages(res.totalPages, res.currentPage, pageSize);
    res.maxPages = maxPageLinksToDisplay;
    res.StausObject = "";
    res.crimeTypeObject = "";

    if (
      res.results !== null &&
      res.results !== "" &&
      res.results &&
      res.results.length !== 0 &&
      res.results &&
      res.results.length !== undefined
    ) {
      let lookup = {};
      let CrimeType = [];

      let status = [];
      res.results.forEach(presentobj => {
        let crimeType = presentobj.crimeType;
        if (!(crimeType in lookup)) {
          lookup[crimeType] = 1;
          CrimeType.push(crimeType);
        }
        let objectStatus = presentobj.status;
        if (!(objectStatus in lookup)) {
          lookup[objectStatus] = 1;
          status.push(objectStatus);
        }
      });

      let newCrimeTypes = [];
      CrimeType.forEach(element => {
        let newObj = {
          value: element,
          displayName: element
        };
        newCrimeTypes.push(newObj);
      });

      res.crimeTypeObject = newCrimeTypes;

      let newStatus = [];
      status.forEach(element => {
        let newObj = {
          value: element,
          displayName: element
        };
        newStatus.push(newObj);
      });

      // console.log("contentArray========", newStatus);
      res.StausObject = newStatus;
    }

    yield put(requestOpenAudiLogSuccess(res));

    yield put(requestSetAuditlogSort(column, type));
  } catch (e) {
    // console.log(e);
  }
}

export function* callRequestJobAuditLogs(action) {
  yield put(startSpinner());

  try {
    const { payload: auditLogData } = action;

    const res = yield call(Api, {
      url: url.job.auditLog,
      method: "POST",
      isJwtRequired: true,
      data: auditLogData.job
    });
    if (res) {
      yield put(requestJobAuditLogsSucess(res));
      yield put(stopSpinner());
      if (auditLogData.type === "open") {
        yield put(push("/authenticated/auditlog/joblogs"));
      }
    } else {
      yield put(stopSpinner());
    }
  } catch (e) {
    yield put(stopSpinner());
    console.error(e);
  }
}

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

const getTotalPagesCount = (totalCount, pageSize) =>
  Math.ceil(totalCount / pageSize);
