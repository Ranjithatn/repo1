// @flow
import {
  REQUEST_SELECT_FINGER_SUCCESS,
  REQUEST_STORE_INITIAL_LIVESCAN_DATA,
  REQUEST_STORE_COMPLETED_DATA_SUCCESS,
  REQUEST_ANNOTATION_SELECT_CHANGED,
  REQUEST_ANNOTATION_NOTES_CHANGED,
  REQUEST_ANNOTATION_FINGER_SAVE,
  REQUEST_REMOVE_ANNOTATED_FINGERS,
  REQUEST_CAPTURE_DATA_CANON,
  REQUEST_MUGSHOT_DATA,
  REQUEST_CLEAR_LIVESCAN_DATA,
  REQUEST_LOAD_LIVESCAN,
  REQUEST_STORE_CANON_DATA,
  REQUEST_SCANNED_TYPE,
  PALM_SCAN_WORKFLOW,
  REQUEST_REMOVE_CANON_DATA,
  LIVE_SCAN_WORKFLOW,
  REQUEST_ClOSE_LIVESCAN_PROGRESS
} from "../actions/actionTypes";
import { stat } from "fs";
const initialState = {
  positionDetails: {},
  Livescan: {},
  finalCompletedRolledData: {},
  annotatedFingers: {
    1: {
      status: false,
      Reason: "",
      note: ""
    },
    2: {
      status: false,
      Reason: "",
      note: ""
    },
    3: {
      status: false,
      Reason: "",
      note: ""
    },
    4: {
      status: false,
      Reason: "",
      note: ""
    },
    5: {
      status: false,
      Reason: "",
      note: ""
    },
    6: {
      status: false,
      Reason: "",
      note: ""
    },
    7: {
      status: false,
      Reason: "",
      note: ""
    },
    8: {
      status: false,
      Reason: "",
      note: ""
    },
    9: {
      status: false,
      Reason: "",
      note: ""
    },
    10: {
      status: false,
      Reason: "",
      note: ""
    }
  },
  mugshotData: {
    clicked: true
  },
  mugshotShowdata: {
    selected: false
  },
  annotationNotes: "",
  canonData: {
    ImageData: ""
  },
  scannedType: {
    workflow: "fourFourTwoName",
    workflowName: "fourFourTwo"
  },

  palmScan: {
    visible: false,
    status: "",
    started: false,
    stopped: false,
    completed: false,
    data: []
  },

  liveScanWorkflow: {
    tab: "livescan",
    type: "fourFourTwo",
    status: "",
    started: false,
    inProgress: false,
    completed: false,
    data: [],
    loading: {
      percentage: 0,
      visible: false,
      failed: false,
      completed: false,
      filePath: "",
      checksum: "",
      fileName: ""
    },
    webcamImage: "",
    annotatedFingers: {
      1: {
        status: false,
        Reason: "",
        note: ""
      },
      2: {
        status: false,
        Reason: "",
        note: ""
      },
      3: {
        status: false,
        Reason: "",
        note: ""
      },
      4: {
        status: false,
        Reason: "",
        note: ""
      },
      5: {
        status: false,
        Reason: "",
        note: ""
      },
      6: {
        status: false,
        Reason: "",
        note: ""
      },
      7: {
        status: false,
        Reason: "",
        note: ""
      },
      8: {
        status: false,
        Reason: "",
        note: ""
      },
      9: {
        status: false,
        Reason: "",
        note: ""
      },
      10: {
        status: false,
        Reason: "",
        note: ""
      }
    },
    tusUpload: {}
  }
};

export default function annotation(state = initialState, action = {}) {
  switch (action.type) {
    case REQUEST_LOAD_LIVESCAN:
      initialState.annotatedFingers = {
        1: {
          status: false,
          Reason: "",
          note: ""
        },
        2: {
          status: false,
          Reason: "",
          note: ""
        },
        3: {
          status: false,
          Reason: "",
          note: ""
        },
        4: {
          status: false,
          Reason: "",
          note: ""
        },
        5: {
          status: false,
          Reason: "",
          note: ""
        },
        6: {
          status: false,
          Reason: "",
          note: ""
        },
        7: {
          status: false,
          Reason: "",
          note: ""
        },
        8: {
          status: false,
          Reason: "",
          note: ""
        },
        9: {
          status: false,
          Reason: "",
          note: ""
        },
        10: {
          status: false,
          Reason: "",
          note: ""
        }
      };

      return { ...initialState };
    case REQUEST_SELECT_FINGER_SUCCESS:
      // console.log(action.payload);
      return { ...state, positionDetails: action.payload };
    case REQUEST_STORE_INITIAL_LIVESCAN_DATA:
      return { ...state, Livescan: { initialData: action.payload } };
    case REQUEST_STORE_COMPLETED_DATA_SUCCESS:
      return {
        ...state,
        finalCompletedData: action.payload.finalImage,
        finalCompletedRolledData: action.payload.finalRolledImage
      };

    case REQUEST_ANNOTATION_SELECT_CHANGED:
      return { ...state, annotationReason: action.payload };
    case REQUEST_ANNOTATION_NOTES_CHANGED:
      return { ...state, annotationNotes: action.payload };
    case REQUEST_ANNOTATION_FINGER_SAVE:
      return saveAnnotationFingers(state, action.payload);
    case REQUEST_REMOVE_ANNOTATED_FINGERS:
      return remoceAnnotatedFinger(state, action);
    case REQUEST_CAPTURE_DATA_CANON:
      return { ...state, mugshotData: action.payload };
    case REQUEST_MUGSHOT_DATA:
      return { ...state, mugshotShowdata: action.payload };
    case REQUEST_CLEAR_LIVESCAN_DATA:
      return requestClearLivescanData(state, action.payload);
    case REQUEST_SCANNED_TYPE:
      return requestSetScannedType(state, action.payload);
    case REQUEST_ClOSE_LIVESCAN_PROGRESS:
      let liveScanWorkflow = Object.assign({}, state.liveScanWorkflow);
      liveScanWorkflow.inProgress = false;
      return { ...state, liveScanWorkflow };

    case REQUEST_STORE_CANON_DATA:
      if (!action.payload || action.payload === "") {
        return { ...state, canonData: { ImageData: null } };
      } else {
        const parsedData = JSON.parse(action.payload);
        return { ...state, canonData: parsedData };
      }

    // case REQUEST_REMOVE_CANON_DATA:
    //   return { ...state, canonData: { ImageData: null } };

    case LIVE_SCAN_WORKFLOW:
      return handleLiveScanWorkflow(state, action);

    case PALM_SCAN_WORKFLOW:
      return handlePalmScanWorkflow(state, action);

    default:
      return state;
  }
}
const remoceAnnotatedFinger = (state, payload) => {
  state.positionDetails = "";
  return {
    ...state
  };
};
const requestClearLivescanData = (state, payload) => {
  state.annotationNotes = "";
  state.finalCompletedData = "";
  state.annotationReason = "";
  state.positionDetails = "";
  state.annotatedFingers = {
    1: {
      status: false,
      Reason: "",
      note: ""
    },
    2: {
      status: false,
      Reason: "",
      note: ""
    },
    3: {
      status: false,
      Reason: "",
      note: ""
    },
    4: {
      status: false,
      Reason: "",
      note: ""
    },
    5: {
      status: false,
      Reason: "",
      note: ""
    },
    6: {
      status: false,
      Reason: "",
      note: ""
    },
    7: {
      status: false,
      Reason: "",
      note: ""
    },
    8: {
      status: false,
      Reason: "",
      note: ""
    },
    9: {
      status: false,
      Reason: "",
      note: ""
    },
    10: {
      status: false,
      Reason: "",
      note: ""
    }
  };
  state.mugshotData = {
    clicked: true
  };
  state.mugshotShowdata = {
    selected: false
  };
  state.canonData = { ImageData: null };
  return {
    ...state
  };
};

const saveAnnotationFingers = (state, payload) => {
  return {
    ...state,
    annotationNotes: "",
    annotatedFingers: {
      ...state.annotatedFingers,
      [payload.Position]: {
        status: payload.Reason === 0 ? false : true,
        Reason: payload.Reason,
        note: payload.Info
      }
    }
  };
};
const requestSetScannedType = (state, payload) => {
  let scanData;
  if (payload === "flat") {
    scanData = {
      workflow: "fourFourTwoName",
      workflowName: "fourFourTwo"
    };
  } else if (payload === "rolled") {
    scanData = {
      workflow: "fourFourTwoFlatAndRollsName",
      workflowName: "fourFourTwoFlatAndRolls"
    };
  } else {
    scanData = "";
  }

  return {
    ...state,
    scannedType: scanData
  };
};

// this will handle all palm scan workflow, from start, stop to display and saving of data
const handlePalmScanWorkflow = (state, action) => {
  // console.log("handlePalmScanWorkflow", action);
  const type = action.payload.type;
  let palmScan = Object.assign({}, state.palmScan);

  if (!type) {
    // console.log("You must always specify the type when using palmScanWorkflow");
    return state;
  }

  if (type === "START_SCAN") {
    palmScan.status = "START_SCAN";
    palmScan.started = true;
    palmScan.visible = true;
    palmScan.stopped = false;
    return { ...state, palmScan };
  } else if (type === "STOP_SCAN") {
    palmScan.status = "STOP_SCAN";
    palmScan.started = false;
    palmScan.stopped = false;
    return { ...state, palmScan };
  } else if (type === "STOP_PALM_SCAN") {
    palmScan.status = "STOP_PALM_SCAN";
    palmScan.started = false;
    palmScan.stopped = true;
    // palmScan.data = [];
    return { ...state, palmScan };
  } else if (type === "COMPLETE_SCAN") {
    palmScan.status = "COMPLETE_SCAN";
    palmScan.started = false;
    palmScan.completed = true;
    palmScan.stopped = false;
    return { ...state, palmScan };
  } else if (type === "SAVE_DATA") {
    palmScan.status = "SAVE_DATA";
    palmScan.data = action.payload.data;
    return { ...state, palmScan };
  } else if (type === "SHOW") {
    palmScan.status = "SHOW";
    palmScan.visible = true;
    return { ...state, palmScan };
  } else if (type === "HIDE") {
    palmScan.status = "HIDE";
    palmScan.visible = false;
    return { ...state, palmScan: palmScan };
  } else if (type === "TOGGLE_VISIBILITY") {
    palmScan.visible = !palmScan.visible;
    return { ...state, palmScan: palmScan };
  } else if (type === "RESET") {
    palmScan.status = "RESET";
    palmScan.visible = false;
    palmScan.started = false;
    palmScan.completed = false;
    palmScan.stopped = false;
    palmScan.data = [];
    return { ...state, palmScan: palmScan };
  } else if (type === "RESTART_SCAN") {
    palmScan.status = "RESTART_SCAN";
    palmScan.started = true;
    palmScan.visible = true;
    palmScan.completed = false;
    palmScan.stopped = false;
    palmScan.data = [];
    return { ...state, palmScan };
  } else if (type === "STOP_SCAN_WORKFLOW") {
    palmScan.status = "STOP_SCAN_WORKFLOW";
    palmScan.started = false;
    if( palmScan.status === "RESET" ) {
      palmScan.stopped = false;
    } else {
      palmScan.stopped = false;
    }
    return { ...state, palmScan };
  }

  return state;
};

const handleLiveScanWorkflow = (state, action) => {
  const type = action.payload.type;
  let liveScanWorkflow = Object.assign({}, state.liveScanWorkflow);

  if (type === "SET_LIVESCAN_TYPE") {
    liveScanWorkflow.status = "SET_LIVESCAN_TYPE";
    // liveScanWorkflow.type = action.payload.data;
    if (action.payload.data === "flat") {
      liveScanWorkflow.type = "fourFourTwo";
    } else if (action.payload.data === "rolled") {
      liveScanWorkflow.type = "fourFourTwoFlatAndRolls";
    }
    return { ...state, liveScanWorkflow };
  }

  if (type === "START_SCAN") {
    liveScanWorkflow.status = "START_SCAN";
    liveScanWorkflow.started = true;
    liveScanWorkflow.visible = true;
    liveScanWorkflow.inProgress = true;

    liveScanWorkflow.completed = false;
    liveScanWorkflow.data = [];

    return { ...state, liveScanWorkflow };
  } else if (type === "STOP_SCAN") {
    liveScanWorkflow.status = "STOP_SCAN";
    liveScanWorkflow.started = false;
    liveScanWorkflow.annotatedFingers = {
      1: {},
      2: {},
      3: {},
      4: {},
      5: {},
      6: {},
      7: {},
      8: {},
      9: {},
      10: {}
    };
    return { ...state, liveScanWorkflow };
  } else if (type === "COMPLETE_SCAN") {
    liveScanWorkflow.status = "COMPLETE_SCAN";
    liveScanWorkflow.started = false;
    liveScanWorkflow.completed = true;
    liveScanWorkflow.annotatedFingers = {
      1: {},
      2: {},
      3: {},
      4: {},
      5: {},
      6: {},
      7: {},
      8: {},
      9: {},
      10: {}
    };
    return { ...state, liveScanWorkflow };
  } else if (type === "SAVE_DATA") {
    liveScanWorkflow.status = "SAVE_DATA";
    liveScanWorkflow.data = action.payload.data;
    return { ...state, liveScanWorkflow };
  } else if (type === "SET_ANNOTATED_FINGERS") {
    liveScanWorkflow.status = "SET_ANNOTATED_FINGERS";
    liveScanWorkflow.annotatedFingers = action.payload.data;
    return { ...state, liveScanWorkflow };
  } else if (type === "RESET_ANNOTATIONS") {
    liveScanWorkflow.status = "RESET_ANNOTATIONS";
    liveScanWorkflow.annotatedFingers = {
      1: {},
      2: {},
      3: {},
      4: {},
      5: {},
      6: {},
      7: {},
      8: {},
      9: {},
      10: {}
    };
    return { ...state, liveScanWorkflow };
  } else if (type === "SET_ACTIVE_TAB") {
    liveScanWorkflow.status = "SET_ACTIVE_TAB";
    liveScanWorkflow.tab = action.payload.data;
    return { ...state, liveScanWorkflow };
  } else if (type === "SAVE_WEBCAM_IMAGE") {
    liveScanWorkflow.status = "SAVE_WEBCAM_IMAGE";
    liveScanWorkflow.webcamImage = action.payload.data;
    return { ...state, liveScanWorkflow };
  } else if (type === "RESET") {
    liveScanWorkflow.status = "RESET";
    liveScanWorkflow.started = false;
    liveScanWorkflow.completed = false;
    liveScanWorkflow.type = "fourFourTwo";
    (liveScanWorkflow.tab = "livescan"), (liveScanWorkflow.data = []);
    liveScanWorkflow.webcamImage = "";
    liveScanWorkflow.annotatedFingers = {
      1: {},
      2: {},
      3: {},
      4: {},
      5: {},
      6: {},
      7: {},
      8: {},
      9: {},
      10: {}
    };
    return { ...state, liveScanWorkflow };
  } else if (type === "RESET_EXCEPT_WEBCAM") {
    liveScanWorkflow.status = "RESET";
    liveScanWorkflow.started = false;
    liveScanWorkflow.completed = false;
    (liveScanWorkflow.tab = "livescan"), (liveScanWorkflow.data = []);
    liveScanWorkflow.annotatedFingers = {
      1: {},
      2: {},
      3: {},
      4: {},
      5: {},
      6: {},
      7: {},
      8: {},
      9: {},
      10: {}
    };
    return { ...state, liveScanWorkflow };
  } else if (type === "UPDATE_LOADING") {
    let loading = Object.assign({}, state.liveScanWorkflow.loading);
    liveScanWorkflow.loading = { ...loading, ...action.payload.data };
    return { ...state, liveScanWorkflow };
  } else if (type === "SAVE_TUSUPLOAD_OBJECT") {
    // console.log("SAVE_TUSUPLOAD_OBJECT", action.payload.data);
    liveScanWorkflow.tusUpload = action.payload.data;
    return { ...state, liveScanWorkflow };
  } else if (type === "RESET_LOADING") {
    liveScanWorkflow.loading = {
      percentage: 0,
      visible: false,
      failed: false,
      completed: false,
      filePath: "",
      checksum: "",
      fileName: ""
    };
    // console.log("FINAL", { ...state, liveScanWorkflow });
    return { ...state, liveScanWorkflow };
  }

  return state;
};
