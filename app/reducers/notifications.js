import {
  REQUEST_SHOW_NOTIFICATION,
  REQUEST_REMOVE_NOTIFICATION
} from "../actions/actionTypes";

export default function notifications(state = [], action = {}) {
  const { payload, type } = action;
  switch (action.type) {
    case REQUEST_SHOW_NOTIFICATION:
      return [...state.slice(), payload];
    case REQUEST_REMOVE_NOTIFICATION:
      return state.filter(notification => notification.id !== payload);
    default:
      return state;
  }
}
