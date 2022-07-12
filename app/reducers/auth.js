//@flow
import {
  REQUEST_LOGIN,
  REQUEST_LOGIN_SUCCESS,
  REQUEST_LOGIN_FAILED,
  REQUEST_LOGOUT_SUCCESS,
  RECEIVE_INPUT_FIELD_CHANGED,
  REQUEST_SET_NEW_UPDATE,
  REQUEST_SHOW_UPDATE_MESSAGE,
  REQUEST_SET_DOWNLOAD,
  REQUEST_SET_STATUS,
  REQUEST_SET_LOOKUPS,
  REQUEST_SAVE_ANNOTATIONS_CUSTOM,
  REQUEST_SYSTEM_PERMISSION_SUCCESS,
  REQUEST_SET_LOOKUP_CRIME_TYPES,
  REQUEST_SET_LOOKUP_NATIONALITY,
  REQUEST_SET_USER_INFO,
} from "../actions/actionTypes";

const initialState = {
  username: "",
  password: "",
  apiUri: "",
  jwt: "",
  error: "",
  roles: "",
  newUpdate: undefined,
  updateMessage: "",
  newDownload: undefined,
  version: "",
  updateStatus: "",
  parsedRoles: [],
  lookups: [],
  menuPerm:{},
  servicePerm:{}
};

export default function login(state = initialState, action = {}) {
  switch (action.type) {
    case REQUEST_LOGIN:
      return { ...state, error: "" };
    case REQUEST_LOGIN_SUCCESS:
      const { jwt, roles, parsedRoles } = action.payload;
      return { ...state, password: "", jwt, roles, parsedRoles };
    case REQUEST_LOGIN_FAILED:
      return { ...initialState, error: action.payload };
    case REQUEST_LOGOUT_SUCCESS:
      localStorage.removeItem("jwt");
      return initialState;

      return initialState;
    case RECEIVE_INPUT_FIELD_CHANGED:
      if (action.payload.area === "auth") {
        const { field, value } = action.payload;
        let newState = Object.assign({}, state);
        newState[field] = value;
        return newState;
      } else {
        return state;
      }
    case REQUEST_SET_NEW_UPDATE:
      return { ...state, newUpdate: true };
    case REQUEST_SET_STATUS:
      return { ...state, updateStatus: action.payload };
    case REQUEST_SET_DOWNLOAD:
      return { ...state, newDownload: true, version: action.payload };
    case REQUEST_SHOW_UPDATE_MESSAGE:
      return { ...state, updateMessage: action.payload };
    case REQUEST_SET_LOOKUPS:
      return { ...state, lookups: action.payload };
    case REQUEST_SYSTEM_PERMISSION_SUCCESS:
      return {
        ...state,
        // servicePerm: action.payload.service_perm,
        menuPerm: action.payload.menu_perm
      };
    case REQUEST_SET_LOOKUP_CRIME_TYPES:
      return { ...state, lookupCrimeTypes: action.payload };

    case REQUEST_SET_LOOKUP_NATIONALITY:
      return { ...state, nationality: action.payload };

    case REQUEST_SET_USER_INFO:
     return { ...state, userInfo: action.payload };



    default:
      return state;
  }
}
