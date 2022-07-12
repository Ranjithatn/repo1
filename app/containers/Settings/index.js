import React from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import Label from "../../components/Label/Label";
import FileBrowser from "../../components/FileBrowser/filebrowser";
import Button from "../../components/Button/Button";
import Image from "../../components/Image/Image";
import Switch from "../../components/Switch/Switch";
import PortalNotification from "../../components/Notification/PortalNotification";
import RestartPopup from "../../components/Notification/RestartPopup";
// import _settings from '../../config/settings';
import {
  settings as _settings,
  saveSettings,
  defaultLogFileLocation
} from "../../utils/electron";
import { requestSetLocale } from "../../actions/locale";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";

import Lang_English from "../../images/english.png";
import Lang_Arabic from "../../images/arabic.png";
import os from "os";
import { requestFetchScanSources } from "actions/scanner";

import "./Style.scss";

import logo from "../../images/logo-round.png";

import configData from '../../config/gitHash';


class Settings extends React.Component {
  constructor() {
    super();
    this.state = {
      serverConnection: "",
      ipAddress: "",

      logging: "file",
      logFile: "",

      protocol: "",
      resumableUpload: "disabled",
      captureDevice: "canon",
      workstationName: os.hostname(),
      location: "",
      clientSSLCert: "enabled",
      thumbnailSize: "400",
      imageDimensions: "1600",
      defaultScanner: "",

      error: false,
      success: false,
      errorMessage: "",
      touched: false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    this.setState({ ..._settings() });
    this.props.requestFetchScanSources();
  }

  handleInputChange(e, field) {
    let value = e.target.value;
    this.setState({ [field]: value });
    if (!this.state.touched) {
      this.setState({ touched: true });
    }
  }

  handleSave(e) {
    e.preventDefault();

    this.setState({
      touched: false
    });

    if (this.state.serverConnection) {
      if (isNaN(this.state.serverConnection)) {
        this.setState({
          error: true,
          success: false,
          errorMessage: "Server Connection must be a number (in seocnds)"
        });
        return;
      } else {
        this.setState({ error: false, errorMessage: "" });
      }
    }

    if (this.state.ipAddress) {
      this.state.ipAddress.trim();

      if (!this.state.ipAddress.match(/^[0-9a-z]+$/)) {
        // console.log("ALPHA");
      } else {
        const dots = this.state.ipAddress.split(".");
        // console.log("dots",dots);
        if (dots.length != 4) {
          this.setState({
            error: true,
            success: false,
            errorMessage: "Please enter a valid IP address"
          });
          return;
        }

        let port = 0;
        let fourth = 0;
        if (isNaN(dots[3])) {
          port = dots[3].split(":");
          fourth = port[0];
        } else {
          fourth = dots[3];
        }

        if (
          dots.length != 4 ||
          isNaN(dots[0]) ||
          isNaN(dots[1]) ||
          isNaN(dots[2]) ||
          isNaN(fourth) ||
          dots[0] > 255 ||
          dots[1] > 255 ||
          dots[2] > 255 ||
          fourth > 255
        ) {
          this.setState({
            error: true,
            success: false,
            errorMessage: "Please enter a valid IP address"
          });
          return;
        } else {
          this.setState({ error: false, errorMessage: "" });
        }
      }
    }

    const data = {
      serverConnection: this.state.serverConnection,
      ipAddress: this.state.ipAddress.trim(),

      logging: this.state.logging,
      logFile: this.state.logFile,
      // imageFormat: this.state.imageFormat,
      // templateFormat: this.state.templateFormat,
      protocol: this.state.protocol,
      // resumableUpload: this.state.resumableUpload,
      captureDevice: this.state.captureDevice,
      workstationName: this.state.workstationName || os.hostname(),
      location: this.state.location,
      clientSSLCert: this.state.clientSSLCert,
      thumbnailSize: this.state.thumbnailSize,
      imageDimensions: this.state.imageDimensions,
      defaultScanner: this.state.defaultScanner,
    };
    // console.log("saving data", data);
    try {
      saveSettings(data);
      this.setState({ success: true });
    } catch (e) {
      this.setState({ error: true });
      // console.log("Error occoured while saving the data in file.", e);
    }

    return ReactDOM.render(
      <PortalNotification
        message={<RestartPopup />}
        popup={true}
        style={{ maxWidth: 400 }}
      />,
      document.getElementById("react-portal-container")
    );
  }

  render() {
    const local = {};

    const { formatMessage, locale } = this.props.intl;

    const labelStyle = {
      width: 500,
      marginBottom: 0,
      cursor: "pointer"
    };

    const inputStyle = {
      minWidth: 300,
      cursor: "pointer",
      padding: 5
    };

    let wrapperStyle = {};
    let selectStyle = {};
    let backButtonstyle = {};
    if (this.props.local.dir === "rtl") {
      wrapperStyle = { textAlign: "right" };
      selectStyle = { paddingRight: "40px" };
      // backButtonstyle = { marginRight: 30 };
    } else {
      // backButtonstyle = { marginLeft: 30 };
    }

    let logoStyles = {};
    if ( this.props.local.dir !== "rtl" ) {
      logoStyles = { position: "fixed", top: 0, left: 0, cursor: "pointer" };
    } else {
      logoStyles = { position: "fixed", top: 0, left: "60px", cursor: "pointer" };
    }



    const logFileLoc = this.state.logFile || defaultLogFileLocation;

    const { intl, requestSetLocale, scanSources } = this.props;
    // const { formatMessage } = intl;
    return (
      <div id="tenprint">
        <div
          style={{ background: "#2d3f4b", width: "100%", paddingBottom: 10 }}
        >
          <div className="main--settings">
            <div
              className="language-selector-switch"
              style={{ marginLeft: "15px", color: "#fff" }}
            >
              <div
                onClick={() =>
                  this.props.requestSetLocale({
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
        </div>
        <div style={{ position: "relative", flexGrow: 1 }}>
          <div className="component--settings VerifierWorkflow-Wrapper tenprintverify-main">
            <div className="left">
              <nav>
                <div className="tab active">
                  {formatMessage({ id: "DefaultSettings" })}{" "}
                </div>
              </nav>
            </div>

            <div
              className={`VerifierWorkflowWrapper-main component--settings-content ${this
                .props.local.dir || "ltr"}`}
            >
              <h1>{formatMessage({ id: "DefaultSettings" })}</h1>

              {this.state.success && (
                <div
                  style={{
                    marginTop: 30,
                    background: "#a7fdc5",
                    width: "100%",
                    padding: 20,
                    borderRadius: 5
                  }}
                >
                  Settings successfully saved.
                </div>
              )}

              {this.state.error && (
                <div
                  style={{
                    marginTop: 30,
                    background: "#ffd8d8",
                    width: "100%",
                    padding: 20,
                    borderRadius: 5
                  }}
                >
                  {this.state.errorMessage ||
                    "Error occoured while saving the data, Please try again."}
                </div>
              )}

              <div className="input-wrapper">
                <Label
                  text={formatMessage({ id: "WorkstationName" })}
                  htmlFor="workstationName"
                  style={labelStyle}
                />
                <Input
                  id="workstationName"
                  value={this.state.workstationName}
                  style={inputStyle}
                  wrapperStyle={wrapperStyle}
                  onChange={e => {
                    this.handleInputChange(e, "workstationName");
                  }}
                  disabled={true}
                />
              </div>

              <div className="input-wrapper">
                <Label
                  text={formatMessage({ id: "CheckServerConnection" })}
                  htmlFor="serverConnection"
                  style={labelStyle}
                />
                <Input
                  id="serverConnection"
                  value={ parseInt(this.state.serverConnection) ? parseInt(this.state.serverConnection) : "" }
                  style={inputStyle}
                  wrapperStyle={wrapperStyle}
                  onChange={e => {
                    this.handleInputChange(e, "serverConnection");
                  }}
                  disabled={true}
                />
              </div>

              <div className="input-wrapper">
                <Label
                  text={formatMessage({ id: "ServerIPAddress" })}
                  htmlFor="ipAddress"
                  style={labelStyle}
                />
                <div style={{ display: "flex" }}>
                  <Select
                    value={this.state.protocol}
                    style={{ ...inputStyle, ...selectStyle, minWidth: 100 }}
                    id="serverProtocol"
                    options={[
                      {
                        value: "http",
                        displayName: formatMessage({ id: "HTTP" })
                      },
                      {
                        value: "https",
                        displayName: formatMessage({ id: "HTTPS" })
                      }
                    ]}
                    formatMessage={formatMessage}
                    onChange={e => {
                      this.handleInputChange(e, "protocol");
                    }}
                    disabled={true}
                  />
                  <Input
                    id="ipAddress"
                    value={this.state.ipAddress.trim()}
                    style={{ ...inputStyle, minWidth: 200, padding: 7 }}
                    wrapperStyle={wrapperStyle}
                    onChange={e => {
                      this.handleInputChange(e, "ipAddress");
                    }}
                    disabled={true}
                  />
                </div>
              </div>

              <div className="input-wrapper">
                <Label
                  text={formatMessage({ id: "EnableLogs" })}
                  htmlFor="logging"
                  style={labelStyle}
                />
                <Select
                  id="logging"
                  value={this.state.logging}
                  style={{ ...inputStyle, ...selectStyle }}
                  options={[
                    { value: "no", displayName: formatMessage({ id: "No" }) },
                    {
                      value: "console",
                      displayName: formatMessage({ id: "Console" })
                    },
                    {
                      value: "file",
                      displayName: formatMessage({ id: "File" })
                    },
                    {
                      value: "console_and_file",
                      displayName: formatMessage({ id: "Console and File" })
                    }
                  ]}
                  formatMessage={formatMessage}
                  onChange={e => {
                    this.handleInputChange(e, "logging");
                  }}
                  disabled={true}
                />
              </div>

              {(this.state.logging === "file" ||
                this.state.logging === "console_and_file") && (
                <div className="input-wrapper">
                  <Label
                    text={formatMessage({ id: "LogFileLocation" })}
                    htmlFor="logFile"
                    style={labelStyle}
                  />
                  <Input
                    id="logFile"
                    value={logFileLoc}
                    style={inputStyle}
                    wrapperStyle={wrapperStyle}
                    onChange={e => {
                      this.handleInputChange(e, "logFile");
                    }}
                    disabled={true}
                  />
                </div>
              )}


              {/*
              <div className="input-wrapper">
                <Label
                  text={formatMessage({ id: "ToggleResumableUpload" })}
                  htmlFor="resumableUpload"
                  style={labelStyle}
                />
                <Select
                  id="resumableUpload"
                  value={this.state.resumableUpload}
                  style={{ ...inputStyle, ...selectStyle }}
                  options={[
                    {
                      value: "disabled",
                      displayName: formatMessage({ id: "No" })
                    },
                    {
                      value: "enabled",
                      displayName: formatMessage({ id: "Yes" })
                    }
                  ]}
                  formatMessage={formatMessage}
                  onChange={e => {
                    this.handleInputChange(e, "resumableUpload");
                  }}
                />
              </div>
              */}

              <div className="input-wrapper">
                <Label
                  text={formatMessage({ id: "Capture Image Using" })}
                  htmlFor="captureDevice"
                  style={labelStyle}
                />
                <Select
                  id="captureDevice"
                  value={this.state.captureDevice}
                  style={{ ...inputStyle, ...selectStyle }}
                  options={[
                    {
                      value: "canon",
                      displayName: formatMessage({ id: "Canon" })
                    },
                    {
                      value: "webcam",
                      displayName: formatMessage({ id: "Webcam" })
                    }
                  ]}
                  formatMessage={formatMessage}
                  onChange={e => {
                    this.handleInputChange(e, "captureDevice");
                  }}
                  disabled={true}
                />
              </div>

              <div className="input-wrapper">
                <Label
                  text={formatMessage({ id: "location" })}
                  htmlFor="location"
                  style={labelStyle}
                />
                <Input
                  id="location"
                  value={this.state.location}
                  style={inputStyle}
                  wrapperStyle={wrapperStyle}
                  onChange={e => {
                    this.handleInputChange(e, "location");
                  }}
                  disabled={true}
                />
              </div>

              <div className="input-wrapper">
                <Label
                  text={formatMessage({ id: "clientSSLCert" })}
                  htmlFor="clientSSLCert"
                  style={labelStyle}
                />
                <Select
                  value={this.state.clientSSLCert}
                  style={{ ...inputStyle, ...selectStyle }}
                  id="clientSSLCert"
                  options={[
                    {
                      value: "enabled",
                      displayName: formatMessage({ id: "Enabled" })
                    },
                    {
                      value: "disabled",
                      displayName: formatMessage({ id: "Disabled" })
                    }
                  ]}
                  formatMessage={formatMessage}
                  onChange={e => {
                    this.handleInputChange(e, "clientSSLCert");
                  }}
                  disabled={true}
                />
              </div>

              <div className="input-wrapper">
                <Label
                  text={formatMessage({ id: "thumbnailSize" })}
                  htmlFor="thumbnailSize"
                  style={labelStyle}
                />
                <Input
                  id="thumbnailSize"
                  value={this.state.thumbnailSize}
                  style={inputStyle}
                  wrapperStyle={wrapperStyle}
                  onChange={e => {
                    this.handleInputChange(e, "thumbnailSize");
                  }}
                  disabled={true}
                />
              </div>


              {/*
              <div className="input-wrapper">
                <Label
                  text={formatMessage({ id: "imageDimensions" })}
                  htmlFor="imageDimensions"
                  style={labelStyle}
                />
                <Input
                  id="imageDimensions"
                  value={this.state.imageDimensions}
                  style={inputStyle}
                  wrapperStyle={wrapperStyle}
                  onChange={e => {
                    this.handleInputChange(e, "imageDimensions");
                  }}
                />
              </div>
              */}



              <div className="input-wrapper">
                <Label
                  text={formatMessage({ id: "defaultScanner" })}
                  htmlFor="defaultScanner"
                  style={labelStyle}
                />
                <Select
                  value={this.state.defaultScanner}
                  style={{ ...inputStyle, ...selectStyle }}
                  id="defaultScanner"
                  options={scanSources}
                  // options={[
                  //   {
                  //     value: "enabled",
                  //     displayName: formatMessage({ id: "Enabled" })
                  //   },
                  //   {
                  //     value: "disabled",
                  //     displayName: formatMessage({ id: "Disabled" })
                  //   }
                  // ]}
                  formatMessage={formatMessage}
                  onChange={e => {
                    this.handleInputChange(e, "defaultScanner");
                  }}
                  disabled={true}
                />
              </div>


              { configData.hash &&
                <div className="input-wrapper">
                  <Label
                    text={formatMessage({ id: "gitHash" })}
                    style={labelStyle}
                  />
                  <Input
                    id="gitHash"
                    value={configData.hash}
                    style={inputStyle}
                    wrapperStyle={wrapperStyle}
                    disabled={true}
                  />
                </div>
              }



              <div style={{ marginTop: 40 }}>
                {/*
                <Button
                  rightIcon="gear"
                  text={formatMessage({ id: "SaveSettings" })}
                  type="submit"
                  className="is-primary login-button config-save-button"
                  onClick={e => {
                    this.handleSave(e);
                  }}
                  disabled={!this.state.touched}
                  // disabled={true}
                />
                */}

                <Link to="/" className="button is-info" style={backButtonstyle}>
                  {formatMessage({ id: "BackToLoginPage" })}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div style={ logoStyles }>
          <Image
            src={logo}
            onClick={() => {
              this.props.history.push("/");
            }}
            style={{
              width: 60,
              height: 60,
              position: "fixed",
              top: -10,
              marginTop: 5
            }}
            alt="logo"
          />
        </div>
      </div>
    );
  }
}

// export default injectIntl(Settings);
const mapState = (state, locale) => ({
  locale: locale.displayName,
  local: state.locale,
  scanSources: state.jobs.newJob.cardScan.scanSources || [],
});
export default connect(
  mapState,
  {
    requestSetLocale,
    requestFetchScanSources,
  }
)(injectIntl(Settings));

