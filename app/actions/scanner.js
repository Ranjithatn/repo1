// @flow
import {
  REQUEST_START_SCANNER,
  REQUEST_START_SCANNER_SUCCESS,
  REQUEST_START_SCANNER_FAILED,
  REQUEST_STOP_SCANNER,
  REQUEST_STOP_SCANNER_SUCCESS,
  REQUEST_STOP_SCANNER_FAILED,
  REQUEST_START_CARD_SCAN,
  REQUEST_START_CARD_SCAN_FAILED,
  REQUEST_START_CARD_SCAN_SUCCESS,
  REQUEST_SEGMENTED_CARD_SCAN,
  REQUEST_SEGMENTED_CARD_SCAN_SUCCESS,
  REQUEST_SEGMENTED_CARD_SCAN_FAILED,
  REQUEST_FETCH_SCAN_SOURCES,
  REQUEST_FETCH_SCAN_SOURCES_SUCCESS,
  REQUEST_FETCH_SCAN_SOURCES_FAILED
} from "./actionTypes";

type ScanRequest = {
  Resolution: number,
  cardType: string,
  selectedScanSource: number
};

type CardType = "demoCard" | "FORM1" | "FORM2" | "FORM3" | "customCard" | "Custom";
// type CardType = "demoCard" | "ucwCard" | "custom" | "a4" | "KSA_A4";

export type ScanResponse = {
  cardImage: string,
  cardConfig?: any,
  cardType: CardType,
  onCompleted?: () => void
};

export const requestStartCardScan = (scanRequest: ScanRequest) => ({
  type: REQUEST_START_CARD_SCAN,
  payload: scanRequest
});

export const requestStartCardScanSuccess = (scanResponse: ScanResponse) => ({
  type: REQUEST_START_CARD_SCAN_SUCCESS,
  payload: scanResponse
});

export const requestStartCardScanFailed = () => ({
  type: REQUEST_START_CARD_SCAN_FAILED
});

export const requestSegmentedCardScan = () => ({
  type: REQUEST_SEGMENTED_CARD_SCAN
});

type SegmentedPrint = {
  b64Image: string,
  name: string
};
type SegmentedPrints = Array<SegmentedPrint>;
export const requestSegmentedCardScanSuccess = (
  segmentedPrints: SegmentedPrints
) => ({
  type: REQUEST_SEGMENTED_CARD_SCAN_SUCCESS,
  payload: segmentedPrints
});

export const requestSegmentedCardScanFailed = () => ({
  type: REQUEST_SEGMENTED_CARD_SCAN_FAILED
});

export const requestFetchScanSources = () => ({
  type: REQUEST_FETCH_SCAN_SOURCES
});

export type ScanSource = {
  displayName: string,
  value: number
};
export const requestFetchScanSourcesSuccess = (payload: Array<ScanSource>) => ({
  type: REQUEST_FETCH_SCAN_SOURCES_SUCCESS,
  payload
});

export const requestFetchScanSourcesFailed = () => ({
  type: REQUEST_FETCH_SCAN_SOURCES_FAILED
});
