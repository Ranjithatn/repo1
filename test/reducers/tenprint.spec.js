import tenprint from "../../app/reducers/tenprint";
import {
  REQUEST_SET_TENPRINT_VERIFY,
  REQUEST_SET_TENPRINT_VERIFY_STORE,
  REQUEST_SET_TENPRINT__VERIFY_MATCHED_DATA,
  REQUEST_REMOVE_TENPRINT__VERIFY_MATCHED_DATA,
  REQUEST_SHOW_ADJUDICATOR_SUCCESS,
  RECIVED_MATCHED_PERSON_CHANGED,
  RECIVED_MODAL_DATA,
  REQUEST_HIDE_ADJUDICATOR,
  RECIEVE_NOTE_STORE,
  //tenprint verify new
  REQUEST_SELECTED_TENPRINT_TYPE,
  REQUEST_SET_TENPRINT_VERIFY_RAW,
  MODAL_CHECKBOX
} from "../../app/actions/actionTypes";

import {
  requestSetTenprintVerify,
  requestSetTenprintVerifyRaw,
  requestSetTenprintVerifyStoreData,
  requestRemoveTenprintVerifyMatch,
  requestShowAdjudicatorSuccess,
  requestHideAdjudicator,
  requestStoreNote,
  recivedModalData,
  recivedMatchedPersonChanged,
  requestTogglePaneVisibility,
  requestSelectedTenprintType,
  requestModalCheckbox
} from "../../app/actions/tenprint";
// import {
//   requestSetNewCrimeTypeSuccess
// } from "../../app/actions/jobs";

// import {
//   requestDeleteNewCrimeData
// } from "../../app/actions/tenprint";

describe("tenprint reducer", () => {
  const initialState = {
    tenprintverifydata: {},
    tenprintverifyMatchInfo: {
      Results: []
    },
    tenprintverifyHandData: {
      position: "Left"
    },
    ShowAdjudicator: false,
    SelectedRow: 0,
    AdjudicatorPassImageData: {
      Result: {
        matched: {
          image: ""
        }
      }
    },
    MatchedUserRowID: "",
    MatchedPersonInfo: {},
    adjudicatorMatch: [],
    ConfirmModalData: {},
    selectedSearchOption: undefined,
    //tenprint verify new
    showTenprintSelected: {
      selected: "fingerprint",
      title: "titlebio.fingerprint"
    },
    adjudicatorResult: {},

    //update and register modal lashing, fine initial state
    ModalCheckbox: {
      lashing: false,
      fine: false
    },

    panes: {
      sidebar: true,
      table: true
    }
  };

  it("should have an initial state", () => {
    const output = tenprint();
    const expected = { ...initialState };
    expect(output).toEqual(expected);
  });

  it("should handle REQUEST_SET_TENPRINT_VERIFY", () => {
    const action = requestSetTenprintVerify({
      leftmatches: {
        fingers: "base64data"
      }
    });
    const output = tenprint(initialState, action);
    const expected = {
      ...initialState,
      AdjudicatorPassImageData: { Result: { matched: { image: "" } } },
      ConfirmModalData: {},
      MatchedPersonInfo: {},
      MatchedUserRowID: "",
      ModalCheckbox: { fine: false, lashing: false },
      SelectedRow: 0,
      ShowAdjudicator: false,
      adjudicatorMatch: "base64data",
      adjudicatorResult: {},
      panes: { sidebar: true, table: true },
      selectedSearchOption: undefined,
      showTenprintSelected: {
        selected: "fingerprint",
        title: "titlebio.fingerprint"
      },
      tenprintverifyHandData: { position: "Left" },
      tenprintverifyMatchInfo: { Results: [] },
      tenprintverifydata: { leftmatches: { fingers: "base64data" } }
    };
    expect(output).toEqual(expected);
  });

  it("should handle REQUEST_SET_TENPRINT_VERIFY_RAW ", () => {
    const action = requestSetTenprintVerifyRaw("data");
    const output = tenprint(initialState, action);
    const expected = {
      ...initialState,
      tenprint: "data"
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_SET_TENPRINT_VERIFY_MATCH_DATA", () => {
    const action = requestSetTenprintVerifyStoreData({ SelectedRow: "data" });
    const output = tenprint(initialState, action);
    const expected = {
      ...initialState,
      tenprintverifyMatchInfo: { SelectedRow: "data" },
      SelectedRow: "data",
      ShowAdjudicator: false
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_REMOVE_TENPRINT__VERIFY_MATCHED_DATA", () => {
    const action = requestRemoveTenprintVerifyMatch({ SelectedRow: "data" });
    const output = tenprint(initialState, action);
    const expected = {
      ...initialState
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_SHOW_ADJUDICATOR_SUCCESS", () => {
    const action = requestShowAdjudicatorSuccess({
      status: true,
      Result: { matched: "data", probe: "data" }
    });
    const output = tenprint(initialState, action);
    const expected = {
      ...initialState
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_HIDE_ADJUDICATOR", () => {
    const action = requestHideAdjudicator("data");
    const output = tenprint(initialState, action);
    const expected = {
      ...initialState,
      ShowAdjudicator: "data"
    };
    expect(output).toEqual(expected);
  });
  it("should handle RECIVED_MODAL_DATA", () => {
    const action = recivedModalData("data");
    const output = tenprint(initialState, action);
    const expected = {
      ...initialState,
      ConfirmModalData: "data"
    };
    expect(output).toEqual(expected);
  });
  it("should handle RECIEVE_NOTE_STORE", () => {
    const action = requestStoreNote("data");
    const output = tenprint(initialState, action);
    const expected = {
      ...initialState,
      ActionNote: "data"
    };
    expect(output).toEqual(expected);
  });
  it("should handle RECIVED_MATCHED_PERSON_CHANGED", () => {
    const action = recivedMatchedPersonChanged({
      Index: 1,
      PersonInfo: "data"
    });
    const output = tenprint(initialState, action);
    const expected = {
      ...initialState,
      MatchedUserRowID: 1,
      MatchedPersonInfo: "data"
    };
    expect(output).toEqual(expected);
  });
  it("should handle TOGGLE_PANE_VISIBILITY", () => {
    const action = requestTogglePaneVisibility({
      pane: "all",
      visible: "data"
    });
    const output = tenprint(initialState, action);
    let panes = {
      sidebar: "data",
      table: "data"
    };
    const expected = {
      ...initialState,
      panes
    };
    expect(output).toEqual(expected);
  });
  it("should handle TOGGLE_PANE_VISIBILITY", () => {
    const action = requestTogglePaneVisibility({
      pane: "all1",
      visible: "data"
    });
    const output = tenprint(initialState, action);
    let panes = {
      all1: "data",
      sidebar: true,
      table: true
    };
    const expected = {
      ...initialState,
      panes
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_SELECTED_TENPRINT_TYPE", () => {
    const action = requestSelectedTenprintType("data");
    const output = tenprint(initialState, action);

    const expected = {
      ...initialState,
      showTenprintSelected:"data"
    };
    expect(output).toEqual(expected);
  });
  it("should handle MODAL_CHECKBOX", () => {
    const action = requestModalCheckbox({type:"data",status:"data"});
    const output = tenprint(initialState, action);

    const expected = {
      ...initialState,
      
    };
    expect(output).toEqual(expected);
  });

  // it('should handle REQUEST_SET_NEW_CRIME_TYPE_SUCCESS', () => {

  //   const initialState = { addedCrimeData: [] };
  //   const payload = { hello: "world" };
  //   const requestSetNewCrimeTypeSuccess = {
  //     type: REQUEST_SET_NEW_CRIME_TYPE_SUCCESS,
  //     payload: payload
  //   };
  //   expect(updateCriminalModal(initialState, requestSetNewCrimeTypeSuccess).addedCrimeData).toEqual([payload]);
  // });

  // it('should handle REQUEST_DELETE_NEW_CRIME_DATA', () => {
  //   const initialState = { addedCrimeData: [] };
  //   const requestDeleteNewCrimeData = {
  //     type: REQUEST_DELETE_NEW_CRIME_DATA,
  //     payload: initialState.addedCrimeData,
  //   };
  //   expect(updateCriminalModal(initialState, requestDeleteNewCrimeData)).toEqual(initialState);
  // });
});
