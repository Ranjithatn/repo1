/* eslint global-require: 0, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, globalShortcut } from "electron";
import MenuBuilder from "./menu";
import * as canon from "./hardwareSDK/canon/index";
const {
  checkForUpdates,
  installUpdates,
  downloadUpdates
} = require("./appUpdater");
const { autoUpdater } = require("electron-updater");
const { ipcMain } = require("electron");
const { settings } = require("./utils/electron");

let mainWindow = null;

app.commandLine.appendSwitch("ignore-gpu-blacklist");
// app.commandLine.appendSwitch('js-flags', '--max-old-space-size=4096');

const set = settings();
if (set.clientSSLCert && set.clientSSLCert == "enabled") {
  app.commandLine.appendSwitch('ignore-certificate-errors');
}



if (process.env.NODE_ENV === "production") {
  const sourceMapSupport = require("source-map-support");
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === "development" ||
  process.env.DEBUG_PROD === "true"
) {
  require("electron-debug")();
  const path = require("path");
  const p = path.join(__dirname, "..", "app", "node_modules");
  require("module").globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require("electron-devtools-installer");
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ["REACT_DEVELOPER_TOOLS", "REDUX_DEVTOOLS"];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

/**
 * Add event listeners...
 */

app.on("window-all-closed", () => {
  // call canon camera dispose method before quitting the app
  console.log("DISPOSING.....");
  canon.dispose();

  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
	console.log("event, webContents, url, error, certificate, callback",event, webContents, url, error, certificate, callback);
	event.preventDefault();
	callback(true);
});


app.on("ready", async () => {
  if (
    process.env.NODE_ENV === "development" ||
    process.env.DEBUG_PROD === "true"
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on("did-finish-load", () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    // mainWindow.openDevTools();

    // maximize window
    mainWindow.maximize();

    mainWindow.show();
    mainWindow.focus();
    // if (process.env.NODE_ENV === "production") {
    //   autoUpdater.checkForUpdates();
    // }
    globalShortcut.register("F9", () => {
      mainWindow && mainWindow.toggleDevTools();
    });
  });

  // if (process.env.NODE_ENV === "production") {
  //   checkForUpdates(mainWindow);
  // }


  const checkForUpdatesListener = ipcMain.on("checkForUpdates", () => {
    console.log("ipcMain.on::checkForUpdates");
    autoUpdater.checkForUpdates(mainWindow);
    checkForUpdates(mainWindow);
  });

  ipcMain.on("download", () => {
    downloadUpdates();
  });
  ipcMain.on("install", () => {
    installUpdates();
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
});
