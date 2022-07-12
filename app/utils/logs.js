import fs from 'fs';
import Config from '../config/logs';
import path from 'path';
import electron from 'electron';
import { settings } from './electron';

// const electron = require('electron');

export const storeLog = (res, formatted=false) => {
	// console.log("config res", res);
  const _settings = settings();

  // console.log("storeLog:_settings",_settings);
  // console.log("_settings.logging",_settings.logging);

  if ( _settings.logging && ( _settings.logging === "no" || _settings.logging === "console" ) ) {
    return;
  }


    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    // console.log("userDataPath",userDataPath);

    let filePath = '';
    const logsDir = "__logs__";
    let logFolderPath = "";

    const date = new Date().toISOString().split('T')[0];
    // console.log("LOG::DATE", date);

    // Config.fileName


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


  	let  data = {};

    if ( formatted ) {
    	data = res;
    } else {
  		data = {
  			date: res.headers._headers.date[0],
  			url: res.url,
  			status: res.status,
  			statusText: res.statusText,
  		}
    }

    try {
      fs.appendFileSync( filePath, `${ JSON.stringify(data) },\n`, (err) => {
        if( err ) {
          console.error("TRY Error writing to Logs file., user defined location", err);
        }
      });
    }
    catch (e) {
      // console.log("CATCH writing to user specified path failed, using default location", e)
      const defaultPath = path.join(userDataPath, Config.fileName + '.json');
      fs.appendFileSync( defaultPath, `${ JSON.stringify(data) },\n`, (err) => {
        if( err ) {
          console.error("CATCH Error writing to Logs file.", err);
        } else { console.log("log file updated catch defaultPath") }
      });
    }

	// console.log("Data", data);
}

export default storeLog;
