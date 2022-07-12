import { REQUEST_SHOW_MODAL, REQUEST_HIDE_MODAL } from "../actions/actionTypes";

const initialState = {
  modalType: "",
  modalProps: {}
};

export default function modal(state = initialState, action = {}) {
  switch (action.type) {
    case REQUEST_SHOW_MODAL:
      const { modalType, modalProps } = action.payload;
      return { ...state, modalType: modalType, modalProps: modalProps, latentId: action.payload.latentId || '' };
    case REQUEST_HIDE_MODAL:
      return { modalType: "", modalProps: {} };
    default:
      return state;
  }
}
