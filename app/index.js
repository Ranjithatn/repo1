import React from "react";
import { render } from "react-dom";
import { AppContainer } from "react-hot-loader";
import { addLocaleData } from "react-intl";
import en from "react-intl/locale-data/en";
import ar from "react-intl/locale-data/ar";

import Root from "./containers/Root";
import { configureStore, history } from "./store/configureStore";
import "./app.scss";

import { hideGenericErrors, enableDisableConsole } from "./utils/console";
import { checkIfLicenseExists } from "./utils";
// import { resetLocalStorage } from "./utils/reset";
import { settings } from "./utils/electron";

const { ipcRenderer } = require("electron");
// ipcRenderer.on("message", (evt, msg,error) => {
//   console.log("-------update message:", evt, msg,error);
// });

hideGenericErrors();
// resetLocalStorage();

enableDisableConsole();

addLocaleData([...en, ...ar]);

const _settings = settings();

if (_settings.clientSSLCert && _settings.clientSSLCert == "enabled") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
} else {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";
}



export const store = configureStore();

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById("root")
);

if (module.hot) {
  module.hot.accept("./containers/Root", () => {
    const NextRoot = require("./containers/Root"); // eslint-disable-line global-require
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById("root")
    );
  });
}


checkIfLicenseExists();


