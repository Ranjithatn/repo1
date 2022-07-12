import React, { Fragment } from "react";
import { connect } from "react-redux";

import Button from "../../Button/Button";
import Image from "../../Image/Image";
import LiveScanHand from "../../../images/livescan-hand.png";
const LivescanAPI = require("../../../hardwareSDK/biocoreSdk/livescan/livescan");
import { settings as _settings } from "../../../utils/electron";
import { requestShowModal } from "../../../actions/modal";
import { CONFIRMATION_MODAL } from "../../Modal/ModalRoot";
import {requestCloseLiveScanProgress} from "../../../actions/liveScan"
import Permissions from "../../Permissions"
import {liveScanStartSelector} from "../../../selectors/liveScan"

import ScannerConnected from "../../../images/scanner/connected.png";
import ScannerDisconnected from "../../../images/scanner/disconnected.png";
import ScannerUnknown from "../../../images/scanner/unknown.png";


const readableErrorCode = error => {
  if ( ! error ) { return ""; }
  const data = error.replace(/([a-z])([A-Z])/g, "$1 $2");
  let splitted = data && data.split(" ");
  splitted.splice(0, 1);
  const joined = splitted.join(" ");
  return `"${ joined }" error, `;
};


const displayScannerStatus = (scannerStatus, liveScan, palmScan) => {
  if ( liveScan.tab === "livescan" && liveScan.completed ) { return <span /> }
  if ( liveScan.tab === "palmscan" && palmScan.completed ) { return <span /> }
  if ( liveScan.tab === "mugshot" ) { return <span /> }
  if ( liveScan.tab === "palmscan" && palmScan.visible && palmScan.status === "SHOW" ) { return <span /> }

  if ( scannerStatus === "unknown" ) {
    <span style={{ marginRight: 10, maxWidth: '30px', marginTop: 4 }}>
      <Image src={ ScannerUnknown } />
    </span>
  }

  return (
    <span style={{ marginRight: 10, maxWidth: '30px', marginTop: 4 }}>
      <Image src={ scannerStatus === true ? ScannerConnected : ScannerDisconnected } />
    </span>
  )
}


export function LiveScanTop({
  formatMessage,
  history,
  step,
  impressionName,
  requestSaveLivescanFingerprints,
  palmScan,
  liveScan,
  palmScanWorkflow,
  liveScanWorkflow,
  requestSaveLivescanFingerprintsResumable,
  requestShowModal,
  requestCloseLiveScanProgress,
  startScan,
  retryScan,
  response,
  scannerStatus,
}) {
  const mugshotvisibility = false;

  const settings = _settings();

  let heading = "";
  if (liveScan.tab === "livescan") {
    if (liveScan.completed) {
      heading = formatMessage({ id: "scannedFingPrint" });
    } else {
      heading = formatMessage({ id: "liveScan" });
    }
  } else if (liveScan.tab === "palmscan") {
    if ( palmScan.started ) { heading = formatMessage({ id: "palmScanFingerCapture" }); }
    else if ( ! palmScan.completed && liveScan.tab === "palmscan" ) { heading = formatMessage({ id: "palmScanFingerCapture" }); }
    else { heading = formatMessage({ id: "palmScanJobDataPreview" }); }
  } else if (liveScan.tab === "mugshot") {
    heading = formatMessage({ id: "capturedMugshot" });
  }


  // { (liveScan.tab !== "palmscan" && impressionName) && `${impressionName}${step ? ` : ${step}` : ""}`}

  let currentStepTitle = "";
  if ( liveScan.tab !== "palmscan" && impressionName ) {
    currentStepTitle = `${impressionName}${step ? ` : ${step}` : ""}`;
  }

  if ( retryScan && ! liveScan.completed ) {
    currentStepTitle = `${ readableErrorCode(response) }${ formatMessage({ id: "retryScan" }) }, (${impressionName}${step ? ` : ${step}` : ""})`;
  }

  if ( liveScan.completed ) {
    currentStepTitle = "";
  }


  return (
    <div className="head" style={{ gridTemplateColumns: 'inherit' }}>
      {/*<div className="center" style={{ width: 450 }}>*/}
      <div className="center">
        <Image src={LiveScanHand} />
        <span>{heading}</span>
      </div>
      <span
        className={`flowStep ${
          liveScan.tab === "livescan" || liveScan.tab === "palmscan"
            ? "show"
            : "hide"
          } `}
        style={ retryScan ? { fontWeight: "bold", color: "#ffdd57", textAlign: "center" } : { textAlign: "center" } }
      >
        { currentStepTitle }
      </span>
      <div className="end" style={{ marginRight: "15px" }}>
        {liveScan.completed && (
          <Fragment>
            { displayScannerStatus(scannerStatus, liveScan, palmScan) }
            <Button
              text={formatMessage({ id: "cancel" })}
              className="is-primary"
              // onClick={() => history.push("/authenticated/tenprint")}
              // onClick={() => history.push("/authenticated/jobqueue")}
              onClick={() => {
                if ( liveScan.tab === "palmscan"  ) {
                  if ( palmScan.started || palmScan.stopped ) {
                    requestShowModal({
                      modalType: CONFIRMATION_MODAL,
                      modalProps: {
                        action: () => {
                          palmScanWorkflow({type: 'STOP_SCAN_WORKFLOW'});
                          liveScanWorkflow({ type: "SET_ACTIVE_TAB", data: "livescan" });
                        },
                        message:"confirmationMsg"
                      }
                    });
                  } else {
                    requestShowModal({
                      modalType: CONFIRMATION_MODAL,
                      modalProps: {
                        action: () => { history.push("/authenticated/tenprint") },
                        message:"confirmationMsg"
                      }
                    });
                  }
                  // console.log("INSIDE IF STOP_SCAN_WORKFLOW", palmScan);
                } else {
                  requestShowModal({
                    modalType: CONFIRMATION_MODAL,
                    modalProps: {
                      action: () => { history.push("/authenticated/tenprint") },
                      message:"confirmationMsg"
                    }
                  })
                }
              }}
            />{" "}
            &nbsp;&nbsp;&nbsp;
          </Fragment>
        )}
    {!liveScan.completed  &&(
          <Fragment>
            { displayScannerStatus(scannerStatus, liveScan, palmScan) }
            <Button
              text={formatMessage({ id: "cancel" })}
              className="is-primary"

              onClick={() => {
                if (
                  !startScan
                ) {
                  history.push("/authenticated/tenprint");
                } else {
                  requestShowModal({
                    modalType: CONFIRMATION_MODAL,
                    modalProps: {
                      action: () => {
                        history.push("/authenticated/tenprint");
                        requestCloseLiveScanProgress();
                      },
                      message: "confirmationMsg"
                    }
                  });
                }
              }}
            />
            &nbsp;&nbsp;&nbsp;
          </Fragment>)}
        {/* )}        */}

        {settings &&
          settings.resumableUpload &&
          settings.resumableUpload === "enabled" ? (
            <Button
              text={formatMessage({ id: "save" })}
              className={liveScan.completed ? "is-primary" : "hide"}
              onClick={() => {
                requestSaveLivescanFingerprintsResumable();
                requestCloseLiveScanProgress();
              }}
              disabled={palmScan.visible && !palmScan.completed ? true : false}
            />
          ) : (
            <Button
              text={formatMessage({ id: "save" })}
              className={liveScan.completed ? "is-primary" : "hide"}
              onClick={() => {
                requestSaveLivescanFingerprints({});
                requestCloseLiveScanProgress();
              }}
              disabled={palmScan.visible && !palmScan.completed ? true : false}
            />
          )}
        {/*
        <Button
          text={formatMessage({ id: "next" })}
          className={liveScan.completed ? "hide" : "is-primary"}
          rightIcon="arrow-right"
          disabled={!liveScan.completed}
        />
        */}
      </div>
    </div>
  );
}
const mapState = state => ({
  state: state,
  startScan: liveScanStartSelector(state),

});
export default connect(mapState, { requestShowModal,requestCloseLiveScanProgress })(LiveScanTop);
