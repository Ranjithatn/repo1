import {
  UPDATE_SERVER_STATUS,
  REQUEST_NFIQ_QUALITY_THRESHOLD,
  REQUEST_NFIQ_QUALITY_THRESHOLD_SUCCESS,
} from "./actionTypes";

export const requestUpdateServerStatus = (data) => {
	return {
	  type: UPDATE_SERVER_STATUS,
	  payload: data
	};
}

export const requestNFIQQualityThreshold = (data) => {
	return {
	  type: REQUEST_NFIQ_QUALITY_THRESHOLD,
	  payload: data
	};
}

export const requestUpdateNFIQQualityThreshold = (data) => {
	return {
	  type: REQUEST_NFIQ_QUALITY_THRESHOLD_SUCCESS,
	  payload: data
	};
}

