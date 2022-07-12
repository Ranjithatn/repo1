// requestShowAuditLog
import {
  REQUEST_SHOW_AUDITLOG,
  REQUEST_SHOW_AUDITLOG_SUCCESS,
  REQUEST_AUDITLOG_PAGES,
  REQUEST_JOB_AUDIT_LOGS,
  REQUEST_JOB_AUDIT_LOGS_SUCESS,
  REQUEST_SET_AUDIT_LOGS_FILTER,
  REQUEST_RESET_AUDIT_LOGS_FILTER,
  REQUEST_AUDIT_LOG_SORT,
  REQUEST_SET_AUDIT_LOG_SORT,
  REQUEST_RESET_AUDIT_LOG_SORT
} from "./actionTypes";

export const requestShowAuditLog = (id, status, startDate, endDate, Pages) => {
  const data = {
    jobID: id,
    jobStatus: status,
    jobStartDate: startDate,
    jobEndDate: endDate,
    PageDetails: Pages
  };

  return {
    type: REQUEST_SHOW_AUDITLOG,
    payload: data
  };
};
export const requestOpenAudiLogSuccess = AuditlogData => ({
  type: REQUEST_SHOW_AUDITLOG_SUCCESS,
  payload: AuditlogData
});

type pageSettings = {
  pageNo: number | string
};

// export const requestAuditLogPages = (payload: ?pageSettings) => {
//   type: REQUEST_AUDITLOG_PAGES;
// };

export const requestJobAuditLogs = JobID => ({
  type: REQUEST_JOB_AUDIT_LOGS,
  payload: JobID
});

export const requestJobAuditLogsSucess = LogDetails => ({
  type: REQUEST_JOB_AUDIT_LOGS_SUCESS,
  payload: LogDetails
});
export const requestResetAditlogFilter = () => ({
  type: REQUEST_RESET_AUDIT_LOGS_FILTER
});

export const requestSetAuditLogFilter = (id, status, startDate, endDate, Pages) => {
  const data = {
    jobID: id,
    jobStatus: status,
    jobStartDate: startDate,
    jobEndDate: endDate,
    PageDetails: Pages
  };

  return {
    type: REQUEST_SET_AUDIT_LOGS_FILTER,
    payload: data
  };
};
export const requrstAuditLogSort = (column, type,page) => {
  const data = {
    column: column,
    type: type,
    page:page
  
  };

  return {
    type: REQUEST_AUDIT_LOG_SORT,
    payload: data
  };
};
export const requestSetAuditlogSort = (column, type,) => {
  const data = {
    column: column,
    type: type
  
  };

  return {
    type: REQUEST_SET_AUDIT_LOG_SORT,
    payload: data
  };
};
export const requestResetAuditlogSort = () => ({
 
    type: REQUEST_RESET_AUDIT_LOG_SORT
 
});
