// @flow
import { REQUEST_SHOW_MODAL, REQUEST_HIDE_MODAL, REQUEST_SHOW_MODAL_WITH_DATA } from "./actionTypes";

export const requestShowModal = payload => {
  return {
    type: REQUEST_SHOW_MODAL,
    payload
  };
};

export const requestHideModal = () => ({
  type: REQUEST_HIDE_MODAL
});


export const requestShowModalWithData = payload => {
  return {
    type: REQUEST_SHOW_MODAL_WITH_DATA,
    payload
  };
};
