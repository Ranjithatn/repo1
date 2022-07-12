import {
  REQUEST_SCANNED_IMAGE_MODAL,
  REQUEST_SELECTED_BIOMETRICS,
  REQUEST_BIOMETRICS_MUGSHOT,
  RECEIVED_BIOMETRICS_MUGSHOT,
  REQUEST_UPDATE_JOB_BIOMETRICS,
  REQUEST_REMOVE_BIOMETRIC_MUGSHOT,
} from "./actionTypes";

export const requestScannedImageModal = imageDetails => ({
  type: REQUEST_SCANNED_IMAGE_MODAL,
  payload: imageDetails
});

export const requestSelectedBiometrics = selected => ({
  type: REQUEST_SELECTED_BIOMETRICS,
  payload: selected
});

export const requestBiometricMugshot = selected => ({
  type: REQUEST_BIOMETRICS_MUGSHOT,
  payload: selected
});

export const requestSaveBiometricMugshot = biometricMugshot => ({
  type: RECEIVED_BIOMETRICS_MUGSHOT,
  payload: biometricMugshot
});

export const requestUpdateJobBiometrics = () => ({
  type: REQUEST_UPDATE_JOB_BIOMETRICS,
});

export const requestRemoveBiometricMugshot = () => ({
  type: REQUEST_REMOVE_BIOMETRIC_MUGSHOT,
});
