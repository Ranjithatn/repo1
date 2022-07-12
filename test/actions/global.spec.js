import {
  requestInputFieldChanged,
  receiveInputFieldChanged,
  requestPageChanged,
  requestTableRowClicked,
  requestTableRowClickedFailed,
  receiveTableRowClicked,
  receiveInputFieldChangedFailed,
  requestPageChangedFailed 
} from "../../app/actions/global";
import {
  REQUEST_INPUT_FIELD_CHANGED,
  RECEIVE_INPUT_FIELD_CHANGED,
  REQUEST_PAGE_CHANGED,
  REQUEST_TABLE_ROW_CLICKED,
  REQUEST_TABLE_ROW_CLICKED_FAILED,
  RECEIVE_TABLE_ROW_CLICKED,
  RECEIVE_INPUT_FIELD_CHANGED_FAILED,
  REQUEST_INPUT_FIELD_CHANGED_FAILED,
  REQUEST_PAGE_CHANGED_FAILED
} from "../../app/actions/actionTypes";

describe("global actions", () => {
  it("should create requestInputFieldChanged action", () => {
    const onChangeEventMock = {
      target: {
        id: "some-field",
        value: "value of field"
      }
    };
    const area = "newJob";
    const action = requestInputFieldChanged(onChangeEventMock, area);
    const expected = {
      type: REQUEST_INPUT_FIELD_CHANGED,
      payload: {
        field: "some-field",
        value: "value of field",
        area: "newJob"
      }
    };
    expect(action).toEqual(expected);
  });
  it("should create receiveInputFieldChanged action", () => {
    const action = receiveInputFieldChanged({
      field: "field",
      value: "value",
      area: "auth"
    });
    const expected = {
      type: RECEIVE_INPUT_FIELD_CHANGED,
      payload: {
        field: "field",
        value: "value",
        area: "auth"
      }
    };
    expect(action).toEqual(expected);
  });
  it("should create requestPageChanged action", () => {
    const eventMock = {
      target: {
        tagName: "A",
        value: "value of field",
        innerText: "2",
        id:"2"
      }
    };
    const action = requestPageChanged(eventMock, "jobQueue");
    const expected = {
      type: REQUEST_PAGE_CHANGED,
      payload: {
        page: "2",
        area: "jobQueue"
      }
    };
    expect(action).toEqual(expected);
  });
  it("should not create requestPageChanged action", () => {
    const eventMock = {
      target: {
        noTagName: "A",
        value: "value of field",
        innerText: "2"
      }
    };
    const action = requestPageChanged(eventMock, "jobQueue");
    const expected = {
      type: "unknown",
      payload: {}
    };
    expect(action).toEqual(expected);
  });
  it("should create requestTableRowClicked action", () => {
    const action = requestTableRowClicked("1", "jobQueue");
    const expected = {
      type: REQUEST_TABLE_ROW_CLICKED,
      payload: {
        dataId: "1",
        area: "jobQueue"
      }
    };
    expect(action).toEqual(expected);
  });
  it("should create requestTableRowClicked action", () => {
    const action = requestTableRowClickedFailed();
    const expected = {
      type: REQUEST_TABLE_ROW_CLICKED_FAILED,
    };
    expect(action).toEqual(expected);
  });
  it("should create receiveTableRowClicked action", () => {
    const action = receiveTableRowClicked({dataId: "1", area: "jobQueue"});
    const expected = {
      type: RECEIVE_TABLE_ROW_CLICKED,
      payload: {
        dataId: "1",
        area: "jobQueue"
      }
    };
    expect(action).toEqual(expected);
  });
  it("should create receiveInputFieldChangedFailed action", () => {
    const action = receiveInputFieldChangedFailed();
    const expected = {
      type: REQUEST_INPUT_FIELD_CHANGED_FAILED
    };
    expect(action).toEqual(expected);
  });
  it("should Handle requestPageChangedFailed action", () => {
    const action = requestPageChangedFailed();
    const expected = {
      type: REQUEST_PAGE_CHANGED_FAILED
    };
    expect(action).toEqual(expected);
  });
});
