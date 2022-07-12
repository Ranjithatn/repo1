const { app, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

log.transports.file.level = "debug"

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = false;
autoUpdater.logger = log;
// autoUpdater.logger.transports.file.level = "info";

let mainWindow;
let updateInfo;

// import { settings } from "./utils/electron";
const { settings } = require("./utils/electron");

// set the current server url as the auto update url
const set = settings();
autoUpdater.setFeedURL({url: `${ set.protocol || "http" }://${set.ipAddress}/services-gateway-ucw/softwareupdate`, provider: 'generic'});


  console.log("setFeedURL", `${ set.protocol || "http" }://${set.ipAddress}/services-gateway-ucw/softwareupdate` );
  // use: `autoUpdater.requestHeaders` for setting headers.

  if ( ! process.env.NODE_TLS_REJECT_UNAUTHORIZED ) {
    if (set.clientSSLCert && set.clientSSLCert == "enabled") {
      console.log("setting process.env.NODE_TLS_REJECT_UNAUTHORIZED as 0");
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
      // process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
    } else {
      console.log("setting process.env.NODE_TLS_REJECT_UNAUTHORIZED as 1");
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = 1;
      // process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'false';
    }
  }


exports.checkForUpdates = async function checkForUpdates(mainWin) {
  console.log("checkForUpdates called");
  mainWindow = mainWin;

  // if (set.clientSSLCert && set.clientSSLCert == "enabled") {
  //   console.log("setting process.env.NODE_TLS_REJECT_UNAUTHORIZED as 0");
  //   process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  // } else {
  //   console.log("setting process.env.NODE_TLS_REJECT_UNAUTHORIZED as 1");
  //   process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";
  // }


  // const set = settings();
  // const autoUpdateConfig = {
  //   provider: 'generic',
  //   url: `${set.protocol}://${set.ipAddress}/softwareupdate`,
  // };
  // console.log("autoUpdateConfig",autoUpdateConfig);
  // autoUpdater.setConfig(autoUpdateConfig);




  console.log("process.env.NODE_TLS_REJECT_UNAUTHORIZED", process.env.NODE_TLS_REJECT_UNAUTHORIZED);
  // console.log("process.env['ELECTRON_DISABLE_SECURITY_WARNINGS']", process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] );

  // await autoUpdater.checkForUpdatesAndNotify().then(res => {
  //   console.log("checkForUpdatesAndNotify::res", res);
  //   if ( ! res ) {
  //     sendStatusToWindow("update-error-allow-login",res);
  //   }
  // });
  // .catch( e => {
  //   console.log("catch error occoured", e);
  // } );



  setTimeout( () => {
    console.log("setTimeout called", updateInfo);
    if ( ! updateInfo ) {
      sendStatusToWindow("update-error-allow-login");
    }
  }, 10 * 1000);


  updateInfo = await autoUpdater.checkForUpdates();
  console.log("updateInfo",updateInfo);
  if ( ! updateInfo ) {
    sendStatusToWindow("update-error-allow-login");
  }

  // autoUpdater.checkForUpdatesAndNotify();




};
exports.installUpdates = function installUpdates() {
  try {
    autoUpdater.quitAndInstall();
  } catch (e) {
    console.log("exception", e);
  }
};
exports.downloadUpdates = function downloadUpdates() {
  autoUpdater.downloadUpdate().then(res => {
    sendStatusToWindow("download",res);
  });
};

function sendStatusToWindow(type, msg, info, error) {
  // log.info("sendStatusToWindow::type, msg, info, error",type, msg, info, error);
  if ( type ) {
    mainWindow && mainWindow.webContents.send(type, msg, info, error);
  }
}

// autoUpdater.on("checking-for-update", () => {
//   console.log("checking for app update...");
//   sendStatusToWindow("Checking for update");
// });

autoUpdater.on("update-available", info => {
  console.log("update-available");
  sendStatusToWindow("update-available", "New update is available.", info);
});

autoUpdater.on("download-progress", progress => {
  sendStatusToWindow("download-progress", "Download is in progress", progress);
});

autoUpdater.on("update-not-available", () => {
  console.log("update-not-available");
  sendStatusToWindow("update-not-available", "Update is not available.");
});

autoUpdater.on("update-downloaded", (evt, releaseNotes, releaseName) => {
  console.log("release releaseNotes, releaseName", releaseNotes, releaseName);
  sendStatusToWindow("update-downloaded", `Update downloaded.`, evt);
  // mainWindow && mainWindow.webContents.send("msg");
});

autoUpdater.on("error", error => {
  console.log("autoUpdater::error occoured", error);
  sendStatusToWindow("update-error", "Error updating app.", error);
});
