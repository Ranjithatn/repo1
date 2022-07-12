import livescan from "../../app/reducers/liveScan";
import {} from "../../app/actions/actionTypes";
import {} from "../../app/actions/global";
import {
  requestLoadLiveScan,
  requestSelectFingerSuccess,
  requestStoreInitialLivescanData,
  requestStoreCompletedDataSuccess,
  requestAnnotationSelectChanged,
  requestAnnotationNotesChanged,
  requestAnnotationFingerSave,
  requestRemoveAnnotatedFinger,
  requestCapture,
  requestShowMugshot,
  requestClearLivescanData,
  requestSetScannedType,
  requestCloseLiveScanProgress,
  requestStoreCanonData,
  liveScanWorkflow,
  palmScanWorkflow
} from "../../app/actions/liveScan";

describe("Latent reducer", () => {
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
      completed: false,
      data: [],
      stopped: false,
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
      tusUpload: {},
    }
  };
  it("should have an initial state", () => {
    const output = livescan();
    const expected = { ...initialState };
    expect(output).toEqual(expected);
  });

  it("should handle REQUEST_LOAD_LIVESCAN", () => {
    const action = requestLoadLiveScan();
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
    const output = livescan(initialState, action);
    const expected = {
      ...initialState
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_SELECT_FINGER_SUCCESS", () => {
    const action = requestSelectFingerSuccess("data");

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      positionDetails: "data"
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_STORE_INITIAL_LIVESCAN_DATA", () => {
    // const action = requestStoreInitialLivescanData({finalImage:"data",finalRolledImage:"data"});
    const action = requestStoreInitialLivescanData("data");

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      Livescan: { initialData: "data" }
      //   finalCompletedData: "data",
      //   finalCompletedRolledData: "data"
    };
    expect(output).toEqual(expected);
  });
  xit("should handle REQUEST_STORE_COMPLETED_DATA_SUCCESS", () => {
    const action = requestStoreCompletedDataSuccess({
      finalImage: { data: "data" },
      finalRolledImage: { data: "data" }
    });

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,

      finalCompletedData: { data: "data" },
      finalCompletedRolledData: { data: "data" }
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_ANNOTATION_SELECT_CHANGED", () => {
    const action = requestAnnotationSelectChanged("data");

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      annotationReason: "data"
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_ANNOTATION_NOTES_CHANGED", () => {
    const action = requestAnnotationNotesChanged("data");

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      annotationNotes: "data"
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_ANNOTATION_FINGER_SAVE", () => {
    const action = requestAnnotationFingerSave({
      Position: "data",
      Reason: 0,
      Info: "data"
    });

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      annotationNotes: "",
      annotatedFingers: {
        ...initialState.annotatedFingers,
        data: {
          status: false,
          Reason: 0,
          note: "data"
        }
      }
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_ANNOTATION_FINGER_SAVE", () => {
    const action = requestAnnotationFingerSave({
      Position: "data",
      Reason: 1,
      Info: "data"
    });

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      annotationNotes: "",
      annotatedFingers: {
        ...initialState.annotatedFingers,
        data: {
          status: true,
          Reason: 1,
          note: "data"
        }
      }
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_REMOVE_ANNOTATED_FINGERS", () => {
    const action = requestRemoveAnnotatedFinger();

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      positionDetails: ""
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_CAPTURE_DATA_CANON", () => {
    const action = requestCapture("data");

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      mugshotData: "data"
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_MUGSHOT_DATA", () => {
    const action = requestShowMugshot("data");

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      mugshotShowdata: "data"
    };
    expect(output).toEqual(expected);
  });

  it("should handle REQUEST_CLEAR_LIVESCAN_DATA", () => {
    const action = requestClearLivescanData("data");

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      annotationNotes: "",
      finalCompletedData: "",
      annotationReason: "",
      positionDetails: "",
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
      canonData: { ImageData: null }
    };
    expect(output).toEqual(expected);
  });

  it("should handle REQUEST_SCANNED_TYPE", () => {
    const action = requestSetScannedType("flat");

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      scannedType: {
        workflow: "fourFourTwoName",
        workflowName: "fourFourTwo"
      }
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_SCANNED_TYPE", () => {
    const action = requestSetScannedType("rolled");

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      scannedType: {
        workflow: "fourFourTwoFlatAndRollsName",
        workflowName: "fourFourTwoFlatAndRolls"
      }
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_SCANNED_TYPE", () => {
    const action = requestSetScannedType("else");

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      scannedType: ""
    };
    expect(output).toEqual(expected);
  });
  // it("should handle REQUEST_ClOSE_LIVESCAN_PROGRESS", () => {
  //   const action = requestCloseLiveScanProgress();

  //   const output = livescan(initialState, action);
  //   const expected = {
  //     ...initialState,
  //     liveScanWorkflow: { inProgress: false }
  //   };
  //   expect(output).toEqual(expected);
  // });
  xit("should handle REQUEST_STORE_CANON_DATA", () => {
    const action = requestStoreCanonData({ data: "data" });

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      canonData: { data: "data" }
    };
    expect(output).toEqual(expected);
  });
  it("should handle liveScanWorkflow", () => {
    const action = liveScanWorkflow({
      type: "SET_LIVESCAN_TYPE",
      data: "flat"
    });

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      liveScanWorkflow: {
        ...initialState.liveScanWorkflow,
        type: "fourFourTwo",
        status: "SET_LIVESCAN_TYPE"
      }
    };
    expect(output).toEqual(expected);
  });
  it("should handle liveScanWorkflow", () => {
    const action = liveScanWorkflow({
      type: "SET_LIVESCAN_TYPE",
      data: "rolled"
    });

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      liveScanWorkflow: {
        ...initialState.liveScanWorkflow,
        type: "fourFourTwoFlatAndRolls",
        status: "SET_LIVESCAN_TYPE"
      }
    };
    expect(output).toEqual(expected);
  });
  it("should handle liveScanWorkflow", () => {
    const action = liveScanWorkflow({ type: "START_SCAN", data: "rolled" });

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      liveScanWorkflow: {
        ...initialState.liveScanWorkflow,
        status: "START_SCAN",
        started: true,
        visible: true,
        inProgress: true,

        completed: false,
        data: []
      }
    };
    expect(output).toEqual(expected);
  });
  it("should handle liveScanWorkflow", () => {
    const action = liveScanWorkflow({ type: "STOP_SCAN", data: "rolled" });

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      liveScanWorkflow: {
        ...initialState.liveScanWorkflow,
        status: "STOP_SCAN",
        started: false,
        annotatedFingers: {
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
        }
      }
    };
    expect(output).toEqual(expected);
  });
  it("should handle liveScanWorkflow", () => {
    const action = liveScanWorkflow({ type: "COMPLETE_SCAN", data: "rolled" });

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      liveScanWorkflow: {
        ...initialState.liveScanWorkflow,
        status: "COMPLETE_SCAN",
        started: false,
        completed: true,
        annotatedFingers: {
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
        }
      }
    };
    expect(output).toEqual(expected);
  });
  it("should handle liveScanWorkflow", () => {
    const action = liveScanWorkflow({ type: "SAVE_DATA", data: "rolled" });

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      liveScanWorkflow: {
        ...initialState.liveScanWorkflow,
        status: "SAVE_DATA",
        data: "rolled"
      }
    };
    expect(output).toEqual(expected);
  });
  it("should handle liveScanWorkflow", () => {
    const action = liveScanWorkflow({
      type: "SET_ANNOTATED_FINGERS",
      data: "rolled"
    });

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      liveScanWorkflow: {
        ...initialState.liveScanWorkflow,
        status: "SET_ANNOTATED_FINGERS",
        annotatedFingers: "rolled"
      }
    };
    expect(output).toEqual(expected);
  });
  it("should handle liveScanWorkflow", () => {
    const action = liveScanWorkflow({
      type: "RESET_ANNOTATIONS",
      data: "rolled"
    });

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      liveScanWorkflow: {
        ...initialState.liveScanWorkflow,
        status: "RESET_ANNOTATIONS",
        annotatedFingers: {
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
        }
      }
    };
    expect(output).toEqual(expected);
  });
  it("should handle liveScanWorkflow", () => {
    const action = liveScanWorkflow({ type: "SET_ACTIVE_TAB", data: "rolled" });

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      liveScanWorkflow: {
        ...initialState.liveScanWorkflow,
        status: "SET_ACTIVE_TAB",
        tab: "rolled"
      }
    };
    expect(output).toEqual(expected);
  });
  it("should handle liveScanWorkflow", () => {
    const action = liveScanWorkflow({
      type: "SAVE_WEBCAM_IMAGE",
      data: "rolled"
    });

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      liveScanWorkflow: {
        ...initialState.liveScanWorkflow,
        status: "SAVE_WEBCAM_IMAGE",
        webcamImage: "rolled"
      }
    };
    expect(output).toEqual(expected);
  });
  it("should handle liveScanWorkflow", () => {
    const action = liveScanWorkflow({ type: "RESET", data: "rolled" });

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      liveScanWorkflow: {
        ...initialState.liveScanWorkflow,
        status: "RESET",
        started: false,
        completed: false,
        type: "fourFourTwo",
        tab: "livescan",
        data: [],
        webcamImage: "",
        annotatedFingers: {
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
        }
      }
    };
    expect(output).toEqual(expected);
  });
  it("should handle liveScanWorkflow", () => {
    const action = liveScanWorkflow({
      type: "RESET_EXCEPT_WEBCAM",
      data: "rolled"
    });

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      liveScanWorkflow: {
        ...initialState.liveScanWorkflow,
        status: "RESET",
        started: false,
        completed: false,
        type: "fourFourTwo",
        tab: "livescan",
        data: [],

        annotatedFingers: {
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
        }
      }
    };
    expect(output).toEqual(expected);
  });
  it("should handle liveScanWorkflow", () => {
    const action = liveScanWorkflow({ type: "UPDATE_LOADING", data: "" });

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      liveScanWorkflow: {
        ...initialState.liveScanWorkflow,
        loading: { ...initialState.liveScanWorkflow.loading }
      }
    };
    expect(output).toEqual(expected);
  });
  it("should handle liveScanWorkflow", () => {
    const action = liveScanWorkflow({ type: "RESET_LOADING", data: "" });

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      liveScanWorkflow: {
        ...initialState.liveScanWorkflow,
        loading: {
          percentage: 0,
          visible: false,
          failed: false,
          completed: false,
          filePath: "",
          checksum: "",
          fileName: ""
        }
      }
    };
    expect(output).toEqual(expected);
  });
  it("should handle liveScanWorkflow", () => {
    const action = liveScanWorkflow({ type: "RESET_LOADING1", data: "" });

    const output = livescan(initialState, action);
    const expected = {
      ...initialState
    };
    expect(output).toEqual(expected);
  });
  it("should handle PALM_SCAN_WORKFLOW", () => {
    const action = palmScanWorkflow({ type: "", data: "" });

    const output = livescan(initialState, action);
    const expected = {
      ...initialState
      // palmScan:{
      //   ...initialState.palmScan,

      // }
    };
    expect(output).toEqual(expected);
  });
  it("should handle PALM_SCAN_WORKFLOW", () => {
    const action = palmScanWorkflow({ type: "START_SCAN", data: "" });

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      palmScan: {
        ...initialState.palmScan,
        status: "START_SCAN",
        started: true,
        visible: true,
        stopped: false,
      }
    };
    expect(output).toEqual(expected);
  });
  it("should handle PALM_SCAN_WORKFLOW", () => {
    const action = palmScanWorkflow({ type: "STOP_SCAN", data: "" });

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      palmScan: {
        ...initialState.palmScan,
        status: "STOP_SCAN",
        "stopped": false,
        started: false
      }
    };
    expect(output).toEqual(expected);
  });
  it("should handle PALM_SCAN_WORKFLOW", () => {
    const action = palmScanWorkflow({ type: "COMPLETE_SCAN", data: "" });

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      palmScan: {
        ...initialState.palmScan,
        status: "COMPLETE_SCAN",
        started: false,
        completed:true,
        stopped: false,
      }
    };
    expect(output).toEqual(expected);
  });
  it("should handle PALM_SCAN_WORKFLOW", () => {
    const action = palmScanWorkflow({ type: "SAVE_DATA", data: "data" });

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      palmScan: {
        ...initialState.palmScan,
        status: "SAVE_DATA",
        data:"data"
      }
    };
    expect(output).toEqual(expected);
  });
  it("should handle PALM_SCAN_WORKFLOW", () => {
    const action = palmScanWorkflow({ type: "SHOW", data: "data" });

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      palmScan: {
        ...initialState.palmScan,
        status: "SHOW",
        visible:true,
        stopped: false,
      }
    };
    expect(output).toEqual(expected);
  });
  it("should handle PALM_SCAN_WORKFLOW", () => {
    const action = palmScanWorkflow({ type: "HIDE", data: "data" });

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      palmScan: {
        ...initialState.palmScan,
        status: "HIDE",
        visible:false
      }
    };
    expect(output).toEqual(expected);
  });
  it("should handle PALM_SCAN_WORKFLOW", () => {
    const action = palmScanWorkflow({ type: "TOGGLE_VISIBILITY", data: "data" });

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      palmScan: {
        ...initialState.palmScan,

        visible:true
      }
    };
    expect(output).toEqual(expected);
  });
  it("should handle PALM_SCAN_WORKFLOW", () => {
    const action = palmScanWorkflow({ type: "RESET", data: "data" });

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,
      palmScan: {
        ...initialState.palmScan,
    started:false,
    visible:false,
    status:"RESET",
    "stopped": false,
    completed:false,
    data:[],
    stopped: false,

      }
    };
    expect(output).toEqual(expected);
  });
  it("should handle PALM_SCAN_WORKFLOW", () => {
    const action = palmScanWorkflow({ type: "RESET1", data: "data" });

    const output = livescan(initialState, action);
    const expected = {
      ...initialState,

    };
    expect(output).toEqual(expected);
  });












});
