import React from "react";
import { Link } from "react-router-dom";
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import Label from "../../components/Label/Label";
import FileBrowser from "../../components/FileBrowser/filebrowser";
import Button from "../../components/Button/Button";
import Image from "../../components/Image/Image";
import Switch from "../../components/Switch/Switch";
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
import BSON from "bson";
import archiver from "archiver";
import fs from "fs";


export class Settings extends React.Component {
  constructor() {
    super();
    this.state = {
      serverConnection: "",
      ipAddress: "",
      logFile: "",
      imageFormat: "",
      templateFormat: "",
      protocol: "",
      resumableUpload: "disabled",

      error: false,
      success: false,
      errorMessage: ""
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {

    const output = {
      id: 10,
      data: {
        name: "Hello",
        email: "abc@def.com",
        phone: "1234567890",
        website: "https://www.google.com"
      }
    }

    const bson = new BSON();
    const data = bson.serialize(output);
    console.log("data ---", data);



    // const dataDeserialized = bson.deserialize(data)
    // console.log('dataDeserialized:', dataDeserialized)







    const fsfile = fs.readFileSync('./app/jobid.bson');
    console.log("fsfile",fsfile);
    console.log('dataDeserialized:', bson.deserialize(fsfile) );









    console.log("__dirname",__dirname);
    var zipOutput = fs.createWriteStream(__dirname + '/ABCD-2020.zip');
    var archive = archiver('zip', {
      zlib: { level: 5 } // Sets the compression level.
    });

    zipOutput.on('close', function() {
      console.log(archive.pointer() + ' total bytes');
      console.log('archiver has been finalized and the output file descriptor has closed.');
    });




// good practice to catch this error explicitly
archive.on('entry', function(data) {
  console.log("new file added", data);
});


// pipe archive data to the file
archive.pipe(zipOutput);

archive.append(data, { name: 'jobid.bson' });
console.log("data",data);



// good practice to catch warnings (ie stat failures and other non-blocking errors)
archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    // log warning
  } else {
    // throw error
    throw err;
  }
});

// good practice to catch this error explicitly
archive.on('error', function(err) {
  throw err;
});


archive.finalize();

console.log("after finalized");















    this.setState({ ..._settings() });
  }

  handleInputChange(e, field) {
    let value = e.target.value;
    this.setState({ [field]: value });
  }

  handleSave(e) {
    e.preventDefault();

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

    const data = {
      serverConnection: this.state.serverConnection,
      ipAddress: this.state.ipAddress,
      logFile: this.state.logFile,
      imageFormat: this.state.imageFormat,
      templateFormat: this.state.templateFormat,
      protocol: this.state.protocol,
      resumableUpload: this.state.resumableUpload,
    };
    console.log("saving data", data);
    try {
      saveSettings(data);
      this.setState({ success: true });
    } catch (e) {
      this.setState({ error: true });
      console.log("Error occoured while saving the data in file.", e);
    }
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
      backButtonstyle = { marginRight: 30 };
    } else {
      backButtonstyle = { marginLeft: 30 };
    }

    const logFileLoc = this.state.logFile || defaultLogFileLocation;

    const { intl, requestSetLocale } = this.props;
    // const { formatMessage } = intl;
    console.log("current locale", locale);
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
                      Arabic
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
                  text={formatMessage({ id: "CheckServerConnection" })}
                  htmlFor="serverConnection"
                  style={labelStyle}
                />
                <Input
                  id="serverConnection"
                  value={this.state.serverConnection}
                  style={inputStyle}
                  wrapperStyle={wrapperStyle}
                  onChange={e => {
                    this.handleInputChange(e, "serverConnection");
                  }}
                />
              </div>

              <div className="input-wrapper">
                <Label
                  text={formatMessage({ id: "ServerIPAddress" })}
                  htmlFor="ipAddress"
                  style={labelStyle}
                />
                <Input
                  id="ipAddress"
                  value={this.state.ipAddress}
                  style={inputStyle}
                  wrapperStyle={wrapperStyle}
                  onChange={e => {
                    this.handleInputChange(e, "ipAddress");
                  }}
                />
              </div>

              <div className="input-wrapper">
                <Label
                  text={formatMessage({ id: "ServerProtocol" })}
                  htmlFor="serverProtocol"
                  style={labelStyle}
                />
                <Select
                  value={this.state.protocol}
                  style={{ ...inputStyle, ...selectStyle }}
                  id="serverProtocol"
                  options={[
                    { value: "http", displayName: formatMessage({ id: "HTTP" }) },
                    { value: "https", displayName: formatMessage({ id: "HTTPS" }) },
                  ]}
                  formatMessage={formatMessage}
                  onChange={e => {
                    this.handleInputChange(e, "protocol");
                  }}
                />
              </div>



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
                />
              </div>

              <div className="input-wrapper">
                <Label
                  text={formatMessage({ id: "SelectImageFormat" })}
                  htmlFor="imageFormat"
                  style={labelStyle}
                />
                <Select
                  value={this.state.imageFormat}
                  style={{ ...inputStyle, ...selectStyle }}
                  id="imageFormat"
                  options={[
                    { value: "WSQ", displayName: formatMessage({ id: "WSQ" }) },
                    { value: "BMP", displayName: formatMessage({ id: "BMP" }) },
                    { value: "PNG", displayName: formatMessage({ id: "PNG" }) },
                    { value: "JPG", displayName: formatMessage({ id: "JPG" }) },
                    { value: "GIF", displayName: formatMessage({ id: "GIF" }) },
                    { value: "TIF", displayName: formatMessage({ id: "TIF" }) },
                    {
                      value: "JPEG2K",
                      displayName: formatMessage({ id: "JPEG2K" })
                    }
                  ]}
                  formatMessage={formatMessage}
                  defaultValue={formatMessage({ id: "Select" })}
                  onChange={e => {
                    this.handleInputChange(e, "imageFormat");
                  }}
                />
              </div>

              <div className="input-wrapper">
                <Label
                  text={formatMessage({ id: "SelectTemplateFormat" })}
                  htmlFor="templateFormat"
                  style={labelStyle}
                />
                <Select
                  id="templateFormat"
                  value={this.state.templateFormat}
                  style={{ ...inputStyle, ...selectStyle }}
                  options={[
                    { value: "ICS", displayName: formatMessage({ id: "ICS" }) },
                    {
                      value: "ANSI",
                      displayName: formatMessage({ id: "ANSI" })
                    },
                    { value: "ISO", displayName: formatMessage({ id: "ISO" }) },
                    {
                      value: "ANSI_PLUS",
                      displayName: formatMessage({ id: "ANSI_PLUS" })
                    },
                    {
                      value: "ISO_PLUS",
                      displayName: formatMessage({ id: "ISO_PLUS" })
                    }
                  ]}
                  formatMessage={formatMessage}
                  defaultValue={formatMessage({ id: "Select" })}
                  onChange={e => {
                    this.handleInputChange(e, "templateFormat");
                  }}
                />
              </div>


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
                    { value: "disabled", displayName: formatMessage({ id: "No" }) },
                    { value: "enabled", displayName: formatMessage({ id: "Yes" }) },
                  ]}
                  formatMessage={formatMessage}
                  onChange={e => {
                    this.handleInputChange(e, "resumableUpload");
                  }}
                />
              </div>


              <div style={{ marginTop: 40 }}>
                <Button
                  rightIcon="gear"
                  text={formatMessage({ id: "SaveSettings" })}
                  type="submit"
                  className="is-primary login-button"
                  onClick={e => {
                    this.handleSave(e);
                  }}
                />

                <Link to="/" className="button is-info" style={backButtonstyle}>
                  {formatMessage({ id: "BackToLoginPage" })}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// export default injectIntl(Settings);
const mapState = (state, locale) => ({
  locale: locale.displayName,
  local: state.locale
});
export default connect(mapState, { requestSetLocale })(injectIntl(Settings));
