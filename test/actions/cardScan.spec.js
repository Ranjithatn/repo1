import * as action from "../../app/actions/cardScan";
import {
    CARD_SCAN_WORKFLOW,
    CARD_SCAN_RESET
} from "../../app/actions/actionTypes";

describe("CardScan Actions", () => {
  it("should create CARD_SCAN_WORKFLOW actions", () => {
   
    const output = action.cardScanWorkflow("data");
    const expected = {
      type: CARD_SCAN_WORKFLOW,
      payload: "data"
    };
    expect(output).toEqual(expected);
  });
  it("should create CARD_SCAN_RESET actions", () => {
   
    const output = action.cardScanReset("data");
    const expected = {
      type: CARD_SCAN_RESET,
      payload: "data"
    };
    expect(output).toEqual(expected);
  });
 
  
});
