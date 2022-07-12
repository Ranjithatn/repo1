import React, { Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import WorkflowWrapper from "../../WorkflowWrapper/WorkflowWrapper";

import LiveScanTop from "./LiveScanTop";
import LiveScanLeft from "./LiveScanLeft";

import ScanLeftHand from "./Components/ScanLeftHand";
import ScanRightHand from "./Components/ScanRightHand";
import ScanArea from "./Components/ScanArea";
import Image from "../../Image/Image";
import PalmScan from "./PalmScan";

const LivescanAPI = require("../../../hardwareSDK/biocoreSdk/livescan/livescan");

import Helper from '../TenprintVerify/Helper';
import * as localStorage from "../../../utils/localStorage";
import {reg_space} from "../../../utils/regEx"

import { settings as _settings } from "../../../utils/electron";

import "./LiveScan.scss";


import {
  requestStartScan,
  requestStopScan,
  requestSetScannedType,
  palmScanWorkflow,
  liveScanWorkflow,
  requestSaveLivescanFingerprints,
  requestStoreCanonData,
  requestSaveLivescanFingerprintsResumable,
} from "../../../actions/liveScan";



import {
  palmScanSelector,
  liveScanSelector,
  canonDataSelector,
  webcamImageSelector,
} from "../../../selectors/liveScan";

import { requestShowModal } from "../../../actions/modal";
import Button from "../../Button/Button";
import * as liveScanHelper from '../../../sagas/helpers/liveScanHelper';





class LiveScan extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      step: '',
      impressionName: '',
      scanStart: false,
      completedScan: false,

      started: false,
      preview: {},
      url: "",
      height: "",
      width: "",
      userResponse: "",
      supportedDecisions: [],
      data: {},
      final: [], // use this for sending to server
    };
    this.sendUserResponse = this.sendUserResponse.bind(this);
    this.onChange = this.onChange.bind(this);
    this.startScan = this.startScan.bind(this);
    this.stopScan = this.stopScan.bind(this);
    this.findBothHands = this.findBothHands.bind(this);

    this.handleRetryUpload = this.handleRetryUpload.bind(this);
    this.handleAbortUpload = this.handleAbortUpload.bind(this);
    this.handleCancelUpload = this.handleCancelUpload.bind(this);
  }


  sendUserResponse(response) {
    const userChosenResponse =
      this.state.userResponse !== ""
        ? this.state.userResponse
        : this.state.supportedDecisions[0].value;
    LivescanAPI.sendUserResponse(userChosenResponse).then(res => {
      console.log("sending user response to the livescanapi:", res);
      this.setState({
        supportedDecisions: [],
        userResponse: ""
      });
    });
  }


  onChange(value) {
    console.log("user response:", value);
    this.setState({ userResponse: value });
  }


  handleRetryUpload() {
    console.log("handleRetryUpload");
    liveScanHelper.retryUpload();
  }


  handleAbortUpload() {
    console.log("handleAbortUpload");
    liveScanHelper.abortUpload();
  }

  handleCancelUpload() {
    console.log("handleCancelUpload");
    liveScanHelper.cancelUpload();
  }


  startScan() {
    this.props.liveScanWorkflow({ type: 'START_SCAN' });
    LivescanAPI.startCapture(
      onError => {
        alert(onError);
      },
      preview => {
        console.log("live scan preview", preview);
        console.log("preview.Active.Modality", preview.Active && preview.Active.Modality);
        if (preview && preview.Image) {
          const url = preview.Image.ImageUri;
          const height = preview.Image.Height / 2;
          const width = preview.Image.Width / 2;
          const step = preview.Active.WorkflowStep;
          const impressionName = preview.Active.ImpressionName;
          this.setState({ url, width, height, step, impressionName, preview });
        }
      },
      onCompletedData => {
        console.log("live scan workflow completed", onCompletedData);

        this.setState({ data: {}, final: [] });

        const LeftHand = this.findAllLeftHand( onCompletedData );
        const RightHand = this.findAllRightHand( onCompletedData );
        const BothHands = this.findBothHands( onCompletedData );

        this.setState({
          data: { LeftHand, RightHand, BothHands },
          final: onCompletedData,
        });
        this.props.liveScanWorkflow({ type: "SAVE_DATA", data: onCompletedData });
        this.stopScan();
        this.props.liveScanWorkflow({ type: "COMPLETE_SCAN" });
      },

      onUserRequest => {
        console.log("live scan onUserRequest", onUserRequest);
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
      this.props.liveScan.type
    );
  }

  stopScan() {
    LivescanAPI.stopCapture()
      .then(res => {
        console.log("live scan capture/workflow stopped:", res);
        this.setState({ step: '' })
        this.props.liveScanWorkflow({ type: "STOP_SCAN" });
      })
      .catch(e => {
        console.log("-----scanner status:", e);
      });
  }


  findAllLeftHand(fingers) {
    const selected = fingers.filter( finger => finger.position.indexOf('Left') > - 1 );
    return this.sortFingers(selected);
  }

  findAllRightHand(fingers) {
    const selected = fingers.filter( finger => finger.position.indexOf('Right') > - 1 );
    return this.sortFingers(selected);
  }

  findBothHands(fingers) {
    let output = [];
    fingers.map( finger => {
      if ( finger.position === "LeftFourFingers" ) { output[0] = finger; }
      if ( this.props.liveScan.type === "fourFourTwoFlatAndRolls" ) {
        if ( finger.position === "LeftThumb" && finger.impression === "LivescanPlain" ) { output[1] = finger; }
        if ( finger.position === "RightThumb" && finger.impression === "LivescanPlain" ) { output[2] = finger; }
        if ( finger.position === "RightFourFingers" ) { output[3] = finger; }
      } else {
        if ( finger.position === "BothThumbs" ) { output[1] = finger; }
        if ( finger.position === "RightFourFingers" ) { output[2] = finger; }
      }

    });
    return output;
  }


  sortFingers(fingers) {
    let output = [];
    fingers.map((finger, index) => {
      if (finger.position.indexOf("Thumb") != -1) {
        output[0] = finger;
      } else if (finger.position.indexOf("Index") != -1) {
        output[1] = finger;
      } else if (finger.position.indexOf("Middle") != -1) {
        output[2] = finger;
      } else if (finger.position.indexOf("Ring") != -1) {
        output[3] = finger;
      } else if (finger.position.indexOf("Little") != -1) {
        output[4] = finger;
      }
    });
    return output;
  }

  componentDidMount() {
    const listening = localStorage.get("tenprintListener");
    if ( listening === null || listening != 'true' ) {
      localStorage.set("tenprintListener", "true");
      const routeChangeListener = this.props.history.listen( location => {
        if ( location.pathname === "/authenticated/tenprint/livescan" || location.pathname === "/authenticated/tenprint" ) {
          // console.log("DONT RESET STORE");
        } else {
          console.log("RESET STORE");
          localStorage.remove('tenprintListener');
          this.props.liveScanWorkflow({ type: "RESET" }); // reset livescan data
          this.props.palmScanWorkflow({ type: 'RESET' }); // reset palmscan data
          this.props.requestStoreCanonData(""); // reset the mugshot
          routeChangeListener();
        }
      });
    }

  }


  // componentWillUnmount() {
  //   console.log("componentWillUnmount::I am leaving.....");
  //   this.props.liveScanWorkflow({ type: "RESET" });
  //   this.props.requestStoreCanonData(""); // reset the mugshot
  // }


  render() {

    const {
      palmScan,
      liveScan,
      history,
      formatMessage,
      liveScanWorkflow,
      palmScanWorkflow,
      requestShowModal,
      requestSaveLivescanFingerprints,
      canonData,
      requestSaveLivescanFingerprintsResumable,
      webcamImage,
    } = this.props;

    console.log("LiveScan :: state", this.state );
    console.log("LiveScan :: props", this.props );

    const setting = _settings();


    // write a better logic here
    // const routeChangeListener = history.listen( location => {
    //   if (location.pathname != "/authenticated/tenprint/livescan") {
    //     console.log("LiveScan :: HISTORY CHANGE LISTENER..")
    //     routeChangeListener();
    //     // LivescanAPI.resetCollection(); // reset the entire collection.
    //     this.props.liveScanWorkflow({ type: "RESET" });
    //     this.props.requestStoreCanonData({ data: null }); // reset the mugshot
    //   }
    // });



    return (
      <WorkflowWrapper
        className="livescan-main"
        top={
          <LiveScanTop
            history={history}
            formatMessage={formatMessage}
            step={this.state.step}
            impressionName={this.state.impressionName}
            palmScan={palmScan}
            liveScan={liveScan}
            requestSaveLivescanFingerprints={requestSaveLivescanFingerprints}
            palmScanWorkflow={palmScanWorkflow}
            liveScanWorkflow={liveScanWorkflow}
            requestSaveLivescanFingerprintsResumable={requestSaveLivescanFingerprintsResumable}
          />
        }
        left={
          <LiveScanLeft
            startScan={this.startScan}
            stopScan={this.stopScan}
            requestShowModal={requestShowModal}
            palmScanWorkflow={palmScanWorkflow}
            history={history}
            canonData={canonData}
          />
        }
        // palmScan={
        //   <Fragment>
        //     {palmScan.visible && (
        //       <PalmScan
        //         formatMessage={formatMessage}
        //         palmScan={palmScan}
        //         palmScanWorkflow={palmScanWorkflow}
        //         requestStartScan={requestStartScan}
        //         requestStopScan={requestStopScan}
        //         scanStart={this.state.scanStart}
        //         completedScan={this.state.completedScan}
        //         started={ true }
        //       />
        //     )}
        //   </Fragment>
        // }
        main={
          <div className="component-palm-scan">

            {/* livescan tan starts here */}
            { liveScan.tab === "palmscan" && (
              <Fragment>
                {palmScan.visible && (
                  <PalmScan
                    formatMessage={formatMessage}
                    palmScan={palmScan}
                    palmScanWorkflow={palmScanWorkflow}
                    // requestStartScan={requestStartScan}
                    // requestStopScan={requestStopScan}
                    // scanStart={this.state.scanStart}
                    // completedScan={this.state.completedScan}
                    // state={this.state}
                    requestShowModal={requestShowModal}
                    sendUserResponse={this.sendUserResponse}
                  />
                )}
              </Fragment>
              )}

              { liveScan.tab === "palmscan" && ! palmScan.started && ! palmScan.completed && (
              <div className="WorkflowWrapper-main">
                <div className="component-palm-scan">
                  <div className="column scan-container">
                    <div style={{ background: "#FFF", padding: "100px", textAlign: "center", fontSize: "20px" }}>Please start palm scan capture first.</div>
                  </div>
                </div>
              </div>
              )}


            { liveScan.loading && liveScan.loading.visible &&
            <div className="component--loading--wrapper">
              { console.log("liveScan.loading.percentage",liveScan.loading.percentage) }
              <div className="component--loading">
                <span>Uploading...</span>
                { ! liveScan.loading.failed &&
                  <Fragment>
                    <div className="loading--inner">
                      <span style={{ width: `${liveScan.loading.percentage}%` }}></span>
                      <p>&nbsp;</p>
                      {/*<p>{liveScan.loading.percentage}% completed</p>*/}
                    </div>
                    <Button
                      text="Abort"
                      className="is-danger"
                      style={{ marginTop: 15 }}
                      onClick={ () => { this.handleAbortUpload() } }
                    />
                  </Fragment>
                }

                { liveScan.loading.failed &&
                  <div className="upload--failed">
                  <p>Uploading failed, Please re-try or you can cancel.</p>
                  <Button
                    text="Retry Uploading"
                    className="is-primary"
                    style={{ marginTop: 20 }}
                    onClick={ () => { this.handleRetryUpload() } }
                  />
                  <Button
                    text="Cancel"
                    className="is-danger"
                    style={{ marginTop: 20, marginLeft: 10 }}
                    onClick={ () => { this.handleCancelUpload() } }
                  />
                  </div>
                }

              </div>
            </div>
            }



            {/* livescan tan starts here */}
            { liveScan.tab === "livescan" && (
            <Fragment>
                { ! liveScan.completed && (
                  <div className="WorkflowWrapper-main">
                    <div className="columns">
                      <ScanLeftHand step={this.state.step} liveScan={liveScan} preview={this.state.preview} />
                      <ScanArea
                        url={this.state.url}
                        supportedDecisions={this.state.supportedDecisions}
                        response={this.state.response}
                        formatMessage={formatMessage}
                        sendUserResponse={this.sendUserResponse}
                        onChange={this.onChange}
                        impressionName={this.state.impressionName}
                        step={this.state.step}
                        started={this.state.started}
                        liveScan={ liveScan }
                      />
                      <ScanRightHand step={this.state.step} liveScan={liveScan} preview={this.state.preview} />
                    </div>
                  </div>
                )}

                { liveScan.completed && (
                  <div className="WorkflowWrapper-main">
                    <div className="livescanscanned flat-fingerprints">
                      {this.state.data && this.state.data.LeftHand && this.state.data.LeftHand.length > 0 && (
                        <div className="columns segmented-section">
                          {this.state.data.LeftHand.map((finger, index) => {
                            return (
                              <div key={index} className="column is-paddingless">
                                <div className="impression-name">
                                  {finger.position &&
                                    finger.position.match(reg_space).join(" ")}
                                </div>
                                <div className="segmented-data-container">
                                  { finger.image && finger.image.Base64Data &&
                                  <Image
                                    style={{ cursor: 'pointer' }}
                                    onClick={ () => {
                                      requestShowModal({
                                        modalType: "LIVESCAN_PROBE",
                                        modalProps: { image: finger.image && finger.image.Base64Data, position: finger.position.match(reg_space).join(" ") }
                                      })
                                    }}
                                    src={`data:image/png;base64, ${finger.image && finger.image.Base64Data}`}
                                    title={`${formatMessage({ id: "score" })}: ${ finger.image && finger.image.Quality && finger.image.Quality.NativeScore }`}
                                  />
                                  }
                                  { ( ! finger.image || finger.annotation.Info ) &&
                                    <span style={{ position: "absolute" }} title={finger.annotation.Info}>{formatMessage({ id: "annotated" })}</span>
                                  }
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {this.state.data && this.state.data.RightHand && this.state.data.RightHand.length > 0 && (
                        <div className="columns segmented-section">
                          {this.state.data.RightHand.map((finger, index) => {
                            return (
                              <div key={index} className="column is-paddingless">
                                <div className="impression-name">
                                  {finger.position &&
                                    finger.position.match(reg_space).join(" ")}
                                </div>
                                <div className="segmented-data-container">
                                  { finger.image && finger.image.Base64Data &&
                                  <Image
                                    style={{ cursor: 'pointer' }}
                                    onClick={ () => {
                                      requestShowModal({
                                        modalType: "LIVESCAN_PROBE",
                                        modalProps: { image: finger.image && finger.image.Base64Data, position: finger.position.match(reg_space).join(" ") }
                                      })
                                    }}
                                    src={`data:image/png;base64, ${finger.image && finger.image.Base64Data}`}
                                    title={`${formatMessage({ id: "score" })}: ${ finger.image && finger.image.Quality && finger.image.Quality.NativeScore }`}
                                  />
                                  }
                                  { ( ! finger.image || finger.annotation.Info ) &&
                                    <span style={{ position: "absolute" }} title={finger.annotation.Info}>{formatMessage({ id: "annotated" })}</span>
                                  }
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {this.state.data && this.state.data.BothHands && this.state.data.BothHands.length > 0 && (
                        <div className={`columns ${ this.props.liveScan.type === "fourFourTwoFlatAndRolls" ? 'segmented-section4' : 'segmented-section3' }`}>
                          {this.state.data.BothHands.map((finger, index) => {
                            return (
                              <div key={index} className="column is-paddingless">
                                <div className="impression-name">
                                  {finger.position &&
                                    finger.position.match(reg_space).join(" ")}
                                </div>
                                <div className="segmented-data-container">
                                  { finger.image && finger.image.Base64Data &&
                                  <Image
                                    style={{ cursor: 'pointer' }}
                                    onClick={ () => {
                                      requestShowModal({
                                        modalType: "LIVESCAN_PROBE",
                                        modalProps: { image: finger.image && finger.image.Base64Data, position: finger.position.match(reg_space).join(" ") }
                                      })
                                    }}
                                    src={`data:image/png;base64, ${finger.image && finger.image.Base64Data}`}
                                    title={`${formatMessage({ id: "score" })}: ${ finger.image && finger.image.Quality && finger.image.Quality.NativeScore }`}
                                  />
                                  }
                                  { ( ! finger.image || finger.annotation.Info ) &&
                                    <span style={{ position: "absolute" }} title={finger.annotation.Info}>{formatMessage({ id: "annotated" })}</span>
                                  }
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                    </div>
                  </div>
                )}

            </Fragment>
            )}
            {/* livescan tan ends here */}



            {/* mugshot tan starts here */}
            { liveScan.tab === "mugshot" && (
              <div className="column scan-container">

                { this.props.canonData && this.props.canonData.ImageData &&
                <div className="img-center">
                  <Image
                    src={
                      this.props.canonData.ImageData
                        ? "data:image/png;base64," +
                          this.props.canonData.ImageData
                        : ""
                    }
                  />
                </div>
                }

                { setting.captureDevice && setting.captureDevice === "webcam" && webcamImage != "" &&
                <div className="img-center">
                  <Image
                    src={`data:image/png;base64,${ webcamImage }`}
                  />
                </div>

                }

                }
                { ( ! this.props.canonData || ! this.props.canonData.ImageData ) && ! webcamImage &&
                  <div style={{ background: "#FFF", padding: "100px", textAlign: "center", fontSize: "20px" }}>Please capture the mugshot first.</div>
                }
              </div>
            )}
            {/* mugshot tan ends here */}


          </div>
        }
        foot={<div />}
      />
    )
  }


}




const mapState = state => ({
  state: state,
  palmScan: palmScanSelector(state),
  liveScan: liveScanSelector(state),
  canonData: canonDataSelector(state),
  webcamImage: webcamImageSelector(state),
});
const mapProps = {
  liveScanWorkflow,
  palmScanWorkflow,
  requestShowModal,
  requestSaveLivescanFingerprints,
  requestStoreCanonData,
  requestSaveLivescanFingerprintsResumable,
};

export default connect(mapState, mapProps )( withRouter( LiveScan ) );



