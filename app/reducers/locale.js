import { REQUEST_SET_LOCALE_SUCCESS } from "../actions/actionTypes";

const initialState = {
  lang: "en",
  dir: "ltr",
  displayName: "English"
};

export default function locale(state = initialState, action = {}) {
  switch (action.type) {
    case REQUEST_SET_LOCALE_SUCCESS:
      const { lang, dir, displayName } = action.payload;
      return { ...state, lang: lang, dir: dir, displayName: displayName };
    default:
      return state;
  }
}
