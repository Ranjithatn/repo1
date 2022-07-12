import React, { Fragment } from "react";
import { connect } from "react-redux";

import Modal from "../Modal";
import Button from "../../Button/Button";
import Image from "../../Image/Image";
import Icon from "../../Icon/Icon";
import mugshot from "../../../images/mugshot.jpg";
import { requestHideModal } from "../../../actions/modal";

import "./AddMugshotModal.scss";
import { requestCapture, liveScanWorkflow } from "../../../actions/liveScan";
import {
  mugshotDataSelector,
  showMugshotDataSelector,
  canonDataSelector
} from "../../../selectors/liveScan";

import { requestStoreCanonData } from "../../../actions/liveScan";

import { stopSpinner } from "../../../actions/spinner";

import * as canon from "../../../hardwareSDK/canon/index";
import * as canonWebsocket from "../../../hardwareSDK/canon/webSocket";
import { displayError } from "../../Notification/PortalNotification";
import { settings as _settings } from "../../../utils/electron";
import Webcam from "../../Webcam";

export class AddMugshotModal extends React.Component {
  constructor() {
    super();
    this.state = {
      liveStart: false,
      error: false,
      completed: false,
      image: "",
      captureWebcam: false,
      webcamCaptured: false,
      noDeviceFound: false,
    };
    this.startLiveView = this.startLiveView.bind(this);
    this.stopLiveView = this.stopLiveView.bind(this);
    this.cameraConnectionError = this.cameraConnectionError.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleCaptureClick = this.handleCaptureClick.bind(this);
    this.handleWebcamCaptureClick = this.handleWebcamCaptureClick.bind(this);
    this.saveWebcamData = this.saveWebcamData.bind(this);
    this.checkIfCameraReturnedData = this.checkIfCameraReturnedData.bind(this);
    this.noDeviceFound = this.noDeviceFound.bind(this);
  }

  componentDidMount() {
    const setting = _settings();

    if (setting.captureDevice && setting.captureDevice === "webcam") {
    } else {
      if (
        !this.state.liveStart &&
        !(this.props.canonData && this.props.canonData.ImageData)
      ) {
        this.startLiveView();
      }
    }
  }

  componentWillUnmount() {
    canonWebsocket.disconnectWebSocket();
    setTimeout(() => {
      this.stopLiveView();
    }, 100);
  }

  startLiveView() {
    setTimeout(() => {
      canon.startLiveView();
    }, 1000);
    this.setState({ liveStart: true, error: false });

    canonWebsocket.connectSocketServer(
      data => {
        // console.log("received canon data", data.length);
        this.setState({ image: data });
      },
      error => {
        if (!this.state.image) {
          // console.log("websocket error is", error);
          displayError( formatMessage({id:"cameraNotFound"}));
        } else {
          // console.log("websocket error is", error);
          displayError(`Liveview error occurred ${error}`);
        }
      }
    );

    // canonWebsocket.connectSocketServer( onData => {
    //   //Can be used as img.src
    //   console.log("websocket data is", onData);
    //   this.setState({ image: onData });
    // });
  }

  stopLiveView() {
    // console.log("stopLiveView");
    canon.stopLiveView();
    canonWebsocket.disconnectWebSocket();
    this.setState({ liveStart: false, error: false, completed: true });
  }

  cameraConnectionError() {
    displayError(
      "Liveview error occurred, Please check if your camera is connected and switched on."
    );
    this.setState({ liveStart: false, error: true });
    // canon.dispose();
  }

  checkIfCameraReturnedData() {
    // console.log("checkIfCameraReturnedData::called");
    if (this.state.liveStart) {
      // console.log("liveview is running, no need to display the error");
      return;
    }
    if (this.props.canonData.ImageData) {
      // console.log("We have image");
    } else {
      // console.log("no image");
      displayError(
        "Error occoured, Please switch off and on your camera and then capture the image again."
      );
      this.props.stopSpinner(); // stop the spinner if running.
    }
  }

  handleButtonClick() {
    // console.log("handleButtonClick", this.state);

    if (!this.state.liveStart && this.state.error) {
      // console.log("start");
      this.startLiveView();
    } else if (!this.state.liveStart && this.props.canonData.ImageData) {
      // console.log("start2 - clear mugshot data");
      this.props.requestStoreCanonData("");
      this.startLiveView();
    } else if (!this.state.liveStart && !this.props.canonData.ImageData) {
      // console.log("start");
      this.startLiveView();
    } else {
      // console.log("stop");
      this.stopLiveView();
      setTimeout(() => {
        this.handleCaptureClick();
        setTimeout(() => {
          this.checkIfCameraReturnedData();
        }, 15000);
      }, 1000);
    }
  }

  handleCaptureClick() {
    // console.log("handleCaptureClick called");
    try {
      this.props.requestCapture({ data: mugshot });
      this.setState({ error: false });
    } catch (e) {
      console.log("Error Occured", e);
    }
  }

  handleWebcamCaptureClick() {
    this.setState({ captureWebcam: true });
  }

  saveWebcamData(data) {
    // console.log("saveWebcamData");
    this.props.liveScanWorkflow({
      type: "SAVE_WEBCAM_IMAGE",
      data: data.slice(22)
    });
    this.setState({ captureWebcam: false, webcamCaptured: true });
  }

  noDeviceFound() {
    this.setState({ noDeviceFound: true });
  }


  render() {
    const {
      requestHideModal,
      formatMessage,
      requestCapture,
      mugshotData,
      showMugshot,
      canonData
    } = this.props;

    const setting = _settings();

    // console.log("render", this.state, canonData);

    const isWebcam =
      setting.captureDevice && setting.captureDevice === "webcam"
        ? true
        : false;

    let showImage = false;
    if (
      (canonData.ImageData && !this.state.liveStart) ||
      (this.state.image && this.state.liveStart)
    ) {
      showImage = true;
    }

    let buttonText = "";
    if (!this.state.liveStart && this.state.error) {
      buttonText = formatMessage({ id: "Start Live View" });
    } else if (this.state.liveStart && !this.state.completed) {
      buttonText = formatMessage({ id: "capture" });
    } else if (!this.state.liveStart && canonData.ImageData) {
      buttonText = formatMessage({ id: "Restart Live View" });
    } else if (this.state.liveStart && canonData.ImageData) {
      buttonText = formatMessage({ id: "recapture" });
    } else if (!this.state.liveStart && !canonData.ImageData) {
      buttonText = formatMessage({ id: "Start Live View" });
    } else if (this.state.liveStart && this.state.completed) {
      buttonText = formatMessage({ id: "capture" });
    } else {
      buttonText = "Processing...";
    }

    return (
      <Modal
        title={formatMessage({ id: "addMugshot" })}
        className="mugshot-modal"
        requestHideModal={requestHideModal}
        content={
          <Fragment>
            {isWebcam && (
              <Webcam
                capture={this.state.captureWebcam}
                onCapture={this.saveWebcamData}
                formatMessage={formatMessage}
                noDeviceFound={ this.noDeviceFound }
              />
            )}
            {!isWebcam &&
              showImage && (
                <div className="mugshot-center">
                  {!canonData.ImageData || this.state.liveStart ? (
                    <Image src={this.state.image} id="mugshotImg" />
                  ) : (
                    <Image
                      src={"data:image/png;base64," + canonData.ImageData}
                      id="mugshotImg"
                    />
                  )}
                </div>
              )}

            {!isWebcam &&
              !showImage && (
                <div
                  className="mugshot-center"
                  style={{ textAlign: "center", fontSize: 20 }}
                >
                  {this.state.liveStart && !this.state.completed
                    ? formatMessage({id:"Loading preview, please wait..."})
                    : formatMessage({id:"Capturing Image, please wait..."})}
                </div>
              )}
          </Fragment>
        }
        buttons={
          <Fragment>
            {!isWebcam && (
              <div className="footer-content">
                <div className="center">
                  <Button
                    className={
                      !canonData.ImageData ? "is-primary " : " is-danger "
                    }
                    leftIcon="camera"
                    id="capturebtn"
                    text={buttonText}
                    onClick={() => {
                      this.handleButtonClick();
                    }}
                    disabled={
                      buttonText.indexOf("Processing") != -1 ? true : false
                    }
                  />
                </div>
                <div className="right">
                  <Button
                    className="is-primary"
                    disabled={this.state.liveStart}
                    text={formatMessage({ id: "done" })}
                    onClick={requestHideModal}
                    id="donebtn"
                  />
                </div>
              </div>
            )}
            {isWebcam && (
              <div className="footer-content">
                <div className="center">
                  <Button
                    className="is-primary"
                    leftIcon="camera"
                    id="capturebtn"
                    text={formatMessage({ id: "Capture Image" })}
                    disabled={ this.state.noDeviceFound }
                    // text={ this.state.webcamCaptured ? "Restart Video" : "Capture Image" }
                    onClick={() => {
                      this.handleWebcamCaptureClick();
                    }}
                  />
                </div>
                <div className="right">
                  <Button
                    className="is-primary"
                    disabled={this.state.liveStart}
                    text={formatMessage({ id: "done" })}
                    onClick={requestHideModal}
                    id="donebtn"
                  />
                </div>
              </div>
            )}
          </Fragment>
        }
      />
    );
  }
}

const mapState = state => ({
  mugshotData: mugshotDataSelector(state),
  canonData: canonDataSelector(state)
});

export default connect(
  mapState,
  {
    requestHideModal,
    requestCapture,
    liveScanWorkflow,
    requestStoreCanonData,
    stopSpinner
  }
)(AddMugshotModal);
