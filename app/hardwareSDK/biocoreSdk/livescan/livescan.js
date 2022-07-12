import { parseFingerprintsData, makePalmsData } from "../helpers";
import { positions, impressions } from "../workflows";
// import os from 'os';
import * as workflows from "../workflows";
import { settings } from "../../../utils/electron";

// const arch = os.arch();
const arch = process.env.PROCESSOR_ARCHITECTURE;
console.log("arch",arch);



// let workflows = null;
let biocoreWebServiceUrl = null;

// if ( arch === "win32" || arch === "ia32" ) {


const defaultSettings = settings();
console.log("defaultSettings",defaultSettings)

if ( defaultSettings.osArchitecture && defaultSettings.osArchitecture === "32" ) {
  biocoreWebServiceUrl = "https://localhost:7743";
} else {
  biocoreWebServiceUrl = "http://localhost:7743";  
}


// if ( arch !== 'x86' || arch !== 'AMD64' || arch.indexOf('32') !== -1 ) {
//   biocoreWebServiceUrl = "https://localhost:7743";
// } else {
//   biocoreWebServiceUrl = "http://localhost:7743";
// }




// if ( arch === "ia32" ) {
//   biocoreWebServiceUrl = "https://localhost:7743";
//   // workflows = require('../workflows-32');
//   // workflows = require('../workflows');
// } else {
//   biocoreWebServiceUrl = "http://localhost:7743";
//   // workflows = require('../workflows');
// }


console.log("biocoreWebServiceUrl",biocoreWebServiceUrl, workflows);
// import fingers from "../fingers";
// import { code, Content } from "../response";
// const CrossMatch = require("../cmBiocoreWebService");

// const biocoreWebServiceUrl = "https://localhost:7743";
const registerWorkflowUrl = biocoreWebServiceUrl + "/workflow/register/json";
const startCollectionUrl = biocoreWebServiceUrl + "/collection/start/json";
const stopCollectionurl = biocoreWebServiceUrl + "/collection/stop/json";
const resetCollectionUrl = biocoreWebServiceUrl + "/collection/reset/json";
const downloadUserDataUrl = biocoreWebServiceUrl + "/collection/person/json?";
const previewUrl = biocoreWebServiceUrl + "/preview/query/json?";
// const queryStatusUrl = "https://localhost:7743/status/query/json";
// const queryPreviewUrl = "https://localhost:7743/preview/query/json";
const userResponseUrl = biocoreWebServiceUrl + "/collection/interact/json?";
const setAnnotationsUrl = biocoreWebServiceUrl + "/collection/annotation/json";
const queryStatusUrl = biocoreWebServiceUrl + "/status/query/json";

const biocoreSession = "biocoreSession";

let onWorkflowCompleted = null;
let onErrorCallback = null;
let onPreviewData = null;
let onUserRequestCallback = null;
let onStatusCallback = null;
let _workflowName = null;

let scannerStatus = { IsReady: false };

let sessionId = "";
let isDownloadComplete = 0;
let cmBCWS = null;
let allowQueryStatus = false;

// init();

export async function startCapture(
  onError,
  onData,
  onCompleted,
  onUserRequest,
  onStatus,
  workflowName
) {
  try {
    if (typeof onError === "function") {
      onErrorCallback = onError;
    }
    if (typeof onUserRequest === "function") {
      onUserRequestCallback = onUserRequest;
    }
    if (typeof onData === "function") {
      onPreviewData = onData;
    }
    if (typeof onCompleted === "function") {
      onWorkflowCompleted = onCompleted;
    }
    if (typeof onStatus === "function") {
      onStatusCallback = onStatus;
    }

    // await this.resetCollection();

    if (!workflows[workflowName]) throw new Error("no workflow found");
    _workflowName = workflowName;
    const workflow = workflows[workflowName];
    const workflowNameJson = JSON.stringify({
      WorkflowName: workflow.Workflow.Name
    });

    //we call registerWorkflow and wait for response for sessionID before we call startCollection
    const registerRes = await callApi(
      registerWorkflowUrl,
      "post",
      JSON.stringify(workflow)
    );
    const url = startCollectionUrl + (sessionId ? `?${sessionId}` : "");
    const startRes = await callApi(url, "post", workflowNameJson);
    isDownloadComplete = 0;
    allowQueryStatus = true;
    _doQueryStatus(0);
    _doQueryPreview(0);
  } catch (err) {
    console.error(err);
    onError(err);
  }
}

export function setAnnotations(annotations) {
  return new Promise((resolve, reject) => {
    if (!scannerStatus.IsReady) reject("scanner is not ready");
    const url = setAnnotationsUrl + (sessionId ? `?${sessionId}` : "");
    const jsonAnnotations = JSON.stringify(annotations);
    console.log("------- setting annotations:", url, jsonAnnotations);
    return callApi(url, "post", jsonAnnotations).then(res => {
      if (res.SessionId) {
        console.log("---------- set annotations response:", res);
        localStorage.setItem(biocoreSession, res.SessionId);
        if (res.SessionId) sessionId = res.SessionId;
        resolve(res);
      } else {
        if (
          res.ExceptionData &&
          res.ExceptionData.Message &&
          res.ExceptionData.Message ===
            "BioCoreWebService Error Session not specified"
        ) {
          resetCollection().then(resetRes => {
            if (resetRes === true) {
              setAnnotations(annotations);
            } else {
              reject(res);
            }
          });
        } else {
          reject(res);
        }
      }
    });
  });
}

export async function stopCapture() {
  console.log("stopCapture::sessionId",sessionId);
  let url = !!sessionId
    ? `${stopCollectionurl + "?" + sessionId}`
    : stopCollectionurl;
    localStorage.removeItem(biocoreSession);
    if ( sessionId ) { sessionId = ""; }
    console.log("url",url);
  await resetCollection();
  await callApi(url).then(() => (allowQueryStatus = false));
}

export async function sendUserResponse(response = "enumRepeatStep") {
  //enumRepeatStep | enumConfirmResult | enumAbortWorkflow | enumOverrideResult

  return new Promise((resolve, reject) => {
    if (scannerStatus.IsReady) {
      var responseJson = JSON.stringify({ UserResponse: response });
      callApi(userResponseUrl + sessionId, "post", responseJson)
        .then(res => {
          _doQueryPreview(5);
          resolve(res);
        })
        .catch(e => {
          reject("send user response error:", e);
        });
    } else {
      reject("Scanner is not ready");
    }
  });
}

export async function resetCollection() {
  let url = !!sessionId
    ? `${resetCollectionUrl + "?" + sessionId}`
    : resetCollectionUrl;
  return callApi(url)
    .then(res => {
      console.log("----------> collection reset response:", res);
      if (allowQueryStatus === false) return;
      if (
        res.ExceptionData &&
        res.ExceptionData.Message ===
          "BioCoreWebService Error Session not found"
      ) {
        sessionId = null;
      } else {
        if ("SessionId" in res) {
          sessionId = res.SessionId;
          allowQueryStatus = false;
          return true;
        }
      }
      return false;
    })
    .catch(e => e);
}

function downloadUserData() {
  if (sessionId) {
    callApi(downloadUserDataUrl + sessionId)
      .catch(stopCapture)
      .then(res => {
        if (isDownloadComplete) return;
        isDownloadComplete += 1;
        if (res && res.PersonData) {
          let result;
          if (_workflowName && _workflowName.toLowerCase().includes("palm")) {
            result = makePalmsData(
              res.PersonData.FingerprintBiometrics.FingerprintBiometric
            );
          } else {
            result = parseFingerprintsData(res);
          }
          if (onWorkflowCompleted) {
            allowQueryStatus = false;
            onWorkflowCompleted(result);
            resetCollection();
          }
        }
        return true;
      });
  }
}

function callApi(url, method = "GET", data = null) {
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
      console.log("biocore response", res);
      if ( res.IsReady === false ) {
        console.log("onStatusCallback", res);
        onStatusCallback && onStatusCallback(res);
      }
      _onResponse(res);
      return res;
    })
    .catch(err => {
      console.error("api error:", err);
      throw err;
    });
}

function _onResponse(res) {
  if (res != null) {
    if (res.SessionId != null) {
      sessionId = res.SessionId;
    } else if (res.Status != null) {
      _onQueryStatus(res);
    } else if (res.Preview != null) {
      _onQueryPreview(res);
    } else if (res.ExceptionData != null) {
      onErrorCallback && onErrorCallback(res.ExceptionData);
    } else if (res.EnvironmentData != null) {
      self.onEnvironment(res.EnvironmentData);
    } else if (res.WorkflowName != null) {
      // self.onRegisterWorkflow(res.WorkflowName);
    } else if (
      res.WorkflowList != null &&
      res.WorkflowList.WorkflowName != null
    ) {
      console.log("----- onQueryWorkflow:", res.WorkflowList);
      // self.onQueryWorkflow(res.WorkflowList.WorkflowName);
    } else if (res.Annotations != null) {
      console.log("------ on annotations:", res.Annotations);
      // self.onAnnotations(res.Annotations);
    } else if (res.PersonData != null) {
      console.log("----- on person data:", res.PersonData);
      // self.onPersonData(res.PersonData);
    } else if (res.SessionLog != null) {
      console.log("-------- on session Log:", res.SessionLog);
      // self.onSessionLog(res.SessionLog);
    } else if (res.CollectionStatus != null) {
      console.log("----- on collectionStatus:", res.CollectionStatus);
      // self.onCollectionStatus(res.CollectionStatus);
    } else {
      return res;
    }
  }
  return null;
}

function onPreviewChanged(preview) {
  if (preview) {
    if (preview.Image && preview.Image.ImageUri) {
      preview.Image.ImageUri =
        biocoreWebServiceUrl + preview.Image.ImageUri + sessionId;
    }
    if (preview.Active) {
      preview.Active.WorkflowStep = positions[preview.Active.Position];
      preview.Active.ImpressionName = impressions[preview.Active.Impression];
    }
    onPreviewData(preview);
  } else {
    onPreviewData(preview);
  }
}

function onStatusChanged(status) {
  console.log("status>>>>>>>:", status);
  scannerStatus = status;
  if (status.UserRequest && onUserRequestCallback) {
    console.log("user request status>>>>>>>>>>>:", status.UserRequest);
    onUserRequestCallback(status.UserRequest);
    _doQueryPreview(5);
  } else if (status.WorkflowCompleted === true && isDownloadComplete === 0) {
    downloadUserData();
  }
  onStatusCallback && onStatusCallback(status);
}

function _onQueryStatus(arr) {
  try {
    onStatusChanged(arr.Status);
  } catch (e) {
    // alert(e);
  }
  if (allowQueryStatus) {
    _doQueryStatus(5);
  }
}

function _onQueryPreview(arr) {
  try {
    onPreviewChanged(arr.Preview);
  } catch (e) {
    alert(e);
  }
  _doQueryPreview(5);
}

let queryPreviewTimeout = null;
function _doQueryPreview(timeout) {
  if (queryPreviewTimeout) return;
  var content = { TimeOutSec: timeout };
  // max 10 requests per second
  const url = previewUrl + (sessionId ? sessionId : "");
  queryPreviewTimeout = window.setTimeout(() => {
    callApi(url, "POST", JSON.stringify(content));
    window.clearTimeout(queryPreviewTimeout);
    queryPreviewTimeout = null;
  }, 25);
}

function _doQueryStatus(timeout) {
  _doQueryPreview(0);
  var content = { TimeOutSec: timeout };

  // max 10 requests per second
  const url = !!sessionId ? `${queryStatusUrl}?${sessionId}` : queryStatusUrl;
  window.setTimeout(function() {
    callApi(url, "POST", JSON.stringify(content));
  }, 100);
}

export async function queryStatus() {
  const url = !!sessionId ? `${queryStatusUrl}?${sessionId}` : queryStatusUrl;
  const res = await callApi(url, "POST", JSON.stringify({ TimeOutSec: 0 }));
  return res;
}
