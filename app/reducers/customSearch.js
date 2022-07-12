import {
  RECEIVE_INPUT_FIELD_CHANGED,
  REQUEST_SET_PERSON_DATA,
  REQUEST_RESET_CUSTOM_SEARCH_DATA,
  REQUEST_SET_CUSTOM_SEARCH_ID,
  REQUEST_GET_JOB_SEARCH_TEXT_SUCCESS,
  REQUEST_SET_CUSTOM_SEARCH_DATABASE,
  REQUEST_SET_CUSTOM_SEARCH_RESPONSE,
} from "../actions/actionTypes";
import { reg_alphanumric } from "../utils/regEx";
const reg_numric = /^[0-9\b]*$/;
const initialState = {
  customSearch: {
    SAMISID: "",
    fileNo: ""
  },
  customSearchPersonInfo: [],
  searchIdList: [],
  matchedRowId: 0,
  database: "",
  response: {},
};

export default function customSearch(state = initialState, action = {}) {
  switch (action.type) {
    case RECEIVE_INPUT_FIELD_CHANGED:
      if (action.payload.area === "custom") {
        const { field, value } = action.payload;
        let newState = Object.assign({}, state);
       
        if (field === "SAMISID") {
          newState.customSearch[field] = reg_alphanumric.test(value)
            ? value
            : newState.customSearch[field];
        } else if (field === "fileNo") {
          newState.customSearch[field] = reg_numric.test(value)
            ? value
            : newState.customSearch[field];
        }
        else if (field === "latentID") {
          newState.customSearch[field] = reg_numric.test(value)
            ? value
            : newState.customSearch[field];
        }
        return newState;
      } else {
        return state;
      }
    case REQUEST_SET_PERSON_DATA:
      return {
        ...state,
        customSearchPersonInfo: action.payload.personData,
        matchedRowId: action.payload.index
      };
    case REQUEST_SET_CUSTOM_SEARCH_ID:
      return { ...state, searchIdList: action.payload };

    case REQUEST_RESET_CUSTOM_SEARCH_DATA:
      return { ...state, customSearch: { SAMISID: "", fileNo: "" } };
    case REQUEST_SET_CUSTOM_SEARCH_DATABASE:
      return { ...state, database: action.payload };

    case REQUEST_SET_CUSTOM_SEARCH_RESPONSE:
      return { ...state, response: action.payload };





    case REQUEST_GET_JOB_SEARCH_TEXT_SUCCESS:
      return {
        ...state,
        customSearch: {
          SAMISID: action.payload.find(data => data.key === "SAMISID")
            ? action.payload.find(data => data.key === "SAMISID").value
            : "",
          fileNo: action.payload.find(data => data.key === "File Number")
            ? action.payload.find(data => data.key === "File Number").value
            : "",
            latentID: action.payload.find(data => data.key === "LatentID")
              ? action.payload.find(data => data.key === "LatentID").value
              : ""
        }
      };

    default:
      return state;
  }
}
