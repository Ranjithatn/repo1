import { call, put, takeLatest, select, takeEvery } from "redux-saga/effects";
import Api, { url } from "../api/";
import { push } from "react-router-redux";
import { startSpinner, stopSpinner } from "../actions/spinner";
import { requestShowNotification } from "../actions/notifications";
import { requestActiveJobs } from "../actions/jobs";
import {
  REQUEST_UPDATE_SEARCH_TEXT,
  REQUEST_UPDATE_SEARCH_TEXT_SUCCESS,
  REQUEST_GET_JOB_SEARCH_TEXT
} from "../actions/actionTypes";
import { requestGetJobSearchTextSuccess } from "../actions/customSearch";
import { CUSTOM_SEARCH_MODAL } from "../components/Modal/ModalRoot";
import { customSearchDataSelector } from "../selectors/customSearch";
import { selectedJobSelector } from "../selectors/jobs";
import { requestShowModal } from "../actions/modal";
import { translateRes, translate } from "../utils/intl";
export function* watchUpdateSearchText() {
  yield takeLatest(REQUEST_UPDATE_SEARCH_TEXT, callRequestUpdateSearchText);
}
export function* watchRequestSearchText() {
  yield takeLatest(REQUEST_GET_JOB_SEARCH_TEXT, callRequestSearchText);
}

export function* callRequestSearchText(action) {
  try {
    const { payload: jobnum } = action;

    const res = yield call(Api, {
      url: url.job.getSearchTexts,
      method: "POST",
      isJwtRequired: true,
      data: jobnum
    });
    if (res) {
      yield put(requestGetJobSearchTextSuccess(res));
    }
  } catch (e) {
    console.log("Call Request Search Text Failed", e);
  }
}

export function* callRequestUpdateSearchText() {
  try {
    let searchData = yield select(customSearchDataSelector);
    const jobnum = yield select(selectedJobSelector);


    if (searchData.SAMISID !== "") {
    if (searchData.SAMISID.length <= 8) {
      yield put(
        requestShowNotification({
          message: "SAMIS ID must be of length 9 or more",
          type: "is-danger"
        })
      );
      return;
    }
  }

    let searchPayloadData = [];
    searchData.SAMISID !== ""
      ? searchPayloadData.push({
          key: "SAMISID",
          value: searchData.SAMISID
        })
      : "";
    searchData.fileNo !== ""
      ? searchPayloadData.push({
          key: "File Number",
          value: searchData.fileNo
        })
      : "";
      searchData.latentID !== "" && searchData.latentID !== undefined
      ? searchPayloadData.push({
          key: "LatentID",
          value: searchData.latentID
        })
      : "";

    const searchTextData = {
      jobID: jobnum,
      searchTexts: searchPayloadData
    };

    const res = yield call(Api, {
      url: url.job.updateSearchTexts,
      method: "POST",
      isJwtRequired: true,
      data: searchTextData
    });

    if (res) {
      if (res.error) {
        yield put(
          requestShowNotification({
            message: res.error.key,
            type: "is-danger"
          })
        );
      }

      if (res.message) {
        yield put(
          requestShowNotification({
            message: translateRes(res.message),
            type: "is-success"
          })
        );
        yield put(requestShowModal({ modalType: CUSTOM_SEARCH_MODAL }));
        yield put(requestActiveJobs());
        yield put(push("/authenticated/jobqueue"));
      }

      // yield put(
      //   requestShowNotification({
      //     message: res.result,
      //     type: "is-success"
      //   })
      // );
      // yield put(requestShowModal({ modalType: CUSTOM_SEARCH_MODAL }));
      // yield put(requestActiveJobs());
    } else {
      yield put(
        requestShowNotification({
          message: translate("Search Text Save Error"),
          type: "is-danger"
        })
      );
    }
  } catch (e) {
    console.log("Could not Update search text", e);
  }
}
