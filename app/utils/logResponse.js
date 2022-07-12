import fs from 'fs';
import Config from '../config/logs';
import path from 'path';
import electron from 'electron';
import { settings } from './electron';

// const electron = require('electron');

export const logResponse = (url, res) => {
  const _settings = settings();

    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    // console.log("userDataPath",userDataPath);

    let filePath = '';
    const logsDir = "__logs__";
    let logFolderPath = "";

    const date = `response_${new Date().toISOString().split('T')[0]}`;


    if ( _settings && _settings.logFile ) {
      logFolderPath = path.join(_settings.logFile, logsDir);
      filePath = path.join(_settings.logFile, logsDir, date + '.json');
    } else {
      filePath = path.join(userDataPath, logsDir,  date + '.json');
      logFolderPath = path.join(userDataPath, logsDir);
    }


    if (! fs.existsSync(logFolderPath) ) {
      fs.mkdirSync(logFolderPath);
    }


    const data = {
      url: url,
      timestamp: new Date(),
      response: res,
    };

    try {
      fs.appendFileSync( filePath, `${ JSON.stringify(data) },\n\n\n\n`, (err) => {
        if( err ) {
          console.error("Error writing response to Logs file., user defined location", err);
        }
      });
    }
    catch (e) {
      // console.log("CATCH writing to user specified path failed, using default location", e)
      const defaultPath = path.join(userDataPath, Config.fileName + '.json');
      fs.appendFileSync( defaultPath, `${ JSON.stringify(data) },\n\n\n\n`, (err) => {
        if( err ) {
          console.error("Error writing response to Logs file.", err);
        } else { console.log("log file updated catch defaultPath") }
      });
    }


}

export default logResponse;
