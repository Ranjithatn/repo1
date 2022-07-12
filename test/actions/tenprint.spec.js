import * as action from "../../app/actions/tenprint";
import {
  REQUEST_TENPRINT_VERIFY,
  REQUEST_SET_TENPRINT_VERIFY,
  REQUEST_SET_TENPRINT_VERIFY_HAND,
  REQUEST_SET_TENPRINT_VERIFY_STORE,
  REQUEST_SET_TENPRINT_VERIFY_MATCH,
  REQUEST_SET_TENPRINT__VERIFY_MATCHED_DATA,
  REQUEST_REMOVE_TENPRINT__VERIFY_MATCHED_DATA,
  REQUEST_SHOW_ADJUDICATOR,
  REQUEST_LOAD_LIVESCAN,
  REQUEST_MATCHED_PERSON_CHANGED,
  RECIVED_MATCHED_PERSON_CHANGED,
  REQUEST_MODAL_DATA,
  RECIVED_MODAL_DATA,
  REQUEST_HIDE_ADJUDICATOR,
  RECIEVE_NOTE_STORE,
  REQUEST_SHOW_ADJUDICATOR_SUCCESS,
  REQUEST_SELECTED_TENPRINT_TYPE,
  REQUEST_SET_TENPRINT_VERIFY_RAW,
  MODAL_CHECKBOX,
  REQUEST_SET_ADD_NEW,
  REQUEST_DELETE_NEW_CRIME_DATA,
  TOGGLE_PANE_VISIBILITY,
  REQUEST_RESET_CRIME_DATA
} from "../../app/actions/actionTypes";

describe("Tenprint Actions", () => {
  it("should create requestTenprintVerify actions", () => {
   
    const output = action.requestTenprintVerify("historyDetails");
    const expected = {
      type: REQUEST_TENPRINT_VERIFY,
      payload: "historyDetails"
    };
    expect(output).toEqual(expected);
  });
  it("should create requestShowAdjudicator actions", () => {
   
    const output = action.requestShowAdjudicator("adjudicatorData");
    const expected = {
      type: REQUEST_SHOW_ADJUDICATOR,
      payload: "adjudicatorData"
    };
    expect(output).toEqual(expected);
  });
  it("should create requestShowAdjudicatorSuccess actions", () => {
   
    const output = action.requestShowAdjudicatorSuccess("adjudicatorData");
    const expected = {
      type: REQUEST_SHOW_ADJUDICATOR_SUCCESS,
      payload: "adjudicatorData"
    };
    expect(output).toEqual(expected);
  });
  it("should create requestSetTenprintVerify actions", () => {
   
    const output = action.requestSetTenprintVerify("tenprintData");
    const expected = {
      type: REQUEST_SET_TENPRINT_VERIFY,
      payload: "tenprintData"
    };
    expect(output).toEqual(expected);
  });
  it("should create requestSetTenprintVerifyHand actions", () => {
   
    const output = action.requestSetTenprintVerifyHand("tenprintHandData");
    const expected = {
      type: REQUEST_SET_TENPRINT_VERIFY_HAND,
      payload: "tenprintHandData"
    };
    expect(output).toEqual(expected);
  });
  it("should create requestSetTenprintVerifyStoreHand actions", () => {
   
    const output = action.requestSetTenprintVerifyStoreHand("tenprintHandData");
    const expected = {
      type: REQUEST_SET_TENPRINT_VERIFY_STORE,
      payload: "tenprintHandData"
    };
    expect(output).toEqual(expected);
  });
  it("should create requestSetTenprintVerifyMatchData actions", () => {
   
    const output = action.requestSetTenprintVerifyMatchData("TenprintVerifyMatchData ");
    const expected = {
      type: REQUEST_SET_TENPRINT_VERIFY_MATCH,
      payload: "TenprintVerifyMatchData "
    };
    expect(output).toEqual(expected);
  });
  it("should create requestSetTenprintVerifyStoreData actions", () => {
   
    const output = action.requestSetTenprintVerifyStoreData("TenprintVerifyStoreData  ");
    const expected = {
      type: REQUEST_SET_TENPRINT__VERIFY_MATCHED_DATA,
      payload: "TenprintVerifyStoreData  "
    };
    expect(output).toEqual(expected);
  });
  it("should create requestRemoveTenprintVerifyMatch actions", () => {
   
    const output = action.requestRemoveTenprintVerifyMatch();
    const expected = {
      type: REQUEST_REMOVE_TENPRINT__VERIFY_MATCHED_DATA
    };
    expect(output).toEqual(expected);
  });
  it("should create requestSelectedTenprintType actions", () => {
   
    const output = action.requestSelectedTenprintType("selected");
    const expected = {
      type: REQUEST_SELECTED_TENPRINT_TYPE,
      payload:"selected"
    };
    expect(output).toEqual(expected);
  });
  it("should create requestModalCheckbox actions", () => {
   
    const output = action.requestModalCheckbox("selected");
    const expected = {
      type: MODAL_CHECKBOX,
      payload:"selected"
    };
    expect(output).toEqual(expected);
  });
  it("should create recivedMatchedPersonChanged actions", () => {
   
    const output = action.recivedMatchedPersonChanged("data");
    const expected = {
      type: RECIVED_MATCHED_PERSON_CHANGED,
      payload:"data"
    };
    expect(output).toEqual(expected);
  });
  
  xit("should create requestMatchedPersonChanged actions", () => {
   const data={
    index:1,
    PersonDetails:"details",
    Selected:"val",
    userID:1
   }
    const output = action.requestMatchedPersonChanged(1,"dertails",data.Selected,1);
    const expected = {
      type: REQUEST_MATCHED_PERSON_CHANGED,
      payload:data
    };
    expect(output).toEqual(expected);
  });

  it("should create requestModalData actions", () => {
   
    const output = action.requestModalData();
    const expected = {
      type: REQUEST_MODAL_DATA
    };
    expect(output).toEqual(expected);
  });
  it("should create recivedModalData actions", () => {
   
    const output = action.recivedModalData("data");
    const expected = {
      type: RECIVED_MODAL_DATA,
      payload:"data"
    };
    expect(output).toEqual(expected);
  });
  it("should create requestHideAdjudicator actions", () => {
   
    const output = action.requestHideAdjudicator("status");
    const expected = {
      type: REQUEST_HIDE_ADJUDICATOR,
      payload:"status"
    };
    expect(output).toEqual(expected);
  });
  it("should create requestStoreNote actions", () => {
   
    const output = action.requestStoreNote("notedata");
    const expected = {
      type: RECIEVE_NOTE_STORE,
      payload:"notedata"
    };
    expect(output).toEqual(expected);
  });
  it("should create requestSetTenprintVerifyRaw actions", () => {
   
    const output = action.requestSetTenprintVerifyRaw("data");
    const expected = {
      type: REQUEST_SET_TENPRINT_VERIFY_RAW,
      payload:"data"
    };
    expect(output).toEqual(expected);
  });
  it("should create requestTogglePaneVisibility actions", () => {
   
    const output = action.requestTogglePaneVisibility("data");
    const expected = {
      type: TOGGLE_PANE_VISIBILITY,
      payload:"data"
    };
    expect(output).toEqual(expected);
  });
  it("should create requestDeleteNewCrimeData actions", () => {
   
    const output = action.requestDeleteNewCrimeData(1);
    const expected = {
      type: REQUEST_DELETE_NEW_CRIME_DATA,
      payload:1
    };
    expect(output).toEqual(expected);
  });



  it("should create requestSetAddnew actions", () => {
   
    const output = action.requestSetAddnew();
    const expected = {
      type: REQUEST_SET_ADD_NEW
    };
    expect(output).toEqual(expected);
  });

  it("should create REQUEST_RESET_CRIME_DATA actions", () => {
   
    const output = action.requestResetCrimeType();
    const expected = {
      type: REQUEST_RESET_CRIME_DATA
    };
    expect(output).toEqual(expected);
  });
  
});
