import React from "react";
import "./PalmScan.scss";
import Button from "../../Button/Button";

import ScanLeftPalm from "./Components/ScanLeftPalm";
import ScanRightPalm from "./Components/ScanRightPalm";
import ScanArea from "./Components/ScanArea";
const LivescanAPI = require("../../../hardwareSDK/biocoreSdk/livescan/livescan");
import Image from "../../Image/Image";
import {reg_space} from "../../../utils/regEx"

import ScanLeftHand from "./Components/ScanLeftHand";
import ScanRightHand from "./Components/ScanRightHand";


export class PalmScan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      height: "",
      width: "",
      step: "",
      ImpressionName: "",
      userResponse: "",
      supportedDecisions: [],
      data: [],
      final: [], // use this for sending to server
      LeftPalm: [],
      RightPalm: [],
      preview: {},
    };
    this.startScan = this.startScan.bind(this);
    this.stopScan = this.stopScan.bind(this);
    this.findSpecificFinger = this.findSpecificFinger.bind(this);
    this.sendUserResponse = this.sendUserResponse.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    if (this.props.palmScan.started) {
      this.startScan();
    }
    if (!this.props.palmScan.started) {
      this.stopScan();
    }
  }

  componentWillUnmount() {
    console.log("componentWillUnmount");
    this.props.palmScanWorkflow({ type: "HIDE" });
  }

  sendUserResponse(response) {
    const userChosenResponse =
      this.state.userResponse !== ""
        ? this.state.userResponse
        : this.state.supportedDecisions[0].value;
    LivescanAPI.sendUserResponse(userChosenResponse).then(res => {
      console.log("------------send user response workflow success:", res);
      this.setState({
        supportedDecisions: [],
        userResponse: ""
      });
    });
  }

  onChange(value) {
    console.log("--- value:", value);
    this.setState({ userResponse: value });
  }

  startScan() {
    // specify palm scan workflow here.
    const scanType = {
      workflow: "fourFourTwoName",
      workflowName: "rtlPalmPrints"
    };
    //rtlPalmPrints
    //fourFourTwo

    LivescanAPI.startCapture(
      onError => {
        alert(onError);
      },
      preview => {
        console.log("palm scan preview", preview);
        if (preview && preview.Image) {
          const url = preview.Image.ImageUri;
          const height = preview.Image.Height / 2;
          const width = preview.Image.Width / 2;
          const step = preview.Active.WorkflowStep;
          const ImpressionName = preview.Active.ImpressionName;
          this.setState({ url, width, height, step, ImpressionName, preview });
        }
      },
      onCompletedData => {
        console.log("palm scan workflow completed", onCompletedData);

        const LeftPalm = [];
        const RightPalm = [];
        const final = [];

        const LeftUpperPalm = this.findSpecificFinger(
          "LeftUpperPalm",
          onCompletedData
        );
        const LeftLowerPalm = this.findSpecificFinger(
          "LeftLowerPalm",
          onCompletedData
        );
        const LeftRighterPalm = this.findSpecificFinger(
          "LeftWritersPalm",
          onCompletedData
        );
        LeftPalm.push(LeftUpperPalm, LeftLowerPalm, LeftRighterPalm);

        const RightUpperPalm = this.findSpecificFinger(
          "RightUpperPalm",
          onCompletedData
        );
        const RightLowerPalm = this.findSpecificFinger(
          "RightLowerPalm",
          onCompletedData
        );
        const RightRighterPalm = this.findSpecificFinger(
          "RightWritersPalm",
          onCompletedData
        );
        RightPalm.push(RightUpperPalm, RightLowerPalm, RightRighterPalm);

        final.push(
          LeftUpperPalm,
          LeftLowerPalm,
          LeftRighterPalm,
          RightUpperPalm,
          RightLowerPalm,
          RightRighterPalm
        );
        this.setState({
          data: onCompletedData,
          final: final,
          LeftPalm: LeftPalm,
          RightPalm: RightPalm
        });
        this.props.palmScanWorkflow({ type: "SAVE_DATA", data: final });
        this.props.palmScanWorkflow({ type: "COMPLETE_SCAN" });
      },

      onUserRequest => {
        console.log("pam scan onUserRequest", onUserRequest);
        let supportedDecision = [];

        onUserRequest.SupportedDecisions.SupportedDecision.forEach(
          (element, index) => {
            console.log("onUserRequest :: USER REQUEST DATA ::", element);
            let eachdata = {
              value: element,
              displayName: this.props.formatMessage({ id: element })
            };
            supportedDecision.push(eachdata);
          }
        );
        this.setState({
          supportedDecisions: supportedDecision,
          response: onUserRequest.RequestCode
        });
      },
      scanType.workflowName
    );
  }

  stopScan() {
    LivescanAPI.stopCapture()
      .then(res => {
        console.log("palm scan capture/workflow stopped:", res);
        this.props.palmScanWorkflow({ type: "STOP_SCAN" });
      })
      .catch(e => {
        alert("-----scanner status:", e);
      });
  }

  findSpecificFinger(type, data) {
    const fingers = data || this.state.data;
    // let output = null;
    return fingers.filter(finger => {
      if (type === "RightUpperPalm" && finger.Position === "RightUpperPalm") {
        return finger;
      } else if (
        type === "RightLowerPalm" &&
        finger.Position === "RightLowerPalm"
      ) {
        return finger;
      } else if (
        type === "RightWritersPalm" &&
        finger.Position === "RightWritersPalm"
      ) {
        return finger;
      } else if (
        type === "LeftUpperPalm" &&
        finger.Position === "LeftUpperPalm"
      ) {
        return finger;
      } else if (
        type === "LeftLowerPalm" &&
        finger.Position === "LeftLowerPalm"
      ) {
        return finger;
      } else if (
        type === "LeftWritersPalm" &&
        finger.Position === "LeftWritersPalm"
      ) {
        return finger;
      }
    })[0];
    // return output;
  }

  render() {
    let { palmScan, palmScanWorkflow, formatMessage, requestShowModal } = this.props;
    console.log("--------props:", this.props);

    let LeftPalm = [];
    let RightPalm = [];

    if (palmScan.completed && palmScan.data.length > 0) {
      console.log("this.state", this.state);
      console.log("this.props.palmScan", palmScan);
      LeftPalm = [palmScan.data[0], palmScan.data[1], palmScan.data[2]];
      RightPalm = [palmScan.data[3], palmScan.data[4], palmScan.data[5]];
    } else {
      LeftPalm = this.state.LeftPalm;
      RightPalm = this.state.RightPalm;
    }

    console.log("LeftPalm", LeftPalm);
    console.log("RightPalm", RightPalm);
    console.log("-----palmScan:", palmScan);

    return (
      <div className="component-palm-scan">
        {palmScan.started && (
          <div className="WorkflowWrapper-main">
            <div className="columns">
              <ScanLeftHand step={this.state.step} liveScan={palmScan} preview={this.state.preview} />
              <ScanArea
                url={this.state.url}
                supportedDecisions={this.state.supportedDecisions}
                response={this.state.response}
                formatMessage={formatMessage}
                sendUserResponse={this.sendUserResponse}
                onChange={this.onChange}
                impressionName={this.state.ImpressionName}
                step={this.state.step}
              />
              <ScanRightHand step={this.state.step} liveScan={palmScan} preview={this.state.preview} />
            </div>
          </div>
        )}

        {palmScan.completed && (
          <div className="WorkflowWrapper-main">
            <div className="livescanscanned flat-fingerprints">
              {LeftPalm.length > 0 && (
                <div className="columns segmented-section3">
                  {LeftPalm.map((finger, index) => {
                    return (
                      <div key={index} className="column is-paddingless">
                        <div className="impression-name">
                          {finger.Position &&
                            finger.Position.match(reg_space).join(" ")}
                        </div>
                        <div className="segmented-data-container" title={
                          finger.Annotation.Reason.length > 0 ? `${finger.Annotation.Reason}: ${finger.Annotation.Info}` : ""
                        }>
                        {
                          finger.Image &&
                          <Image
                            src={`data:image/png;base64, ${finger.Image &&
                              finger.Image.Base64Data}`}
                            // title={`${formatMessage({ id: "score" })}: ${
                            //   finger.Image && finger.Image.Quality && finger.Image.Quality.NativeScore
                            // }`}
                            style={{ cursor: 'pointer' }}
                            onClick={ () => {
                              requestShowModal({
                                modalType: "LIVESCAN_PROBE",
                                modalProps: { image: finger.Image && finger.Image.Base64Data, position: finger.Position.match(reg_space).join(" ") }
                              })
                            }}
                          />
                        }
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {RightPalm.length > 0 && (
                <div className="columns segmented-section3">
                  {RightPalm.map((finger, index) => {
                    return (
                      <div key={index} className="column is-paddingless">
                        <div className="impression-name">
                          {finger.Position &&
                            finger.Position.match(reg_space).join(" ")}
                        </div>
                        <div className="segmented-data-container" title={
                          finger.Annotation.Reason.length > 0 ? `${finger.Annotation.Reason}: ${finger.Annotation.Info}` : ""
                        }>
                        {
                          finger.Image &&
                          <Image
                            src={`data:image/png;base64, ${finger.Image &&
                              finger.Image.Base64Data}`}
                            // title={`${formatMessage({ id: "score" })}: ${
                            //   finger.Image.Quality.NativeScore
                            // }`}
                            style={{ cursor: 'pointer' }}
                            onClick={ () => {
                              requestShowModal({
                                modalType: "LIVESCAN_PROBE",
                                modalProps: { image: finger.Image && finger.Image.Base64Data, position: finger.Position.match(reg_space).join(" ") }
                              })
                            }}
                          />
                        }
                        </div>
                      </div>
                    );
                  })}``
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default PalmScan;
