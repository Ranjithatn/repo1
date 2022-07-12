import {
  REQUEST_INPUT_FIELD_CHANGED,
  REQUEST_INPUT_FIELD_CHANGED_FAILED,
  RECEIVE_INPUT_FIELD_CHANGED,
  REQUEST_PAGE_CHANGED,
  REQUEST_PAGE_CHANGED_FAILED,
  REQUEST_TABLE_ROW_CLICKED,
  REQUEST_TABLE_ROW_CLICKED_FAILED,
  RECEIVE_TABLE_ROW_CLICKED
} from "./actionTypes";

export const requestInputFieldChanged = (e, area: string) => {
  const { id, value } = e.target;
  const data = {
    field: id,
    value: value,
    area: area
  };

  return {
    type: REQUEST_INPUT_FIELD_CHANGED,
    payload: data
  };
};

type FieldData = {
  field: ?string,
  value: string,
  area: string
};

type TableRowData = {
  area: string,
  dataId: ?string
};

export const receiveInputFieldChanged = (data: FieldData) => {
  return {
    type: RECEIVE_INPUT_FIELD_CHANGED,
    payload: data
  };
};

export const receiveInputFieldChangedFailed = () => ({
  type: REQUEST_INPUT_FIELD_CHANGED_FAILED,
});

// e, area: string
export const requestPageChanged = (e, area) => {

  if (!e.target || !e.target.tagName || e.target.tagName !== "A")
    //only send proper action if link is clicked
    return { type: "unknown", payload: {} };
  const pageNumberClicked = e.target.id;

  return {
    type: REQUEST_PAGE_CHANGED,
    payload: {
      page: pageNumberClicked,
      area
    }
  };
};

export const requestPageChangedFailed = () => ({
  type: REQUEST_PAGE_CHANGED_FAILED
});

export const requestTableRowClicked = (dataId, area, status, type,tcn) => {
  const data = {
    dataId,
    area,
    status,
    type,
    tcn
  };
  return {
    type: REQUEST_TABLE_ROW_CLICKED,
    payload: data
  };
};

export const requestTableRowClickedFailed = (dataId, area: string) => ({
  type: REQUEST_TABLE_ROW_CLICKED_FAILED
});

export const receiveTableRowClicked = (payload: TableRowData) => {
  return {
    type: RECEIVE_TABLE_ROW_CLICKED,
    payload
  };
};
