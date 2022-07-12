import { createSelector } from "reselect";


export const latentImageSelector = createSelector (
    state => state.latent,
    Imgpath => Imgpath
  );
export const latentSUDSelector = createSelector (
    state => state.latent.SUDData,
    SUDData => SUDData
  );
export const scannedImageSelector = createSelector (
    state => state.latent.latentScan,
    SUDData => SUDData
  );