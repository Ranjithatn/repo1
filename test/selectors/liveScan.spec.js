import {
  fingerNameSelector,
  fingerPositionSelector,
  completedFPSelector,
  completedRolledFPSelector,
  annotationReasonSelector,
  annotationNotesSelector,
  annotatedFingersSelector,
  mugshotDataSelector,
  LivescanProbeModalSelector,
  showMugshotDataSelector,
  VerifyannotatedFingersSelector,
  ScanDataTypeSelector,
  canonDataSelector,
  palmScanSelector,
  liveScanSelector,
  webcamImageSelector
} from "../../app/selectors/liveScan";

let state = {
  jobs: {
    jobType: "Tenprint",
    jobsById:{0:{type:"Tenprint"}}
  },
  modal: {
    modalProps: ""
  },
  liveScan: {
    positionDetails: {
      annotationPosition: "6",
      annotationFinger: "Left Thumb"
    },
    annotatedFingers: {
      1: { status: false, Reason: "", note: "" },
      2: { status: true, Reason: 1, note: "missing" }
    },
    finalCompletedData: {
      lefthand: {}
    },
    finalCompletedRolledData: {
      lefthand: {}
    },
    annotationReason: "2",
    annotationNotes: "xyz",
    mugshotData: {
      clicked: true
    },
    mugshotShowdata: {
      selected: false
    },
    scannedType: {
      workflow: "fourFourTwoName",
      workflowName: "fourFourTwo"
    },
    canonData: {
      ImageData: "base64"
    },
    palmScan: {
      visible: false,
      status: "",
      started: false,
      completed: false
    },
    liveScanWorkflow:{
      start:true,
      webcamImage:"data"
    }
  }
};
describe("Livescan Selectors", () => {
  describe("fingerNameSelector", () => {
    it("should get the annotated finger name", () => {
      const output = fingerNameSelector(state);
      const expected = "Left Thumb";
      expect(output).toEqual(expected);
    });
  });
  describe("fingerPositionSelector", () => {
    it("should get the annotated finger position", () => {
      const output = fingerPositionSelector(state);
      const expected = "6";
      expect(output).toEqual(expected);
    });
  });
  describe("completedFPSelector", () => {
    it("should get the flat fingers data", () => {
      const output = completedFPSelector(state);
      const expected = {
        lefthand: {}
      };
      expect(output).toEqual(expected);
    });
  });

  describe("completedRolledFPSelector", () => {
    it("should get the rolled fingers data", () => {
      const output = completedRolledFPSelector(state);
      const expected = {
        lefthand: {}
      };
      expect(output).toEqual(expected);
    });
  });
  describe("annotationReasonSelector", () => {
    it("should get the annotated reason", () => {
      const output = annotationReasonSelector(state);
      const expected = "2";
      expect(output).toEqual(expected);
    });
  });
  describe("annotationNotesSelector", () => {
    it("should get the annotated notes", () => {
      const output = annotationNotesSelector(state);
      const expected = "xyz";
      expect(output).toEqual(expected);
    });
  });
  describe("annotatedFingersSelector", () => {
    it("should get the annotated fingers", () => {
      const output = annotatedFingersSelector(state);
      const expected = {
        1: { status: false, Reason: "", note: "" },
        2: { status: true, Reason: 1, note: "missing" }
      };
      expect(output).toEqual(expected);
    });
  });
  describe("mugshotDataSelector", () => {
    it("should get the check for mugshot data", () => {
      const output = mugshotDataSelector(state);
      const expected = {
        clicked: true
      };
      expect(output).toEqual(expected);
    });
  });
  describe("LivescanProbeModalSelector", () => {
    it("should get the probe modal data", () => {
      const output = LivescanProbeModalSelector(state);
      const expected = {"ProbeData": "", "jobType": "Tenprint"};
      expect(output).toEqual(expected);
    });
  });
  describe("showMugshotDataSelector", () => {
    it("should get the selected mugshot", () => {
      const output = showMugshotDataSelector(state);
      const expected = {
        selected: false
      };
      expect(output).toEqual(expected);
    });
  });
  describe("VerifyannotatedFingersSelector", () => {
    it("should get the veified annotated fingers", () => {
      const output = VerifyannotatedFingersSelector(state);
      const expected = {
        1: { status: false, Reason: "", note: "" },
        2: { status: true, Reason: 1, note: "missing" }
      };
      expect(output).toEqual(expected);
    });
  });
  describe("ScanDataTypeSelector", () => {
    it("should get the scanner types", () => {
      const output = ScanDataTypeSelector(state);
      const expected = {
        workflow: "fourFourTwoName",
        workflowName: "fourFourTwo"
      };
      expect(output).toEqual(expected);
    });
  });
  describe("canonDataSelector", () => {
    it("should get the canon camera data", () => {
      const output = canonDataSelector(state);
      const expected = {
        ImageData: "base64"
      };
      expect(output).toEqual(expected);
    });
  });
  describe("palmScanSelector", () => {
    it("should get the palm scan data", () => {
      const output = palmScanSelector(state);
      const expected = {
        visible: false,
        status: "",
        started: false,
        completed: false
      };
      expect(output).toEqual(expected);
    });
  });
  describe("liveScanSelector", () => {
    it("should get theliveScanSelector data", () => {
      const output = liveScanSelector(state);
      const expected = {
        start:true,
        webcamImage:"data"
      };
      expect(output).toEqual(expected);
    });
  });
  describe("liveScanSelector", () => {
    it("should get webcamImageSelector data", () => {
      const output = webcamImageSelector(state);
      const expected = 
    
     "data"
      ;
      expect(output).toEqual(expected);
    });
  });
});
