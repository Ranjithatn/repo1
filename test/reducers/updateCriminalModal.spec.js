import updateCriminalModal from "../../app/reducers/updateCriminalModal";
import {
  RECEIVE_INPUT_FIELD_CHANGED,
  REQUEST_SET_NEW_CRIME_TYPE_SUCCESS,
  REQUEST_DELETE_NEW_CRIME_DATA
} from "../../app/actions/actionTypes";

import { receiveInputFieldChanged } from "../../app/actions/global";
import { requestSetNewCrimeTypeSuccess } from "../../app/actions/jobs";

import { requestDeleteNewCrimeData } from "../../app/actions/tenprint";

describe("updateCriminalModal", () => {
  const initialState = {
    addCrimeData: {
      CaseType: "",
      Description: ""
    },
    addedCrimeData: [],
    linkData:{
      latentId:undefined,
      bioId:""
    }
  };

  it("should have an initial state", () => {
    const output = updateCriminalModal();
    const expected = { ...initialState };
    expect(output).toEqual(expected);
  });

  it("should handle RECEIVE_INPUT_FIELD_CHANGED", () => {
    const data = {};
    const receiveInputFieldChanged = {
      type: RECEIVE_INPUT_FIELD_CHANGED,
      payload: data
    };
    expect(updateCriminalModal({}, receiveInputFieldChanged)).toEqual(data);
  });

  it("should handle RECEIVE_INPUT_FIELD_CHANGED IF case", () => {
    const data = { area: "addCrimeType", field: "data", vallue: "data" };
    const action = receiveInputFieldChanged(data);
    const output = updateCriminalModal(initialState, action);
    const expected = {
      ...initialState,
      addCrimeData: { CaseType: "", Description: "", data: undefined },
      addedCrimeData: []
    };
    expect(output).toEqual(expected);
  });

  it("should handle REQUEST_SET_NEW_CRIME_TYPE_SUCCESS", () => {
    const initialState = { addedCrimeData: [] };
    const payload = { hello: "world" };
    const requestSetNewCrimeTypeSuccess = {
      type: REQUEST_SET_NEW_CRIME_TYPE_SUCCESS,
      payload: payload
    };
    expect(
      updateCriminalModal(initialState, requestSetNewCrimeTypeSuccess)
        .addedCrimeData
    ).toEqual([payload]);
  });

  it("should handle REQUEST_DELETE_NEW_CRIME_DATA", () => {
    const initialState = { addedCrimeData: [] };
    const requestDeleteNewCrimeData = {
      type: REQUEST_DELETE_NEW_CRIME_DATA,
      payload: initialState.addedCrimeData
    };
    expect(
      updateCriminalModal(initialState, requestDeleteNewCrimeData)
    ).toEqual(initialState);
  });
});
