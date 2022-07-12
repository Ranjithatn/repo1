// @flow
import {
  CARD_SCAN_WORKFLOW,
  CARD_SCAN_RESET,
} from "./actionTypes";

export const cardScanWorkflow = (data) => ({
  type: CARD_SCAN_WORKFLOW,
  payload: data,
});

export const cardScanReset = (data) => ({
  type: CARD_SCAN_RESET,
  payload: data,
});

