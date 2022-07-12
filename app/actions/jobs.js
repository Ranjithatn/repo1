// @flow
import {
  REQUEST_ACTIVE_JOBS,
  REQUEST_ACTIVE_JOBS_SUCCESS,
  REQUEST_ACTIVE_JOBS_FAILED,
  REQUEST_ADD_JOB_FIELD_CHANGED,
  REQUEST_CREATE_JOB,
  REQUEST_CREATE_JOB_SUCCESS,
  REQUEST_CREATE_JOB_FAILED,
  REQUEST_ACTION_HISTORY,
  REQUEST_ACTION_HISTORY_SUCCESS,
  REQUEST_ACTION_HISTORY_FAILED,
  REQUEST_REMOVE_JOB,
  REQUEST_REMOVE_JOB_SUCCESS,
  REQUEST_REMOVE_JOB_FAILED,
  REQUEST_NEW_ACTION,
  REQUEST_NEW_ACTION_SUCCESS,
  REQUEST_NEW_ACTION_FAILED,
  REQUEST_SUBMIT_PRINTS,
  REQUEST_SUBMIT_PRINTS_SUCCESS,
  REQUEST_SUBMIT_PRINTS_FAILED,
  REQUEST_REMOVE_FILTER,
  REQUEST_SHOW_FILTERED_DATA,
  REQUEST_ASC_SORT,
  REQUEST_HISTORY_SORT,
  REQUEST_ACTION_SUCCESS,
  REQUEST_OPEN_JOB,
  REQUEST_SHOW_JOB_FILTERED_DATA,
  SET_JOB_TYPE_FILTER_APPLIED,
  REQUEST_SAVE_CARD_SCAN_BOXES,
  REQUEST_CLOSE_FILTER,
  REQUEST_CLOSE_FILTER_SUCCESS,
  REQUEST_CLOSE_ACTION_FILTER,
  REQUEST_CLOSE_ACTION_FILTER_SUCCESS,
  REQUEST_FILTERED_ACTIVE_JOBS_SUCCESS,
  REQUEST_JOB_AUDIT_LOGS,
  REQUEST_JOB_AUDIT_LOGS_SUCESS,
  REQUEST_SET_BIOMETRICS_DETAILS,
  REQUEST_UPDATE_JOB,
  REQUEST_UPDATE_JOB_SUCCESS,
  REQUEST_UPDATE_JOB_FAILED,
  REQUEST_CLEAR_LATENT_EDITOR_DATA,
  REQUEST_SAVE_ANNOTATIONS,
  REQUEST_SET_CIVIL_SEARCH,
  REQUEST_SET_NEW_CRIME_TYPE_SUCCESS,
  REQUEST_SET_PAGE,
  RESET_ACTION_TYPE,
  REQUEST_START_SCAN_TYPE,
  REQUEST_START_PRINT,
  REQUEST_STOP_PRINT,
  REQUEST_CLEAR_TRANSACTION_HISTORY,
  REQUEST_WILDCARD_SEARCH,
  REQUEST_SET_WILDCARD_SEARCH,
  REQUEST_SET_WILDCARD_ACTION_SEARCH,
  REQUEST_SAVE_ANNOTATIONS_CUSTOM,
  REQUEST_RESET_PALMSCAN_ANNOTATIONS,
  REQUEST_SYSTEM_PERMISSION_ERROR,
  REQUEST_SYSTEM_PERMISSION_SUCCESS,
  REQUEST_SYSTEM_PERMISSION,
  REQUEST_ACTION_START
} from "./actionTypes";


type Person = {
  name: string,
  gender: string,
  nationality: string,
  dob: string,
  memo: string
};

type Job = {
  id: string, // required for createJob
  number: string, //required for createJob
  type?: string,
  terminalId?: string,
  siteID?: ?string,
  liftNo?: ?string,
  crimeType?: string,
  person?: Person,
  status?: string,
  isActive?: boolean,
  history?: ?string,
  createdOn?: string,
  modifiedOn?: string
};

type Jobs = {
  currentPage: number,
  results: Array<Job>,
  totalCount: number
};

const defaultPageSettings = { pageNo: 1, pageSize: 3 };
type PageSettings = {
  pageNo: number | string,
  pageSize: number
};

export const requestActiveJobs = (payload: ?PageSettings) => {
  let returned = {
    type: REQUEST_ACTIVE_JOBS
  };
  if (payload) {
    returned["payload"] = payload;
  }
  return returned;
};

export const requestActiveJobsSuccess = jobs => ({
  type: REQUEST_ACTIVE_JOBS_SUCCESS,
  payload: jobs
});

export const requestFilteredActiveJobsSuccess = jobs => ({
  type: REQUEST_FILTERED_ACTIVE_JOBS_SUCCESS,
  payload: jobs
});
// type historyDetails = {
//   jobsdata: any,
//   rowdata: string,
//   sorttype: string,
//   formatMessage:any
// };
export const requestHistorySort = historyDetails => ({
  type: REQUEST_HISTORY_SORT,
  payload: historyDetails
});

// type Job_Details = {
//   jobID: String | Number,
//   jobStatus: String,
//   jobType: String,
// };

export const requestOpenJob = Job_Details => ({
  type: REQUEST_OPEN_JOB,
  payload: Job_Details
});

type SortData = {
  jobsdata: any,
  rowdata: string,
  sorttype: string,
  formatMessage:any
};
export const requestAscSort = SortData => ({
  type: REQUEST_ASC_SORT,
  payload: SortData
});

export const requestActiveJobsFailed = () => ({
  type: REQUEST_ACTIVE_JOBS_FAILED
});

type NewJob = {
  transactionType: string,
  number: string | number
};
// saga will select data for payload to api
export const requestCreateJob = (newJob: NewJob) => ({
  type: REQUEST_CREATE_JOB,
  payload: newJob
});

export const requestCreateJobSuccess = jobId => ({
  type: REQUEST_CREATE_JOB_SUCCESS,
  payload: jobId
});

export const requestActionSuccess = actionId => ({
  type: REQUEST_ACTION_SUCCESS,
  payload: actionId
});

export const requestCreateJobFailed = () => ({
  type: REQUEST_CREATE_JOB_FAILED
});

export const requestActionHistory = (jobId: ?string) => ({
  type: REQUEST_ACTION_HISTORY,
  payload: jobId
});

type Action = {
  id: string,
  jobID: string,
  actionType: string,
  status: string,
  tcn: ?string,
  createdOn: string
};
type ActionHistory = {
  totalPages: ?number,
  pages: Array<number>,
  maxPages: ?number,
  currentPage: ?number,
  totalCount: ?number,
  results: Array<Action>
};
export const requestActionHistorySuccess = (actionHistory: ActionHistory) => ({
  type: REQUEST_ACTION_HISTORY_SUCCESS,
  payload: actionHistory
});

export const requestActionHistoryFailed = () => ({
  type: REQUEST_ACTION_HISTORY_FAILED
});

export const requestRemoveJob = (jobId: number) => ({
  type: REQUEST_REMOVE_JOB,
  payload: jobId
});

export const requestRemoveJobSuccess = jobId => ({
  type: REQUEST_REMOVE_JOB_SUCCESS,
  payload: jobId
});

export const requestRemoveJobFailed = () => ({
  type: REQUEST_REMOVE_JOB_FAILED
});

type NewActionRequest = {
  newAction: any | Array,
  job: number | string,
  username: string
};
type FilterData = {
  key: string,
  value: string
};
export const requestShowFilteredData = (payload: FilterData) => ({
  type: REQUEST_SHOW_FILTERED_DATA,
  payload
});
type JobFilterData = {
  key: string,
  value: string
};
export const requestShowJobFilteredData = (payload: JobFilterData) => ({
  type: REQUEST_SHOW_JOB_FILTERED_DATA,
  payload
});
export const requestNewAction = (payload: NewActionRequest) => ({
  type: REQUEST_NEW_ACTION,
  payload
});

export const requestNewActionSuccess = (id: number | string) => ({
  type: REQUEST_NEW_ACTION_SUCCESS,
  payload: id
});

export const requestNewActionFailed = () => ({
  type: REQUEST_NEW_ACTION_FAILED
});

type BoxData = {
  imageDimensions: Array<number>,
  boxes: any
};
export const requestSaveCardScanBoxes = (data: BoxData) => ({
  type: REQUEST_SAVE_CARD_SCAN_BOXES,
  payload: data
});

export const requestClearLatentEditorData = () => ({
  type: REQUEST_CLEAR_LATENT_EDITOR_DATA
});

export const requestSubmitPrints = () => ({
  type: REQUEST_SUBMIT_PRINTS
});

export const requestSubmitPrintsSuccess = () => ({
  type: REQUEST_SUBMIT_PRINTS_SUCCESS
});

export const requestSubmitPrintsFailed = () => ({
  type: REQUEST_SUBMIT_PRINTS_FAILED
});

export const requestRemoveFilter = () => ({
  type: REQUEST_REMOVE_FILTER
});
// yield put(setJobTypeFilter({value: true}));

export const setJobTypeFilter = payload => ({
  type: SET_JOB_TYPE_FILTER_APPLIED,
  payload
});

export const requestCloseFilter = () => ({
  type: REQUEST_CLOSE_FILTER
});
export const requestCloseFilterSucess = () => ({
  type: REQUEST_CLOSE_FILTER_SUCCESS
});

export const requestCloseActionFilter = () => ({
  type: REQUEST_CLOSE_ACTION_FILTER
});
export const requestCloseActionFilterSucess = () => ({
  type: REQUEST_CLOSE_ACTION_FILTER_SUCCESS
});

export const requestJobAuditLogs = JobID => ({
  type: REQUEST_JOB_AUDIT_LOGS,
  payload: JobID
});

export const requestJobAuditLogsSucess = LogDetails => ({
  type: REQUEST_JOB_AUDIT_LOGS_SUCESS,
  payload: LogDetails
});

export const requestUpdateBiometricDetails = (BiometricDetails) => ({
  type: REQUEST_SET_BIOMETRICS_DETAILS,
  payload: BiometricDetails
});
// export const setJobTypeFilter = (isJobTypeFilterApplied) => {
//   debugger;
//   return {
//     type: SET_JOB_TYPE_FILTER_APPLIED,
//     selectedFilterValue
//   }
// }

export const requestUpdateJob = (id: number) => ({
  type: REQUEST_UPDATE_JOB,
  payload: id
});

export const requestUpdateJobSuccess = () => ({
  type: REQUEST_UPDATE_JOB_SUCCESS
});

export const requestUpdateJobFailed = () => ({
  type: REQUEST_UPDATE_JOB_FAILED
});
export const requestSetCivilSearch = (data) => ({
  type: REQUEST_SET_CIVIL_SEARCH,
  payload:data
});
export const requestSetNewCrimeTypeSuccess = (data) => ({
  type: REQUEST_SET_NEW_CRIME_TYPE_SUCCESS,
  payload:data
});
export const requestSetpage = (data) => ({
  type: REQUEST_SET_PAGE,
  payload:data
});
export const requestWildcardSearch = () => ({
  type: REQUEST_WILDCARD_SEARCH
});
export const requestSetWildcardSearch = (data) => ({
  type: REQUEST_SET_WILDCARD_SEARCH,
  payload:data
});
export const requestSetWildcardActionSearch = (data) => ({
  type: REQUEST_SET_WILDCARD_ACTION_SEARCH,
  payload:data
});

export const requestSaveAnnotations = (annotations, reducerArea) => ({
  type: REQUEST_SAVE_ANNOTATIONS,
  payload: {
    annotations,
    reducerArea
  }
});
export const resetActionType =() => ({
  type: RESET_ACTION_TYPE
});
export const requestStartScanType =scanType => ({
  type: REQUEST_START_SCAN_TYPE,
  payload:scanType
});
export const requestStartPrint =() => ({
  type: REQUEST_START_PRINT
});
export const requestStopPrint =() => ({
  type: REQUEST_STOP_PRINT
});
export const requestClearTransactionHistory =() => ({
  type: REQUEST_CLEAR_TRANSACTION_HISTORY
});

export const requestSaveAnnotationsCustom = (data) => ({
  type: REQUEST_SAVE_ANNOTATIONS_CUSTOM,
  payload: data
});


export const requestResetPalmscanAnnotations =() => ({
  type: REQUEST_RESET_PALMSCAN_ANNOTATIONS
});

/**
 * new permistion api actions
 */
export const requestSystemPermissions = () =>{
  console.log("requestSystemPermissions called.");
  return  ({
    type: REQUEST_SYSTEM_PERMISSION
  })
};
export const requestSystemPermissionsSuccess = (menuPerm) => ({
  type: REQUEST_SYSTEM_PERMISSION_SUCCESS,
  payload:{
    // service_perm:servicePerm,
    menu_perm: menuPerm
  }
});
export const requestSystemPermissionsFailed = () => ({
  type: REQUEST_SYSTEM_PERMISSION_ERROR
});
export const requestActionStart = (val) => ({
  type: REQUEST_ACTION_START,
  payload:val
});


