import { call, put, takeLatest, select, fork } from "redux-saga/effects";
import { delay } from "redux-saga";
import Api, { url } from "../api/";
import {
  REQUEST_INPUT_FIELD_CHANGED,
  RECEIVE_INPUT_FIELD_CHANGED,
  RECEIVE_INPUT_FIELD_CHANGED_FAILED,
  REQUEST_PAGE_CHANGED,
  REQUEST_PAGE_CHANGED_SUCCESS,
  REQUEST_ACTIVE_JOBS,
  REQUEST_TABLE_ROW_CLICKED,
  REQUEST_TABLE_ROW_CLICKED_FAILED,
  REQUEST_PAGE_CHANGED_FAILED
} from "../actions/actionTypes";
import {
  receiveTableRowClicked,
  requestInputFieldChanged,
  receiveInputFieldChanged,
  receiveInputFieldChangedFailed,
  requestTableRowClickedFailed,
  requestPageChangedFailed
} from "../actions/global";
import { isNumber } from "../utils";
import {
  jobsPagingSelector,
  setJobTypeFilter,
  jobsByIdStateSelector,
  jobsForFilter,
  jobsTypeSelector,
  actionHistoryListSelector,
  actionHistoryDataListSelector,
} from "../selectors/jobs";
import {
  requestActiveJobs,
  requestActionHistory,
  requestShowJobFilteredData,
  requestCloseActionFilter,
  requestCloseFilter
} from "../actions/jobs";

import { requestShowAuditLog, requrstAuditLogSort } from "../actions/auditlog";
import {
  auditPagingSelector,
  jobAuditLogFilterSelector,
  jobAuditLogSortSelector
} from "../selectors/auditlog";
import { callJobClicked, callRequestActionHistory } from "./jobs";
import { requestShowNotification } from "../actions/notifications";
import { lookupsSelector, userLocationSelector } from "../selectors/auth";

export function* watchRequestInputFieldChanged() {
  yield takeLatest(REQUEST_INPUT_FIELD_CHANGED, callInputFieldChanged);
}

export function* watchRequestPageChanged() {
  yield takeLatest(REQUEST_PAGE_CHANGED, callPageChanged);
}

export function* watchRequestTableRowClicked() {
  yield takeLatest(REQUEST_TABLE_ROW_CLICKED, callRequestTableRowClicked);
}

export function* callInputFieldChanged(action) {
  // console.log("callInputFieldChanged::action.payload",action.payload);
  const filterContent = {
    area: "",
    field: "",
    value: "",
    type: "",
    content: []
  };
  // console.log("callInputFieldChanged::filterContent",filterContent);
  try {
    if (action.payload.area === "filter") {
      let JobsData = yield select(actionHistoryDataListSelector);
      if (action.payload.value === "ACTION STATE") {
        let objectkeys = Object.keys(JobsData);

        let lookup = {};
        // let result=[];
        let result = objectkeys
          .filter(presentobj => {
            let name = JobsData[presentobj].status;
            if (!(name in lookup)) {
              lookup[name] = 1;
              return true;
            }
            return false;
          })
          .map(presentobj => JobsData[presentobj].status);
        // objectkeys.forEach(presentobj => {
        //   let name = JobsData[presentobj].status;

        //   if (!(name in lookup)) {
        //     lookup[name] = 1;
        //     result.push(name);
        //   }
        // });

        var contentArray = result.map(element => ({
          value: element,
          displayName: element
        }));
        filterContent.area = action.payload.area;
        filterContent.type = action.payload.value;
        filterContent.content.push(contentArray);

        yield put(receiveInputFieldChanged(filterContent));
      } else if (action.payload.value === "USER ID") {
        let objectkeys = Object.keys(JobsData);

        let lookup = {};
        // let result=[];
        let result = objectkeys
          .filter(presentobj => {
            let name = JobsData[presentobj].by;
            if (!(name in lookup)) {
              lookup[name] = 1;
              return true;
            }
            return false;
          })
          .map(presentobj => JobsData[presentobj].by);

        var contentArray = result.map(element => ({
          value: element,
          displayName: element
        }));
        filterContent.area = action.payload.area;
        filterContent.type = action.payload.value;
        filterContent.content.push(contentArray);
        yield put(receiveInputFieldChanged(filterContent));
      } else if (action.payload.value === "ACTION TYPE") {
        let objectkeys = Object.keys(JobsData);

        let lookup = {};
        // let result=[];
        let result = objectkeys
          .filter(presentobj => {
            let name = JobsData[presentobj].actionType;
            if (!(name in lookup)) {
              lookup[name] = 1;
              return true;
            }
            return false;
          })
          .map(presentobj => JobsData[presentobj].actionType);

        var contentArray = result.map(element => ({
          value: element,
          displayName: element
        }));
        filterContent.area = action.payload.area;
        filterContent.type = action.payload.value;
        filterContent.content.push(contentArray);
        yield put(receiveInputFieldChanged(filterContent));
      } else {
      }
    } else if (action.payload.area === "addCrimeType") {
      yield put(receiveInputFieldChanged(action.payload));
    } else if (action.payload.area === "jobFilter") {
      // yield put(requestCloseFilter());
      yield put(requestActiveJobs());
      yield call(delay, 300);
      let JobsData = yield select(jobsByIdStateSelector);
      yield put(requestCloseFilter());

      if (action.payload.value === "JOB TYPE") {
        const { totalCount } = yield select(jobsPagingSelector);
        let pageData = {
          pageNo: 1,
          pageSize: totalCount
        };
        const res = yield call(Api, {
          url: url.job.getActive,
          method: "POST",
          isJwtRequired: true,
          data: pageData
        });

        let objectkeys = Object.keys(res.results);
        let lookup = {};
        let result = [];

        objectkeys.forEach(presentobj => {
          let id = res.results[presentobj].type;
          if (!(id in lookup)) {
            lookup[id] = 1;
            result.push(id);
          }
        });

        const contentArray = [];
        result.forEach(element => {
          var newObj = {
            value: element,
            displayName: element
          };
          contentArray.push(newObj);
        });

        filterContent.area = action.payload.area;
        filterContent.type = action.payload.value;
        filterContent.content.push(contentArray);

        yield put(receiveInputFieldChanged(filterContent));
      } else if (action.payload.value === "TERMINAL ID") {
        const { totalCount } = yield select(jobsPagingSelector);
        let pageData = {
          pageNo: 1,
          pageSize: totalCount
        };
        const res = yield call(Api, {
          url: url.job.getActive,
          method: "POST",
          isJwtRequired: true,
          data: pageData
        });

        let objectkeys = Object.keys(res.results);
        let lookup = {};
        let result = [];

        objectkeys.forEach(presentobj => {
          let id = res.results[presentobj].terminalID;
          if (id !== "" && id !== undefined) {
            if (!(id in lookup)) {
              lookup[id] = 1;
              result.push(id);
            }
          }
        });

        const contentArray = [];
        result.forEach(element => {
          var newObj = {
            value: element,
            displayName: element
          };
          contentArray.push(newObj);
        });
        filterContent.area = action.payload.area;
        filterContent.type = action.payload.value;
        filterContent.content.push(contentArray);
        yield put(receiveInputFieldChanged(filterContent));
      } else if (action.payload.value === "USER ID") {
        const { totalCount } = yield select(jobsPagingSelector);
        let pageData = {
          pageNo: 1,
          pageSize: totalCount
        };
        const res = yield call(Api, {
          url: url.job.getActive,
          method: "POST",
          isJwtRequired: true,
          data: pageData
        });

        let objectkeys = Object.keys(res.results);
        let lookup = {};
        let result = [];

        objectkeys.forEach(presentobj => {
          let id = res.results[presentobj].createdBy;
          if (!(id in lookup)) {
            lookup[id] = 1;
            result.push(id);
          }
        });

        const contentArray = [];
        result.forEach(element => {
          var newObj = {
            value: element,
            displayName: element
          };
          contentArray.push(newObj);
        });
        filterContent.area = action.payload.area;
        filterContent.type = action.payload.value;
        filterContent.content.push(contentArray);

        yield put(receiveInputFieldChanged(filterContent));
      } else if (action.payload.value === "JOB ID") {
        const { totalCount } = yield select(jobsPagingSelector);

        let pageData = {
          pageNo: 1,
          pageSize: totalCount
        };
        const res = yield call(Api, {
          url: url.job.getActive,
          method: "POST",
          isJwtRequired: true,
          data: pageData
        });

        let objectkeys = Object.keys(res.results);
        let lookup = {};
        let result = [];

        objectkeys.forEach(presentobj => {
          let id = res.results[presentobj].id;
          if (!(id in lookup)) {
            lookup[id] = 1;
            result.push(id);
          }
        });

        const contentArray = [];
        result.forEach(element => {
          var newObj = {
            value: element,
            displayName: element
          };
          contentArray.push(newObj);
        });

        filterContent.area = action.payload.area;
        filterContent.type = action.payload.value;
        filterContent.content.push(contentArray);

        yield put(receiveInputFieldChanged(filterContent));
      } else if (action.payload.value === "LOCATION ID") {
        const locations = yield select(userLocationSelector);

        filterContent.area = action.payload.area;
        filterContent.type = action.payload.value;
        const lang = localStorage.getItem("lang") || "en";

        const dropdownItems = [];
        locations.length > 0 &&
          locations.forEach(item => {
            dropdownItems.push({
              value: item.englishText,
              displayName: lang === "ar" ? item.arabicText : item.englishText
            });
          });

        filterContent.content.push([...dropdownItems]);

        yield put(receiveInputFieldChanged(filterContent));
      }
    } else {
      yield put(receiveInputFieldChanged(action.payload));
    }
  } catch (e) {
    yield put({ type: RECEIVE_INPUT_FIELD_CHANGED_FAILED });
    console.error("---- input field changed error:", e);
  }
}
// function fillJobId() {
//   try {
//      const totalJobs = yield select(jobsPagingSelector);
//
//     let  pageData = { pageNo: 1, pageSize };
//     const res = yield call(Api, {
//       url: url.job.getActive,
//       method: "POST",
//       isJwtRequired: true,
//       data: pageData
//     });
//   } catch (e) {
//     console.log(e);
//   }
// }
export function* callPageChanged(action) {
  try {
    let { area, page } = action.payload;
    let pageNum = parseInt(page);
    let nextPage;
    if (area === "jobQueue") {
      // todo: action history, filtering, etc..
      const { currentPage, pageSize } = yield select(jobsPagingSelector);
      if (page === "Next Page" || page === "...") {
        nextPage = currentPage + 1;
      } else if (page === "Previous") {
        nextPage = currentPage - 1;
      } else {
        if (isNumber(pageNum)) {
          nextPage = pageNum;
        } else {
          throw "page is not a number";
        }
      }
      const JobTypeFilter = yield select(setJobTypeFilter);  
      JobTypeFilter
        ? yield put(
            requestShowJobFilteredData({
              key: "",
              value: "",
              pageNo: nextPage,
              pageSize: pageSize,
              JobTypeFilter: JobTypeFilter
            })
          )
        : yield put(requestActiveJobs({ pageNo: nextPage, pageSize }));
    } else if (area === "AuditLog") {
      // todo: action history, filtering, etc..
      const { currentPage, pageSize } = yield select(auditPagingSelector);
      if (page === "Next Page" || page === "...") {
        nextPage = currentPage + 1;
      } else if (page === "Previous") {
        nextPage = currentPage - 1;
      } else {
        if (isNumber(pageNum)) {
          nextPage = pageNum;
        } else {
          throw "page is not a number";
        }
      }

      const auditlogFilter = yield select(jobAuditLogFilterSelector);
      const jobAuditLogSort = yield select(jobAuditLogSortSelector);
      auditlogFilter
        ? yield put(
            requrstAuditLogSort(
              jobAuditLogSort.column,
              jobAuditLogSort.type,
              nextPage
            )
          )
        : jobAuditLogSort.column !== ""
          ? yield put(
              requrstAuditLogSort(
                jobAuditLogSort.column,
                jobAuditLogSort.type,
                nextPage
              )
            )
          : yield put(requestShowAuditLog("", "", "", "", nextPage));
    } //
  } catch (e) {
    yield put(requestPageChangedFailed());
    console.error("---- page changed error:", e);
  }
}

export function* callRequestTableRowClicked(action) {
  try {
    const { area, dataId, status } = action.payload;

    yield put(receiveTableRowClicked(action.payload));

    if (area === "jobQueue") {
      // if row clicked in jobQueue, perform async task to get action history
      yield put(requestActionHistory(dataId));
      yield put(requestCloseActionFilter());
    }
  } catch (e) {
    yield put(requestTableRowClickedFailed());
    console.error("---- input field changed error:", e);
  }
}
