import app from "../../app/reducers/app";
import {} from "../../app/actions/actionTypes";
import {} from "../../app/actions/global";
import {
requestUpdateServerStatus,
requestUpdateNFIQQualityThreshold

} from "../../app/actions/app";
import {
 
} from "../../app/actions/jobs";

describe("Latent reducer", () => {
  const initialState = {
    serverStatus: 'unknown',
    settings: {
        nfiq_quality_threshold: 'loading...',
    },
  };
  it("should have an initial state", () => {
    const output = app();
    const expected = { ...initialState };
    expect(output).toEqual(expected);
  });

  it("should handle UPDATE_SERVER_STATUS", () => {
    const action = requestUpdateServerStatus("data");
    const output = app(initialState, action);
    const expected = {
      ...initialState,
      serverStatus:"data"
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_NFIQ_QUALITY_THRESHOLD_SUCCESS", () => {
    const action = requestUpdateNFIQQualityThreshold("data");
    const output = app(initialState, action);
    const expected = {
      ...initialState,
      settings: {
        nfiq_quality_threshold: 'data',
    }
    };
    expect(output).toEqual(expected);
  });

  
  
});
