import {
  requestShowAuditLog,
  requestOpenAudiLogSuccess,
  requestAuditLogPages,
  requestJobAuditLogs,
  requestJobAuditLogsSucess,
  requestResetAditlogFilter,
  requestSetAuditLogFilter 
} from "../../app/actions/auditlog";
import {
  REQUEST_SHOW_AUDITLOG,
  REQUEST_SHOW_AUDITLOG_SUCCESS,
  REQUEST_AUDITLOG_PAGES,
  REQUEST_JOB_AUDIT_LOGS,
  REQUEST_JOB_AUDIT_LOGS_SUCESS,
  REQUEST_RESET_AUDIT_LOGS_FILTER,
  REQUEST_SET_AUDIT_LOGS_FILTER
} from "../../app/actions/actionTypes";

describe("AuditLog Actions", () => {
  it("should create requestShowAuditLog actions", () => {
    const data = {
      jobID: 1,
      jobStatus: "New",
      jobStartDate: "12-04-2018",
      jobEndDate: "14-04-2018",
      PageDetails: 1
    };
    const output = requestShowAuditLog(1, "New", "12-04-2018", "14-04-2018", 1);
    const expected = {
      type: REQUEST_SHOW_AUDITLOG,
      payload: data
    };
    expect(output).toEqual(expected);
  });
  it("should create requestOpenAudiLogSuccess actions", () => {
    const data = {
      jobID: 1,
      jobStatus: "New",
      jobStartDate: "12-04-2018",
      jobEndDate: "14-04-2018",
      PageDetails: 1
    };
    const output = requestOpenAudiLogSuccess(data);
    const expected = {
      type: REQUEST_SHOW_AUDITLOG_SUCCESS,
      payload: data
    };
    expect(output).toEqual(expected);
  });
  xit("should create requestAuditLogPages actions", () => {
      const pageSettings = {
        pageNo: 1
      };
    const output = requestAuditLogPages({payload:pageSettings});
    const expected = {
      type: REQUEST_AUDITLOG_PAGES
    };
    expect(output).toEqual(expected);
  });
  it("should create requestJobAuditLogs actions", () => {
    const output = requestJobAuditLogs(1);
    const expected = {
      type: REQUEST_JOB_AUDIT_LOGS,
      payload: 1
    };
    expect(output).toEqual(expected);
  });
  it("should create requestJobAuditLogsSucess actions", () => {
    const output = requestJobAuditLogsSucess("LogDetails");
    const expected = {
      type: REQUEST_JOB_AUDIT_LOGS_SUCESS,
      payload: "LogDetails"
    };
    expect(output).toEqual(expected);
  });
  it("should create requestSetAuditLogFilter actions", () => {
    const output = requestSetAuditLogFilter(1,"LogDetails","data","data",1);
    const data = {
      jobID: 1,
      jobStatus: "LogDetails",
      jobStartDate: "data",
      jobEndDate: "data",
      PageDetails: 1
    };
    const expected = {
      type: REQUEST_SET_AUDIT_LOGS_FILTER,
      payload: data
    };
    expect(output).toEqual(expected);
  });
  it("should create requestResetAditlogFilter  actions", () => {
    const output = requestResetAditlogFilter ();
    const expected = {
      type: REQUEST_RESET_AUDIT_LOGS_FILTER
    };
    expect(output).toEqual(expected);
  });
});
