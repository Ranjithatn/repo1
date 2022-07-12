import tus from "tus-js-client";
// import BSON from "bson";
import fs from "fs";
import electron from "electron";
import path from "path";
import { store } from "../../index";
import crypto from "crypto";
// const fork = require('child_process').fork;
import Constants from "../../constants";
import zip from "zlib";
const bson = new (require("bson-max")).BSON();
import InnovatricsHelper from "../../../innov-sud/helper";
import { stopSpinner } from "../../actions/spinner";
import { requestShowNotification } from "../../actions/notifications";

import {
  liveScanWorkflow,
  liveScanFingerprintResumableSuccess
} from "../../actions/liveScan";

const TEMP_DIR = "__temp__";
let tusUpload; // this will store tus object, which we can use later for aborting, etc.

export function convertBase64ToWSQ(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const modifiedData = { ...data };

      const handleLicenseFailed = () => {
        store.dispatch( stopSpinner() );
        store.dispatch( stopSpinner() );
        store.dispatch( requestShowNotification({
          message: "Innovatrics License Not Found.",
          type: "is-danger"
        }) );
      }

      const converted = await InnovatricsHelper.generateSUD(modifiedData, handleLicenseFailed);
      // console.log("convertBase64ToWSQ::converted::data",converted);
      modifiedData.biometrics = converted;

      resolve(modifiedData);

      // return modifiedData;
    } catch (e) {
      console.log("convertBase64ToWSQ::error occoured", e);
      reject(e);
    }
  });
}

// convert JS object to BSON Buffer.
export const convertToBSON = data => {
  // const bson = new BSON();
  return bson.serialize(data);
};

export const deserealizeBSON = data => {
  return bson.deserialize(Buffer.from(data));
};

// take a name and add timestamp to it, along with .zip extension.
export const generateFileName = name => {
  return `${name}_${new Date().getTime()}.gzip`;
};

export const getPath = fileName => {
  const electronUserDataPath = (electron.app || electron.remote.app).getPath(
    "userData"
  );
  const filePath = path.join(electronUserDataPath, TEMP_DIR, fileName);
  const tempDirPath = path.join(electronUserDataPath, TEMP_DIR);

  if (!fs.existsSync(tempDirPath)) {
    fs.mkdirSync(tempDirPath);
  }

  return filePath;
};

export const generateGzipFile = (fullFilePath, bsonData, callback) => {

  zip.gzip(
    bsonData,
    {
      level: zip.constants.Z_BEST_COMPRESSION
    },
    (err, buff) => {
      //Calcualte Hash (checksum)
      if (err) {
        callback(err, true);
        return;
      }
      const hash = crypto.createHash("sha1");
      hash.update(buff);
      const checksum = hash.digest("base64");
      console.log("GZip base64 hash: ", checksum);
      fs.writeFileSync(fullFilePath, buff);
      callback(checksum);
      // return checksum;
    }
  );
};


// export const uploadFile = (path, fileName, checksum, handleUploadProgress, handleUploadSuccess, handleUploadError) => {
export const uploadFile = (path, fileName, checksum) => {
  console.log("path, fileName, checksum", path, fileName, checksum);

  const file = fs.createReadStream(path);
  console.log("file", file);
  const size = fs.statSync(path).size;
  console.log("fs.statSync(path)", fs.statSync(path));
  console.log(":size:", size);
  console.log("Constants.API_ORIGIN_URL", Constants.API_ORIGIN_URL);

  const url = `${Constants.API_ORIGIN_URL}/UpdateBiometricsXhr/`;
  console.log("url", url);

  const uploadOptions = {
    // endpoint: "http://127.0.0.1:1991",
    endpoint: url,
    resume: true,
    metadata: {
      filename: fileName,
      contentType: file.type || "application/octet-stream",
      checksum: checksum
    },
    uploadSize: size,
    onError: error => {
      // handleUploadError(error);
      console.log("handleUploadError", error);
      store.dispatch(
        liveScanWorkflow({ type: "UPDATE_LOADING", data: { failed: true } })
      );
    },
    onProgress: (bytesUploaded, bytesTotal) => {
      const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
      console.log("handleUploadProgress");
      // handleUploadProgress(bytesUploaded, bytesTotal, percentage);
      store.dispatch(
        liveScanWorkflow({
          type: "UPDATE_LOADING",
          data: { percentage: percentage }
        })
      );
    },
    onSuccess: () => {
      console.log("handleUploadSuccess");
      store.dispatch(
        liveScanWorkflow({
          type: "UPDATE_LOADING",
          data: { visible: false, completed: true }
        })
      );

      // continue further process...
      store.dispatch(liveScanFingerprintResumableSuccess());

      clearStateAndDeleteFiles(path);
    }
  };

  console.log("uploadOptions", uploadOptions);

  tusUpload = new tus.Upload(file, uploadOptions);
  store.dispatch(
    liveScanWorkflow({ type: "SAVE_TUSUPLOAD_OBJECT", data: tusUpload })
  );

  const authToken = `Bearer ${localStorage.getItem("jwt")}`;
  console.log("authToken", authToken);
  tusUpload.options.headers["Authorization"] = authToken;

  tusUpload.start();
};

export const retryUpload = path => {
  console.log("retryUpload");
  try {
    store.dispatch(
      liveScanWorkflow({ type: "UPDATE_LOADING", data: { failed: false } })
    );
    const loading = store.getState().liveScan.liveScanWorkflow.loading;
    console.log("retryUpload::loading", loading);
    uploadFile(loading.filePath, loading.fileName, loading.checksum);
  } catch (e) {
    console.log("error occoured while retrying the upload", e);
  } finally {
    //
  }
};

export const cancelUpload = path => {
  console.log("cancelUpload");
  store.dispatch(
    liveScanWorkflow({
      type: "UPDATE_LOADING",
      data: { visible: false, completed: false, failed: false }
    })
  );

  const loading = store.getState().liveScan.liveScanWorkflow.loading;
  console.log("loading", loading);

  clearStateAndDeleteFiles(loading.filePath);
};

export const abortUpload = path => {
  const state = store.getState();
  console.log("state", state);
  console.log("abortUpload::abortUpload", state.liveScan.liveScanWorkflow);
  console.log("state", state);
  const tusUpload = state.liveScan.liveScanWorkflow.tusUpload;

  console.log("abortUpload", tusUpload);
  try {
    tusUpload.abort();
    store.dispatch(
      liveScanWorkflow({
        type: "UPDATE_LOADING",
        data: { visible: false, completed: false, failed: false }
      })
    );
    const loading = state.liveScan.liveScanWorkflow.loading;
    clearStateAndDeleteFiles(loading.filePath);
  } catch (e) {
    console.log("error occoured while aborting the upload", e);
  }
  // finally {
  // }
};

export const clearStateAndDeleteFiles = path => {
  console.log("clearStateAndDeleteFiles", path);
  fs.unlinkSync(path);
  store.dispatch(liveScanWorkflow({ type: "RESET_LOADING" }));
};
