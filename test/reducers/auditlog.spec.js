import auditlogs from "../../app/reducers/auditlog";
import { REQUEST_SHOW_AUDITLOG_SUCCESS } from "../../app/actions/actionTypes";
import {} from "../../app/actions/global";
import {
  requestOpenAudiLogSuccess,
  requestJobAuditLogsSucess
} from "../../app/actions/auditlog";
// import { requestLogoutSuccess } from "../../app/actions/auth";
// import { requestHideModal } from "../../app/actions/modal";

describe("Audit Log reducer", () => {
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
    filter: {
      end: "",
      start: "",
      status: ""
    },
    sort:{column:"",type:""}
  };
  it("should have an initial state", () => {
    const output = auditlogs();
    const expected = { ...initialState };
    expect(output).toEqual(expected);
  });

  xit("should handle REQUEST_SHOW_AUDITLOG_SUCCESS", () => {
    const action = requestOpenAudiLogSuccess({
      currentPage: 1,
      totalCount: 1,
      results: [
        {
          id: "1",
          documentType: null,
          type: "Tenprint",
          terminalID: "Maanas",
          siteID: "",
          liftNo: "",
          suffixNo: "",
          isActive: true,
          jobBinReferenceID: "",
          jobTextReferenceID: "",
          status: "New",
          createdBy: "Admin",
          modifiedBy: "",
          createdOn: "17‏/09‏/1439 12:47:05 م",
          modifiedOn: "17‏/09‏/1439 12:47:05 م",
          casReference: 0
        }
      ],
      totalPages: 1,
      pages: [1],
      maxPages: 11,
      StausObject: [
        {
          value: "New",
          displayName: "New"
        }
      ],
      crimeTypeObject: [{}]
    });
    const output = auditlogs(initialState, action);
    const expected = {
      ...initialState,
      auditlogPaging: {
        currentPage: 1,
        totalPages: 1,
        maxPages: 11,
        totalCount: 1,
        pages: [1],
        pageSize: 10
      },
      StausObject: [{ displayName: "New", value: "New" }],
      auditLogIdList: ["1"],
      auditLogById: {
        1: {
          casReference: 0,
          createdBy: "Admin",
          createdOn: "17‏/09‏/1439 12:47:05 م",
          documentType: null,
          id: "1",
          isActive: true,
          jobBinReferenceID: "",
          jobTextReferenceID: "",
          liftNo: "",
          modifiedBy: "",
          modifiedOn: "17‏/09‏/1439 12:47:05 م",
          siteID: "",
          status: "New",
          suffixNo: "",
          terminalID: "Maanas",
          type: "Tenprint"
        }
      },
      crimeTypeObject: [{}]
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_JOB_AUDIT_LOGS_SUCESS", () => {
    const action = requestJobAuditLogsSucess([
      {
        action: "Create Job",
        changeDescription: "Job Type [Tenprint] created.",
        terminalID: "Maanas",
        changedBy: null,
        createdOn: "17‏/09‏/1439 12:47:05 م"
      }
    ]);
    const output = auditlogs(initialState, action);
    const expected = {
      ...initialState,
      JobAuditLogDetails: [
        {
          action: "Create Job",
          changeDescription: "Job Type [Tenprint] created.",
          terminalID: "Maanas",
          changedBy: null,
          createdOn: "17‏/09‏/1439 12:47:05 م"
        }
      ]
    };
    expect(output).toEqual(expected);
  });
});
