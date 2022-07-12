// @flow
import {
  REQUEST_RECEIVED_IMAGE,
  REQUEST_SAVE_SUD_SUCCESS,
  REQUEST_SHOW_SCANNED_IMAGE,
  REQUEST_IMPORT_IMAGE,
  REQUEST_CLEAR_LATENT_EDITOR_DATA,
  REQUEST_START_LATENT_SCAN,
  REQUEST_STOP_LATENT_SCAN,
  REQUEST_SAVE_INNOV_SPINNER,
  REQUEST_SAVE_INNOV_LICENSE,
} from "../actions/actionTypes";
const initialState = {
  latent: {},
  SUDData: {},
  latentScan: {
    isScan: false,
    base64Data: ""
  },
  start: false,
  spinner: false,
  license: true,
};

export default function latent(state = initialState, action = {}) {
  switch (action.type) {
    case REQUEST_RECEIVED_IMAGE:
      return { ...state, imgdata: action.payload };

    case REQUEST_SAVE_SUD_SUCCESS:
      return { ...state, SUDData: action.payload };

    case REQUEST_SHOW_SCANNED_IMAGE:
      return {
        ...state,
        latentScan: { isScan: true, base64Data: action.payload }
      };

    case REQUEST_IMPORT_IMAGE:
      return { ...state, latentScan: { isScan: false } };

    case REQUEST_CLEAR_LATENT_EDITOR_DATA:
      return { ...state, latent: {} };
    case REQUEST_START_LATENT_SCAN:
      return { ...state, start: true };
    case REQUEST_STOP_LATENT_SCAN:
      return { ...state, start: false };

    case REQUEST_SAVE_INNOV_SPINNER:
      return { ...state, spinner: action.payload };

    case REQUEST_SAVE_INNOV_LICENSE:
      return { ...state, license: action.payload };



    default:
      return state;
  }
}
