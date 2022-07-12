import {
  requestSelectFinger,
  requestRemoveAnnotatedFinger,
  requestLoadLiveScan,
  requestSelectFingerSuccess,
  requestStoreCompletedData,
  requestStopScan,
  requestStartScan,
  requestStoreInitialLivescanData,
  requestSaveLivescanFingerprints,
  requestStoreCompletedDataSuccess,
  requestAnnotationSelectChanged,
  requestAnnotationNotesChanged,
  requestAnnotationFingerSave,
  requestCapture,
  requestShowMugshot,
  requestClearLivescanData,
  requestStoreCanonData,
  requestSetScannedType,
  palmScanWorkflow,
  liveScanWorkflow,
  requestSaveLivescanFingerprintsResumable,
  liveScanFingerprintResumableSuccess,
  requestCloseLiveScanProgress
} from "../../app/actions/liveScan";
import {
  REQUEST_SELECT_FINGER,
  REQUEST_SELECT_FINGER_SUCCESS,
  REQUEST_START_SCAN,
  REQUEST_STOP_SCAN,
  REQUEST_STORE_INITIAL_LIVESCAN_DATA,
  REQUEST_STORE_COMPLETED_DATA,
  REQUEST_STORE_COMPLETED_DATA_SUCCESS,
  REQUEST_SAVE_LIVESCAN_FINGERPRINTS,
  REQUEST_ANNOTATION_SELECT_CHANGED,
  REQUEST_ANNOTATION_NOTES_CHANGED,
  REQUEST_ANNOTATION_FINGER_SAVE,
  REQUEST_REMOVE_ANNOTATED_FINGERS,
  REQUEST_CAPTURE_DATA,
  REQUEST_MUGSHOT_DATA,
  REQUEST_CLEAR_LIVESCAN_DATA,
  REQUEST_LOAD_LIVESCAN,
  REQUEST_STORE_CANON_DATA,
  REQUEST_CAPTURE_DATA_CANON,
  REQUEST_SCANNED_TYPE,
  PALM_SCAN_WORKFLOW,
  LIVE_SCAN_WORKFLOW,
  REQUEST_SAVE_LIVESCAN_FINGERPRINTS_RESUMABLE_SUCCESS,
  REQUEST_SAVE_LIVESCAN_FINGERPRINTS_RESUMABLE,
  REQUEST_ClOSE_LIVESCAN_PROGRESS
} from "../../app/actions/actionTypes";

describe("Livescan Actions", () => {
  it("should create requestSelectFinger actions", () => {
    const output = requestSelectFinger(1);
    const expected = {
      type: REQUEST_SELECT_FINGER,
      payload: 1
    };
    expect(output).toEqual(expected);
  });
  it("should create requestSelectFingerSuccess actions", () => {
    const output = requestSelectFingerSuccess(1);
    const expected = {
      type: REQUEST_SELECT_FINGER_SUCCESS,
      payload: 1
    };
    expect(output).toEqual(expected);
  });
  it("should create requestStoreCompletedData actions", () => {
    const completedData = {};
    const output = requestStoreCompletedData(completedData);
    const expected = {
      type: REQUEST_STORE_COMPLETED_DATA,
      payload: completedData
    };
    expect(output).toEqual(expected);
  });
  it("should create requestRemoveAnnotatedFinger actions", () => {
    const output = requestRemoveAnnotatedFinger();
    const expected = {
      type: REQUEST_REMOVE_ANNOTATED_FINGERS
    };
    expect(output).toEqual(expected);
  });
  it("should create requestLoadLiveScan actions", () => {
    const output = requestLoadLiveScan();
    const expected = {
      type: REQUEST_LOAD_LIVESCAN
    };
    expect(output).toEqual(expected);
  });
  it("should create requestStartScan actions", () => {
    const output = requestStartScan();
    const expected = {
      type: REQUEST_START_SCAN
    };
    expect(output).toEqual(expected);
  });
  it("should create requestStopScan actions", () => {
    const output = requestStopScan();
    const expected = {
      type: REQUEST_STOP_SCAN
    };
    expect(output).toEqual(expected);
  });
  it("should create requestStoreInitialLivescanData actions", () => {
    const intialData = {};
    const output = requestStoreInitialLivescanData(intialData);
    const expected = {
      type: REQUEST_STORE_INITIAL_LIVESCAN_DATA,
      payload: intialData
    };
    expect(output).toEqual(expected);
  });
  it("should create requestSaveLivescanFingerprints actions", () => {
    const finalData = {};
    const output = requestSaveLivescanFingerprints(finalData);
    const expected = {
      type: REQUEST_SAVE_LIVESCAN_FINGERPRINTS,
      payload: finalData
    };
    expect(output).toEqual(expected);
  });
  it("should create requestStoreCompletedDataSuccess actions", () => {
    const finalData={
       "finalImage" : {},
       "finalRolledImage" : {}
    }
 
    const output = requestStoreCompletedDataSuccess({},{});
    const expected = {
      type: REQUEST_STORE_COMPLETED_DATA_SUCCESS,
      payload: {
        "finalImage" : {},
        "finalRolledImage" : {}
     }
    };
    expect(output).toEqual(expected);
  });
  it("should create requestAnnotationSelectChanged actions", () => {
    const annotation = {};
    const output = requestAnnotationSelectChanged(annotation);
    const expected = {
      type: REQUEST_ANNOTATION_SELECT_CHANGED,
      payload: annotation
    };
    expect(output).toEqual(expected);
  });
  it("should create requestAnnotationNotesChanged actions", () => {
    const annotationNotes = "Finger annotated";
    const output = requestAnnotationNotesChanged(annotationNotes);
    const expected = {
      type: REQUEST_ANNOTATION_NOTES_CHANGED,
      payload: annotationNotes
    };
    expect(output).toEqual(expected);
  });
  it("should create requestAnnotationFingerSave actions", () => {
    const annotationFinger = {};
    const output = requestAnnotationFingerSave(annotationFinger);
    const expected = {
      type: REQUEST_ANNOTATION_FINGER_SAVE,
      payload: annotationFinger
    };
    expect(output).toEqual(expected);
  });
  it("should create requestCapture actions", () => {
    const captureData = {};
    const output = requestCapture(captureData);
    const expected = {
      type: REQUEST_CAPTURE_DATA_CANON,
      payload: captureData
    };
    expect(output).toEqual(expected);
  });
  it("should create requestShowMugshot actions", () => {
    const showMugshotData = {
      selected: false
    };
    const output = requestShowMugshot(showMugshotData);
    const expected = {
      type: REQUEST_MUGSHOT_DATA,
      payload: showMugshotData
    };
    expect(output).toEqual(expected);
  });

  it("should create requestClearLivescanData actions", () => {
    const output = requestClearLivescanData();
    const expected = {
      type: REQUEST_CLEAR_LIVESCAN_DATA
    };
    expect(output).toEqual(expected);
  });
  it("should create requestStoreCanonData actions", () => {
    const data={
      imgData:"base64Data"
    }
    const output = requestStoreCanonData({imgData:"base64Data"});
    const expected = {
      type: REQUEST_STORE_CANON_DATA,
      payload:data
    };
    expect(output).toEqual(expected);
  });
  it("should create requestSetScannedType actions", () => {
   
    const output = requestSetScannedType("data");
    const expected = {
      type: REQUEST_SCANNED_TYPE,
      payload:"data"
    };
    expect(output).toEqual(expected);
  });
  it("should create palmScanWorkflow actions", () => {
   
    const output = palmScanWorkflow("data");
    const expected = {
      type: PALM_SCAN_WORKFLOW,
      payload:"data"
    };
    expect(output).toEqual(expected);
  });
  it("should create liveScanWorkflow actions", () => {
   
    const output = liveScanWorkflow("data");
    const expected = {
      type: LIVE_SCAN_WORKFLOW,
      payload:"data"
    };
    expect(output).toEqual(expected);
  });
  it("should create requestSaveLivescanFingerprintsResumable actions", () => {
   
    const output = requestSaveLivescanFingerprintsResumable("data");
    const expected = {
      type: REQUEST_SAVE_LIVESCAN_FINGERPRINTS_RESUMABLE,
      payload:"data"
    };
    expect(output).toEqual(expected);
  });
  it("should create liveScanFingerprintResumableSuccess actions", () => {
   
    const output = liveScanFingerprintResumableSuccess();
    const expected = {
      type: REQUEST_SAVE_LIVESCAN_FINGERPRINTS_RESUMABLE_SUCCESS
    };
    expect(output).toEqual(expected);
  });
  it("should create requestCloseLiveScanProgress actions", () => {
   
    const output = requestCloseLiveScanProgress();
    const expected = {
      type: REQUEST_ClOSE_LIVESCAN_PROGRESS
    };
    expect(output).toEqual(expected);
  });
});
