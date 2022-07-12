import scannedBiometrics from "../../app/reducers/scannedBiometrics";
import {} from "../../app/actions/actionTypes";
import {} from "../../app/actions/global";
import {
requestSelectedBiometrics,
requestSaveBiometricMugshot,
requestRemoveBiometricMugshot

} from "../../app/actions/scannedBiometrics";
import {
 
} from "../../app/actions/jobs";

describe("Latent reducer", () => {
  const initialState = {
    showBiometrics: {
        selected: "fingerprint",
        title:"titlebio.fingerprint"
      },
      biometricMugshot:""
  };
  it("should have an initial state", () => {
    const output = scannedBiometrics();
    const expected = { ...initialState };
    expect(output).toEqual(expected);
  });

  it("should handle REQUEST_SELECTED_BIOMETRICS", () => {
    const action = requestSelectedBiometrics("data");
    const output = scannedBiometrics(initialState, action);
    const expected = {
      ...initialState,
      showBiometrics:"data"
    };
    expect(output).toEqual(expected);
  });

  it("should handle RECEIVED_BIOMETRICS_MUGSHOT", () => {
    const action = requestSaveBiometricMugshot("data");
    const output = scannedBiometrics(initialState, action);
    const expected = {
      ...initialState,
      biometricMugshot:"data"
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_REMOVE_BIOMETRIC_MUGSHOT", () => {
    const action = requestRemoveBiometricMugshot("data");
    const output = scannedBiometrics(initialState, action);
    const expected = {
      ...initialState,
      biometricMugshot:""
    };
    expect(output).toEqual(expected);
  });
  
});
