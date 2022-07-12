import { createSelector } from "reselect";


export const cardScanWorkflowSelector = createSelector (
  state => state.cardScan.workflow,
  workflow => workflow
);

export const cardScanSelector = createSelector (
  state => state.cardScan,
  cardScan => cardScan
);

export const cardScanPreviewSelector = createSelector (
  state => state.cardScan.preview,
  preview => preview
);


