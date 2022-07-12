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

import Helper from "../TenprintVerify/Helper";
import * as localStorage from "../../../utils/localStorage";
import { reg_space } from "../../../utils/regEx";

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
  requestSaveLivescanFingerprintsResumable
} from "../../../actions/liveScan";

import {
  palmScanSelector,
  liveScanSelector,
  canonDataSelector,
  webcamImageSelector
} from "../../../selectors/liveScan";

import { requestShowModal } from "../../../actions/modal";
import Button from "../../Button/Button";
import * as liveScanHelper from "../../../sagas/helpers/liveScanHelper";
import { requestShowNotification } from "../../../actions/notifications";
import { palmScanAnnotationsSelector } from "selectors/jobs";
import { requestResetPalmscanAnnotations } from "actions/jobs";

let count = 0;
export class LiveScan extends React.Component {
  _isMounted = null;
  constructor(props) {
    super(props);
    this.state = {
      step: "",
      impressionName: "",
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
      scannerStatus: "unknown",

      __decisionCounter: 0,
      __decisionStep: "",

      psRenderId: Math.random(),
      retryScan: false,
      retryStep: "",
      cleanCaptureArea: false,
      response: ""

      // palmScanData: {},
    };
    this.sendUserResponse = this.sendUserResponse.bind(this);
    this.onChange = this.onChange.bind(this);
    this.startScan = this.startScan.bind(this);
    this.stopScan = this.stopScan.bind(this);
    this.findBothHands = this.findBothHands.bind(this);

    this.handleRetryUpload = this.handleRetryUpload.bind(this);
    this.handleAbortUpload = this.handleAbortUpload.bind(this);
    this.handleCancelUpload = this.handleCancelUpload.bind(this);

    this.startPalmScan = this.startPalmScan.bind(this);
    this.stopPalmScan = this.stopPalmScan.bind(this);

    // this.__palmScanContainer = {
    //   startScan: () => {},
    //   stopScan: () => {}
    // };
  }

  sendUserResponse(response) {
    const userChosenResponse =
      this.state.userResponse !== ""
        ? this.state.userResponse
        : this.state.supportedDecisions[0].value;
    LivescanAPI.sendUserResponse(userChosenResponse).then(res => {
      // console.log("sending user response to the livescanapi:", res);
      this.setState({
        supportedDecisions: [],
        userResponse: "",
        cleanCaptureArea: false,

        __decisionCounter: 0,
        __decisionStep: ""
      });
    });
  }

  onChange(value) {
    // console.log("user response:", value);
    this.setState({ userResponse: value });
  }

  handleRetryUpload() {
    // console.log("handleRetryUpload");
    liveScanHelper.retryUpload();
  }

  handleAbortUpload() {
    // console.log("handleAbortUpload");
    liveScanHelper.abortUpload();
  }

  handleCancelUpload() {
    // console.log("handleCancelUpload");
    liveScanHelper.cancelUpload();
  }

  startScan() {
    // console.log("STARTSCAN::::THIS.PROPS", this.state);
    this.props.liveScanWorkflow({ type: "START_SCAN" });
    LivescanAPI.startCapture(
      onError => {
        console.error(onError);
      },
      preview => {
        // console.log("live scan preview", preview);
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
        // console.log("live scan workflow completed", onCompletedData);
        if ( this.props.liveScan.type === "RESET" || this.props.liveScan.type === "START_SCAN" ) { return; }

        // this.setState({ data: {}, final: [] });

        const LeftHand = this.findAllLeftHand(onCompletedData);
        const RightHand = this.findAllRightHand(onCompletedData);
        const BothHands = this.findBothHands(onCompletedData);

        const lsPlain = onCompletedData.filter(
          item => item.impression === "LivescanPlain"
        );
        const updatedAnnotations = onCompletedData.map(item => {
          // console.log("onCompletedData::::item", item);
          if (item.impression === "LivescanRolled") {
            let output = { ...item };
            const flatFiner = lsPlain.find(
              plainFinger => plainFinger.position === item.position
            );
            output.annotation = flatFiner.annotation
              ? flatFiner.annotation
              : output.annotation;
            return output;
          } else {
            return item;
          }
        });

        // console.log("this.props.liveScan", this.props.liveScan);
        // console.log("this.props.liveScan.type", this.props.liveScan.type);
        lsPlain.forEach(finger => {
          if (this.props.liveScan.type === "fourFourTwo") {
            // console.log("if");
          } else if (
            finger.annotation.Reason === "PermanentMissing" ||
            finger.annotation.Reason === "UnableToAcquire"
          ) {
            // console.log("lsPlain.forEach::finger", finger);
            const output = { ...finger };
            output.impression = "LivescanRolled";
            updatedAnnotations.push(output);
          }
        });

        // console.log("updatedAnnotations::modified", updatedAnnotations);

        this.setState({
          data: { LeftHand, RightHand, BothHands },
          final: updatedAnnotations,

          retryScan: false,
          retryStep: "",
          cleanCaptureArea: false,
          response: ""
        });
        this.props.liveScanWorkflow({
          type: "SAVE_DATA",
          data: updatedAnnotations
        });
        // no need to call stopScan if onCompleted is called. LiveScan will call stop for us.
        // this.stopScan();
        this.props.liveScanWorkflow({ type: "COMPLETE_SCAN" });
        /*
        only call setAnnotations if component is still mounted
        we check _isMounted because if the user captures left four, then navigates away from the page, onCompletedData is still called.
        */
        this._isMounted &&
          LivescanAPI.setAnnotations({ Annotations: { Annotation: [] } }); // reset all set annotations
      },

      onUserRequest => {
        // console.log("live scan onUserRequest", onUserRequest);
        let supportedDecision = [];

        // console.log(
        //   "onUserRequest.SupportedDecisions.SupportedDecision",
        //   onUserRequest.SupportedDecisions.SupportedDecision
        // );
        // console.log("onUserRequest::this.state", this.state);

        const error = onUserRequest.RequestCode;

        // enumMissingBiometrics : if biometrics are missing
        // enumWrongControlFingers : if biometrics are wrong
        // enumRepeatStep", "enumConfirmResult", "enumAbortWorkflow

        // Clear Capture Area
        const decisions = onUserRequest.SupportedDecisions.SupportedDecision;
        // console.log("onUserRequest::decisions", decisions);

        /* THIS WILL AUTOMATE CLEAR CAPTURE AREA ERROR */
        if (onUserRequest.RequestCode === "enumClearCaptureArea") {
          return LivescanAPI.sendUserResponse("enumConfirmResult").then(res => {
            // do nothing.
          });
        }
        /* THIS WILL AUTOMATE CLEAR CAPTURE AREA ERROR */

        // follow old logic if we already automated response for three times and the step user is currently on is same.
        if (
          this.state.__decisionCounter > 2 &&
          this.state.__decisionStep === this.state.step
        ) {
          // console.log("onUserRequest::inside if", this.state);
          decisions.forEach((element, index) => {
            // console.log("onUserRequest :: USER REQUEST DATA ::1", element);
            let eachdata = {
              value: element,
              displayName: this.props.formatMessage({ id: element })
            };
            supportedDecision.push(eachdata);
          });
          this.setState({
            supportedDecisions: supportedDecision,
            response: onUserRequest.RequestCode,
            retryScan:
              onUserRequest.RequestCode === "enumClearCaptureArea"
                ? true
                : false,
            retryStep:
              onUserRequest.RequestCode === "enumClearCaptureArea"
                ? this.state.retryStep
                : "",
            cleanCaptureArea:
              onUserRequest.RequestCode === "enumClearCaptureArea"
                ? true
                : false
            // __decisionCounter: 0,
            // __decisionStep: "",
          });
        }
        // let's automate the steps for three times.
        else {
          // console.log("onUserRequest::inside else", this.state);

          const counter = this.state.__decisionCounter + 1;

          if (decisions.indexOf("enumRepeatStep") !== -1) {
            // console.log("Lets send user response");

            LivescanAPI.sendUserResponse("enumRepeatStep").then(res => {
              // console.log("sending user response to the livescanapi:2", res);
              this.setState({
                supportedDecisions: [],
                userResponse: "",
                __decisionCounter: counter,
                __decisionStep: this.state.step,
                retryScan: true,
                retryStep: this.state.step,
                cleanCaptureArea:
                  onUserRequest.RequestCode === "enumClearCaptureArea"
                    ? true
                    : false,
                response: onUserRequest.RequestCode
              });
            });
          } else {
            // console.log("DECISIONS ELSE... 12.3.232.3");

            decisions.forEach((element, index) => {
              // console.log("onUserRequest :: USER REQUEST DATA ::3", element);
              let eachdata = {
                value: element,
                displayName: this.props.formatMessage({ id: element })
              };
              supportedDecision.push(eachdata);
            });
            this.setState({
              supportedDecisions: supportedDecision,
              response: onUserRequest.RequestCode,
              __decisionCounter: counter,
              __decisionStep: this.state.step,
              retryScan:
                onUserRequest.RequestCode === "enumClearCaptureArea"
                  ? true
                  : false,
              retryStep:
                onUserRequest.RequestCode === "enumClearCaptureArea"
                  ? this.state.retryStep
                  : "",
              cleanCaptureArea:
                onUserRequest.RequestCode === "enumClearCaptureArea"
                  ? true
                  : false
            });
          }
        } // else ends here
      }, // onUserRequest ends here

      // scanner status
      (status) => {
        // console.log("SCANNER::STATUS",status);
        this.setState({ scannerStatus: status.IsReady });
      },

      this.props.liveScan.type
    );
  }

  stopScan() {
    LivescanAPI.stopCapture()
      .then(res => {
        console.log("live scan capture/workflow stopped:", res);
        this.setState({ step: "", palmScanData: {} });
        this.props.liveScanWorkflow({ type: "STOP_PALM_SCAN" });
        this.props.liveScanWorkflow({ type: "STOP_SCAN" });
      })
      .catch(e => {
        console.log("-----scanner status:", e);
      });
  }

  startPalmScan() {
    // specify palm scan workflow here.

    // console.log("startPalmScan::called");

    const scanType = {
      workflow: "fourFourTwoName",
      workflowName: "rtlPalmPrints"
    };
    //rtlPalmPrints
    //fourFourTwo

    LivescanAPI.startCapture(
      onError => {
        // alert(onError);
        // console.log("BIOCORE ERROR OCCOURED", onError);
        this.props.palmScanWorkflow({ type: "STOP_SCAN_WORKFLOW" });
        this.props.requestShowNotification({
          message: onError,
          type: "is-danger"
        });
      },
      preview => {
        // console.log("palm scan preview", preview);
        if (preview && preview.Image) {
          const url = preview.Image.ImageUri;
          const height = preview.Image.Height / 2;
          const width = preview.Image.Width / 2;
          const step = preview.Active.WorkflowStep;
          const ImpressionName = preview.Active.ImpressionName;
          this.palmScanComponent &&
            this.palmScanComponent.updateState({
              url,
              width,
              height,
              step,
              ImpressionName,
              preview
            });

          // this.setState({ palmScanData: { url, width, height, step, ImpressionName, preview } });
        }
      },
      onCompletedData => {
        console.log("palm scan workflow completed", onCompletedData);

        const LeftPalm = [];
        const RightPalm = [];
        const final = [];

        // const LeftUpperPalm = this.findSpecificFinger(
        //   "LeftUpperPalm",
        //   onCompletedData
        // );
        const LeftLowerPalm = this.palmScanComponent && this.palmScanComponent.findSpecificFinger(
          "LeftLowerPalm",
          onCompletedData
        );
        const LeftRighterPalm = this.palmScanComponent && this.palmScanComponent.findSpecificFinger(
          "LeftWritersPalm",
          onCompletedData
        );
        // LeftPalm.push(LeftUpperPalm, LeftLowerPalm, LeftRighterPalm);
        LeftPalm.push(LeftLowerPalm, LeftRighterPalm);

        // const RightUpperPalm = this.findSpecificFinger(
        //   "RightUpperPalm",
        //   onCompletedData
        // );
        const RightLowerPalm = this.palmScanComponent && this.palmScanComponent.findSpecificFinger(
          "RightLowerPalm",
          onCompletedData
        );
        const RightRighterPalm = this.palmScanComponent && this.palmScanComponent.findSpecificFinger(
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
        this.palmScanComponent.updateState({
          data: onCompletedData,
          final: final,
          LeftPalm: LeftPalm,
          RightPalm: RightPalm,
          restared: false
        });
        this.props.palmScanWorkflow({ type: "SAVE_DATA", data: final });
        this.props.palmScanWorkflow({ type: "COMPLETE_SCAN" });

        // this.stopPalmScan();
        this.props.requestResetPalmscanAnnotations();
        LivescanAPI.stopCapture()
          .then(res => {
            // console.log("palm scan capture/workflow stopped:", res);
            // console.log("hello universe", this);
            // this.props.palmScanWorkflow({ type: "STOP_PALM_SCAN" });
            // this.setState({ psRenderId: Math.random() });
          })
          .catch(e => {
            alert("-----scanner status:", e);
          });
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
        this.palmScanComponent.updateState({
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

  stopPalmScan(completed = false) {
    // console.log("stopPalmScan called", this);
    this.props.requestResetPalmscanAnnotations();
    this.props.palmScanWorkflow({ type: "STOP_SCAN_WORKFLOW" });
    LivescanAPI.stopCapture()
      .then(res => {
        // console.log("palm scan capture/workflow stopped:", res);
        // console.log("hello universe", this);
        // this.props.palmScanWorkflow({ type: "STOP_PALM_SCAN" });
        // this.setState({ psRenderId: Math.random() });
      })
      .catch(e => {
        alert("-----scanner status:", e);
      });
  }

  findAllLeftHand(fingers) {
    const selected = fingers.filter(
      finger => finger.position.indexOf("Left") > -1
    );
    return this.sortFingers(selected);
  }

  findAllRightHand(fingers) {
    const selected = fingers.filter(
      finger => finger.position.indexOf("Right") > -1
    );
    return this.sortFingers(selected);
  }

  findBothHands(fingers) {
    // console.log("this.props.liveScan.type", this.props.liveScan.type);
    let output = [];
    fingers.map(finger => {
      if (finger.position === "LeftFourFingers") {
        output[0] = finger;
      }
      if (this.props.liveScan.type === "fourFourTwoFlatAndRolls") {
        if (
          finger.position === "LeftThumb" &&
          finger.impression === "LivescanPlain"
        ) {
          output[1] = finger;
        }
        if (
          finger.position === "RightThumb" &&
          finger.impression === "LivescanPlain"
        ) {
          output[2] = finger;
        }
        if (finger.position === "RightFourFingers") {
          output[3] = finger;
        }
      } else {
        if (finger.position === "BothThumbs") {
          output[1] = finger;
        }
        if (finger.position === "RightFourFingers") {
          output[2] = finger;
        }
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

  async componentWillUnmount() {
    // console.log("LiveScan::componentWillUnmount::ResetTheState");

    // console.log("RESET STORE");
    // localStorage.remove('tenprintListener');
    this.props.liveScanWorkflow({ type: "RESET" }); // reset livescan data
    this.props.palmScanWorkflow({ type: "RESET" }); // reset palmscan data
    this.props.requestStoreCanonData(""); // reset the mugshot

    // stop livescan and reset state
    await LivescanAPI.setAnnotations({ Annotations: { Annotation: [] } });
    await LivescanAPI.stopCapture()
      .then(res => {
        this._isMounted = false;
        // console.log("live scan capture/workflow stopped:", res);
      })
      .catch(e => {
        console.log("-----scanner status:", e);
      });
  }

  async componentDidMount() {
    // to prevent memory leak, use this property to do anything that happens after an async call.
    this._isMounted = true;

    const status = await LivescanAPI.queryStatus();
    // this.palmScanComponent && this.palmScanComponent.updateState({ scannerStatus: status.Status.IsReady });
    this.setState({ scannerStatus: status.Status.IsReady });
  }

  async componentDidUpdate(prevProps, prevState) {
    if ( this.props.liveScan.tab === "palmscan" && prevProps.liveScan.tab !== "palmscan" && this.props.palmScan.visible ) {
      const status = await LivescanAPI.queryStatus();
      this.setState({ scannerStatus: status.Status.IsReady });
    }
  }

  render() {
    // console.log("LiveScan::this._child", this._child);

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
      annotations,
      requestResetPalmscanAnnotations
    } = this.props;

    const setting = _settings();

    let retryScan = false;
    if (this.state.retryScan && this.state.retryStep === this.state.step) {
      retryScan = true;
    }

    // console.log("this.state, this.props", this.state, this.props);



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
            requestSaveLivescanFingerprintsResumable={
              requestSaveLivescanFingerprintsResumable
            }
            retryScan={retryScan}
            response={this.state.response}
            scannerStatus={ this.state.scannerStatus }
          />
        }
        left={
          <LiveScanLeft
            startScan={this.startScan}
            stopScan={this.stopScan}
            // startPalmScan={ this.startPalmScan }
            // stopPalmScan={ this.stopPalmScan }

            // startPalmScan={ this.__palmScanContainer.startScan }
            // stopPalmScan={ this.__palmScanContainer.stopScan }
            palmScanRef={{
              startScan: this.startPalmScan.bind(this),
              stopScan: this.stopPalmScan.bind(this)
            }}
            // palmScanRef={ this._child }
            // palmScanRef={ this.__palmScanContainer }

            requestShowModal={requestShowModal}
            palmScanWorkflow={palmScanWorkflow}
            history={history}
            canonData={canonData}
          />
        }
        main={
          <div className="component-palm-scan">
            {/* livescan tan starts here */}
            {liveScan.tab === "palmscan" && (
              <Fragment>
                {palmScan.visible && (
                  <PalmScan
                    key={this.state.psRenderId}
                    formatMessage={formatMessage}
                    palmScan={palmScan}
                    palmScanWorkflow={palmScanWorkflow}
                    requestShowModal={requestShowModal}
                    sendUserResponse={this.sendUserResponse}
                    ref={ref => (this.palmScanComponent = ref)}
                    annotations={annotations}
                    requestResetPalmscanAnnotations={
                      requestResetPalmscanAnnotations
                    }
                  />
                )}
              </Fragment>
            )}

            {liveScan.tab === "palmscan" &&
              !palmScan.started &&
              !palmScan.completed &&
              !palmScan.stopped && (
                <div className="WorkflowWrapper-main">
                  <div className="component-palm-scan">
                    <div className="column scan-container">
                      <div
                        style={{
                          background: "#FFF",
                          padding: "100px",
                          textAlign: "center",
                          fontSize: "20px"
                        }}
                      >
                        {formatMessage({
                          id: "Please start palm scan capture first"
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {liveScan.loading && liveScan.loading.visible && (
              <div
                className="component--loading--wrapper"
                style={{ zIndex: 200 }}
              >
                <div className="component--loading">
                  <span>Uploading...</span>
                  {!liveScan.loading.failed && (
                    <Fragment>
                      <div className="loading--inner">
                        <span
                          style={{ width: `${liveScan.loading.percentage}%` }}
                        />
                        <p>&nbsp;</p>
                        {/*<p>{liveScan.loading.percentage}% completed</p>*/}
                      </div>
                      <Button
                        text="Abort"
                        className="is-danger"
                        style={{ marginTop: 15 }}
                        onClick={() => {
                          this.handleAbortUpload();
                        }}
                      />
                    </Fragment>
                  )}

                  {liveScan.loading.failed && (
                    <div className="upload--failed">
                      <p>Uploading failed, Please re-try or you can cancel.</p>
                      <Button
                        text="Retry Uploading"
                        className="is-primary"
                        style={{ marginTop: 20 }}
                        onClick={() => {
                          this.handleRetryUpload();
                        }}
                      />
                      <Button
                        text="Cancel"
                        className="is-danger"
                        style={{ marginTop: 20, marginLeft: 10 }}
                        onClick={() => {
                          this.handleCancelUpload();
                        }}
                      />
                    </div>
                  )}
                  {liveScan.loading.failed ? this.handleCancelUpload() : ""}
                </div>
              </div>
            )}

            {/* livescan tan starts here */}
            {liveScan.tab === "livescan" && (
              <Fragment>
                {!liveScan.completed && (
                  <div className="WorkflowWrapper-main">
                    <div className="columns">
                      <ScanLeftHand
                        step={this.state.step}
                        liveScan={liveScan}
                        preview={this.state.preview}
                      />
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
                        liveScan={liveScan}
                        cleanCaptureArea={this.state.cleanCaptureArea}
                      />
                      <ScanRightHand
                        step={this.state.step}
                        liveScan={liveScan}
                        preview={this.state.preview}
                      />
                    </div>
                  </div>
                )}

                {liveScan.completed && (
                  <div className="WorkflowWrapper-main">
                    <div className="livescanscanned flat-fingerprints">
                      {this.state.data &&
                        this.state.data.LeftHand &&
                        this.state.data.LeftHand.length > 0 && (
                          <div className="columns segmented-section">
                            {this.state.data.LeftHand.map((finger, index) => {
                              return (
                                <div
                                  key={index}
                                  className="column is-paddingless"
                                >
                                  <div className="impression-name">
                                    {finger.position &&
                                      finger.position
                                        .match(reg_space)
                                        .join(" ")}
                                  </div>
                                  <div
                                    className="segmented-data-container"
                                    title={`${formatMessage({
                                      id: "score"
                                    })}: ${
                                      finger.image
                                        ? finger.image.Quality
                                          ? finger.image.Quality.NativeScore
                                          : "NA"
                                        : "NA"
                                    } ${`\n`} ${
                                      finger.annotation.Reason &&
                                      finger.annotation.Reason !==
                                        "NotAnnotated"
                                        ? finger.annotation.Reason +
                                          ":" +
                                          finger.annotation.Info
                                        : ""
                                    }`}
                                  >
                                    {finger.image && finger.image.Base64Data && (
                                      <Image
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                          requestShowModal({
                                            modalType: "LIVESCAN_PROBE",
                                            modalProps: {
                                              image:
                                                finger.image &&
                                                finger.image.Base64Data,
                                              position: finger.position
                                                .match(reg_space)
                                                .join(" ")
                                            }
                                          });
                                        }}
                                        src={`data:image/png;base64, ${finger.image &&
                                          finger.image.Base64Data}`}
                                      />
                                    )}
                                    {(!finger.image ||
                                      (finger.annotation.Info &&
                                        finger.annotation.Reason !==
                                          "NotAnnotated")) && (
                                      <span
                                        style={{ position: "absolute" }}
                                        // title={
                                        //   `${formatMessage({ id: "score" })}: ${
                                        //     finger.image
                                        //       ? finger.image.Quality
                                        //         ? finger.image.Quality
                                        //             .NativeScore
                                        //         : "NA"
                                        //       : "NA"
                                        //   }` +
                                        //   "1&lt;br&gt;" +
                                        //   formatMessage({ id: "score" }) +
                                        //   ":" +
                                        //   finger.annotation.Reason
                                        //     ? finger.annotation.Reason !==
                                        //       "NotAnnotated"
                                        //       ? finger.annotation.Reason +
                                        //         ":" +
                                        //         finger.annotation.Info
                                        //       : "NA"
                                        //     : "NA"
                                        // }
                                      >
                                        {formatMessage({ id: "annotated" })}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                      {this.state.data &&
                        this.state.data.RightHand &&
                        this.state.data.RightHand.length > 0 && (
                          <div className="columns segmented-section">
                            {this.state.data.RightHand.map((finger, index) => {
                              return (
                                <div
                                  key={index}
                                  className="column is-paddingless"
                                  title={`${formatMessage({ id: "score" })}: ${
                                    finger.image
                                      ? finger.image.Quality
                                        ? finger.image.Quality.NativeScore
                                        : "NA"
                                      : "NA"
                                  }${`\n`}${
                                    finger.annotation.Reason &&
                                    finger.annotation.Reason !== "NotAnnotated"
                                      ? finger.annotation.Reason +
                                        ":" +
                                        finger.annotation.Info
                                      : ""
                                  }`}
                                >
                                  <div className="impression-name">
                                    {finger.position &&
                                      finger.position
                                        .match(reg_space)
                                        .join(" ")}
                                  </div>
                                  <div className="segmented-data-container">
                                    {finger.image && finger.image.Base64Data && (
                                      <Image
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                          requestShowModal({
                                            modalType: "LIVESCAN_PROBE",
                                            modalProps: {
                                              image:
                                                finger.image &&
                                                finger.image.Base64Data,
                                              position: finger.position
                                                .match(reg_space)
                                                .join(" ")
                                            }
                                          });
                                        }}
                                        src={`data:image/png;base64, ${finger.image &&
                                          finger.image.Base64Data}`}
                                        // title={`${formatMessage({
                                        //   id: "score"
                                        // })}: ${finger.image &&
                                        //   finger.image.Quality &&
                                        //   finger.image.Quality.NativeScore}`}
                                      />
                                    )}
                                    {(!finger.image ||
                                      (finger.annotation.Info &&
                                        finger.annotation.Reason !==
                                          "NotAnnotated")) && (
                                      <span style={{ position: "absolute" }}>
                                        {formatMessage({ id: "annotated" })}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                      {this.state.data &&
                        this.state.data.BothHands &&
                        this.state.data.BothHands.length > 0 && (
                          <div
                            className={`columns ${
                              this.props.liveScan.type ===
                              "fourFourTwoFlatAndRolls"
                                ? "segmented-section4"
                                : "segmented-section3"
                            }`}
                          >
                            {this.state.data.BothHands.map((finger, index) => {
                              return (
                                <div
                                  key={index}
                                  className="column is-paddingless"
                                >
                                  <div className="impression-name">
                                    {finger.position &&
                                      finger.position
                                        .match(reg_space)
                                        .join(" ")}
                                  </div>
                                  <div
                                    className="segmented-data-container"
                                    title={`${formatMessage({
                                      id: "score"
                                    })}: ${
                                      finger.image
                                        ? finger.image.Quality
                                          ? finger.image.Quality.NativeScore
                                          : "NA"
                                        : "NA"
                                    }

                                    `
                                  }
                                  >
                                    {finger.image && finger.image.Base64Data && (
                                      <Image
                                        style={{
                                          cursor: "pointer",
                                          padding: "0px"
                                        }}
                                        onClick={() => {
                                          requestShowModal({
                                            modalType: "LIVESCAN_PROBE",
                                            modalProps: {
                                              image:
                                                finger.image &&
                                                finger.image.Base64Data,
                                              position: finger.position
                                                .match(reg_space)
                                                .join(" ")
                                            }
                                          });
                                        }}
                                        src={`data:image/png;base64, ${finger.image &&
                                          finger.image.Base64Data}`}
                                        // title={`${formatMessage({
                                        //   id: "score"
                                        // })}: ${finger.image &&
                                        //   finger.image.Quality &&
                                        //   finger.image.Quality.NativeScore}`}
                                      />
                                    )}
                                    {(!finger.image ||
                                      (finger.annotation.Info &&
                                        finger.annotation.Reason !==
                                          "NotAnnotated")) && (
                                      <span style={{ position: "absolute" }}>
                                        {formatMessage({ id: "annotated" })}
                                      </span>
                                    )}
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
            {liveScan.tab === "mugshot" && (
              <div className="column scan-container">
                {this.props.canonData && this.props.canonData.ImageData && (
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
                )}
                {setting.captureDevice &&
                  setting.captureDevice === "webcam" &&
                  webcamImage != "" && (
                    <div
                      className="img-center"
                      style={{ flexDirection: "row" }}
                    >
                      <Image src={`data:image/png;base64,${webcamImage}`} />
                    </div>
                  )}
                }
                {(!this.props.canonData || !this.props.canonData.ImageData) &&
                  !webcamImage && (
                    <div
                      style={{
                        background: "#FFF",
                        padding: "100px",
                        textAlign: "center",
                        fontSize: "20px"
                      }}
                    >
                      {formatMessage({id:"Please capture the mugshot first"}) }
                    </div>
                  )}
              </div>
            )}
            {/* mugshot tan ends here */}
          </div>
        }
        foot={<div />}
      />
    );
  }
}

const mapState = state => ({
  state: state,
  palmScan: palmScanSelector(state),
  liveScan: liveScanSelector(state),
  canonData: canonDataSelector(state),
  webcamImage: webcamImageSelector(state),
  annotations: palmScanAnnotationsSelector(state)
});
const mapProps = {
  liveScanWorkflow,
  palmScanWorkflow,
  requestShowModal,
  requestSaveLivescanFingerprints,
  requestStoreCanonData,
  requestSaveLivescanFingerprintsResumable,
  requestShowNotification,
  requestResetPalmscanAnnotations
};

export default connect(
  mapState,
  mapProps
)(withRouter(LiveScan));
