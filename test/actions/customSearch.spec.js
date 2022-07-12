import {
  setPersonData,
  resetCustomSearchData,
  requestUpdateSearchText,
  requestSetCustomSearchID,
  requestGetJobSearchText,
  requestGetJobSearchTextSuccess,
  setCustomSearchDatabase
} from "../../app/actions/customSearch";
import {
  REQUEST_SET_PERSON_DATA,
  REQUEST_RESET_CUSTOM_SEARCH_DATA,
  REQUEST_SET_CUSTOM_SEARCH_ID,
  REQUEST_UPDATE_SEARCH_TEXT,
  REQUEST_GET_JOB_SEARCH_TEXT,
  REQUEST_GET_JOB_SEARCH_TEXT_SUCCESS,
  REQUEST_SET_CUSTOM_SEARCH_DATABASE
} from "../../app/actions/actionTypes";

describe("CustomSearch Actions", () => {
  it("should create setPersonData actions", () => {
    const data = {
      personData: {},
      index: 1
    };
    const output = setPersonData({}, 1);
    const expected = {
      type: REQUEST_SET_PERSON_DATA,
      payload: data
    };
    expect(output).toEqual(expected);
  });
  it("should create resetCustomSearchData actions", () => {
    const output = resetCustomSearchData();
    const expected = {
      type: REQUEST_RESET_CUSTOM_SEARCH_DATA
    };
    expect(output).toEqual(expected);
  });
  it("should create requestUpdateSearchText actions", () => {
    const output = requestUpdateSearchText();
    const expected = {
      type: REQUEST_UPDATE_SEARCH_TEXT
    };
    expect(output).toEqual(expected);
  });
  it("should create requestSetCustomSearchID actions", () => {
    const output = requestSetCustomSearchID("searchIdList");
    const expected = {
      type: REQUEST_SET_CUSTOM_SEARCH_ID,
      payload: "searchIdList"
    };
    expect(output).toEqual(expected);
  });
  it("should create requestGetJobSearchText actions", () => {
    const output = requestGetJobSearchText(1);
    const expected = {
      type: REQUEST_GET_JOB_SEARCH_TEXT,
      payload: 1
    };
    expect(output).toEqual(expected);
  });
  it("should create requestGetJobSearchTextSuccess actions", () => {
    const data = { SAMISID: "123", FileNo: "123" };
    const output = requestGetJobSearchTextSuccess({
      SAMISID: "123",
      FileNo: "123"
    });
    const expected = {
      type: REQUEST_GET_JOB_SEARCH_TEXT_SUCCESS,
      payload: data
    };
    expect(output).toEqual(expected);
  });
  it("should create setCustomSearchDatabase actions", () => {
    const data = { SAMISID: "123", FileNo: "123" };
    const output = setCustomSearchDatabase({
      SAMISID: "123",
      FileNo: "123"
    });
    const expected = {
      type: REQUEST_SET_CUSTOM_SEARCH_DATABASE,
      payload: data
    };
    expect(output).toEqual(expected);
  });
});
