import {
  requestActiveJobs,
  requestActiveJobsSuccess,
  requestActiveJobsFailed,
  requestCreateJob,
  requestCreateJobSuccess,
  requestCreateJobFailed,
  requestActionHistory,
  requestActionHistorySuccess,
  requestActionHistoryFailed,
  requestSubmitPrints,
  requestSubmitPrintsSuccess,
  requestSubmitPrintsFailed,
  requestNewAction,
  requestNewActionSuccess,
  requestNewActionFailed,
  requestRemoveJob,
  requestRemoveJobSuccess,
  requestRemoveJobFailed,
  requestFilteredActiveJobsSuccess,
  requestHistorySort,
  requestOpenJob,
  requestActionSuccess,
  requestShowFilteredData,
  requestCloseActionFilterSucess,
  requestCloseActionFilter,
  requestCloseFilterSucess,
  requestCloseFilter,
  setJobTypeFilter,
  requestShowJobFilteredData,
  requestSaveCardScanBoxes,
  requestAscSort,
  requestJobAuditLogs,
  requestJobAuditLogsSucess,
  requestUpdateBiometricDetails,
  requestUpdateJob,
  requestUpdateJobSuccess,
  requestUpdateJobFailed,
  requestSaveAnnotations,
  requestClearLatentEditorData,
  requestSetCivilSearch,
  requestSetNewCrimeTypeSuccess,
  resetActionType,
  requestSetpage,
  requestStartScanType
 
} from "../../app/actions/jobs";
import {
  REQUEST_START_SCAN_TYPE,
  REQUEST_ACTIVE_JOBS,
  REQUEST_ACTIVE_JOBS_SUCCESS,
  REQUEST_ACTIVE_JOBS_FAILED,
  REQUEST_CREATE_JOB,
  REQUEST_CREATE_JOB_SUCCESS,
  REQUEST_CREATE_JOB_FAILED,
  REQUEST_ACTION_HISTORY,
  REQUEST_ACTION_HISTORY_SUCCESS,
  REQUEST_ACTION_HISTORY_FAILED,
  REQUEST_SUBMIT_PRINTS,
  REQUEST_SUBMIT_PRINTS_SUCCESS,
  REQUEST_SUBMIT_PRINTS_FAILED,
  REQUEST_NEW_ACTION,
  REQUEST_NEW_ACTION_SUCCESS,
  REQUEST_NEW_ACTION_FAILED,
  REQUEST_REMOVE_JOB,
  REQUEST_REMOVE_JOB_SUCCESS,
  REQUEST_REMOVE_JOB_FAILED,
  REQUEST_FILTERED_ACTIVE_JOBS_SUCCESS,
  REQUEST_HISTORY_SORT,
  REQUEST_OPEN_JOB,
  REQUEST_CLEAR_LATENT_EDITOR_DATA,
  REQUEST_ACTION_SUCCESS,
  REQUEST_SHOW_FILTERED_DATA,
  REQUEST_ASC_SORT,
  REQUEST_SHOW_JOB_FILTERED_DATA,
  SET_JOB_TYPE_FILTER_APPLIED,
  REQUEST_CLOSE_FILTER,
  REQUEST_CLOSE_FILTER_SUCCESS,
  REQUEST_CLOSE_ACTION_FILTER,
  REQUEST_CLOSE_ACTION_FILTER_SUCCESS,
  REQUEST_SAVE_CARD_SCAN_BOXES,
  REQUEST_SET_CIVIL_SEARCH, 
  REQUEST_SET_BIOMETRICS_DETAILS,
  REQUEST_UPDATE_JOB,
  REQUEST_UPDATE_JOB_SUCCESS,
  REQUEST_UPDATE_JOB_FAILED,
  REQUEST_JOB_AUDIT_LOGS,
  REQUEST_JOB_AUDIT_LOGS_SUCESS,
  REQUEST_SAVE_ANNOTATIONS,
  REQUEST_SET_NEW_CRIME_TYPE_SUCCESS,
  RESET_ACTION_TYPE,
  REQUEST_SET_PAGE
} from "../../app/actions/actionTypes";
describe("requestUpdateJobFailed", () => {
  let output;
  let expected;
  it("should create requestUrequestUpdateJobFailedpdateJobSuccess action", () => {
  
    output = requestUpdateJobFailed();
    expected = {
      type: REQUEST_UPDATE_JOB_FAILED
    };
    expect(output).toEqual(expected);
  });
});
describe("requestUpdateJobSuccess", () => {
  let output;
  let expected;
  it("should create requestUpdateJobSuccess action", () => {
  
    output = requestUpdateJobSuccess();
    expected = {
      type: REQUEST_UPDATE_JOB_SUCCESS
    };
    expect(output).toEqual(expected);
  });
});
describe("requestUpdateJob", () => {
  let output;
  let expected;
  it("should create requestUpdateJob action", () => {
    const payload = 1
    output = requestUpdateJob(1);
    expected = {
      type: REQUEST_UPDATE_JOB,
      payload: 1
    };
    expect(output).toEqual(expected);
  });
});
describe("jobs actions", () => {
  const defaultPageSettings = { pageNo: 1, pageSize: 10 };
  let output;
  let expected;
  describe("requestActiveJobs", () => {
    xit("should create requestJobAuditLogs action", () => {
      output = requestJobAuditLogs(1);
      expected = {
        type: REQUEST_JOB_AUDIT_LOGS,
        payload:1
      };
      expect(output).toEqual(expected);
    });
    it("should create requestActiveJobs action no page settings", () => {
      output = requestActiveJobs();
      expected = {
        type: REQUEST_ACTIVE_JOBS
      };
      expect(output).toEqual(expected);
    });
    it("should create request active jobs action with custom page settings", () => {
      const payload = {
        pageNo: 2,
        pageSize: 20
      };
      output = requestActiveJobs(payload);
      expected = {
        type: REQUEST_ACTIVE_JOBS,
        payload: {
          pageNo: 2,
          pageSize: 20
        }
      };
      expect(output).toEqual(expected);
      expect(output).toMatchSnapshot();
    });
  });
  describe("requestActiveJobSuccess", () => {
    it("should create rquestActiveJobSuccess action", () => {
      const payload = {
        results: [],
        currentPage: 1,
        totalCount: 100
      };
      output = requestActiveJobsSuccess(payload);
      expected = {
        type: REQUEST_ACTIVE_JOBS_SUCCESS,
        payload: {
          results: [],
          currentPage: 1,
          totalCount: 100
        }
      };
      expect(output).toEqual(expected);
    });
  });
  describe("requestJobAuditLogsSucess ", () => {
    xit("should create requestJobAuditLogsSucess action", () => {
      const payload = "sdf";
      output = requestJobAuditLogsSucess (payload);
      expected = {
        type: REQUEST_JOB_AUDIT_LOGS_SUCESS,
        payload: "sdf"
      };
      expect(output).toEqual(expected);
    });
  });
  describe("requestUpdateBiometricDetails  ", () => {
    it("should create requestUpdateBiometricDetails  action", () => {
      const payload = "sdf";
      output = requestUpdateBiometricDetails(payload);
      expected = {
        type: REQUEST_SET_BIOMETRICS_DETAILS,
        payload: "sdf"
      };
      expect(output).toEqual(expected);
    });
  });
  describe("requestActiveJobsFailed", () => {
    it("should create requestActiveJobsFailed action", () => {
      output = requestActiveJobsFailed();
      expected = {
        type: REQUEST_ACTIVE_JOBS_FAILED
      };
      expect(output).toEqual(expected);
    });
  });
  it("should create requestCreateJob actions", () => {
    const output = requestCreateJob();
    const expected = {
      type: REQUEST_CREATE_JOB
    };
    expect(output).toEqual(expected);
  });
  it("should create requestCreateJobSuccess actions", () => {
    const output = requestCreateJobSuccess("1");
    const expected = {
      type: REQUEST_CREATE_JOB_SUCCESS,
      payload: "1"
    };
    expect(output).toEqual(expected);
  });
  it("should create requestCreateJobFailed actions", () => {
    const output = requestCreateJobFailed();
    const expected = {
      type: REQUEST_CREATE_JOB_FAILED
    };
    expect(output).toEqual(expected);
  });
  it("should create requestActionHistory actions", () => {
    const output = requestActionHistory("1");
    const expected = {
      type: REQUEST_ACTION_HISTORY,
      payload: "1"
    };
    expect(output).toEqual(expected);
  });
  it("should create requestActionHistorySuccess actions", () => {
    const mockActionHistory = {
      totalPages: "50",
      pages: [6, 7, 8, 9, 10],
      maxPages: "5",
      currentPage: "6",
      totalCount: 250,
      results: [
        {
          id: "1",
          jobID: "1",
          actionType: "Search Criminal",
          status: "Pending",
          tcn: "TCN0001",
          createdOn: "2018-01-04T10:07:20"
        }
      ]
    };
    const output = requestActionHistorySuccess(mockActionHistory);
    const expected = {
      type: REQUEST_ACTION_HISTORY_SUCCESS,
      payload: {
        totalPages: "50",
        pages: [6, 7, 8, 9, 10],
        maxPages: "5",
        currentPage: "6",
        totalCount: 250,
        results: [
          {
            id: "1",
            jobID: "1",
            actionType: "Search Criminal",
            status: "Pending",
            tcn: "TCN0001",
            createdOn: "2018-01-04T10:07:20"
          }
        ]
      }
    };
    expect(output).toEqual(expected);
  });
  it('should create requestActionHistoryFailed actions', () => {
    const output = requestActionHistoryFailed();
    const expected = {
      type:REQUEST_ACTION_HISTORY_FAILED
    }
    expect(output).toEqual(expected);
   });

   it('should create a requestSubmitPrints action', () => {
     const output = requestSubmitPrints();
     const expected = {
       type: REQUEST_SUBMIT_PRINTS
     }
     expect(output).toEqual(expected);
   })

   it('should create a requestSubmitPrintsSuccess action', () => {
    const output = requestSubmitPrintsSuccess();
    const expected = {
      type: REQUEST_SUBMIT_PRINTS_SUCCESS
    }
    expect(output).toEqual(expected);
  })

  it('should create a requestSubmitPrintsFailed action', () => {
    const output = requestSubmitPrintsFailed();
    const expected = {
      type: REQUEST_SUBMIT_PRINTS_FAILED
    }
    expect(output).toEqual(expected);
  })

  it('should create a requestNewAction action', () => {
    const payload = {
      newAction: "Search Tenprint",
      job: 1,
      username: "username"
    }
    const output = requestNewAction(payload);
    const expected = {
      type: REQUEST_NEW_ACTION,
      payload: {
        newAction: "Search Tenprint",
        job: 1,
        username: "username"
      }
    }
    expect(output).toEqual(expected);
  })

  it('should create a requestNewActionSuccess action', () => {
    const payload = {jobId: 1};
    const output = requestNewActionSuccess(payload);
    const expected = {
      type: REQUEST_NEW_ACTION_SUCCESS,
      payload: { jobId: 1 }
    }
    expect(output).toEqual(expected);
  })

  it('should create a requestNewActionFailed action', () => {
    const output = requestNewActionFailed();
    const expected = {
      type: REQUEST_NEW_ACTION_FAILED,
    }
    expect(output).toEqual(expected);
  })


  it('should create a requestRemoveJob action', () => {
    const output = requestRemoveJob(1);
    const expected = {
      type: REQUEST_REMOVE_JOB,
      payload: 1
    }
    expect(output).toEqual(expected);
  })

  it('should create a requestRemoveJobSuccess action', () => {
    const output = requestRemoveJobSuccess(1);
    const expected = {
      type: REQUEST_REMOVE_JOB_SUCCESS,
      payload: 1
    }
    expect(output).toEqual(expected);
  })

  it('should create a requestRemoveJobFailed action', () => {
    const output = requestRemoveJobFailed();
    const expected = {
      type: REQUEST_REMOVE_JOB_FAILED
    }
    expect(output).toEqual(expected);
  });
  it("should create a requestFilteredActiveJobsSuccess action", () => {
    const data = [];
    const output = requestFilteredActiveJobsSuccess(data);
    const expected = {
      type: REQUEST_FILTERED_ACTIVE_JOBS_SUCCESS,
      payload: []
    };
    expect(output).toEqual(expected);
  });
  it("should create a requestHistorySort action", () => {
    const historyDetails = [];
    const output = requestHistorySort(historyDetails);
    const expected = {
      type: REQUEST_HISTORY_SORT,
      payload: historyDetails
    };
    expect(output).toEqual(expected);
  });
  it("should create a requestOpenJob action", () => {
    const jobDetails = 1;
    const output = requestOpenJob(jobDetails);
    const expected = {
      type: REQUEST_OPEN_JOB,
      payload: jobDetails
    };
    expect(output).toEqual(expected);
  });
  it("should create a requestActionSuccess action", () => {
    const actionID = 1;
    const output = requestActionSuccess(actionID);
    const expected = {
      type: REQUEST_ACTION_SUCCESS,
      payload: actionID
    };
    expect(output).toEqual(expected);
  });
  it("should create a requestShowFilteredData action", () => {
    const filteredData = {
      key: "status",
      value: "completed"
    };
    const output = requestShowFilteredData(filteredData);
    const expected = {
      type: REQUEST_SHOW_FILTERED_DATA,
      payload: filteredData
    };
    expect(output).toEqual(expected);
  });
  it("should create a requestShowJobFilteredData action", () => {
    const filteredData = {
      key: "type",
      value: "tenprint"
    };
    const output = requestShowJobFilteredData(filteredData);
    const expected = {
      type: REQUEST_SHOW_JOB_FILTERED_DATA,
      payload: filteredData
    };
    expect(output).toEqual(expected);
  });
  it("should create a setJobTypeFilter action", () => {
    const output = setJobTypeFilter("filter");
    const expected = {
      type: SET_JOB_TYPE_FILTER_APPLIED,
      payload: "filter"
    };
    expect(output).toEqual(expected);
  });
  it("should create a requestCloseFilter action", () => {
    const output = requestCloseFilter();
    const expected = {
      type: REQUEST_CLOSE_FILTER
    };
    expect(output).toEqual(expected);
  });
  it("should create a requestCloseFilterSucess action", () => {
    const output = requestCloseFilterSucess();
    const expected = {
      type: REQUEST_CLOSE_FILTER_SUCCESS
    };
    expect(output).toEqual(expected);
  });
  it("should create a requestCloseActionFilter action", () => {
    const output = requestCloseActionFilter();
    const expected = {
      type: REQUEST_CLOSE_ACTION_FILTER
    };
    expect(output).toEqual(expected);
  });
  it("should create a requestCloseActionFilterSucess action", () => {
    const output = requestCloseActionFilterSucess();
    const expected = {
      type: REQUEST_CLOSE_ACTION_FILTER_SUCCESS
    };
    expect(output).toEqual(expected);
  });
  it("should create a requestSaveCardScanBoxes action", () => {
    const boxes = {};
    const output = requestSaveCardScanBoxes(boxes);
    const expected = {
      type: REQUEST_SAVE_CARD_SCAN_BOXES,
      payload: boxes
    };
    expect(output).toEqual(expected);
  });
  it("should create a requestAscSort action", () => {
    const SortData = {
      jobsdata: "",
      rowdata: "",
      sorttype: ""
    };
    const output = requestAscSort(SortData);
    const expected = {
      type: REQUEST_ASC_SORT,
      payload: SortData
    };
    expect(output).toEqual(expected);
  });
  it("should create a requestJobAuditLogs action", () => {
   
    const output = requestJobAuditLogs(1);
    const expected = {
      type: REQUEST_JOB_AUDIT_LOGS,
      payload: 1
    };
    expect(output).toEqual(expected);
  });
  it("should create a requestJobAuditLogsSucess action", () => {
   
    const output = requestJobAuditLogsSucess("logs");
    const expected = {
      type: REQUEST_JOB_AUDIT_LOGS_SUCESS,
      payload: "logs"
    };
    expect(output).toEqual(expected);
  });
  it("should create a requestSaveAnnotations action", () => {
   const annotations={}
   const reducerArea={}
    const output = requestSaveAnnotations( {},{} );
    const expected = {
      type: REQUEST_SAVE_ANNOTATIONS,
      payload: {annotations,reducerArea}
    };
    expect(output).toEqual(expected);
  });
  it("should create a requestClearLatentEditorData action", () => {
  
    const output = requestClearLatentEditorData();
    const expected = {
      type: REQUEST_CLEAR_LATENT_EDITOR_DATA
    };
    expect(output).toEqual(expected);
  });
  it("should create a requestSetCivilSearch action", () => {
  
    const output = requestSetCivilSearch(true);
    const expected = {
      type: REQUEST_SET_CIVIL_SEARCH,
      payload:true
    };
    expect(output).toEqual(expected);
  });
  it("should create a requestSetNewCrimeTypeSuccess action", () => {
  
    const output = requestSetNewCrimeTypeSuccess("crimeType");
    const expected = {
      type: REQUEST_SET_NEW_CRIME_TYPE_SUCCESS,
      payload:"crimeType"
    };
    expect(output).toEqual(expected);
  });
  it("should create a requestSetpage action", () => {
  
    const output = requestSetpage("data");
    const expected = {
      type: REQUEST_SET_PAGE,
      payload:"data"
    };
    expect(output).toEqual(expected);
  });
  it("should create a resetActionType action", () => {
  
    const output = resetActionType("crimeType");
    const expected = {
      type: RESET_ACTION_TYPE
    };
    expect(output).toEqual(expected);
  });
  it("should create a requestStartScanType action", () => {
  
    const output = requestStartScanType("scanType");
    const expected = {
      type: REQUEST_START_SCAN_TYPE,
      payload:"scanType"
    };
    expect(output).toEqual(expected);
  });
});
