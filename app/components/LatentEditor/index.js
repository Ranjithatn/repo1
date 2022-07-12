// @flow

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import "./LatentEditor.scss";
const path = require("path");
const electron = require("electron");
const { ipcRenderer } = electron;
const fs = window.require("fs");
// const { deserializeData } = require("./innovatrics");
import InnovatricsHelper from '../../../innov-sud/helper';

import Spinner from "../Spinner/Spinner";
import { requestShowNotification } from "actions/notifications";
import { translate, translateRes } from '../../utils/intl';

const readFile = path =>
  new Promise(resolve => fs.readFile(path, (err, data) => resolve(data)));
type Props = {
  onLatentReady?: (webViewElem: HTMLElement) => void,
  onReceiveSud?: (sudData: any) => void
};

class LatentEditor extends Component<Props> {
  webView: HTMLElement;

  // componentWillMount() {
  //   ipcRenderer.on("latent:ready", this.onLatentReady);
  //   ipcRenderer.on("crossmatch:sud", this.onReceiveSud);
  // }

  constructor() {
    super();
    this.state = {
      visible: false,
      key: Math.random(),
      noLicense: false,
      // spinner: false,
    }
  }

  componentDidMount() {
    this.webView.addEventListener("dom-ready", this.onWebviewReady.bind(this));
    ipcRenderer.on("latent:ready", this.onLatentReady.bind(this));
    ipcRenderer.on("crossmatch:sud", this.onReceiveSud.bind(this));
    ipcRenderer.on("latent:image-ready", this.onLatentImageReady.bind(this));
    ipcRenderer.on("loading-failed", this.licenseFailed.bind(this));
    ipcRenderer.on("invalid-input", this.invalidInput.bind(this));




    // // open the dev tools
    // this.webView.openDevTools();

    document.getElementById("save").addEventListener("click", event => {
      event.preventDefault();
      /** send request for SUD file to latent editor */
      // this.setState({ spinner: true });
      this.props.requestSaveInnovSpinner(true);

      this.webView.send("latent:sud");

      // console.log("LatentEditor::this.webView", this.webView);
      this.webView.addEventListener('console-message', (e) => {
        console.log("LatentEditor::webview", e);
        console.log('LatentEditor::webview logged a message:', e.message);
      });

    });
    this.props.requestSaveInnovSpinner(true);

    var me = this;
    window.saveClick = function() {
      me.webView.send("latent:sud");
    };
  }

  componentWillUnmount() {
      // this.webView.removeEventListener("dom-ready", this.onWebviewReady);
      // ipcRenderer.removeListener("latent:ready", this.onLatentReady);
      // ipcRenderer.removeListener("crossmatch:sud", this.onReceiveSud);

    this.webView.removeEventListener("dom-ready", this.onWebviewReady);
    // ipcRenderer.removeListener("latent:ready", this.onLatentReady);
    // ipcRenderer.removeListener("crossmatch:sud", this.onReceiveSud);
    // ipcRenderer.removeListener("latent:image-ready", this.onLatentImageReady);
    // ipcRenderer.removeListener("loading-failed", this.licenseFailed);

    ipcRenderer.removeAllListeners("latent:ready");
    ipcRenderer.removeAllListeners("crossmatch:sud");
    ipcRenderer.removeAllListeners("latent:image-ready");
    ipcRenderer.removeAllListeners("loading-failed");
    ipcRenderer.removeAllListeners("invalid-input");

    window.saveClick = null;
  }

  componentDidUpdate(prevProps, prevState) {
    if ( this.props.lang !== prevProps.lang ) {
      this.props.requestSaveInnovSpinner(true);
      this.setState({ key: Math.random(), visible: false });
    }
  }

  licenseFailed(e) {
    // console.log("licenseFailed", e, this.props);
    this.setState({ noLicense: true });
    this.props.requestSaveInnovSpinner(false);
    this.props.requestSaveInnovLicense(false);
    this.props.requestShowNotification({
      message: "Innovatrics license not found",
      type: "is-danger"
    });
  }


  invalidInput(e) {
    this.props.requestSaveInnovSpinner(false);
    this.props.requestShowNotification({
      message: translate("detectMinutiae"),
      type: "is-danger"
    });
  }


  async onLatentReady() {
    this.props.onLatentReady && this.props.onLatentReady(this.webView);
    let image = "";
    if (this.props.isScan) {
      let croppedImg = this.props.imageurl.substring(
        this.props.imageurl.indexOf(",") + 1
      );
      image = Buffer.from(croppedImg, "base64");
    } else {
      image = await readFile(this.props.imageurl);
    }

    // const webview = document.getElementById("latentwebview");
    // console.log(webview)
    this.webView && this.webView.send("latent:image", { image });
    this.props.requestSaveInnovLicense(true);
  }

  async onReceiveSud(evt, data) {
    // try {
      console.log("onReceiveSud", data);

      if ( data.sud === false ) {
        this.props.requestSaveInnovSpinner(false);
        return;
      }
      this.props.onReceiveSud && this.props.onReceiveSud(evt, data);
      const SUDFile = await InnovatricsHelper.generatePNG( data.sud, (error) => {
        console.log("onReceiveSud error occoured", error)
      });
      this.props.requestSaveInnovSpinner(false);
      this.props.requestSaveSUD(SUDFile);
    // } catch(e) {
    //   console.log("catch error occoured", e);
    //   this.props.requestSaveInnovSpinner(false);
    // }

  }

  async onWebviewReady() {
    const image = await readFile(this.props.imageurl);

    const webview = document.getElementById("latent");

      // console.log("open editor dev tools");
      // this.webView.openDevTools();


    this.webView.send("latent:image", { image });
    this.props.onWebviewReady && this.props.onWebviewReady();

    // open the dev tools
    // this.webView.openDevTools();

  }

  onLatentImageReady() {
    // console.log("onLatentImageReady::Image is ready now, we can display it.");
    this.setState({ visible: true });
    this.props.requestSaveInnovSpinner(false);
  }

  render() {
    // console.log("rendering latetnt editor.....");
    let latentSrc;
    if (process && process.env && process.env.NODE_ENV === "development") {
      latentSrc = path.normalize(
        "file:/" + path.resolve(__dirname) + "/innovatrics/latent/latent.html"
      );
    } else {
      latentSrc = path.normalize(
        "file:/" +
          path.resolve(__dirname, "../../") +
          "/app/innovatrics/latent/latent.html"
      );
    }


    // console.log("this.state",this.state);
    // console.log("this.props",this.props);


    return (
      <Fragment>

        { ! this.state.noLicense && ( ! this.state.visible || this.props.spinner ) &&
          <Spinner />
        }

        <webview
          src={latentSrc}
          className="latentwebview"
          ref={wv => (this.webView = wv)}
          // style={{ width: "100%" }}
          nodeintegration="true"
          id="latentwebview"
          webpreferences="experimentalCanvasFeatures, webgl"
          autosize="on"
          minwidth="600"
          minheight="800"
          style={ this.state.visible ? { width: "100%", height: "calc( 100vh - 136px )" } : { opacity: "0" } }
          key={this.state.key}
        />
      </Fragment>
    );

  }
}

const mapState = (state) => ({
  lang: state.locale.lang,
  spinner: state.latent.spinner,
});

export default connect(mapState, {requestShowNotification})(LatentEditor);

// export default LatentEditor;
