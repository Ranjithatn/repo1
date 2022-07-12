import { call, put, takeLatest, select } from "redux-saga/effects";
import Constants from "../constants";
import * as localStorage from "../utils/localStorage";
import { delay } from "redux-saga";
import { push } from "react-router-redux";
// import { autoUpdater } from "electron-updater";
import {
  REQUEST_LOGIN,
  REQUEST_LOGIN_SUCCESS,
  REQUEST_LOGOUT,
  REQUEST_LOGOUT_SUCCESS,
  REQUEST_SPINNER_START,
  REQUEST_SPINNER_STOP,
  REQUEST_CHECK_FOR_APP_UPDATE,
  REQUEST_LOGIN_POPUP
} from "../actions/actionTypes";
import { requestInputFieldChanged } from '../actions/global';
import {
  requestLoginSuccess,
  requestLogoutSuccess,
  requestLoginFailed,
  requestSetLookups,
  requestSetLookupCrimeTypes,
  requestSetLookupNationality,
  requestSetUserInfo,
} from "../actions/auth";
import { requestShowNotification } from "../actions/notifications";
import {
  // updateServerConnectionStatus,
  requestUpdateServerStatus
} from "../actions/app";
import { updateMsgSelector } from "../selectors/auth";
import { requestActiveJobs, requestSystemPermissions } from "../actions/jobs";
import Api, { url } from "../api/";
import { startSpinner, stopSpinner } from "../../app/actions/spinner";
import { settings } from "../utils/electron";

import { store } from "../index";
import path from "path";
import { translateRes } from "../utils/intl";
import { displayLoginPopup } from "../components/Notification/PortalNotification";

import moment from "moment";


const LivescanAPI = require("../hardwareSDK/biocoreSdk/livescan/livescan");

const electron = require("electron").remote;

const ipcRenderer = require("electron").ipcRenderer;

export function* watchRequestLogin() {
  yield takeLatest(REQUEST_LOGIN, callLogin);
}

export function* watchRequestLoginPopup() {
  yield takeLatest(REQUEST_LOGIN_POPUP, callLoginPopup);
}

export function* watchCheckForappUpdate() {
  yield takeLatest(REQUEST_CHECK_FOR_APP_UPDATE, checkForAppUpdate);
}

export function* watchRequestLogout() {
  yield takeLatest(REQUEST_LOGOUT, callLogout);
}

export function* checkForAppUpdate(action) {
  const _settings = settings();

  let newApiUri = "";
  if (_settings && _settings.ipAddress) {
    newApiUri = `${_settings.protocol ? _settings.protocol : "http"}://${
      _settings.ipAddress
    }/services-gateway-ucw/api`;
    Constants.API_ORIGIN_URL = newApiUri;
    localStorage.set("api", newApiUri);
  }

  yield put(startSpinner());
  yield call(delay, 1000);
  ipcRenderer.send("checkForUpdates");
}

export function* callLogin(action) {
  yield put(stopSpinner());
  try {
    yield put(startSpinner());
    const { payload } = action;
    const _settings = settings();

    let newApiUri = "";
    if (_settings && _settings.ipAddress) {
      newApiUri = `${_settings.protocol ? _settings.protocol : "http"}://${
        _settings.ipAddress
      }/services-gateway-ucw/api`;
      Constants.API_ORIGIN_URL = newApiUri;
      localStorage.set("api", newApiUri);
    }
    // localStorage.set("api", Constants.API_ORIGIN_URL);

    const loginRes = yield call(Api, {
      url: url.auth.login,
      method: "POST",
      data: payload
    });
    if (loginRes.jwt) {
      const { jwt } = loginRes;
      // const {
      //   "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": roles
      // } = yield call(parseJwt, jwt);

      const parsed = yield call(parseJwt, jwt);

      // console.log( "userRoles", parsed.userRoles );
      // console.log( "userRoles::JSON", JSON.parse(parsed.userRoles) );
      // const parsedRoles = JSON.parse(parsed.userRoles);
      const parsedRoles = parsed.userRoles;

      let {
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": roles
      } = parsed;

      // console.log("AUTH::roles",roles);
      if (!roles) {
        roles = "custom";
      }

      yield call(localStorage.set, "jwt", jwt);

      yield put(requestLoginSuccess({ jwt, roles, parsedRoles }));
      yield put( requestSystemPermissions() );
      yield call( requestLookupCrimeTypes );
      yield call( getUserLocations );
      // yield call( requestLookupNationality );

      yield put( requestSetUserInfo(loginRes.userInfo) );

      yield put(requestActiveJobs());
      yield put(push("/authenticated/jobqueue"));

      yield put(stopSpinner());

      if (localStorage.get("loginpopup")) {
        localStorage.remove("loginpopup");
      }

      yield call(startCheckingServerConnectionStatus);
      yield call(checkForTokenExpiration);
    } else {
      if (loginRes.Error) {
        yield put(requestLoginFailed(loginRes.Error));
      }
      yield put(stopSpinner());
      yield put(requestInputFieldChanged( { target: { id: 'username', value: '', } }, 'auth'));
      yield put(requestInputFieldChanged( { target: { id: 'password', value: '', } }, 'auth'));
    }
  } catch (e) {
    yield put(requestLoginFailed("Login failed for reasons unknown"));
  } finally {
    yield put(stopSpinner());
    // yield call(startCheckingServerConnectionStatus);
  }
}

export function* callLoginPopup(action) {
  try {
    localStorage.set("loginpopup", "true");
    yield put(startSpinner());
    const { payload } = action;
    const _settings = settings();

    let newApiUri = "";
    if (_settings && _settings.ipAddress) {
      newApiUri = `${_settings.protocol ? _settings.protocol : "http"}://${
        _settings.ipAddress
      }/services-gateway-ucw/api`;
      Constants.API_ORIGIN_URL = newApiUri;
      localStorage.set("api", newApiUri);
    }
    localStorage.set("api", Constants.API_ORIGIN_URL);

    const loginRes = yield call(Api, {
      url: url.auth.login,
      method: "POST",
      data: payload
    });

    if (loginRes.jwt) {
      const { jwt } = loginRes;

      const parsed = yield call(parseJwt, jwt);

      // const parsedRoles = JSON.parse(parsed.userRoles);
      const parsedRoles = parsed.userRoles;

      let {
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": roles
      } = parsed;

      if (!roles) {
        roles = "custom";
      }

      yield call(localStorage.set, "jwt", jwt);

      yield put(requestLoginSuccess({ jwt, roles, parsedRoles }));
      yield put(requestSystemPermissions())

      yield call( requestLookupCrimeTypes );
      yield call( getUserLocations );
      // yield call( requestLookupNationality );

      yield put( requestSetUserInfo(loginRes.userInfo) );

      yield put(requestActiveJobs());
      // yield put(push("/authenticated/jobqueue"));
      localStorage.remove("loginpopup");

      yield put(stopSpinner());
    } else {
      if (loginRes.props.message) {
        // displayLoginPopup( loginRes.props.message );
      }
      yield put(stopSpinner());
    }
  } catch (e) {
    displayLoginPopup("Login failed for reasons unknown");
  } finally {
    yield put(stopSpinner());
  }
}

export function* callLogout(action) {
  yield put(startSpinner());
  try {
    const { history } = action;
    const logoutRes = yield call(Api, {
      url: url.auth.logout,
      method: "POST",
      isJwtRequired: true,
      data: {}
    });
    if (logoutRes) {
      if (logoutRes.message) {
        yield put(
          requestShowNotification({
            message: translateRes(logoutRes.message),
            type: "is-success"
          })
        );
      }

      // stop livescan
      LivescanAPI.stopCapture();
      // stop cardscan
      require("dwt");

      Dynamsoft.WebTwainEnv.Unload();

      yield call(localStorage.set, "jwt", "");
      yield put(requestLogoutSuccess());
      yield put(push("/"));
    }
  } catch (e) {
    console.error("-------- logout failed", e);
  } finally {
    yield put(stopSpinner());
  }
}

export function parseJwt(token) {
  var base64Url = token && token.split(".")[1];
  var base64 = base64Url.replace("-", "+").replace("_", "/");

  const parsed = JSON.parse(window.atob(base64));

  return parsed;
}

export function* handleConnectionStatus() {
  const connStatus = yield call(Api, {
    url: url.systeminfo.systeminfo,
    method: "GET",
    isJwtRequired: true,
    data: {}
  });

  if (connStatus) {
    // console.log("connectionStatus API response", connStatus);
    if (connStatus.serverLiveStatus && connStatus.serverLiveStatus.length > 0) {
      let status = "unknown";
      if (connStatus.serverLiveStatus[0].isActive) {
        status = "connected";
      } else {
        status = "disconnected";
      }
      yield put(requestUpdateServerStatus(status));
    }
  } // if ends here
}

export function* startCheckingServerConnectionStatus() {
  const _settings = settings();
  let callTime = 0;

  if (_settings.serverConnection && _settings.serverConnection > 0) {
    callTime = _settings.serverConnection;
  }

  if (callTime > 0) {
    while (localStorage.get("jwt") && localStorage.get("jwt") != "") {
      // console.log("inside while loop");
      // user is logged in lets continue
      yield call(handleConnectionStatus);
      yield call(delay, callTime * 1000);
    }
  } else {
    // console.log("server connection time is not specified");
    yield call(handleConnectionStatus);
  }
}

export function* getUserLocations() {
  // console.log("getUserLocations::init");

  try {
    const apiCall = yield call(Api, {
      url: url.systeminfo.lookups,
      method: "GET",
      isJwtRequired: true,
      data: {}
    });

    if (apiCall) {
      // console.log("apiCall::success", apiCall);
      yield put(requestSetLookups(apiCall));
    } else {
      console.log("apiCall::failed", apiCall);
    }
  } catch (e) {
    console.log("getUserLocations::catch::error occoured", e);
  }
}


export function* requestLookupCrimeTypes() {
  try {
    const apiCall = yield call(Api, {
      url: url.systeminfo.getniclookupcrimetypes,
      method: "GET",
      isJwtRequired: true,
      data: {}
    });

    if (apiCall) {
      // console.log("requestLookupCrimeTypes::apiCall::success", apiCall);
      yield put( requestSetLookupCrimeTypes(apiCall) );
    } else {
      // console.log("requestLookupCrimeTypes::apiCall::failed", apiCall);
    }
  } catch (e) {
    console.log("requestLookupCrimeTypes::catch::error occoured", e);
  }

}




export function* requestLookupNationality() {
  try {
    const apiCall = yield call(Api, {
      url: url.systeminfo.nationality,
      method: "GET",
      isJwtRequired: true,
      data: {},
      fromBase: true,
    });

    if (apiCall) {
      yield put( requestSetLookupNationality(apiCall) );
    }
  } catch (e) {
    console.log("requestLookupNationality::catch::error occoured", e);
  }

}






export function* handleTokenExpiration() {
  console.log("handleTokenExpiration");

  try {

    const jwt = localStorage.get("jwt");

    if ( jwt ) {
      const parsed = parseJwt(jwt);
      const expiryDate = new Date( parsed.exp * 1000 );
      const currentDate = new Date();

      let a = moment(expiryDate);
      let b = moment(currentDate);
      let minsLeft = a.diff(b, 'minutes');
      console.log("minutes left until token expiry",minsLeft);


      if ( minsLeft <= 1 ) {
            
        const newToken = yield call(Api, {
          url: url.auth.refreshToken,
          method: "POST",
          isJwtRequired: true,
          data: {}
        });

        console.log("newToken",newToken);
        if ( newToken ) {
          // localStorage.set("jwt", newToken);
          yield call(localStorage.set, "jwt", newToken.jwt);
        }

      }

    }

  } catch (e) {
    console.log("handleTokenExpiration::catch",e);
  }


}



export function* checkForTokenExpiration() {
  let callTime = 60000; // in ms

  while (localStorage.get("jwt") && localStorage.get("jwt") != "") {
    yield call(handleTokenExpiration);
    yield call(delay, callTime);
  }

}