import jobs, { compareJobs } from "../../app/reducers/jobs";
import {
  REQUEST_ACTIVE_JOBS_SUCCESS,
  REQUEST_NEW_ACTION_SUCCESS,
  RECEIVE_INPUT_FIELD_CHANGED,
  REQUEST_ACTION_HISTORY_SUCCESS,
  RECEIVE_TABLE_ROW_CLICKED,
  REQUEST_START_CARD_SCAN_SUCCESS,
  REQUEST_SAVE_CARD_SCAN_BOXES,
  REQUEST_SEGMENTED_CARD_SCAN_SUCCESS,
  REQUEST_FETCH_SCAN_SOURCES_SUCCESS,
  REQUEST_REMOVE_FILTER,
  REQUEST_SET_PAGE
} from "../../app/actions/actionTypes";
import {
  requestInputFieldChanged,
  receiveInputFieldChanged,
  receiveTableRowClicked,
  requestPageChanged,
  closeJobFiletr
} from "../../app/actions/global";
import {
  requestActiveJobsSuccess,
  requestActionHistorySuccess,
  requestCreateJobSuccess,
  requestNewActionSuccess,
  requestRemoveJobSuccess,
  requestSaveCardScanBoxes,
  requestRemoveFilter,
  setJobTypeFilter,
  requestCloseFilterSucess,
  requestCloseActionFilterSucess,
  requestActionSuccess,
  requestFilteredActiveJobsSuccess,
  requestClearLatentEditorData,
  requestSetpage,
  resetActionType,
  requestSetCivilSearch,
  requestUpdateBiometricDetails,
  requestSaveAnnotations
} from "../../app/actions/jobs";
import { requestLogoutSuccess } from "../../app/actions/auth";
import { requestHideModal } from "../../app/actions/modal";
import {
  requestStartCardScanSuccess,
  requestSegmentedCardScanSuccess,
  requestFetchScanSourcesSuccess
} from "../../app/actions/scanner";

describe("jobs reducer", () => {
  const initialState = {
    newJob: {
      id: undefined,
      cardScan: {
        annotations: {},
        cardImage: "",
        segmentedPrints: [],
        cardType: "demoCard", // "demoCard","KSA_A4", "fbiCriminal"
        scanResolution: 500,
        cardConfig: undefined,
        boxes: {},
        imageDimensions: [], // set after card is scanned and when saving boxes
        scanSources: [],
        selectedScanSource: undefined // number value used for Dynamsoft
      },
      palmScanAnnotations: {},
      selectedSearchOption: undefined //tenprint, latent, etc...
    },
    LogsDetails: {},
    BiometricsDetails: {},
    actionHistory: {
      currentPage: "",
      maxPages: undefined,
      pageSize: 10, // not from server. how many to display per page. need ui control. perhaps add a dropdown
      currentPage: 1,
      totalPages: undefined,
      totalCount: undefined,
      pages: undefined,
      results: []
    },
    ahData: [{
      actionType: "Search Criminal",
      createdOn: "2018-01-04T10:07:20",
      id: "1",
      jobID: "1",
      status: "Pending",
      tcn: "TCN0001",
    }],
    selectedJob: undefined,
    JobTypeFilter: undefined,
    selectedAction: undefined,
    jobsPaging: {
      maxPages: undefined,
      pageSize: 10, // not from server. how many to display per page. need ui control. perhaps add a dropdown
      currentPage: 1,
      totalPages: undefined,
      totalCount: undefined,
      pages: undefined
    },
    jobsIdList: [],
    jobsById: {},
    newAction: undefined,
    newSearchAction: [],
    actionHeader: undefined,
    isCivil: false,
    page: "",
    printStart:false,
    menuPerm:{},
    servicePerm:{}
  };
  xit("should have an initial state", () => {
    const output = jobs();
    const expected = { ...initialState };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_ACTIVE_JOBS_SUCCESS", () => {
    const action = requestActiveJobsSuccess({
      currentPage: 2,
      totalCount: 10,
      maxPages: 10,

      results: [{ id: 1 }, { id: 2 }]
    });
    const output = jobs(initialState, action);
    const expected = {
      ...initialState,
      jobsPaging: {
        ...initialState.jobsPaging,
        totalCount: 10,
        currentPage: 2,
        maxPages: 10
      },
      jobsById: {
        1: { id: 1 },
        2: { id: 2 }
      },
      jobsIdList: [1, 2]
    };
    expect(output).toEqual(expected);
  });

  it("should handle REQUEST_ACTION_HISTORY_SUCCESS action type", () => {
    const initState = Object.assign({}, initialState);
    initState.selectedJob = 1;
    const action = requestActionHistorySuccess({
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
    });
    const output = jobs(initState, action);
    const expected = {
      ...initialState,
      selectedJob: 1,
      actionHistory: {
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
      },
      newAction: undefined,
      newSearchAction: []
    };
    expect(output).toEqual(expected);
  });

  it("should handle REQUEST_CREATE_JOB_SUCCESS by storing id into newJob", () => {
    const action = requestCreateJobSuccess(1);
    const output = jobs(initialState, action);
    const expected = {
      ...initialState,
      newJob: {
        ...initialState.newJob,
        transactionType: "",
        id: 1
      },
      selectedJob: 1
    };
    expect(output).toEqual(expected);
  });

  it("should handle RECEIVE_TABLE_ROW_CLICKED or jobQueue", () => {
    const action = receiveTableRowClicked({ area: "jobQueue", dataId: 1 });
    const output = jobs(initialState, action);
    const expected = { ...initialState, selectedJob: 1 };
    expect(output).toEqual(expected);
  });
  it("should handle RECEIVE_TABLE_ROW_CLICKED for setSelectedJob", () => {
    const action = receiveTableRowClicked({
      area: "setSelectedJob",
      dataId: 1
    });
    const output = jobs(initialState, action);
    const expected = { ...initialState, selectedJob: 1 };
    expect(output).toEqual(expected);
  });

  it("should handle RECEIVE_TABLE_ROW_CLICKED for actionHistory", () => {
    const action = receiveTableRowClicked({ area: "actionHistory", dataId: 1 });
    const output = jobs(initialState, action);
    const expected = { ...initialState, selectedAction: 1 };
    expect(output).toEqual(expected);
  });

  it("should handle RECEIVE_TABLE_ROW_CLICKED by returning prev state", () => {
    const action = receiveTableRowClicked({ area: "anotherArea", dataId: 1 });
    const output = jobs(initialState, action);
    expect(output).toEqual(initialState);
  });

  it("should handle RECEIVE_INPUT_FIELD_CHANGED and update newJob fields", () => {
    const action = receiveInputFieldChanged({
      field: "fieldId",
      value: "fieldValue",
      area: "newJob"
    });
    const output = jobs(initialState, action);
    const expected = {
      ...initialState,
      newJob: { ...initialState.newJob, transactionType: "fieldValue" }
    };
    expect(output).toEqual(expected);
  });

  it("should handle RECEIVE_INPUT_FIELD_CHANGED and update newJob cardscan fields", () => {
    const action = receiveInputFieldChanged({
      field: "configType",
      value: "UCWCard",
      area: "cardScanConfig"
    });
    const output = jobs(initialState, action);
    const expected = {
      ...initialState,
      newJob: {
        ...initialState.newJob,
        cardScan: {
          ...initialState.newJob.cardScan,
          configType: "UCWCard"
        },
        palmScanAnnotations: {},
      }
    };
    expect(output).toEqual(expected);
  });

  it("should handle RECEIVE_INPUT_FIELD_CHANGED and update newAction field", () => {
    const action = receiveInputFieldChanged({
      field: "searchCriminalDB",
      value: "Search Criminal Database",
      area: "newAction"
    });
    const output = jobs(initialState, action);
    const expected = {
      ...initialState,
      newAction: "Search Criminal Database"
    };
    expect(output).toEqual(expected);
  });
  xit("should handle RECEIVE_INPUT_FIELD_CHANGED and update newAction field", () => {
    const action = receiveInputFieldChanged({
      field: "searchCriminalDB",
      value: "Search Criminal Database",
      area: "newAction"
    });
    initialState.newAction= "Search Criminal Database";
    const output = jobs(initialState, action);
    const expected = {
      ...initialState,
      newAction:undefined
    };
    expect(output).toEqual(expected);
  });

  it("should handle RECEIVE_INPUT_FIELD_CHANGED for area submitPrints", () => {
    const action = receiveInputFieldChanged({
      field: "submitPrints-civilDatabase",
      value: "Search Latent Database",
      area: "submitPrints"
    });
    const output = jobs(initialState, action);
    const expected = {
      ...initialState,
      newJob: {
        ...initialState.newJob,
        selectedSearchOption: "Search Latent Database"
      }
    };
    expect(output).toEqual(expected);
  });

  it("should handle RECEIVE_INPUT_FIELD_CHANGED by returning prev state", () => {
    const action = receiveInputFieldChanged({
      field: "fieldId",
      value: "fieldValue",
      area: "jobQueue"
    });
    const output = jobs(initialState, action);
    expect(output).toEqual(initialState);
  });

  it("should handle REQUEST_NEW_ACTION_SUCCESS", () => {
    const action = requestNewActionSuccess();
    const initState = {
      ...initialState,
      newAction: "Search Criminal Database"
    };
    const output = jobs(initState, action);
    const expected = {
      ...initialState,
      newAction: ""
    };
    expect(output).toEqual(expected);
  });

  it("should handle REQUEST_HIDE_MODAL action type", () => {
    const action = requestHideModal();
    const initState = {
      ...initialState,
      newJob: { ...initialState.newJob, id: 1, transactionType: "Latent" }
    };
    const output = jobs(initState, action);
    const expected = {
      ...initState,
      newJob: { ...initialState.newJob, id: 1, transactionType: "" }
    };
    expect(output).toEqual(expected);
  });

  it("should handle REQUEST_START_CARD_SCAN_SUCCESS", () => {
    const payload = {
      cardImage: "cardImage",
      cardConfig: "cardConfig",
      Resolution: 500,
      cardType: "fbiCriminal"
    };
    const action = requestStartCardScanSuccess(payload);
    const output = jobs(initialState, action);
    const expected = {
      ...initialState,
      newJob: {
        ...initialState.newJob,
        cardScan: {
          ...initialState.newJob.cardScan,
          cardImage: "cardImage",
          cardConfig: "cardConfig",
          scanResolution: 500,
          cardType: "fbiCriminal"
        },
      }
    };
    expect(output).toEqual(expected);
  });

  xit("should handle REQUEST_LOGOUT_SUCCESS action type", () => {
    const action = requestCreateJobSuccess(1);
    let output = jobs(initialState, action);
    let expected = {
      ...initialState,
      newJob: {
        ...initialState.newJob,
        id: 1,
        transactionType: ""
      },
      selectedJob: 1
    };
    expect(output).toEqual(expected);
    const anotherAction = receiveTableRowClicked({
      area: "jobQueue",
      dataId: 1
    });
    output = jobs(expected, anotherAction);
    expected = {
      ...expected,
      selectedJob: 1
    };
    expect(output).toEqual(expected);
    const logoutAction = requestLogoutSuccess();
    output = jobs(expected, logoutAction);
    expect(output).toEqual(initialState);
  });

  it("should handle REQUEST_REMOVE_JOB_SUCCESS and remove job by id", () => {
    const initState = {
      ...initialState,
      jobsIdList: ["1", "2"],
      jobsById: { "1": {}, "2": {} }
    };
    const action = requestRemoveJobSuccess("2");
    const output = jobs(initState, action);
    const expected = {
      ...initState,
      jobsIdList: ["1"],
      jobsById: { "1": {} }
    };
    expect(output).toEqual(expected);
  });

  it("should handle REQUEST_SAVE_CARD_SCAN_BOXES", () => {
    const action = requestSaveCardScanBoxes({
      boxes: {
        "R. ROLLED THUMB": {},
        "R. ROLLED INDEX": {}
      },
      imageDimensions: [100, 100]
    });
    const output = jobs(initialState, action);
    const expected = {
      ...initialState,
      newJob: {
        ...initialState.newJob,
        cardScan: {
          ...initialState.newJob.cardScan,
          boxes: { "R. ROLLED THUMB": {}, "R. ROLLED INDEX": {} },
          imageDimensions: [100, 100]
        }
      }
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_CLEAR_LATENT_EDITOR_DATA", () => {
    const action = requestClearLatentEditorData();
    const output = jobs(initialState, action);
    const expected = {
      ...initialState,
      newJob: {
        ...initialState.newJob,
        cardScan: {
          ...initialState.newJob.cardScan,
          annotations: {},
          cardImage: null
        }
      }
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_SAVE_CARD_SCAN_BOXES covering if case", () => {
    const action = requestSaveCardScanBoxes({
      boxes: {},
      imageDimensions: [100, 100]
    });
    const output = jobs(initialState, action);
    const expected = {
      ...initialState
    };
    expect(output).toEqual(expected);
  });

  it("should handle REQUEST_SEGMENTED_CARD_SCAN_SUCCESS", () => {
    const payload = [
      { b64Image: "a", name: "b" },
      { b64Image: "c", name: "d" }
    ];
    const action = requestSegmentedCardScanSuccess(payload);
    const output = jobs(initialState, action);
    const expected = {
      ...initialState,
      newJob: {
        ...initialState.newJob,
        cardScan: {
          ...initialState.newJob.cardScan,
          segmentedPrints: [
            { b64Image: "a", name: "b" },
            { b64Image: "c", name: "d" }
          ]
        }
      }
    };
    expect(output).toEqual(expected);
  });

  it("should compare jobs and return true", () => {
    const oldJobs = {
      "1": { modifiedOn: "1-1-2018" },
      "2": { modifiedOn: "1-1-2018" }
    };
    const newJobs = [
      { id: "1", modifiedOn: "1-1-2018" },
      { id: "2", modifiedOn: "1-1-2018" }
    ];
    const output = compareJobs(newJobs, oldJobs);
    expect(output).toEqual(true);
  });

  it("should handle unknown action type", () => {
    const action = {
      type: "unknown",
      payload: { test: "test" }
    };
    const output = jobs(initialState, action);
    expect(output).toEqual(initialState);
  });

  xit("should handle REQUEST_REMOVE_FILTER", () => {
    const action = requestRemoveFilter();
    const initState = {
      ...initialState
    };
    const output = jobs(initState, action);
    const expected = {
      ...initialState
    };
    expect(output).toEqual(expected);
  });

  it("should handle SET_JOB_TYPE_FILTER_APPLIED", () => {
    const action = setJobTypeFilter({
      value: 1
    });
    const initState = {
      ...initialState
    };
    const output = jobs(initState, action);
    const expected = {
      ...initialState,
      JobTypeFilter: 1
    };
    expect(output).toEqual(expected);
  });

  it("should handle REQUEST_CLOSE_FILTER_SUCCESS", () => {
    const action = requestCloseFilterSucess();
    const initState = {
      ...initialState
    };
    const output = jobs(initState, action);
    const expected = {
      ...initialState
    };
    expect(output).toEqual(expected);
  });

  it("should handle REQUEST_CLOSE_ACTION_FILTER_SUCCESS", () => {
    const action = requestCloseActionFilterSucess();
    const initState = {
      ...initialState
    };
    const output = jobs(initState, action);
    const expected = {
      ...initialState,
      filter: ""
    };
    expect(output).toEqual(expected);
  });

  it("should handle REQUEST_PAGE_CHANGED", () => {
    const event = {
      target: ""
    };
    const action = requestPageChanged(event, "Page Changed");
    const initState = {
      ...initialState
    };
    const output = jobs(initState, action);
    const expected = {
      ...initialState
    };
    expect(output).toEqual(expected);
  });

  it("should handle REQUEST_ACTION_SUCCESS", () => {
    const action = requestActionSuccess();
    const initState = {
      ...initialState
    };
    const output = jobs(initState, action);
    const expected = {
      ...initialState,
      actionHistory: { results: undefined }
    };
    expect(output).toEqual(expected);
  });

  it("should handle REQUEST_FILTERED_ACTIVE_JOBS_SUCCESS", () => {
    const send_data = {
      id: 1,
      results: []
    };
    const action = requestFilteredActiveJobsSuccess(send_data);
    const initState = {
      ...initialState
    };
    const output = jobs(initState, action);
    const expected = {
      ...initialState
    };
    expect(output).toEqual(expected);
  });

  it("should handle REQUEST_FETCH_SCAN_SOURCES_SUCCESS", () => {
    const payload = [{ value: 0 }, { value: 1 }];
    const action = requestFetchScanSourcesSuccess(payload);
    const output = jobs(initialState, action);
    const expected = {
      ...initialState,
      newJob: {
        ...initialState.newJob,
        cardScan: {
          ...initialState.newJob.cardScan,
          scanSources: payload,
          selectedScanSource: payload[0].value
        }
      }
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_SET_PAGE", () => {
    const payload = 1;
    const action = requestSetpage(payload);
    const output = jobs(initialState, action);
    const expected = {
      ...initialState,
      page: 1
    };
    expect(output).toEqual(expected);
  });
  it("should handle RESET_ACTION_TYPE", () => {
    const action = resetActionType();
    const output = jobs(initialState, action);
    const expected = {
      ...initialState,
      newAction: undefined
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_SET_CIVIL_SEARCH", () => {
    const action = requestSetCivilSearch();
    initialState.isCivil = false;
    const output = jobs(initialState, action);
    const expected = {
      ...initialState,
      isCivil: true
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_SET_CIVIL_SEARCH", () => {
    const action = requestSetCivilSearch();
    initialState.isCivil = true;
    const output = jobs(initialState, action);
    const expected = {
      ...initialState,
      isCivil: false
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_SET_CIVIL_SEARCH", () => {
    const action = requestSetCivilSearch();
    initialState.isCivil = "othervalue";
    const output = jobs(initialState, action);
    const expected = {
      ...initialState
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_SET_BIOMETRICS_DETAILS", () => {
    const action = requestUpdateBiometricDetails("data");

    const output = jobs(initialState, action);
    const expected = {
      ...initialState,
      BiometricsDetails: "data"
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_SAVE_ANNOTATIONS", () => {
    const action = requestSaveAnnotations({
      annotations: "data",
      reducerArea: "cardScan"
    });

    const output = jobs(initialState, action);
    const expected = {
      ...initialState,
      newJob: {
        ...initialState.newJob,
        cardScan: {
          ...initialState.newJob.cardScan,
          annotations: {}
        }
      }
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_SAVE_ANNOTATIONS", () => {
    const action = requestSaveAnnotations({
      annotations: "data",
      reducerArea: "liveScan"
    });

    const output = jobs(initialState, action);
    const expected = {
      ...initialState
    };
    expect(output).toEqual(expected);
  });
});
