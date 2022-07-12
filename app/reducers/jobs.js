// @flow
import {
  REQUEST_ACTIVE_JOBS_SUCCESS,
  REQUEST_ACTION_HISTORY_SUCCESS,
  REQUEST_REMOVE_JOB_SUCCESS,
  RECEIVE_INPUT_FIELD_CHANGED,
  REQUEST_CREATE_JOB_SUCCESS,
  REQUEST_CREATE_JOB_FAILED,
  REQUEST_HIDE_MODAL,
  RECEIVE_TABLE_ROW_CLICKED,
  REQUEST_LOGOUT_SUCCESS,
  REQUEST_NEW_ACTION_SUCCESS,
  REQUEST_PAGE_CHANGED,
  REQUEST_REMOVE_FILTER,
  REQUEST_SHOW_FILTERED_DATA,
  REQUEST_ACTION_SUCCESS,
  REQUEST_START_SCANNER_SUCCESS,
  REQUEST_START_CARD_SCAN,
  REQUEST_START_CARD_SCAN_SUCCESS,
  REQUEST_SEGMENTED_CARD_SCAN_SUCCESS,
  REQUEST_FETCH_SCAN_SOURCES_SUCCESS,
  REQUEST_SAVE_CARD_SCAN_BOXES,
  SET_JOB_TYPE_FILTER_APPLIED,
  REQUEST_CLOSE_FILTER_SUCCESS,
  REQUEST_CLOSE_ACTION_FILTER_SUCCESS,
  REQUEST_FILTERED_ACTIVE_JOBS_SUCCESS,
  REQUEST_SET_CIVIL_SEARCH,
  REQUEST_SET_BIOMETRICS_DETAILS,
  REQUEST_CLEAR_LATENT_EDITOR_DATA,
  REQUEST_SAVE_ANNOTATIONS,
  REQUEST_SET_PAGE,
  RESET_ACTION_TYPE,
  REQUEST_START_PRINT,
  REQUEST_STOP_PRINT,
  REQUEST_SET_WILDCARD_SEARCH,
  REQUEST_SET_WILDCARD_ACTION_SEARCH,
  REQUEST_SAVE_ANNOTATIONS_CUSTOM,
  REQUEST_RESET_PALMSCAN_ANNOTATIONS,
  REQUEST_SYSTEM_PERMISSION_SUCCESS,
  REQUEST_ACTION_START
} from "../actions/actionTypes";


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
    selectedSearchOption: undefined, //tenprint, latent, etc...
    palmScanAnnotations: {},
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
  selectedJob: undefined,
  JobTypeFilter: undefined,
  wildacardSearchText: undefined,
  wildacardActionSearchText: undefined,
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
  printStart: false,
  actionStart:false
};

export default function jobs(state = initialState, action = {}) {
  let data, newState;
  switch (action.type) {
    case REQUEST_ACTIVE_JOBS_SUCCESS:
      newState = getJobsById(state, action);
      return newState;
    case REQUEST_ACTION_HISTORY_SUCCESS:
      return {
        ...state,
        actionHistory: { ...action.payload },
        ahData: action.payload.results,
        newAction: undefined,
        newSearchAction: []
      };
    case REQUEST_REMOVE_JOB_SUCCESS:
      newState = {
        ...state,
        jobsById: {
          ...state.jobsById
        },
        jobsIdList: state.jobsIdList.filter(
          oldJob => oldJob !== action.payload.toString()
        ),
        selectedJob: undefined
      };
      delete newState.jobsById[action.payload];
      return newState;
    case REQUEST_CREATE_JOB_SUCCESS:
      return {
        ...state,
        selectedJob: action.payload,
        newJob: { ...state.newJob, transactionType: "", id: action.payload }
      }; // store new job id
    case RECEIVE_INPUT_FIELD_CHANGED:
      return handleInputFieldChanged(state, action.payload);

    case REQUEST_PAGE_CHANGED:
      return { ...state, selectedJob: undefined };
    case REQUEST_SET_WILDCARD_SEARCH:
      return { ...state, wildacardSearchText: action.payload };
    case REQUEST_SET_WILDCARD_ACTION_SEARCH:
      return { ...state, wildacardActionSearchText: action.payload };
    case RECEIVE_TABLE_ROW_CLICKED:
      const { area, dataId, status, type, tcn } = action.payload;
      if (area === "setSelectedJob") {
        return {
          ...state,
          selectedJob: dataId
        };
      }
      if (area === "jobQueue") {
        return {
          ...state,
          selectedJob: dataId,
          selectedJobStatus: status,
          jobType: type
        };
      } else if (area === "actionHistory") {
        return {
          ...state,
          selectedAction: dataId,
          selectedActionStatus: status,
          SelectedActionType: type,
          newAction: type,
          actionHeader: type,
          selectedTcn: tcn
        };
      } else {
        return state;
      }
    case REQUEST_START_CARD_SCAN_SUCCESS:
      const { cardImage, cardConfig, Resolution, cardType } = action.payload;

      return {
        ...state,
        newJob: {
          ...state.newJob,
          cardScan: {
            ...state.newJob.cardScan,
            cardImage,
            cardConfig,
            scanResolution: Resolution,
            cardType
          }
        }
      };
    case REQUEST_SEGMENTED_CARD_SCAN_SUCCESS:
      return {
        ...state,
        newJob: {
          ...state.newJob,
          cardScan: {
            ...state.newJob.cardScan,
            segmentedPrints: action.payload
          }
        }
      };
    case REQUEST_SAVE_CARD_SCAN_BOXES:
      if (
        JSON.stringify(state.newJob.cardScan.boxes) ===
        JSON.stringify(action.payload.boxes)
      )
        return state;
      return {
        ...state,
        newJob: {
          ...state.newJob,
          cardScan: {
            ...state.newJob.cardScan,
            boxes: action.payload.boxes,
            imageDimensions: action.payload.imageDimensions
          }
        }
      };
    case REQUEST_FETCH_SCAN_SOURCES_SUCCESS:
      return {
        ...state,
        newJob: {
          ...state.newJob,
          cardScan: {
            ...state.newJob.cardScan,
            scanSources: action.payload,
            cardType: initialState.newJob.cardScan.cardType,
            scanResolution: initialState.newJob.cardScan.scanResolution,
            selectedScanSource: action.payload[0] && action.payload[0].value
          }
        }
      };
    case REQUEST_CLEAR_LATENT_EDITOR_DATA:
      return {
        ...state,
        newJob: {
          ...state.newJob,
          cardScan: {
            ...state.newJob.cardScan,
            annotations: {},
            cardImage: null
          }
        }
      };
    case REQUEST_NEW_ACTION_SUCCESS:
      return { ...state, newAction: "", newSearchAction: [] };
    case REQUEST_START_PRINT:
      return { ...state, printStart: true };
    case REQUEST_STOP_PRINT:
      return { ...state, printStart: false };
    case REQUEST_HIDE_MODAL:
      return { ...state, newJob: { ...state.newJob, transactionType: "" } };
    case REQUEST_LOGOUT_SUCCESS:
      return initialState;
    case REQUEST_REMOVE_FILTER:
      return handleRemoveFilter(state);
    case SET_JOB_TYPE_FILTER_APPLIED:
      return { ...state, JobTypeFilter: action.payload.value };
    case REQUEST_SET_PAGE:
      return { ...state, page: action.payload };
    case REQUEST_CLOSE_FILTER_SUCCESS:
      return closeJobFiletr(state);
    case REQUEST_CLOSE_ACTION_FILTER_SUCCESS:
      return closeActionFiletr(state);
    case REQUEST_ACTION_SUCCESS:
      return { ...state, actionHistory: { results: action.payload } };
    case RESET_ACTION_TYPE:
      return { ...state, newAction: undefined };
    case REQUEST_FILTERED_ACTIVE_JOBS_SUCCESS:
      return getFilteredJobsById(state, action);
    case REQUEST_SET_CIVIL_SEARCH:
      if (state.isCivil === false) {
        return { ...state, isCivil: true };
      } else if (state.isCivil === true) {
        return { ...state, isCivil: false };
      } else {
        return { ...state };
      }
    // return getFilteredJobsById(state, action);

    case REQUEST_SET_BIOMETRICS_DETAILS:
      return { ...state, BiometricsDetails: action.payload };
    case REQUEST_ACTION_START:
      return { ...state, actionStart: action.payload };

    case REQUEST_SAVE_ANNOTATIONS:
      if (action.payload.reducerArea === "cardScan") {
        return {
          ...state,
          newJob: {
            ...state.newJob,
            cardScan: {
              ...state.newJob.cardScan,
              annotations: action.payload.annotations,
              type: "REQUEST_SAVE_ANNOTATIONS"
            }
          }
        };
      }
      else if ( action.payload.reducerArea === "palmScan" ) {
        return {
          ...state,
          newJob: {
            ...state.newJob,
            palmScanAnnotations: action.payload.annotations
          }
        };
      }
      else {
        return state;
      }


    case REQUEST_RESET_PALMSCAN_ANNOTATIONS:
      return {
        ...state,
        newJob: {
          ...state.newJob,
          palmScanAnnotations: {}
        }
      };

    case REQUEST_SAVE_ANNOTATIONS_CUSTOM:
      let updatedState = { ...state };
      updatedState.newJob.cardScan.annotations = action.payload;
      updatedState.newJob.cardScan.type = "REQUEST_SAVE_ANNOTATIONS_CUSTOM";
      return updatedState;


    default:
      return state;
  }
}

const closeJobFiletr = state => {
  delete state.jobFilter;
  return {
    ...state,
    JobTypeFilter: undefined,
    wildacardSearchText: undefined
  };
};
const closeActionFiletr = state => {
  state.filter = "";
  state.wildacardActionSearchText = undefined;
  return {
    ...state
  };
};

const handleRemoveFilter = state => {
  delete state.filter;
  return {
    ...state,
    JobTypeFilter: undefined
  };
};
const handleInputFieldChanged = (state, payload) => {
  const { area, field, value } = payload;

  if (area === "newJob") {
    if (state.newJob.transactionType === value) {
      return {
        ...state,
        newJob: {
          ...state.newJob,
          transactionType: undefined
        }
      };
    } else {
      return {
        ...state,
        newJob: {
          ...state.newJob,
          transactionType: value
        }
      };
    }
  } else if (area === "newAction") {
    if (state.newAction === value) {
      return {
        ...state,
        newAction: undefined
        // selectedAction:value
      };
    } else {
      return {
        ...state,
        newAction: value
        // selectedAction:value
      };
    }
  } else if (area === "newSearchAction") {
    let data = [...state.newSearchAction];

    const itemIndex = data.indexOf(value);
    if (itemIndex != -1) {
      data.splice(itemIndex, 1);
      if (value === "Search Civil") {
        if (data.indexOf("Search Criminal") !== -1) {
          data.splice(data.indexOf("Search Criminal"), 1);
        }
      }
    } else {
      if (value === "Search Civil") {
        if (data.indexOf("Search Criminal") === -1) {
          data.push("Search Criminal"); //removed while removing criminal db search,,, if we are supporting criminal then just uncomment me
        }
      }
      data.push(value);
    }
    if (state.newSearchAction === value) {
      return {
        ...state,
        newSearchAction: []
        // selectedAction:value
      };
    } else {
      return {
        ...state,
        newSearchAction: data
        // selectedAction:value
      };
    }
  } else if (area === "newCustomSearchAction") {
    let data = [...state.newSearchAction];

    const itemIndex = data.indexOf(value);
    if (itemIndex != -1) {
      data.splice(itemIndex, 1);
      if (value === "Search Civil") {
        if (data.indexOf("Search Criminal") !== -1) {
          data.splice(data.indexOf("Search Criminal"), 1);
        }
      }
    } else {
      if (value === "Search Civil") {
        if (data.indexOf("Search Criminal") === -1) {
          // data.push("Search Criminal");  //removed while removing criminal db search,,, if we are supporting criminal then just uncomment me
        }
      }
      data.push(value);
    }
    if (state.newSearchAction === value) {
      return {
        ...state,
        newSearchAction: []
        // selectedAction:value
      };
    } else {
      return {
        ...state,
        newSearchAction: data
        // selectedAction:value
      };
    }
  } else if (area === "submitPrints") {
    return {
      ...state,
      newJob: {
        ...state.newJob,
        selectedSearchOption: value
      }
    };
  } else if (area === "cardScanConfig") {
    return {
      ...state,
      newJob: {
        ...state.newJob,
        cardScan: {
          ...state.newJob.cardScan,
          [field]: value
        }
      }
    };
  } else if (area === "filter") {
    return {
      ...state,
      filter: payload
    };
  } else if (area === "jobFilter") {
    return {
      ...state,
      jobFilter: payload
    };
  } else {
   
    return state;
  }
};

const getJobsById = (state, action) => {
  const {
    results,
    currentPage,
    totalPages,
    maxPages,
    totalCount,
    pages
  } = action.payload;
  const { jobsIdList, jobsById } = state;
  let newJobsById = {};
  const jobsPaging = {
    currentPage,
    totalPages,
    maxPages,
    totalCount,
    pages,
    pageSize: 10
  };
  const newJobsIdList = results.map(job => {
    newJobsById[job.id] = job;
    return job.id;
  });
  if (compareJobs(results, jobsById)) {
    return { ...state, jobsPaging };
  } else {
    return {
      ...state,
      jobsIdList: newJobsIdList,
      jobsById: newJobsById,
      jobsPaging
    };
  }
};
const getFilteredJobsById = (state, action) => {
  const {
    results,
    currentPage,
    totalPages,
    maxPages,
    totalCount,
    pages
  } = action.payload;
  let newJobsById = {};
  state.jobsPaging.currentPage = currentPage;
  state.jobsPaging.totalPages = totalPages;
  state.jobsPaging.maxPages = maxPages;
  state.jobsPaging.totalCount = totalCount;
  state.jobsPaging.pages = pages;
  state.jobsPaging.pageSize = 10;
  let newJobsIdList = [];
  if (results) {
    newJobsIdList = results.map(job => {

      newJobsById[job.id] = job;
      return job.id;
    });
  }
  state.jobsIdList = newJobsIdList;
  state.jobsById = newJobsById;

  state.selectedJob=undefined
  return {
    ...state
  };
};

export function compareJobs(newJobs, oldJobs) {
  // newJobs is an array from the server, oldJobs is an object of jobs by id
  // returns true if oldJobs === newJobs
  if (Object.keys(oldJobs).length === 0) return false;
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
