import customSearch from "../../app/reducers/customSearch";
import { REQUEST_SHOW_AUDITLOG_SUCCESS } from "../../app/actions/actionTypes";
import { receiveInputFieldChanged } from "../../app/actions/global";
import { setPersonData,requestSetCustomSearchID,resetCustomSearchData,setCustomSearchDatabase,requestGetJobSearchTextSuccess } from "../../app/actions/customSearch";
// import { requestLogoutSuccess } from "../../app/actions/auth";
// import { requestHideModal } from "../../app/actions/modal";

describe("Custom Search Log reducer", () => {
  const initialState = {
    customSearch: {
      SAMISID: "",
      fileNo: ""
    },
    customSearchPersonInfo: [],
    searchIdList: [],
    matchedRowId: 0,
    database: "",
    response: {}
  };
  it("should have an initial state", () => {
    const output = customSearch();
    const expected = { ...initialState };
    expect(output).toEqual(expected);
  });

  it("should handle RECEIVE_INPUT_FIELD_CHANGED", () => {
    const action = receiveInputFieldChanged({
      field: "SAMISID",
      value: "fieldValue",
      area: "custom"
    });
    const output = customSearch(initialState, action);
    const expected = {
      ...initialState,
      customSearch: { SAMISID: "fieldValue", fileNo: "" },
      customSearchPersonInfo: [],
      database: "",
      matchedRowId: 0,
      searchIdList: [],
      response: {}
    };
    expect(output).toEqual(expected);
  });

  it("should handle RECEIVE_INPUT_FIELD_CHANGED for case fileno", () => {
    const action = receiveInputFieldChanged({
      field: "fileNo",
      value: "fieldValue",
      area: "custom"
    });
    const output = customSearch(initialState, action);
    const expected = {
      ...initialState,
      customSearch: { SAMISID: "fieldValue", fileNo: "" },
      customSearchPersonInfo: [],
      database: "",
      matchedRowId: 0,
      searchIdList: [],
      response: {}
    };
    expect(output).toEqual(expected);
  });
  it("should handle RECEIVE_INPUT_FIELD_CHANGED for case fileno", () => {
    const action = receiveInputFieldChanged({
      field: "fileNo",
      value: 1,
      area: "custom"
    });
    const output = customSearch(initialState, action);
    const expected = {
      ...initialState,
      customSearch: { SAMISID: "fieldValue", fileNo: 1 },
      customSearchPersonInfo: [],
      database: "",
      matchedRowId: 0,
      searchIdList: [],
      response: {}
    };
    expect(output).toEqual(expected);
  });
  it("should handle RECEIVE_INPUT_FIELD_CHANGED for case fileno", () => {
    const action = receiveInputFieldChanged({
      field: "fileNo",
      value: 1,
      area: "custom1"
    });
    const output = customSearch(initialState, action);
    const expected = {
      ...initialState
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_SET_PERSON_DATA for case fileno", () => {
    const action = setPersonData({
      personData: {
        id: "1"
      },
      index: 1
    });
    const output = customSearch(initialState, action);
    const expected = {
      ...initialState,
      customSearchPersonInfo: {
        index: 1,
        personData: { id: "1" }
      },
      matchedRowId: undefined
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_SET_CUSTOM_SEARCH_ID ", () => {
    const action = requestSetCustomSearchID([
        {
          "key": "SAMISID",
          "value": "edf"
        },
        {
          "key": "File Number",
          "value": "35"
        }
      ]);
    const output = customSearch(initialState, action);
    const expected = {
      ...initialState,
      searchIdList:[
        {
          "key": "SAMISID",
          "value": "edf"
        },
        {
          "key": "File Number",
          "value": "35"
        }
      ]
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_RESET_CUSTOM_SEARCH_DATA ", () => {
    const action = resetCustomSearchData();
    const output = customSearch(initialState, action);
    const expected = {
      ...initialState,
      customSearch: { SAMISID: "", fileNo: "" }
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_SET_CUSTOM_SEARCH_DATABASE", () => {
    const action = requestSetCustomSearchID([
        {
          "key": "SAMISID",
          "value": "edf"
        },
        {
          "key": "File Number",
          "value": "35"
        }
      ]);
    const output = customSearch(initialState, action);
    const expected = {
      ...initialState,
      searchIdList:[
        {
          "key": "SAMISID",
          "value": "edf"
        },
        {
          "key": "File Number",
          "value": "35"
        }
      ]
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_RESET_CUSTOM_SEARCH_DATA ", () => {
    const action = resetCustomSearchData();
    const output = customSearch(initialState, action);
    const expected = {
      ...initialState,
      customSearch: { SAMISID: "", fileNo: "" }
    };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_SET_CUSTOM_SEARCH_DATABASE ", () => {
    const action = setCustomSearchDatabase({
        database:"civil"
    });
    const output = customSearch(initialState, action);
    const expected = {
      ...initialState,
      database: {
        database:"civil"
    }
    };
    expect(output).toEqual(expected);
  });
  xit("should handle REQUEST_GET_JOB_SEARCH_TEXT_SUCCESS ", () => {
    const action = requestGetJobSearchTextSuccess({
      SAMISID: "m" ,fileNo:"1"
    });
    const output = customSearch(initialState, action);
    const expected = {
      ...initialState,
      customSearch: {
        SAMISID:"m",
        fileNo: 1
    }
    };
    expect(output).toEqual(expected);
  });

});
