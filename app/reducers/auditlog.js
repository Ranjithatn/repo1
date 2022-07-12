import {
  REQUEST_SHOW_AUDITLOG_SUCCESS,
  REQUEST_AUDITLOG_PAGES,
  REQUEST_JOB_AUDIT_LOGS_SUCESS,
  REQUEST_SET_AUDIT_LOGS_FILTER,
  REQUEST_RESET_AUDIT_LOGS_FILTER,
  REQUEST_SET_AUDIT_LOG_SORT,
  REQUEST_RESET_AUDIT_LOG_SORT
} from "../actions/actionTypes";
const initialState = {
  auditlogPaging: {
    maxPages: undefined,
    pageSize: 10, // not from server. how many to display per page. need ui control. perhaps add a dropdown
    currentPage: 1,
    totalPages: undefined,
    totalCount: undefined,
    pages: undefined
  },
  auditLogIdList: [],
  auditLogById: {},
  JobAuditLogDetails: {},
  filter: { start: "", end: "", status: "" },
  sort: { column: "", type: "" }
};

export default function auditlogs(state = initialState, action = {}) {
  switch (action.type) {
    case REQUEST_SHOW_AUDITLOG_SUCCESS:
      return getAuditLogsById(state, action);

    case REQUEST_JOB_AUDIT_LOGS_SUCESS:
      return { ...state, JobAuditLogDetails: action.payload };
    case REQUEST_SET_AUDIT_LOG_SORT:
      return {
        ...state,
        sort: { column: action.payload.column, type: action.payload.type }
      };
    case REQUEST_RESET_AUDIT_LOG_SORT:
      return { ...state, sort: { column: "", type: "" } };
    case REQUEST_SET_AUDIT_LOGS_FILTER:
      return {
        ...state,
        filter: {
          start: action.payload.jobStartDate,
          end: action.payload.jobEndDate,
          status: action.payload.jobStatus
        }
      };
    case REQUEST_RESET_AUDIT_LOGS_FILTER:
      return {
        ...state,
        filter: {
          start: "",
          end: "",
          status: ""
        }
      };

    default:
      return state;
  }
}
const getAuditLogsById = (state, action) => {
  const {
    results,
    currentPage,
    totalPages,
    maxPages,
    totalCount,
    pages,
    StausObject,
    crimeTypeObject
  } = action.payload;

  const { auditLogIdList, auditLogById } = state;
  let newauditLogById = {};
  const auditlogPaging = {
    currentPage,
    totalPages,
    maxPages,
    totalCount,
    pages,
    pageSize: 10
  };
  let newAuditLogList = {};
  if (results && results !== "" && results !== undefined) {
    newAuditLogList = results.map(audit => {
      newauditLogById[audit.id] = audit;
      return audit.id;
    });

    if (compareJobs(results, auditLogById)) {
      return {
        ...state,
        auditlogPaging,
        auditLogIdList: newAuditLogList,
        auditLogById: results
      };
    } else {
      return {
        ...state,
        auditLogIdList: newAuditLogList,
        auditLogById: results,
        auditlogPaging,
        StausObject,
        crimeTypeObject
      };
    }
  } else {
    return {
      ...state,
      auditLogIdList: newAuditLogList,
      auditLogById: results,
      auditlogPaging,
      StausObject,
      crimeTypeObject
    };
  }
};

export function compareJobs(newJobs, oldJobs) {
  // newJobs is an array from the server, oldJobs is an object of jobs by id
  // returns true if oldJobs === newJobs

  if (oldJobs === null || Object.keys(oldJobs).length === 0) return false;
  for (let i = 0; i < newJobs.length; i++) {
    let newJob = newJobs[i];
    let newJobId = newJob.id;
    let existingJob = oldJobs[newJobId];
    if (!existingJob) return false;
    let newJobModifiedOn = newJob.modifiedOn;
    let existingJobModifiedOn = existingJob.modifiedOn;
    if (existingJobModifiedOn !== newJobModifiedOn) return false;
  }
  return true;
}
