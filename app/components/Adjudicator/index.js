// @flow
import React, { Component, Fragment } from "react";
import "./Adjudicator.scss";
const path = require("path");
const electron = require("electron");
const { ipcRenderer } = electron;
const fs = window.require("fs");
import { connect } from "react-redux";

type Props = {
  onAdjudicatorReady?: (webViewElem: HTMLElement) => void
};

class Adjudicator extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      key: Math.random(),
    }
    this.onAdjudicatorReady = this.onAdjudicatorReady.bind(this);
  }

  webView: HTMLElement;

  componentWillMount() {
    // console.log("Inside Component Wil mount");
    ipcRenderer.on("adjudicator:ready", this.onAdjudicatorReady);
  }
  componentDidMount(){
    this.webView.addEventListener("dom-ready", () => {
      // this.webView.openDevTools();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('componentDidUpdate::this.props', this.props);

    if ( this.props.lang !== prevProps.lang ) {
      this.setState({ key: Math.random() });
    }

    this.onAdjudicatorReady();
  }

  onAdjudicatorReady() {


    //this.webView.openDevTools();
    // console.log("Inside Ready");
    this.props.onAdjudicatorReady &&
      this.props.onAdjudicatorReady(this.webView);
    // console.log("Adjudicator Ready");
    let reference;
    let probe;

    probe = this.props.ImageData;
    reference = this.props.selectedMatch;

    // const file =
    //   "D:\\thumb_left_original.jpeg";

    // base64_decode(base64,"D:\\thumb_left_original.jpeg")

    let probeBuffer = Buffer.from(probe, "base64");
    let matchBuffer = Buffer.from(reference, "base64");

    reference = {
      data: matchBuffer,
      type: "image"
    };

    probe = {
      data: probeBuffer,
      type: "image"
    };

    const data = { reference, probe };
    // console.log("DATA::", data);

    // readWriteFile(matchBuffer,'matchBuffer');
    // readWriteFile(probeBuffer, 'probeBuffer');

    this.webView.send("adjudicator:receiveData", data);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener("adjudicator:ready", this.onAdjudicatorReady);
  }

  render() {
    // console.log('test::sthis.props', this.props);
    let adjudicatorSrc;
    if (process && process.env && process.env.NODE_ENV === "development") {
      adjudicatorSrc = path.normalize(
        "file:/" +
          path.resolve(__dirname) +
          "/innovatrics/adjudicator/adjudicator.html"
      ); //dev
    } else {
      adjudicatorSrc = path.normalize(
        "file:/" +
          path.resolve(__dirname, "../../") +
          "/app/innovatrics/adjudicator/adjudicator.html"
      );
    }

    return (
      <webview
        className="adjudicatorwebview"
        src={adjudicatorSrc}
        ref={wv => (this.webView = wv)}
        style={{ width: "100%" }}
        nodeintegration="true"
        id="latent"
        autosize="on"
        key={this.state.key}
      />
    );
  }
}


const mapState = (state) => ({
  lang: state.locale.lang,
});


// export default Adjudicator;
export default connect(mapState, null)(Adjudicator);

