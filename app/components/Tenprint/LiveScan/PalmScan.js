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

// import { connect } from "react-redux";
// import { cardScanAnnotationsSelector } from "selectors/jobs";



function showTitle( finger, formatMessage ) {
  console.log("showTitle::finger",finger);
  let text = ``;

  if ( finger && finger.Image && finger.Image.Quality && finger.Image.Quality.NativeScore ) {
    text = text + `${ formatMessage({id: "score"}) }: ${finger.Image.Quality.NativeScore || "NA"}${`\n`}`;
  } else {
    text = text + `${ formatMessage({id: "score"}) }: NA${`\n`}`;
  }

  if ( finger && finger.Annotation && finger.Annotation.Reason !== "NotAnnotated" && finger.Annotation.Reason.length > 0 ) {
    text = text + `${finger.Annotation.Reason}: ${finger.Annotation.Info}`;
  }

  return text;

}



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
      scannerStatus: "unknown",
      LeftPalm: [],
      RightPalm: [],
      preview: {},
      restared: false,
    };
    this.startScan = this.startScan.bind(this);
    this.stopScan = this.stopScan.bind(this);
    this.findSpecificFinger = this.findSpecificFinger.bind(this);
    this.sendUserResponse = this.sendUserResponse.bind(this);
    this.onChange = this.onChange.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  // async componentDidMount() {
  //   const status = await LivescanAPI.queryStatus();
  //   this.setState({ scannerStatus: status.Status.IsReady });
  // }


  componentDidUpdate() {
    // console.log("PalmScan::componentDidUpdate",this.props.palmScan, this.state);

    if (
      this.props.palmScan &&
      ( this.props.palmScan.completed === true || this.props.palmScan.started === false ) &&
      this.props.palmScan.status === "STOP_SCAN_WORKFLOW" &&
      this.state.step
    ) {
      // console.log("update state and remove the cached data");
      this.setState({
        step: "",
        ImpressionName: "",
        userResponse: "",
        supportedDecisions: [],
        preview: {},
        url: "",
      });
    }

    // if (this.props.palmScan.stopped && this.props.palmScan.status === "STOP_PALM_SCAN" ) {
    //   console.log("PalmScan::inside if");
    //   // this.props.palmScanWorkflow({ type: "START_SCAN" });
    //   // this.stopScan();
    // }

    // if (this.props.palmScan.started && this.props.palmScan.status === "RESTART_SCAN" ) {
    //   console.log("PalmScan::inside if");
    //   this.props.palmScanWorkflow({ type: "START_SCAN" });
    //   this.startScan({type: "restart"});
    // }
    // else if ( this.props.palmScan.completed ) {
    //   console.log("PalmScan::inside else");
    //   this.stopScan();
    // }
  }


  componentWillUnmount() {
    // console.log("PalmScan::componentWillUnmount");
    this.props.palmScanWorkflow({ type: "HIDE" });
    this.stopScan();
  }


  updateState( data ) {
    // console.log("PalmScan::updateState", data);
    let state = { ...this.state };
    // console.log("state",state);
    this.setState({ ...state, ...data });
  }


  sendUserResponse(response) {
    const userChosenResponse =
      this.state.userResponse !== ""
        ? this.state.userResponse
        : this.state.supportedDecisions[0].value;
    LivescanAPI.sendUserResponse(userChosenResponse).then(res => {
      // console.log("------------send user response workflow success:", res);
      this.setState({
        supportedDecisions: [],
        userResponse: ""
      });
    });
  }

  onChange(value) {
    // console.log("--- value:", value);
    this.setState({ userResponse: value });
  }

  startScan(data={}) {
    // specify palm scan workflow here.

    // console.log("startScan::called",data);



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
        // console.log("palm scan preview", preview);
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
        // console.log("palm scan workflow completed", onCompletedData);

        const LeftPalm = [];
        const RightPalm = [];
        const final = [];

        // const LeftUpperPalm = this.findSpecificFinger(
        //   "LeftUpperPalm",
        //   onCompletedData
        // );
        const LeftLowerPalm = this.findSpecificFinger(
          "LeftLowerPalm",
          onCompletedData
        );
        const LeftRighterPalm = this.findSpecificFinger(
          "LeftWritersPalm",
          onCompletedData
        );
        // LeftPalm.push(LeftUpperPalm, LeftLowerPalm, LeftRighterPalm);
        LeftPalm.push(LeftLowerPalm, LeftRighterPalm);

        // const RightUpperPalm = this.findSpecificFinger(
        //   "RightUpperPalm",
        //   onCompletedData
        // );
        const RightLowerPalm = this.findSpecificFinger(
          "RightLowerPalm",
          onCompletedData
        );
        const RightRighterPalm = this.findSpecificFinger(
          "RightWritersPalm",
          onCompletedData
        );
        // RightPalm.push(RightUpperPalm, RightLowerPalm, RightRighterPalm);
        RightPalm.push(RightLowerPalm, RightRighterPalm);

        final.push(
          // LeftUpperPalm,
          LeftLowerPalm,
          LeftRighterPalm,
          // RightUpperPalm,
          RightLowerPalm,
          RightRighterPalm
        );
        this.setState({
          data: onCompletedData,
          final: final,
          LeftPalm: LeftPalm,
          RightPalm: RightPalm,
          restared: false,
        });
        this.props.palmScanWorkflow({ type: "SAVE_DATA", data: final });
        this.props.palmScanWorkflow({ type: "COMPLETE_SCAN" });

        this.stopScan();
      },

      onUserRequest => {
        // console.log("pam scan onUserRequest", onUserRequest);
        let supportedDecision = [];

        onUserRequest.SupportedDecisions.SupportedDecision.forEach(
          (element, index) => {
            // console.log("onUserRequest :: USER REQUEST DATA ::", element);
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

      // scanner status
      (status) => {
        // console.log("SCANNER::STATUS",status);
        this.setState({ scannerStatus: status.IsReady });
      },


      scanType.workflowName
    );

    // if ( data && data.type === "restart" ) { this.setState({ restared: true }); }


  }

  stopScan() {
    this.props.requestResetPalmscanAnnotations();
    LivescanAPI.stopCapture()
      .then(res => {
        // console.log("palm scan capture/workflow stopped:", res);
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
      // if (type === "RightUpperPalm" && finger.Position === "RightUpperPalm") {
      //   return finger;
      // } else if (
      if (
        type === "RightLowerPalm" &&
        finger.Position === "RightLowerPalm"
      ) {
        return finger;
      } else if (
        type === "RightWritersPalm" &&
        finger.Position === "RightWritersPalm"
      ) {
        return finger;
      }
      // else if (
      //   type === "LeftUpperPalm" &&
      //   finger.Position === "LeftUpperPalm"
      // ) {
      //   return finger;
      // }

      else if (
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
    // console.log("PalmScan::render");
    let { palmScan, palmScanWorkflow, formatMessage, requestShowModal, annotations } = this.props;
    // console.log("--------props:", this.props);

    let LeftPalm = [];
    let RightPalm = [];

    if (palmScan.completed && palmScan.data.length > 0) {
      // console.log("this.state", this.state);
      // console.log("this.props.palmScan", palmScan);
      // LeftPalm = [palmScan.data[0], palmScan.data[1], palmScan.data[2]];
      // RightPalm = [palmScan.data[3], palmScan.data[4], palmScan.data[5]];
      LeftPalm = [palmScan.data[0], palmScan.data[1]];
      RightPalm = [palmScan.data[2], palmScan.data[3]];
    } else {
      LeftPalm = this.state.LeftPalm;
      RightPalm = this.state.RightPalm;
    }

    // console.log("LeftPalm", LeftPalm);
    // console.log("RightPalm", RightPalm);
    // console.log("-----palmScan:", palmScan);


    return (
      <div className="component-palm-scan" id="palmscan-wrapper--main">
        {(palmScan.started || palmScan.stopped) && (
          <div className="WorkflowWrapper-main">
            <div className="columns">
              <ScanLeftHand step={this.state.step} liveScan={palmScan} preview={this.state.preview} annotations={annotations} />
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
              <ScanRightHand step={this.state.step} liveScan={palmScan} preview={this.state.preview} annotations={annotations} />
            </div>
          </div>
        )}

        {palmScan.completed && ! palmScan.stopped && (
          <div className="WorkflowWrapper-main">
            <div className="livescanscanned flat-fingerprints">
              {LeftPalm.length > 0 && ( LeftPalm[0] || LeftPalm[1] ) && (
                <div className="columns segmented-section3">
                  {LeftPalm.map((finger, index) => {
                    // console.log("PalmScan::finger", finger);
                    if ( ! finger ) { return null; }
                    return (
                      <div key={index} className="column is-paddingless">
                        <div className="impression-name">
                          {finger && finger.Position &&
                            finger.Position.match(reg_space).join(" ")}
                        </div>
                        <div className="segmented-data-container" title={ showTitle(finger, formatMessage) }>
                        {
                          finger && finger.Image &&
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
                        { finger && finger.Annotation.Reason !== "NotAnnotated" && finger.Annotation.Reason.length > 0 &&
                          <div style={{ position: "absolute" }}>{ formatMessage({ id: "annotated" }) }</div>
                        }
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {RightPalm.length > 0 && ( RightPalm[0] || RightPalm[1] ) && (
                <div className="columns segmented-section3">
                  {RightPalm.map((finger, index) => {
                    // console.log("PalmScan::finger", finger);
                    if ( ! finger ) { return null; }
                    { finger.Annotation.Reason && finger.Annotation.Info }
                    return (
                      <div key={index} className="column is-paddingless">
                        <div className="impression-name">
                          {finger && finger.Position &&
                            finger.Position.match(reg_space).join(" ")}
                        </div>
                        <div className="segmented-data-container" title={ showTitle(finger, formatMessage) }>
                        {
                          finger && finger.Image &&
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
                                modalProps: { image: finger && finger.Image && finger.Image.Base64Data, position: finger.Position.match(reg_space).join(" ") }
                              })
                            }}
                          />
                        }
                        { finger && finger.Annotation.Reason !== "NotAnnotated" && finger.Annotation.Reason.length > 0 &&
                          <div style={{ position: "absolute" }}>{ formatMessage({ id: "annotated" }) }</div>
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
// const mapState = state => ({
//   annotations: cardScanAnnotationsSelector(state)
// });

// export default connect( mapState, null )(PalmScan);

/*

  style={{ alignItems: "center", justifyContent: "center" }}

*/
