import {
    REQUEST_SELECTED_BIOMETRICS,
    RECEIVED_BIOMETRICS_MUGSHOT,
    REQUEST_REMOVE_BIOMETRIC_MUGSHOT,
  } from "../actions/actionTypes";

const initialState = {
  showBiometrics: {
    selected: "fingerprint",
    title:"titlebio.fingerprint"
  },
  biometricMugshot:""

};
export default function scannedBiometrics(state = initialState, action = {}) {
    switch (action.type) {
      case REQUEST_SELECTED_BIOMETRICS:
       return { ...state, showBiometrics: action.payload };
 
      case RECEIVED_BIOMETRICS_MUGSHOT:
        return { ...state, biometricMugshot: action.payload };

      case REQUEST_REMOVE_BIOMETRIC_MUGSHOT:
        return { ...state, biometricMugshot: "" };

      default:
        return state
    }
}
