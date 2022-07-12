// @flow
import {
  REQUEST_RECEIVED_IMAGE,
  REQUEST_SAVE_LATENT_EDITED_IMAGE,
  REQUEST_SAVE_SUD,
  REQUEST_SAVE_SUD_SUCCESS,
  REQUEST_SHOW_SCANNED_IMAGE,
  REQUEST_IMPORT_IMAGE,
  REQUEST_START_LATENT_SCAN,
  REQUEST_STOP_LATENT_SCAN,
  REQUEST_SAVE_INNOV_SPINNER,
  REQUEST_SAVE_INNOV_LICENSE,
} from "./actionTypes";
type ImgData = {
  file: Object,
  base64: any
};
export const requestReceivedImage = (imgdata: ImgData) => ({
  type: REQUEST_RECEIVED_IMAGE,
  payload: imgdata
});
export const requestSaveLatentEditedImage = (EditedImgData, extra) => ({
  type: REQUEST_SAVE_LATENT_EDITED_IMAGE,
  payload: EditedImgData,
  extra: extra,
});
export const requestSaveSUD = SUDData => ({
  type: REQUEST_SAVE_SUD,
  payload: SUDData
});
export const requestSaveSUDSuccess = SUDData => ({
  type: REQUEST_SAVE_SUD_SUCCESS,
  payload: SUDData
});
export const requestShowScannedImage = image => ({
  type: REQUEST_SHOW_SCANNED_IMAGE,
  payload: image
});
export const requestImportImage = image => ({
  type: REQUEST_IMPORT_IMAGE,
  payload: image
});
export const requestStartLatentScan = () => ({
  type: REQUEST_START_LATENT_SCAN
});
export const requestStopLatentScan = () => ({
  type: REQUEST_STOP_LATENT_SCAN
});

export const requestSaveInnovSpinner = data => ({
  type: REQUEST_SAVE_INNOV_SPINNER,
  payload: data
});

export const requestSaveInnovLicense = data => ({
  type: REQUEST_SAVE_INNOV_LICENSE,
  payload: data
});



