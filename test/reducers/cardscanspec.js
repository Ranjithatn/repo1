import cardScan from "../../app/reducers/cardScan";
import {} from "../../app/actions/actionTypes";
import {} from "../../app/actions/global";
import {
cardScanWorkflow

} from "../../app/actions/cardScan";
import {

} from "../../app/actions/jobs";

describe("Latent reducer", () => {
  const initialState = {
    workflow: {
        status: 'EMPTY',
        cards: [],
        activeCard: 0,
        previousCardData: {},
      },
      config: {},
      current_scan: {
        path: '',
      },
      segmented: [],
      custom: {
        allOptions: [
          { value: "L. PLAIN LITTLE", displayName: "L. PLAIN LITTLE" },
          { value: "L. PLAIN RING", displayName: "L. PLAIN RING" },
          { value: "L. PLAIN MIDDLE", displayName: "L. PLAIN MIDDLE" },
          { value: "L. PLAIN INDEX", displayName: "L. PLAIN INDEX" },
          { value: "R. PLAIN LITTLE", displayName: "R. PLAIN LITTLE" },
          { value: "R. PLAIN RING", displayName: "R. PLAIN RING" },
          { value: "R. PLAIN MIDDLE", displayName: "R. PLAIN MIDDLE" },
          { value: "R. PLAIN INDEX", displayName: "R. PLAIN INDEX" },
          { value: "R. ROLLED THUMB", displayName: "R. ROLLED THUMB" },
          { value: "R. ROLLED INDEX", displayName: "R. ROLLED INDEX" },
          { value: "R. ROLLED MIDDLE", displayName: "R. ROLLED MIDDLE" },
          { value: "R. ROLLED RING", displayName: "R. ROLLED RING" },
          { value: "R. ROLLED LITTLE", displayName: "R. ROLLED LITTLE" },
          { value: "L. ROLLED THUMB", displayName: "L. ROLLED THUMB" },
          { value: "L. ROLLED INDEX", displayName: "L. ROLLED INDEX" },
          { value: "L. ROLLED MIDDLE", displayName: "L. ROLLED MIDDLE" },
          { value: "L. ROLLED RING", displayName: "L. ROLLED RING" },
          { value: "L. ROLLED LITTLE", displayName: "L. ROLLED LITTLE" },
          { value: "L. SLAP", displayName: "L. SLAP" },
          { value: "R. SLAP", displayName: "R. SLAP" },
          { value: "L. PLAIN THUMB", displayName: "L. PLAIN THUMB" },
          { value: "R. PLAIN THUMB", displayName: "R. PLAIN THUMB" },

          { value: "R. FULL PALM", displayName: "R. FULL PALM" },
          { value: "R. UPPER PALM", displayName: "R. UPPER PALM" },
          { value: "L. FULL PALM", displayName: "L. FULL PALM" },
          { value: "L. UPPER PALM", displayName: "L. UPPER PALM" },
        ],
        selectedIDS: [],
      },
      preview: {
        tab: "",
        data: {
          flat: [],
          rolled: [],
          palm: [],
        }
      },
  };
  it("should have an initial state", () => {
    const output = cardScan();
    const expected = { ...initialState };
    expect(output).toEqual(expected);
  });

  it("should handle CARD_SCAN_WORKFLOW", () => {
    const action = cardScanWorkflow({type:"CARD_SCAN_IMAGE",data:"data"});
    const output = cardScan(initialState, action);
    const expected = {
      ...initialState,
      workflow: {
        "activeCard": 0,
        cards: [],
        "status": "CARD_SCAN_IMAGE",
        previousCardData: {},
      }
    };
    expect(output).toEqual(expected);
  });
  it("should handle CARD_SCAN_WORKFLOW", () => {
    const action = cardScanWorkflow({type:"SET_ACTIVE_CARD",data:"data"});
    const output = cardScan(initialState, action);
    const expected = {
      ...initialState,
      workflow: {
        "activeCard": "data",
        cards: [],
        "status": "SET_ACTIVE_CARD",
        previousCardData: {},
      }
    };
    expect(output).toEqual(expected);
  });
  it("should handle CARD_SCAN_WORKFLOW", () => {
    const action = cardScanWorkflow({type:"SET_CARD_SCAN_CONFIG",data:{data:"data"}});
    const output = cardScan(initialState, action);
    const expected = {
      ...initialState,
      workflow: {
        "activeCard": 0,
        cards: [],
        "status": "SET_CARD_SCAN_CONFIG",
        "config":   {
            "data": "data",
           },
           previousCardData: {},
      },

    };
    expect(output).toEqual(expected);
  });
  it("should handle CARD_SCAN_WORKFLOW", () => {
    const action = cardScanWorkflow({type:"CARD_SCAN_INIT",data:{data:"data"}});
    const output = cardScan(initialState, action);
    const expected = {
      ...initialState,
      workflow: {
        "activeCard": 0,
        cards: [],
        "status": "CARD_SCAN_INIT",
        "current_scan": {data:"data"},
        previousCardData: {},
      },

    };
    expect(output).toEqual(expected);
  });
  it("should handle CARD_SCAN_WORKFLOW", () => {
    const action = cardScanWorkflow({type:"CARD_SCAN_CHANGE_ACTIVE_CARD",data:"data"});
    const output = cardScan(initialState, action);
    const expected = {
      ...initialState,
      workflow: {
        "activeCard": "data",
        cards: [],
        "status": "CARD_SCAN_CHANGE_ACTIVE_CARD",
        previousCardData: {},

      },

    };
    expect(output).toEqual(expected);
  });
  it("should handle CARD_SCAN_WORKFLOW", () => {
    const action = cardScanWorkflow({type:"SAVE_CARD_SCAN_BOXES",data:{image:"data",data:"data"}});
    initialState.segmented=[{
        image:"data",data:"data"
      }]
    const output = cardScan(initialState, action);
    const expected = {
      ...initialState,
      segmented: [{
        image:"data",data:"data"
      }],

    };
    expect(output).toEqual(expected);
  });
  it("should handle CARD_SCAN_WORKFLOW", () => {
    const action = cardScanWorkflow({type:"SAVE_CARD_SCAN_BOXES",data:{image:"data",data:"data"}});

    const output = cardScan(initialState, action);
    const expected = {
      ...initialState,
      segmented: [{
        image:"data",data:"data"
      }],

    };
    expect(output).toEqual(expected);
  });
  it("should handle CARD_SCAN_WORKFLOW", () => {
    const action = cardScanWorkflow({type:"SAVE_CARD_SCAN_BOXES",data:{image:"data",data:"data"}});
    initialState.segmented=[{
        image:"data1",data:"data1"
      }]
    const output = cardScan(initialState, action);
    const expected = {
      ...initialState,
      segmented: [
        {"data": "data1", "image": "data1"}, {"data": "data", "image": "data"}],

    };
    expect(output).toEqual(expected);
  });



});
