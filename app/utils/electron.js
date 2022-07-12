import path from 'path';
import electron from 'electron';
import fs from 'fs';
import os from 'os';




const userDataPath = (electron.app || electron.remote.app).getPath('userData');
// const filePath = path.join(userDataPath, `UCW_Settings.json`);
const filePath = path.join(__dirname, '../../', 'UCW_Settings.json');
console.log("__dirname",__dirname);
console.log("filePath",filePath);

// const settingsFilePath = path.join(__dirname, '../', 'UCW_Settings.json');
// console.log("settingsFilePath", settingsFilePath)


const cardScanPath = path.join(userDataPath, `_card_scan__`);
const tempPath = path.join(userDataPath, `_temp_`);

const defaultState = {
  serverConnection: "",
  ipAddress: "",
  logging: "file",
  logFile: "",
  imageFormat: "",
  templateFormat: "",
  protocol: "http",
  resumableUpload: "disabled",
  captureDevice: "canon",
  workstationName: os.hostname(),
  location: "",
  clientSSLCert: "enabled",
  thumbnailSize: "400",
  imageDimensions: "1600",
  defaultScanner: "",
  osArchitecture: "",
}



const settings = () => {

  try {

    if ( fs.existsSync(filePath) ) {
      const file_settings = JSON.parse( fs.readFileSync(filePath, 'utf8') );
      const updated = {...file_settings};
      if ( ! updated.thumbnailSize ) { updated.thumbnailSize = 400; }
      if ( ! updated.imageDimensions ) { updated.imageDimensions = 1600; }
      updated.resumableUpload = "disabled";
      return updated;
    } else {
      fs.writeFileSync(filePath, JSON.stringify(defaultState), 'utf8');
      return defaultState;
    }

  }
  catch (e) {
    console.log("catch error", e);
    return {};
  }

}


const saveSettings = (data) => {
  try {
    const existing = settings();
    // console.log("data.ipAddress",data.ipAddress);
    // console.log("existing.ipAddress",existing.ipAddress);
    if ( data.ipAddress !== existing.ipAddress ) {
      localStorage.setItem("api",`${data.protocol ? data.protocol : "http"}://${data.ipAddress}/services-gateway-ucw/api`);
    }
    fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');
    return true;
  } catch (e) {
    return false;
  }
}


const defaultLogFileLocation = userDataPath;

const generateFileName = (name) => {
  return `${ name }_${ new Date().getTime() }.png`;
}


export { settings, saveSettings, defaultLogFileLocation, cardScanPath, generateFileName, tempPath };
