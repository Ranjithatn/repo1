const { autoUpdater } = require('electron-updater')
import { settings } from "./electron";
const log = require("electron-log");
const { app, dialog } = require('electron');

// autoUpdater.autoDownload = false;
// autoUpdater.autoInstallOnAppQuit = false;
// autoUpdater.logger = log;
// autoUpdater.logger.transports.file.level = "info";

let mainWindow;

const appUpdate = function appUpdate(currWindow) {
  // console.log("currWindow",currWindow);
  mainWindow = currWindow;
  // console.log("mainWindow",mainWindow);

  const set = settings();
  autoUpdater.setFeedURL({url: `${set.protocol}://${set.ipAddress}/services-gateway-ucw/softwareupdate`, provider: 'generic'});




  // autoUpdater.on("checking-for-update", (res) => {
  //   console.log("checking for app update...");
  //   console.log("res",res);
  //   sendStatusToWindow(res);
  // });


  return autoUpdater.checkForUpdates(mainWindow).then( res => {
    // console.log("autoUpdater.checkForUpdatesautoUpdater.checkForUpdates",res);

    autoUpdater.on("checking-for-update", (res) => {
      // console.log("checking for app update...");
      // console.log("res",res);
      sendStatusToWindow(res);
    });

    sendStatusToWindow(res);
  });

};


const downloadUpdates = function downloadUpdates() {
  autoUpdater.downloadUpdate().then(res => {
    sendStatusToWindow(res);
  });
};



function sendStatusToWindow(msg, error) {
  log.info("log info",msg);
  mainWindow && mainWindow.webContents.send("message", msg, error);
}


export { appUpdate, downloadUpdates }

// export default {
//   appUpdate,
//   downloadUpdates,
// };



/*

function appUpdater(mainwindow) {
  console.log("appUpdater called");
  console.log("autoUpdater",autoUpdater);
  const set = settings();
  autoUpdater.setFeedURL({url: `${set.protocol}://${set.ipAddress}/softwareupdate`, provider: 'generic'});

  autoUpdater.on('error', err => console.log(err));
  autoUpdater.on('checking-for-update', () => console.log('checking-for-update'));
  autoUpdater.on('update-available', () => {
    console.log('update-available');
    console.log("lets do something");


    dialog.showMessageBox({
      type: 'question',
      buttons: ['Install Now', 'Later'],
      defaultId: 0,
      message: 'A new version of ' + app.getName() + ' is available.',
    }, response => {
      if (response === 0) {
        setTimeout(() => autoUpdater.downloadUpdate(), 1);
      }
    });


  });
  autoUpdater.on('update-not-available', () => console.log('update-not-available'));

  // Ask the user if update is available
  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    let message = app.getName() + ' ' + releaseName + ' is now available. It will be installed the next time you restart the application.';
    if (releaseNotes) {
      const splitNotes = releaseNotes.split(/[^\r]\n/);
      message += '\n\nRelease notes:\n';
      splitNotes.forEach(notes => {
        message += notes + '\n\n';
      });
    }
    // Ask user to update the app
    dialog.showMessageBox({
      type: 'question',
      buttons: ['Install and Relaunch', 'Later'],
      defaultId: 0,
      message: 'A new version of ' + app.getName() + ' has been downloaded',
      detail: message
    }, response => {
      if (response === 0) {
        setTimeout(() => autoUpdater.quitAndInstall(), 1);
      }
    });
  });
  // init for updates
  return autoUpdater.checkForUpdates(mainwindow);
}

export {
  appUpdater
};





*/












// let mainWindow;







// exports.checkForUpdates = function checkForUpdates(mainWin) {
//   console.log("checkForUpdates called");
//   const set = settings();
//   mainWindow = mainWin;
//   autoUpdater.setFeedURL({url: `${set.protocol}://${set.ipAddress}/softwareupdate`, provider: 'generic'});

//   console.log("autoUpdater",autoUpdater);


//   // const set = settings();
//   // const autoUpdateConfig = {
//   //   provider: 'generic',
//   //   url: `${set.protocol}://${set.ipAddress}/softwareupdate`,
//   // };
//   // console.log("autoUpdateConfig",autoUpdateConfig);
//   // autoUpdater.setConfig(autoUpdateConfig);

//   autoUpdater.checkForUpdatesAndNotify().then(res => {
//     console.log("received response", res);
//     sendStatusToWindow(res);
//   });
// };




// function sendStatusToWindow(msg, error) {
//   console.log("msg, error",msg, error);
//   log.info(msg);
//   mainWindow && mainWindow.webContents.send("message", msg, error);
// }




