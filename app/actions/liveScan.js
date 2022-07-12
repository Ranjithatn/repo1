// @flow
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
  REQUEST_SAVE_LIVESCAN_FINGERPRINTS_RESUMABLE,
  REQUEST_SAVE_LIVESCAN_FINGERPRINTS_RESUMABLE_SUCCESS,
  REQUEST_ClOSE_LIVESCAN_PROGRESS
} from "./actionTypes";

export const requestSelectFinger = position => ({
  type: REQUEST_SELECT_FINGER,
  payload: position
});

export const requestRemoveAnnotatedFinger = () => ({
  type: REQUEST_REMOVE_ANNOTATED_FINGERS,
});

export const requestLoadLiveScan = () => ({
  type: REQUEST_LOAD_LIVESCAN,
});

export const requestSelectFingerSuccess = position => ({
  type: REQUEST_SELECT_FINGER_SUCCESS,
  payload: position
});

export const requestStartScan = () => ({
  type: REQUEST_START_SCAN
});

export const requestStoreInitialLivescanData = initialData => ({
  type: REQUEST_STORE_INITIAL_LIVESCAN_DATA,
  payload: initialData
});

export const requestStopScan = () => ({
  type: REQUEST_STOP_SCAN
});
export const requestCloseLiveScanProgress = () => ({
  type: REQUEST_ClOSE_LIVESCAN_PROGRESS
});

export const requestStoreCompletedData = finalImage => ({
  type: REQUEST_STORE_COMPLETED_DATA,
  payload: finalImage
});

export const requestSaveLivescanFingerprints = finalData => ({
  type: REQUEST_SAVE_LIVESCAN_FINGERPRINTS,
  payload: finalData
});

export const requestStoreCompletedDataSuccess = (finalImage, finalRolledImage) => {
  const sendData = {
    finalImage: finalImage,
    finalRolledImage: finalRolledImage
  }
  return{
    type: REQUEST_STORE_COMPLETED_DATA_SUCCESS,
    payload: sendData
  }
};

export const requestAnnotationSelectChanged = annotation => ({
  type: REQUEST_ANNOTATION_SELECT_CHANGED,
  payload: annotation
});

export const requestAnnotationNotesChanged = annotationNotes => ({
  type: REQUEST_ANNOTATION_NOTES_CHANGED,
  payload: annotationNotes
});

export const requestAnnotationFingerSave = annotationFinger => ({
  type: REQUEST_ANNOTATION_FINGER_SAVE,
  payload: annotationFinger
});

export const requestCapture= captureData => ({
  type: REQUEST_CAPTURE_DATA_CANON,
  payload: captureData
});

export const requestShowMugshot= showMugshotData => ({
  type: REQUEST_MUGSHOT_DATA,
  payload: showMugshotData
});

//requestCapture
export const requestClearLivescanData = () => ({
  type: REQUEST_CLEAR_LIVESCAN_DATA,
});

export const requestStoreCanonData = (data) => ({
  type: REQUEST_STORE_CANON_DATA,
  payload: data,
});

export const requestSetScannedType = (data) => ({
  type: REQUEST_SCANNED_TYPE,
  payload: data,
});

export const palmScanWorkflow = (data) => ({
  type: PALM_SCAN_WORKFLOW,
  payload: data,
});

export const liveScanWorkflow = (data) => ({
  type: LIVE_SCAN_WORKFLOW,
  payload: data,
});


export const requestSaveLivescanFingerprintsResumable = finalData => ({
  type: REQUEST_SAVE_LIVESCAN_FINGERPRINTS_RESUMABLE,
  payload: finalData
});


export const liveScanFingerprintResumableSuccess = () => ({
  type: REQUEST_SAVE_LIVESCAN_FINGERPRINTS_RESUMABLE_SUCCESS
});

