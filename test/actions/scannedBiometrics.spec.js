
import {
  REQUEST_SCANNED_IMAGE_MODAL,
  REQUEST_SELECTED_BIOMETRICS,
  REQUEST_BIOMETRICS_MUGSHOT,
  RECEIVED_BIOMETRICS_MUGSHOT,
  REQUEST_UPDATE_JOB_BIOMETRICS,
  REQUEST_REMOVE_BIOMETRIC_MUGSHOT,
} from "../../app/actions/app";
import {
  requestScannedImageModal,
  requestSelectedBiometrics,
  requestBiometricMugshot,
  requestSaveBiometricMugshot,
  requestUpdateJobBiometrics,
  requestRemoveBiometricMugshot
} from "../../app/actions/scannedBiometrics";


describe("app Actions", () => {
  it("should create requestScannedImageModal actions", () => {
    const data = {
      biometricMugshot: "",
      showBiometrics: { selected: "fingerprint", title: "titlebio.fingerprint" },
    };
    const output = requestScannedImageModal(data);

    const expected = {
      type: "REQUEST_SCANNED_IMAGE_MODAL",
      payload: data
    };
    
    expect(output).toEqual(expected);
  });
  it("should create requestSelectedBiometrics actions", () => {
    const data = {
      showBiometrics: {
        selected: "fp2",
        title: "abc2"
      },
      biometricMugshot: ""
    };
    const output = requestSelectedBiometrics(data);
    const expected = {
      type: "REQUEST_SELECTED_BIOMETRICS",
      payload: data
    };
    expect(output).toEqual(expected);
  });
  it("should create requestBiometricMugshot actions", () => {
    const data = {
      showBiometrics: {
        selected: "fp3",
        title: "abc3"
      },
      biometricMugshot: ""
    };
    const output = requestBiometricMugshot(data);
    const expected = {
      type: "REQUEST_BIOMETRICS_MUGSHOT",
      payload: data
    };
    expect(output).toEqual(expected);
  });
  it("should create requestSaveBiometricMugshot actions", () => {
    const data = {
      showBiometrics: {
        selected: "fp4",
        title: "abc4"
      },
      biometricMugshot: ""
    };
    const output = requestSaveBiometricMugshot(data);
    const expected = {
      type: "RECEIVED_BIOMETRICS_MUGSHOT",
      payload: data
    };
    expect(output).toEqual(expected);
  });
  it("should create requestUpdateJobBiometrics actions", () => {
  
    const output = requestUpdateJobBiometrics();
    console.log('output: ', output);
    
    const expected = {
      type: "REQUEST_UPDATE_JOB_BIOMETRICS",
    };
    console.log('expected: ', expected);
    expect(output).toEqual(expected);
  });
  it("should create requestRemoveBiometricMugshot actions", () => {
    const output = requestRemoveBiometricMugshot();
    const expected = {
      type: "REQUEST_REMOVE_BIOMETRIC_MUGSHOT",
    };
    expect(output).toEqual(expected);
  });
});
