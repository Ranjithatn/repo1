// @flow
import {
  requestStartCardScan,
  requestStartCardScanSuccess,
  requestStartCardScanFailed,
  requestSegmentedCardScan,
  requestSegmentedCardScanSuccess,
  requestSegmentedCardScanFailed,
  requestFetchScanSources,
  requestFetchScanSourcesSuccess,
  requestFetchScanSourcesFailed
} from "../../app/actions/scanner";
import type { ScanResponse } from "../../app/actions/scanner";
import {
  REQUEST_START_SCANNER,
  REQUEST_START_SCANNER_SUCCESS,
  REQUEST_START_SCANNER_FAILED,
  REQUEST_START_CARD_SCAN,
  REQUEST_START_CARD_SCAN_FAILED,
  REQUEST_START_CARD_SCAN_SUCCESS,
  REQUEST_SEGMENTED_CARD_SCAN,
  REQUEST_SEGMENTED_CARD_SCAN_SUCCESS,
  REQUEST_SEGMENTED_CARD_SCAN_FAILED,
  REQUEST_FETCH_SCAN_SOURCES,
  REQUEST_FETCH_SCAN_SOURCES_SUCCESS,
  REQUEST_FETCH_SCAN_SOURCES_FAILED
} from "../../app/actions/actionTypes";

describe("scanner actions", () => {
  it("should make startCardscan action", () => {
    const scanRequestData = {
      IsSegmented: true,
      Resolution: 500,
      cardType: "fbiCriminal"
    };
    const output = requestStartCardScan(scanRequestData);
    const expected = {
      type: REQUEST_START_CARD_SCAN,
      payload: {
        IsSegmented: true,
        Resolution: 500,
        cardType: "fbiCriminal"
      }
    };
    expect(output).toEqual(expected);
  });

  it("should make startCardscanSuccess action", () => {
    const scanResponse = {
      IsSegmented: true,
      cardImage: "cardImage",
      cardConfig: "cardConfig",
      cardType: "fbiCriminal"
    };
    const output = requestStartCardScanSuccess(scanResponse);
    const expected = {
      type: REQUEST_START_CARD_SCAN_SUCCESS,
      payload: {
        IsSegmented: true,
        cardImage: "cardImage",
        cardConfig: "cardConfig",
        cardType: "fbiCriminal"
      }
    };
    expect(output).toEqual(expected);
  });

  it("should make startCardScanFailed action", () => {
    const output = requestStartCardScanFailed();
    const expected = {
      type: REQUEST_START_CARD_SCAN_FAILED
    };
    expect(output).toEqual(expected);
  });

  it("should make requestSegmentedCardScan action", () => {
    const output = requestSegmentedCardScan();
    const expected = {
      type: REQUEST_SEGMENTED_CARD_SCAN
    };
    expect(output).toEqual(expected);
  });

  it("should make requestSegmentedCardScanFailed action", () => {
    const output = requestSegmentedCardScanFailed();
    const expected = {
      type: REQUEST_SEGMENTED_CARD_SCAN_FAILED
    };
    expect(output).toEqual(expected);
  });

  it("should make requestSegmentedCardScanSuccess action", () => {
    const payload = [{b64Image: "a", name: "b"}, {b64Image: "c", name: "d"}];
    const output = requestSegmentedCardScanSuccess(payload);
    const expected = {
      type: REQUEST_SEGMENTED_CARD_SCAN_SUCCESS,
      payload
    };
    expect(output).toEqual(expected);
  });

  it("should make requestFetchScanSources action", () => {
    const output = requestFetchScanSources();
    const expected = {
      type: REQUEST_FETCH_SCAN_SOURCES,
    };
    expect(output).toEqual(expected);
  });

  it("should make requestFetchScanSourcesSuccess action", () => {
    const payload = [{value: 0, displayName: "Epson 800"}, {value: 1, displayName: "Canon Scan"}];
    const output = requestFetchScanSourcesSuccess(payload);
    const expected = {
      type: REQUEST_FETCH_SCAN_SOURCES_SUCCESS,
      payload: payload
    };
    expect(output).toEqual(expected);
  });

  it("should make requestFetchScanSourcesFailed action", () => {
    const output = requestFetchScanSourcesFailed();
    const expected = {
      type: REQUEST_FETCH_SCAN_SOURCES_FAILED
    };
    expect(output).toEqual(expected);
  });

});

