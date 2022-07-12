import {
  REQUEST_SET_PERSON_DATA,
  REQUEST_RESET_CUSTOM_SEARCH_DATA,
  REQUEST_SET_CUSTOM_SEARCH_ID,
  REQUEST_UPDATE_SEARCH_TEXT,
  REQUEST_GET_JOB_SEARCH_TEXT,
  REQUEST_GET_JOB_SEARCH_TEXT_SUCCESS,
  REQUEST_SET_CUSTOM_SEARCH_DATABASE,
  REQUEST_SET_CUSTOM_SEARCH_RESPONSE,
} from "./actionTypes";

export const setPersonData = (personData, index) => {
  const sendData = {
    personData,
    index
  };

  return {
    type: REQUEST_SET_PERSON_DATA,
    payload: sendData
  };
};
export const resetCustomSearchData = () => ({
  type: REQUEST_RESET_CUSTOM_SEARCH_DATA
});
export const requestUpdateSearchText = () => ({
  type: REQUEST_UPDATE_SEARCH_TEXT
});
export const requestSetCustomSearchID = SearchIdList => ({
  type: REQUEST_SET_CUSTOM_SEARCH_ID,
  payload: SearchIdList
});
export const requestGetJobSearchText = jobId => ({
  type: REQUEST_GET_JOB_SEARCH_TEXT,
  payload: jobId
});
export const requestGetJobSearchTextSuccess = searchDetails => ({
  type: REQUEST_GET_JOB_SEARCH_TEXT_SUCCESS,
  payload: searchDetails
});
export const setCustomSearchDatabase = searchDetails => ({
  type: REQUEST_SET_CUSTOM_SEARCH_DATABASE,
  payload: searchDetails
});

export const setCustomSearchResponse = res => ({
  type: REQUEST_SET_CUSTOM_SEARCH_RESPONSE,
  payload: res
});



