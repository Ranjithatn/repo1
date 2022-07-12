// @flow
import Constants from "../constants";
import * as localStorage from "../utils/localStorage";
import fetch from "isomorphic-fetch";
import PortalNotification from "../components/Notification/PortalNotification";
import React from "react";
import ReactDOM from "react-dom";
import saveLog from "../utils/logs";
import logResponse from "../utils/logResponse";

import { store } from "../index";
import { requestUpdateServerStatus } from "../actions/app";
import { parseJwt } from "../sagas/auth";
import { settings as _settings } from "../utils/electron";
import { startSpinner, stopSpinner } from "../actions/spinner";
import { translate, translateRes } from '../utils/intl';

import InnovatricsHelper from '../../innov-sud/helper';

import { requestShowNotification } from "../actions/notifications";
import moment from "moment";


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
let currStatus = 0;

export const url = {
  auth: {
    login: "/authenticate/login",
    logout: "/authenticate/logout",
    refreshToken: "/authenticate/refreshtoken",
  },
  job: {
    getActive: "/queue/getactivejobs",
    actionHistory: "/queue/getactionhistory",
    searchJobHistory: "/queue/searchjobhistory",
    create: "/job/create",
    remove: "/job/", // add job id during req
    serachActivJob: "/queue/searchjob",
    updateFingerprintData: "/job/updatebiometrics",
    auditLog: "/job/getjobhistories",
    getBiometrics: "/job/getbiometrics",
    getjobauditreport: "/job/getjobauditreport",
    updateSearchTexts: "/job/updatesearchtexts",
    getSearchTexts: "/job/getsearchtexts",
    verifybiometricsquality: "/job/verifybiometricsquality",
    getSearchTexts: "/job/getsearchtexts",
    updateJob:"/job/update",
    getJobById:"/job/",
  },
  action: {
    actionResult: "/action/getactionresult",
    create: "/action/create",
    setActionStatus: "/action/setactionstatus",
    setMatchedPersonDecision: "/action/setmatchedpersondecision",
    getMatchSubsequenceActions: "/action/getmatchsubsequenceactions",
    getMatchedBiometricsImage: "/action/GetMatchedBiometricsImage"
  },
  systeminfo: {
    systeminfo: "/systeminfo",
    getsystemsettings: "/systeminfo/getsystemsettings",
    lookups: "/systeminfo/lookups",
    getnicLookupServiceRoles: "/systeminfo/getniclookupserviceroles?lookupname=UCW", // not being used by UI
    getnicLookupMenuRoles: "/systeminfo/getniclookupmenuroles?lookupname=UCW",
    getniclookupcrimetypes: "/systeminfo/getniclookupcrimetypes",
  }
};


// save the log in file
export const saveAPILog = (res) => {
  saveLog(res);
  return res;
};


// check if the access is denied by the server
export const checkIfAccessDenied = (res) => {
  if (res.status === 401) {
    throw Error( translate("unauthorizedOrTokenExpired") );
  } else if (res.status === 403) {
    throw Error( translate("permissionDenied") );
  } else if (res.status === 404) {
    throw Error( translate("requestedAPINotFound") );
  } else if (res.status === 500) {
    throw Error(`${translate("internalServerErrorOccoured")}: ${res.statusText}`);
  }
  return res;
};


export const checkIfTokenExpired = async (res) => {

  const jwt = localStorage.get("jwt");
  if ( jwt ) {
    try {
      const parsed = parseJwt(jwt);
      const expiryDate = new Date( parsed.exp * 1000 );
      const currentDate = new Date();


      let a = moment(expiryDate);
      let b = moment(currentDate);
      let minsLeft = a.diff(b, 'minutes');
      console.log("minsLeft",minsLeft);

      if ( minsLeft <= 1000 ) {

        const refreshToken = await Api({
          url: url.auth.refreshToken,
          method: 'POST',
          isJwtRequired: false,
        });
        console.log("refreshToken", refreshToken);

      }

      return res;

    } catch(e) {
      throw Error( translate("invalidAccessToken") );
    }
  } else {

    if ( res.status && res.status === 200 ) { return res; }
    if ( res && res.url && res.url.indexOf("authenticate/login") !== -1 ) {
      return res;
    }
  
    // throw Error( translate("accessTokenNotFound") );
  }



  return res;
}


export const checkIfResponseNotOk = (res) => {
  currStatus = res.status;
  if (res.status === 503) {
    throw Error(res.statusText || "Error Occoured");
  }
  return res;
}


export const checkIfContainsIntlMessage = (res) => {
  if ( currStatus === 400 && (res.message || res.error) ) {
    currStatus = 0;
    const error = translateRes(res.message || res.error);
    throw Error(error);
  }
  currStatus = 0;
  return res;
}

// catch all thrown errors, make changes (if required) and proceed.
export const handleError = (error, url) => {
  let redirect = false;
  let message = translate("errorOccoured");

  const jwt = store.getState().auth.jwt;

  if ( typeof error === "object" ) {
    message = translate(error.message);
    if ( error && error.code && error.code === "EHOSTUNREACH" ) {
      message = translate("unableToConnectToServer");
    } else if ( error && error.code && error.code === "ETIMEDOUT" ) {
      message = translate("apiCallFailedCheckServerIP");
    } else if ( error && error.status && error.status === "ECONNREFUSED" ) {
      message = translate("connectionRefused");
    }
    else if ( error.message.indexOf("self signed certificate") !== -1 ) {
      message = translate("enableSelfSignedSSL");
    }
    else if ( message.toString().indexOf("EHOSTUNREACH") !== -1 ) {
      message = translate("unableToConnectToServer");
    }
    else if ( message.toString().indexOf("ETIMEDOUT") !== -1 ) {
      message = translate("apiCallFailedCheckServerIP");
    }
    else if ( message.toString().indexOf("ECONNREFUSED") !== -1 ) {
      message = translate("connectionRefused");
    }

  } else {
    message = translate(error);
  }

  // user should only see the button if their session has expired.
  if ( message === "Session Expired" ) { redirect = true; }
  if ( message.indexOf("Access Denied") != -1 ) { redirect = true; }

  // edge case
  if (
    message.indexOf("Access token not found") !== -1 ||
    message.indexOf("Invalid access token") !== -1 ||
    message.indexOf("غير مصرح لك أو أن التصريح انتهى") !== -1
  ) {
    redirect = true;
    if (jwt) {
      redirect = true;
    } else {
      // message = "Please enter a valid username and password.";
    }
  }

  if ( message === "Unauthorized or Token Expired." ) { redirect = true; }
  else if ( typeof message === 'string' || message instanceof String ) {
    if ( message.toLocaleLowerCase().indexOf('unauthorized') !== -1 ) {
      redirect = true;
    }
  }


  if ( message.toString().indexOf("Cannot read property '0'") !== -1 ) {
    message = translate("apiCallFailedCheckServerIP"); // enterValidServerIPAddress
  }
  if ( message.toString().indexOf("invalid json") !== -1 ) {
    message = translate("apiCallFailedCheckServerIP"); // enterValidServerIPAddress
  }

  if (
    ! jwt &&
    url.indexOf("authenticate/login") !== -1 &&
    message.indexOf("Missing required payload or incorrect payload") !== -1
  ) {
    console.log("INVALID LOGIN CREDENTIALS");
    message = translate("enterValidUsernamePassword");
  }

  const timeout = redirect ? 99999999*99999999 : 5*1000;

  if ( localStorage.get("loginpopup") === "true" ) {
    timeout = 99999999*99999999;
  }


  if ( ! redirect ) {
    ReactDOM.render(
      <PortalNotification message={`${message} - ${ error.code ? `${error.code} `: '' } ${url}`} timeout={ timeout } redirect={redirect} />,
      document.getElementById("react-portal-container")
    );  
  } else {
    ReactDOM.render(
      <PortalNotification message={message} timeout={ timeout } redirect={redirect} />,
      document.getElementById("react-portal-container")
    );  
  }

  // ReactDOM.render(
  //   <PortalNotification message={`${message} - ${ error.code ? `${error.code} `: '' } ${url}`} timeout={ timeout } redirect={redirect} />,
  //   document.getElementById("react-portal-container")
  // );

  return error;

}




export async function hijackResponse( res, url ) {

  return new Promise( async (resolve, reject) => {

    let converted = undefined;
    // when getting the action results, directly convert wsq to png
    if ( url === "/action/getactionresult" ) {
      converted = await InnovatricsHelper.convertWSQtoPNG( res, "probe.biometrics", handleLicenseFailed );

      let count = res.probe && res.probe.biometrics && res.probe.biometrics.length || 1;
      let matchCount = 0;
      res.fingerprintMatches.forEach( item => {
        if ( item.matchInfos && item.matchInfos.length > 0 ) {
          matchCount += item.matchInfos.length;
        }
      });
      if ( ! matchCount ) { matchCount = 0; }

      count = count + matchCount;

      setTimeout( () => {
        resolve(converted);
      }, (count + 1)* 200 );

    }

    // when getting the job biometrics, directly convert wsq to png
    else if ( url === "/job/getbiometrics" ) {
      converted = await InnovatricsHelper.convertWSQtoPNG( res, "biometrics", handleLicenseFailed );
      const count = res && res.biometrics && res.biometrics.length || 1;
      setTimeout( () => {
        resolve(converted);
      }, count* 200 );
    }

    else if ( url === "/action/GetMatchedBiometricsImage" ) {
      converted = await InnovatricsHelper.convertWSQtoPNG( res, "matchedBiometrics", handleLicenseFailed );
      const count = res && res.biometrics && res.biometrics.length || 1;
      setTimeout( () => {
        resolve(converted);
      }, count * 200 );
    }


    else {
      resolve(res);
    }

  });

}



async function waitForSomeTime(time) {
  return new Promise( (resolve, reject) => {
    setTimeout( () => {
      resolve(true);
    }, time || 100);
  } )
}

const updateAnnotationPosition = (biometrics) => {
  const updatedBio = [];
  biometrics.forEach( item => {
    if ( item.position === "Right Writer Palm" ) {
      updatedBio.push({ ...item, position: "Right Writers Palm" });
    }
    else if ( item.position === "Left Writer Palm" ) {
      updatedBio.push({ ...item, position: "Left Writers Palm" });
    } else {
      updatedBio.push(item);
    }
  });
  return updatedBio;
}


const handleLicenseFailed = () => {
  store.dispatch( stopSpinner() );
  store.dispatch( stopSpinner() );
  store.dispatch( requestShowNotification({
    message: "Innovatrics License Not Found.",
    type: "is-danger"
  }) );
}


export const defaultHeaders = {
  "Content-Type": "application/json",
  "Authorization": ""
};

export default async function Api({
  url,
  method = "GET",
  data,
  headers = defaultHeaders,
  isJwtRequired = false,
  fromBase = false,
}) {
  console.log("--------url----------", url);






  // if the user is not authenticated, don't make the api call and show error.
  if ( url === "/authenticate/login" || url === "/authenticate/logout" ) {
    // do nothing
  }
  else {
    const jwt = localStorage.get("jwt");

    const redirect = true;
    const timeout = redirect ? 999999*99999 : 5*1000;
    const message = translate("reAuthenticate")


    if ( jwt ) {
      const parsed = parseJwt(jwt);
      const expiryDate = new Date( parsed.exp * 1000 );
      const currentDate = new Date();

      let a = moment(expiryDate);
      let b = moment(currentDate);
      let minsLeft = a.diff(b, 'minutes');

      // if ( minsLeft <= 1 ) {
      //   return ReactDOM.render(
      //     <PortalNotification message={message} timeout={ timeout } redirect={redirect} />,
      //     document.getElementById("react-portal-container")
      //   );
      // }

    } else if ( ! jwt ) {
      return ReactDOM.render(
        <PortalNotification message={message} timeout={ timeout } redirect={redirect} />,
        document.getElementById("react-portal-container")
      );
    }

  }








  const setting = _settings();
  if (process.env.NODE_ENV !== "production") {
    if (url !== "/systeminfo") {
      console.group("--------- calling api ----------");
      console.log("url:", Constants.API_ORIGIN_URL + url);
      console.log("method:", method);
      console.log("data:", data);
      console.groupEnd();
    }
  }
  if (isJwtRequired) {
    headers = {
      ...headers,
      Authorization: "Bearer " + localStorage.get("jwt")
    };
  }

  if ( setting.workstationName || setting.location ) {
    const clientInfo = JSON.stringify({ WorkStation: setting.workstationName || "", Location: setting.location || "" });
    const clientInfoBuffer = Buffer.from(clientInfo);
    const clientInfoBase64 = clientInfoBuffer.toString('base64');
    headers["ClientInfo"] = clientInfoBase64;
  }

  // console.log("api::headers",headers);


  let showSpinner = true;
  if ( url === "/systeminfo" ) {
    showSpinner = false;
  }


  let api = Constants.API_ORIGIN_URL + (url ? url : "");

  if ( fromBase === true ) {
    api = `${setting.ipAddress}${ url }`;
  }


  if ( showSpinner ) { store.dispatch( startSpinner() ); }

  // store.dispatch( startSpinner() );
  const dataToSend = data;
  // console.log("dataToSend",dataToSend);


  // if "updatebiometrics" endpoint, let's hijack it and convert all images to WSQ
  // and send base64 of WSQ to middleware
  let converted = undefined;
  if ( url === "/job/updatebiometrics" ) {
    // const dataToSend = updateAnnotationPosition(data);

    dataToSend.biometrics = updateAnnotationPosition(dataToSend.biometrics);
    converted = await InnovatricsHelper.generateSUD( dataToSend, handleLicenseFailed );
    // console.log("converted::data",converted);
    // await waitForSomeTime(1000);
    dataToSend.biometrics = converted;

    console.log("sending data::dataToSend", dataToSend);
  }

  // if ( url === "/action/create" && dataToSend.actionType === "Register Latent" ) {
  //   console.log("inside::/action/create");
  //   const updatedParams = await InnovatricsHelper.registerLatentUpdates(dataToSend.parameters);
  //   console.log("updatedParams--updatedParams", updatedParams);
  //   dataToSend.parameters = updatedParams;
  //   console.log("action/create sending data::dataToSend", dataToSend);
  // }


  return await fetch(api, {
    method: method,
    body: JSON.stringify(dataToSend),
    headers: headers
  })
    .then(saveAPILog)
    // .then(checkIfTokenExpired)
    .then(checkIfAccessDenied)
    .then(checkIfResponseNotOk)
    .then(res => res.json())
    .then( checkIfContainsIntlMessage )
    .then( async (res) => {
      console.info("----------- API json response:", res);
      const hijackedRes = await hijackResponse( res, url );
      if ( showSpinner ) { store.dispatch( stopSpinner() ); }
      logResponse(url, hijackedRes);
      return hijackedRes;
    })
    .catch(err => {
      if ( showSpinner ) { store.dispatch( stopSpinner() ); }
      console.log("api response catch", api);
      console.error("---------- api error:", err);
      logResponse(url, err);
      saveAPILog({
        headers: {
          _headers: {
            date: [`${new Date()}`]
          }
        },
        url: api,
        status: err.code || "",
        statusText: err.message || ""
      });
      // store.dispatch( requestShowNotification({
      //   message:`${err.code}:${api}`,
      //   type: "is-danger"
      // }) );
      return handleError(err, api);
    });


}

