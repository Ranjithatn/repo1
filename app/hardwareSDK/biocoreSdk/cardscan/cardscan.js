import { parseFingerprintsData } from "../helpers";
import {
  fourFourOneOneName,
  fourFourOneOne,
} from "./workflows";
import {
  positions,
  impressions
} from "../workflows";
// import fingers from "../fingers";
// import { code, Content } from "../response";
const CrossMatch = require("../cmBiocoreWebService");

const biocoreWebServiceUrl = "https://localhost:7744";
const registerWorkflowUrl = biocoreWebServiceUrl + "/workflow/register/json";
const startCollectionUrl = biocoreWebServiceUrl + "/collection/start/json";
const stopCollectionurl = biocoreWebServiceUrl + "/collection/stop/json?";
const resetCollectionUrl = biocoreWebServiceUrl + "/collection/reset/json?";
const downloadUserDataUrl = biocoreWebServiceUrl + "/collection/person/json?";
const previewUrl = biocoreWebServiceUrl + "/preview/query/json?";
// const queryStatusUrl = "https://localhost:7744/status/query/json";
// const queryPreviewUrl = "https://localhost:7744/preview/query/json";
const userResponseUrl = biocoreWebServiceUrl + "/collection/interact/json?";
const setAnnotationsUrl = biocoreWebServiceUrl + "/collection/annotation/json";

const biocoreSession = "biocoreCardscanSession";

let onWorkflowCompleted = null;
let onErrorCallback = null;
let onScanningCallback = null;
let onUserRequestCallback = null;

let scannerStatus = { isReady: false };

let sessionId = "";
let isDownloadComplete = 0;
let cmBCWS = null;

init();
export async function startCapture(
  onError,
  onScanning,
  onCompleted,
  onUserRequest
) {
  try {
    if (typeof onError === "function") {
      onErrorCallback = onError;
    }
    if (typeof onScanning === "function") {
      onScanningCallback = onScanning;
    }
    if (typeof onUserRequest === "function") {
      onUserRequestCallback = onUserRequest;
    }
    if (typeof onCompleted === "function") {
      onWorkflowCompleted = onCompleted;
    }
    let isScannerReady = checkStatus(onErrorCallback);
    if (!isScannerReady) return;
    await callApi(registerWorkflowUrl, "post", JSON.stringify(fourFourOneOne));
    const workflow = JSON.stringify({ WorkflowName: fourFourOneOneName });
    const url = startCollectionUrl + (sessionId ? `?${sessionId}` : "");
    let startRes = await callApi(url, "post", workflow);
    if (startRes.SessionId) {
      const session = startRes.SessionId;
      localStorage.setItem(biocoreSession, session);
      cmBCWS.setSession(session);
      sessionId = session;
      // getPreview();
      return startRes;
    }
  } catch (err) {
    console.error(err);
  }
}

function init() {
  // crossmatch biocore web service
  cmBCWS = new CrossMatch.BioCoreWebService(biocoreWebServiceUrl);

  cmBCWS.onStatusChanged = status => {
    console.log("----------> status:", status);
    if ("IsReady" in status) {
      scannerStatus.isReady = status.IsReady;
    }
    if (status.UserRequest && onUserRequestCallback) {
      console.log("-----------user response needed:", status.UserRequest);
      onUserRequestCallback(status.UserRequest);
    }
    if (status.WorkflowCompleted === true && isDownloadComplete === 0) {
      console.log("-------------workflow completed:", status.WorkflowCompleted);
      downloadUserData();
    }
  };

  cmBCWS.onRegisterWorkflow = workflow => {
    console.info("------------registerWorkflow:", workflow);
    // UpdateRegisterWorkflow(cmtBC, workflow);
  };

  cmBCWS.onSessionLog = data => {
    console.info("--------session:", data);
    // UpdateSessionLog(cmtBC, data);
  };

  cmBCWS.onQueryWorkflow = workflows => {
    console.log("queryWorkflow>>>>>>>:", workflows);
    // UpdateQueryWorkflow(cmtBC, workflows);
  };

  cmBCWS.onEnvironment = env => {
    console.log("environment>>>>>>>:", env);
    // UpdateEnvironment(cmtBC, env);
  };

  cmBCWS.onPreviewChanged = preview => {
    console.info("--------previewChanged:", preview);
    getPreview(preview);
  };

  cmBCWS.onPersonData = data => {
    console.info("--------person data:", data);
  };

  cmBCWS.onException = error => {
    if (onErrorCallback) onErrorCallback(error);
  };

  let currentSessionId = localStorage.getItem(biocoreSession);
  if (currentSessionId && currentSessionId !== "undefined") {
    cmBCWS.setSession(currentSessionId);
    sessionId = currentSessionId;
    stopCapture();
  }
}

export function setAnnotations(annotations) {
  return new Promise((resolve, reject) => {
    let isScannerReady = checkStatus();
    if (!isScannerReady) reject("scanner is not ready");
    const url = setAnnotationsUrl + (sessionId ? `?${sessionId}` : "");
    const jsonAnnotations = JSON.stringify(annotations);
    console.log("------- setting annotations:", url, jsonAnnotations);
    return callApi(url, "post", jsonAnnotations).then(res => {
      if (res.SessionId) {
        console.log("---------- set annotations response:", res);
        localStorage.setItem(biocoreSession, res.SessionId);
        if (res.SessionId) sessionId = res.SessionId;
        resolve(res);
      }
      reject(res);
    });
  });
}

export function stopCapture() {
  return callApi(stopCollectionurl + (sessionId || "")).then(res => {
    return resetCollection();
  });
}

export async function sendUserResponse(response = "enumRepeatStep") {
  //enumRepeatStep | enumConfirmResult | enumAbortWorkflow | enumOverrideResult
  let isScannerReady = checkStatus();
  if (isScannerReady === false) return Promise.reject("scanner not ready");
  var responseJson = JSON.stringify({ UserResponse: response });
  return callApi(userResponseUrl + sessionId, "post", responseJson)
    .then(res => res)
    .catch(e => {
      throw ("send user response error:", e);
    });
}

function downloadUserData() {
  if (sessionId) {
    console.info("----------downloading data");
    return callApi(downloadUserDataUrl + sessionId) //.then(res => res.json())
      .catch(stopCapture)
      .then(res => {
        if (res && res.PersonData) {
          isDownloadComplete += 1;
          var data = parseFingerprintsData(res);
          console.log("----------downloaded user data:", data);
          if (onWorkflowCompleted) onWorkflowCompleted(data);
        }
        return true;
      })
      .then(stopCapture);
  }
}

function resetCollection() {
  return callApi(resetCollectionUrl + (sessionId || "")) //.then(res => res.json())
    .then(res => {
      console.log("-----------COLLECTION IS RESET RESPONSE:", res);
      if (res.ExceptionData && res.ExceptionData.Message === "BioCoreWebService Error Session not found") {
        cmBCWS.setSession("");
        sessionId = "";
        localStorage.setItem(biocoreSession, "");
        console.group();
        console.log("----------session not found");
        console.log("---------sessionId:", sessionId);
        console.log("----------local storage session", localStorage.getItem(biocoreSession));
        console.groupEnd();
      } else {
        if ("SessionId" in res) {
          isDownloadComplete = 0;
          cmBCWS.setSession(res.SessionId);
          sessionId = res.sessionId;
          localStorage.setItem(biocoreSession, res.SessionId);
          return true;
        } else {
          return false;
        }
      }
    });
}

function callApi(url, method = "get", data = null) {
  console.group();
  console.log(method);
  console.log(url);
  console.log(data);
  console.groupEnd();
  return fetch(url, {
    method,
    body: data
  })
    .then(res => {
      return res.text().then(res => {
        if (res) return JSON.parse(res);
        return res;
      });
    })
    .then(res => {
      console.log("---------API RESPONSE:", res);
      return res;
    })
    .catch(err => {
      console.error("---------api error:", err);
      throw err;
    });
}

function getPreview(preview) {
  if (onScanningCallback) {
    if (preview.Image && preview.Image.ImageUri) {
      preview.Image.ImageUri = biocoreWebServiceUrl + preview.Image.ImageUri + sessionId;
    }
    if (preview.Active) {
      preview.Active.WorkflowStep =
        positions[preview.Active.Position];
        preview.Active.ImpressionName =
        impressions[preview.Active.Impression];
    }
    onScanningCallback(preview);
  }
}

function checkStatus(callback) {
  let result;
  if (scannerStatus.isReady !== true) {
    if (callback) callback("scanner not ready");
    result = false;
  } else {
    result = true;
  }
  return result;
}
