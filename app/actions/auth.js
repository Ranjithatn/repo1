// @flow
import {
  REQUEST_LOGIN,
  REQUEST_LOGIN_SUCCESS,
  REQUEST_LOGIN_FAILED,
  REQUEST_LOGOUT,
  REQUEST_LOGOUT_SUCCESS,
  REQUEST_SET_NEW_UPDATE,
  REQUEST_SHOW_UPDATE_MESSAGE,
  REQUEST_SET_DOWNLOAD,
  REQUEST_SET_STATUS,
  REQUEST_CHECK_FOR_APP_UPDATE,
  REQUEST_LOGIN_POPUP,
  REQUEST_SET_LOOKUPS,
  REQUEST_SET_LOOKUP_CRIME_TYPES,
  REQUEST_SET_LOOKUP_NATIONALITY,
  REQUEST_SET_USER_INFO,
} from "./actionTypes";

type credentials = {
  username?: string,
  password?: string
};

export const requestLogin = (payload: credentials, history) => {
  return {
    type: REQUEST_LOGIN,
    payload,
    history
  };
};


export const requestLoginPopup = (payload: credentials) => {
  return {
    type: REQUEST_LOGIN_POPUP,
    payload,
  };
};


export const requestLoginSuccess = (authData: {
  jwt: string,
  roles: any,
  parsedRoles: array,
}) => {
  return {
    type: REQUEST_LOGIN_SUCCESS,
    payload: authData
  };
};

export const requestLoginFailed = (error: string) => {
  return {
    type: REQUEST_LOGIN_FAILED,
    payload: error
  };
};

export const requestLogout = history => {
  return {
    type: REQUEST_LOGOUT,
    history
  };
};

export const requestLogoutSuccess = () => {
  return {
    type: REQUEST_LOGOUT_SUCCESS
  };
};
export const requestSetNewUpdate = () => {
  return {
    type: REQUEST_SET_NEW_UPDATE
  };
};
export const requestSetDownload = version => {
  return {
    type: REQUEST_SET_DOWNLOAD,
    payload: version
  };
};
export const requestShowUpdateMessage = msg => {
  return {
    type: REQUEST_SHOW_UPDATE_MESSAGE,
    payload: msg
  };
};
export const requestSetStatus = status => {
  return {
    type: REQUEST_SET_STATUS,
    payload: status
  };
};



export const requestCheckForAppUpdate = () => {
  return {
    type: REQUEST_CHECK_FOR_APP_UPDATE,
  };
};

export const requestSetLookups = (data) => {
  return {
    type: REQUEST_SET_LOOKUPS,
    payload: data,
  }
}

export const requestSetLookupCrimeTypes = (data) => {
  return {
    type: REQUEST_SET_LOOKUP_CRIME_TYPES,
    payload: data,
  }
}

export const requestSetLookupNationality = (data) => {
  return {
    type: REQUEST_SET_LOOKUP_NATIONALITY,
    payload: data,
  }
}


export const requestSetUserInfo = (data) => {
  return {
    type: REQUEST_SET_USER_INFO,
    payload: data || {},
  }
}

