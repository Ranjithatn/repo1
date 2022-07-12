// @flow
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
  REQUEST_SET_ADD_NEW,
  REQUEST_DELETE_NEW_CRIME_DATA,
  REQUEST_SELECTED_TENPRINT_TYPE,
  REQUEST_SET_TENPRINT_VERIFY_RAW,
  MODAL_CHECKBOX,
  TOGGLE_PANE_VISIBILITY,
  REQUEST_RESET_CRIME_DATA,
  REQUEST_STORE_LINK_DATA,
  REQUEST_RESET_LINK_DATA,
  REQUEST_UNMATCH
  
} from "./actionTypes";

export const requestTenprintVerify = historyDetails => ({
  type: REQUEST_TENPRINT_VERIFY,
  payload: historyDetails
});
export const requestShowAdjudicator = adjudicatorData => ({
  type: REQUEST_SHOW_ADJUDICATOR,
  payload: adjudicatorData
});
export const requestShowAdjudicatorSuccess = adjudicatorSaveData => ({
  type: REQUEST_SHOW_ADJUDICATOR_SUCCESS,
  payload: adjudicatorSaveData
});

export const requestSetTenprintVerify = tenprintData => ({
  type: REQUEST_SET_TENPRINT_VERIFY,
  payload: tenprintData
});

export const requestSetTenprintVerifyHand = TenprintHandData => ({
  type: REQUEST_SET_TENPRINT_VERIFY_HAND,
  payload: TenprintHandData
});

export const requestSetTenprintVerifyStoreHand = TenprintVerifyStoreData => ({
  type: REQUEST_SET_TENPRINT_VERIFY_STORE,
  payload: TenprintVerifyStoreData
});

export const requestSetTenprintVerifyMatchData = TenprintVerifyMatchData => ({
  type: REQUEST_SET_TENPRINT_VERIFY_MATCH,
  payload: TenprintVerifyMatchData
});

export const requestSetTenprintVerifyStoreData = TenprintVerifyStoreData => ({
  type: REQUEST_SET_TENPRINT__VERIFY_MATCHED_DATA,
  payload: TenprintVerifyStoreData
});

export const requestRemoveTenprintVerifyMatch = () => ({
  type: REQUEST_REMOVE_TENPRINT__VERIFY_MATCHED_DATA
});

//tenprint verify new
export const requestSelectedTenprintType = selected => ({
  type: REQUEST_SELECTED_TENPRINT_TYPE,
  payload: selected
});
export const requestModalCheckbox = selected => ({
  type: MODAL_CHECKBOX,
  payload: selected
});

export const requestMatchedPersonChanged = (
  index,
  PersonDetails,
  event,
  PersonID
) => {
 
  const data = {
    Index:index,
    PersonInfo:PersonDetails,
    Selected:event.target.checked,
    userID:PersonID
  };
  return {
    type: REQUEST_MATCHED_PERSON_CHANGED,
    payload: data
  };
};

export const recivedMatchedPersonChanged = (data) => {
  return {
    type: RECIVED_MATCHED_PERSON_CHANGED,
    payload: data
  };
};
export const requestModalData = () => {
  return {
    type: REQUEST_MODAL_DATA
  };
};
export const recivedModalData = (data) => {
  return {
    type: RECIVED_MODAL_DATA,
    payload: data
  };
};
export const requestHideAdjudicator = status => {
  return {
    type: REQUEST_HIDE_ADJUDICATOR,
    payload: status
  };
};
export const requestStoreNote = NoteData => {
  return {
    type: RECIEVE_NOTE_STORE,
    payload:NoteData
  };
};

export const requestSetTenprintVerifyRaw = data => ({
  type: REQUEST_SET_TENPRINT_VERIFY_RAW,
  payload: data
});
export const requestSetAddnew = () => ({
  type: REQUEST_SET_ADD_NEW
});


export const requestTogglePaneVisibility = data => ({
  type: TOGGLE_PANE_VISIBILITY,
  payload: data
});
export const requestDeleteNewCrimeData = index => ({
  type: REQUEST_DELETE_NEW_CRIME_DATA,
  payload: index
});
export const requestResetCrimeType = () => ({
  type: REQUEST_RESET_CRIME_DATA
});
export const requestResetlinkData = () => ({
  type: REQUEST_RESET_LINK_DATA
});
export const requestUnMatch = () => ({
  type: REQUEST_UNMATCH
});


export const requestStoreLinkData = (
 latentId,bioId
) => {
 
  const data = {
    latentId:latentId,
    bioId:bioId
  };
  return {
    type: REQUEST_STORE_LINK_DATA,
    payload: data
  };
};