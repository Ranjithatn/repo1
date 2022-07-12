import latent from "../../app/reducers/latent";
import {} from "../../app/actions/actionTypes";
import {} from "../../app/actions/global";
import {
  requestReceivedImage,
  requestSaveSUDSuccess,
  requestShowScannedImage,
  requestImportImage
} from "../../app/actions/latent";
import { requestClearLatentEditorData } from "../../app/actions/jobs";

describe("Latent reducer", () => {
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
  it("should have an initial state", () => {
    const output = latent();
    const expected = { ...initialState };
    expect(output).toEqual(expected);
  });

  it("should handle REQUEST_RECEIVED_IMAGE", () => {
    const action = requestReceivedImage({
      img: "img"
    });
    const output = latent(initialState, action);
    const expected = {
      ...initialState,
      SUDData: {},
      imgdata: { img: "img" },
      latent: {},
      latentScan: { base64Data: "", isScan: false }
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_SAVE_SUD_SUCCESS", () => {
    const action = requestSaveSUDSuccess({
      img: "img"
    });
    const output = latent(initialState, action);
    const expected = {
      ...initialState,
      SUDData: { img: "img" },
      latent: {},
      latentScan: { base64Data: "", isScan: false }
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_SHOW_SCANNED_IMAGE", () => {
    const action = requestShowScannedImage({
      img: "img"
    });
    const output = latent(initialState, action);
    const expected = {
      ...initialState,
      SUDData: {},
      latent: {},
      latentScan: { base64Data: { img: "img" }, isScan: true }
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_IMPORT_IMAGE", () => {
    const action = requestImportImage();
    const output = latent(initialState, action);
    const expected = {
      ...initialState,

      latentScan: { isScan: false }
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_CLEAR_LATENT_EDITOR_DATA", () => {
    const action = requestClearLatentEditorData();
    const output = latent(initialState, action);
    const expected = {
      ...initialState,

      latent: {}
    };
    expect(output).toEqual(expected);
  });
});
