import React, { Fragment } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";

import Title from "../../components/Title/Title";
import Label from "../../components/Label/Label";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Image from "../../components/Image/Image";
import logoRound from "../../images/logo-round.png";
import InputField from "../../components/InputField/InputField";
import Icon from "../../components/Icon/Icon";
import { requestSetLocale } from "../../actions/locale";
// import {downloadUpdate} from "../../appUpdater"
import Lang_English from "../../images/english.png";
import Lang_Arabic from "../../images/arabic.png";
import {
  requestSetNewUpdate,
  requestShowUpdateMessage,
  requestSetDownload,
  requestSetStatus
} from "../../actions/auth";
import "./LoginForm.scss";
import Footer from "components/Footer/Footer";

import { Link } from "react-router-dom";
// import _settings from '../../config/settings';
import { updateMessageSelector } from "../../selectors/auth";
import { settings } from "../../utils/electron";
const remote = require("electron").remote;

// const ipcRenderer = remote.require("electron").ipcRenderer;
const ipcRenderer = require("electron").ipcRenderer;
import { translate, translateRes } from "../../utils/intl";

class LoginForm extends React.Component {
  constructor() {
    super();
    this.state = {
      init: true,
      loginCount: 1,
      updateCount: 1,
      update: false,
      login: false,
      downloaded: false,
      downloading: false,
      submit: false,
      submitted: false,
      updateAvailable: false
    };
    this.handleUpdateAvailable = this.handleUpdateAvailable.bind(this);
    this.handleUpdateNotAvailable = this.handleUpdateNotAvailable.bind(this);
    this.handleUpdateDownloaded = this.handleUpdateDownloaded.bind(this);
    this.handleUpdateDownloading = this.handleUpdateDownloading.bind(this);
    this.handleUpdateError = this.handleUpdateError.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.handleUpdateFailAllowLogin = this.handleUpdateFailAllowLogin.bind(
      this
    );
  }

  componentDidMount() {

    const lang = localStorage.getItem("lang") || "en";
    console.log("mmnnss",lang)
    this.props.requestSetLocale({
      lang: lang === "ar" ? "ar" : "en",
      dir: lang === "ar" ? "rtl" : "ltr",
      displayName: lang === "ar" ? "Arabic" : "English"
    })

    // if ( process.env.NODE_ENV !== "development" ) {
    this.updateAvailable = ipcRenderer.on(
      "update-available",
      this.handleUpdateAvailable
    );
    this.updateNotAvailable = ipcRenderer.on(
      "update-not-available",
      this.handleUpdateNotAvailable
    );
    this.updateDownloaded = ipcRenderer.on(
      "update-downloaded",
      this.handleUpdateDownloaded
    );
    this.updateProgress = ipcRenderer.on(
      "download-progress",
      this.handleUpdateDownloading
    );
    this.updateError = ipcRenderer.on("update-error", this.handleUpdateError);
    this.updateFailAllowLogin = ipcRenderer.on(
      "update-error-allow-login",
      this.handleUpdateFailAllowLogin
    );
    // }
  }

  componentWillUnmount() {
    // ipcRenderer.removeListener("update-available", this.updateAvailable);
    // ipcRenderer.removeListener("update-not-available", this.updateNotAvailable);
  }

  loginUser() {
    if ( ! this.state.submitted && this.state.submit ) {
      const username = this.props.username;
      const password = this.props.password;
      this.props.requestLogin({ username, password }, this.props.history);
      this.setState({ submitted: true });
    }
  }

  handleUpdateFailAllowLogin() {
    // console.log("handleUpdateFailAllowLogin", this.state);
    // setTimeout( () => {
    // console.log("inside timeout handleUpdateFailAllowLogin");
    if (!this.state.updateAvailable) {
      this.loginUser();
    }
    // }, 5000);
  }

  handleUpdateAvailable(evt, msg, info) {
    this.setState({ updateAvailable: true });
    const username = this.props.username;
    const password = this.props.password;

    // if ( ! msg && ! info ) {

    //   if ( this.state.loginCount === 1 ) {
    //     console.log("123. CALLING LOGIN", username, password);
    //     this.setState({ init: false, loginCount: 2 });
    //     if ( username !== "" && password !== "" ) {
    //       this.loginUser();
    //     }
    //   }

    //   return;
    // }

    if ( this.state.updateCount === 1 && info && info.version ) {
    // if ( this.state.updateCount === 1 ) {

      this.props.requestSetNewUpdate();
      this.props.requestSetDownload(info.version);
      this.props.requestShowUpdateMessage(`New Update Available`);

      // // this.props.requestSetDownload(info.version);
      // this.props.requestSetNewUpdate();
      // this.props.requestShowUpdateMessage(`New Update Available`);
      // // this.props.requestSetDownload(info.version);
      this.setState({ updateCount: 2 });
    } else {
      // update failed.. allow the user to login.
    }
  }

  handleUpdateNotAvailable(evt, msg, info) {
    const username = this.props.username;
    const password = this.props.password;
    if ( this.state.loginCount === 1 ) {
      this.setState({ init: false, loginCount: 2 });
      if (username !== "" && password !== "") {
        this.loginUser();
      }
    }
  }

  handleUpdateDownloaded(evt, msg, info) {
    // console.log("handleUpdateDownloaded msg, info",msg, info);
    this.props.requestShowUpdateMessage(`Update Downloaded`);
    this.setState({ downloaded: true });
    this.props.requestSetNewUpdate();
  }

  handleUpdateDownloading(evt, msg, info) {
    // console.log("handleUpdateDownloading msg, info",msg, info);
    this.props.requestShowUpdateMessage(`Downloading Update...`);
    this.setState({ downloading: true });
  }

  handleUpdateError(evt, msg, info) {
    if ( this.state.loginCount === 1 ) {
      const username = this.props.username;
      const password = this.props.password;
      this.setState({ init: false, loginCount: 2 });
      if (username !== "" && password !== "") {
        this.loginUser();
      }
    }
  }

  render() {
    const {
      requestInputFieldChanged,
      username,
      password,
      requestLogin,
      history,
      error,
      intl,
      apiUri,
      locale,
      requestSetLocale,
      requestSetNewUpdate,
      requestShowUpdateMessage,
      updateMsg,
      newUpdate,
      requestSetDownload,
      newDownload,
      version,
      requestSetStatus,
      requestCheckForAppUpdate,
      auth
    } = this.props;

    const { formatMessage } = intl;
    // let api = apiUri;

    // let _settings = settings();
    // if (_settings && _settings.ipAddress) {
    //   api = _settings.ipAddress;
    // } else {
    //   if (!api) {
    //     let apiendpoint = localStorage.getItem("api");
    //     if (apiendpoint) {
    //       apiendpoint = apiendpoint.split("/");
    //       if (apiendpoint[2]) {
    //         api = apiendpoint[2];
    //       }
    //     }
    //   }
    // }

    // if (_settings.clientSSLCert && _settings.clientSSLCert == "enabled") {
    //   process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    // } else {
    //   process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";
    // }

    // console.log("current locale", locale);

    if ( ! newUpdate && ! newDownload && ! this.state.login && this.state.loginCount === 1 && ! this.state.init ) {
      this.setState({ init: false, loginCount: 2 });
      if ( username !== "" && password !== "" ) {
        this.loginUser()
      }
    }

    // console.log("newUpdate, newDownload, this.state", newUpdate, newDownload, this.state);

    return (
      <Fragment>
      <div id="login-form">
        <div className="logo">
          <img src={logoRound} alt="round-logo" />
        </div>
        <div className="login-form-container">
          <div className="title-container">
            <Title text={formatMessage({ id: "UniversalCriminal" })} />
          </div>
          {/* <Title  text={formatMessage({id:"workstation"})} /> */}
          <form
            onSubmit={e => {
              e.preventDefault();

              if (!this.state.init) {
                this.setState({ submit: true });
                requestLogin({ username, password }, history);
              }
              else {
                this.setState({ submit: true });
                requestCheckForAppUpdate();
              }
            }}
          >
            <InputField
              labelText={formatMessage({ id: "username.label" })}
              onChange={e => requestInputFieldChanged(e, "auth")}
              inputId="username"
              value={username}
              inputClassName="input"
              placeholder={formatMessage({ id: "username.placeholder" })}
            />
            <InputField
              labelText={formatMessage({ id: "password.label" })}
              inputId="password"
              value={password}
              inputClassName="input"
              inputType="password"
              helpMsg={translate(error)}
              helpClassName="is-warning"
              placeholder={formatMessage({ id: "password.placeholder" })}
              onChange={e => requestInputFieldChanged(e, "auth")}
            />
            <Button
              rightIcon={ locale === "en" ? "sign-in" : '' }
              leftIcon={ locale !== "en" ? "sign-in" : '' }
              text={formatMessage({ id: "login" })}
              type="submit"
              disabled={!username || !password || newUpdate || newDownload}
              className="is-primary login-button"
            />

            <div
              style={{
                position: "fixed",
                top: 30,
                left: 30,
                cursor: "pointer",
                fontSize: 26
              }}
            >
              <Link to="/settings">
                <Icon
                  style={{ color: "#555" }}
                  icon="bars"
                  title={formatMessage({ id: "Open Settings" })}
                />
              </Link>
            </div>
            <div
              style={{
                position: "fixed",
                top: 23,
                right: 20,
                cursor: "pointer",
                fontSize: 18
              }}
            >
              <div
                className="language-selector-switch"
                style={{ marginLeft: "15px" }}
              >
                <div
                  onClick={() =>
                    requestSetLocale({
                      lang: locale === "en" ? "ar" : "en",
                      dir: locale === "en" ? "rtl" : "ltr",
                      displayName: locale === "en" ? "Arabic" : "English"
                    })
                  }
                  style={{ marginTop: "-2px" }}
                >
                  {locale === "en" && (
                    <div style={{ display: "flex" }}>
                    <span style={{ lineHeight: "28px", marginRight: "5px" }}>
                    لغة عربية
                    </span>{" "}
                    <Image src={Lang_Arabic} />
                  </div>
                    
                  )}
                  {locale !== "en" && (
                    <div style={{ display: "flex" }}>
                    <Image src={Lang_English} />{" "}
                    <span style={{ lineHeight: "28px", marginLeft: "5px" }}>
                      English
                    </span>
                  </div>
                  )}
                </div>
              </div>
            </div>


              { (newUpdate || newDownload) &&
              <div
                style={{
                  position: "fixed",
                  bottom: 23,
                  right: 20,
                  // cursor: "pointer",
                  fontSize: 18,
                  zIndex: 500,
                  borderRadius: 5
                }}
              >
                <div className="update_section">
                  <h4>{updateMsg}</h4>
                  {this.state.downloaded && (newUpdate||newDownload) && (
                    <Button
                      rightIcon="download"
                      text={formatMessage({ id: "quit&install" })}
                      type="button"
                      onClick={() => ipcRenderer.send("install")}
                      className="is-primary login-button"
                    />
                  )}

                  {!this.state.downloaded && newDownload && (
                    <Fragment>
                      <h5>Version:{version}</h5>
                      <Button
                        rightIcon="download"
                        text={formatMessage({ id: "download" })}
                        type="button"
                        onClick={() => ipcRenderer.send("download")}
                        className="is-primary login-button"
                        disabled={this.state.downloading}
                      />
                    </Fragment>
                  )}
                </div>
              </div>
              }

          </form>
        </div>
      </div>
      <Footer hideLogin={true} hideConnectionStatus={true} />
      </Fragment>
    );
  }
}



const mapState = ({ auth, locale }) => ({
  newDownload: auth.newDownload,
  version: auth.version,
  locale: locale.lang,
});
export default connect(
  mapState,
  {
    requestSetLocale,
    requestShowUpdateMessage,
    requestSetNewUpdate,
    requestSetDownload,
    requestSetStatus
  }
)(injectIntl(LoginForm));
