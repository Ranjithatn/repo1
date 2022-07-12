import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import WorkflowWrapper from "components/WorkflowWrapper/WorkflowWrapper";
import TenprintCardScannedLeft from "components/Tenprint/TenprintCard/TenprintCardScanned/TenprintCardScannedLeft";
import {
  fullCardScanImageSelector,
  cardTypeSelector,
  cardSegmentedPrintsSelector,
  newJobIdSelector,
  cardScanAnnotationsSelector
} from "selectors/jobs";
import { requestUpdateJob } from "actions/jobs";
import { requestShowModal } from "actions/modal";
import Button from "components/Button/Button";
import Title from "components/Title/Title";
import ProgressBar from "components/ProgressBar/ProgressBar";
import "./TenprintCardSegmented.scss";
import { cardScanPreviewSelector } from "selectors/cardScan";
import { cardScanWorkflow } from "actions/cardScan";
import Helper from "./Helper";
import { CONFIRMATION_MODAL } from "../../../Modal/ModalRoot";

// import fs from 'fs';

function getAnnotations(forRegion, annotations) {
  // console.log("getAnnotations::forRegion, annotations", forRegion, annotations);
  if (typeof forRegion === "string" && forRegion.length) {
    const lowerCased = forRegion.toLowerCase();
    // console.log("lowerCased", lowerCased);
    if (lowerCased.includes("rolled ") || lowerCased.includes("plain ")) {
      const splitOn = lowerCased.includes("rolled ") ? "rolled " : "plain ";
      const split = lowerCased && lowerCased.split(splitOn);
      const firstLetter = lowerCased[0];
      const handSide = firstLetter === "r" ? "right" : "left";
      const position = split[split.length - 1];
      if (annotations[handSide + "-" + position]) {
        return annotations[handSide + "-" + position];
      } else {
        return false;
      }
    } else if (lowerCased.includes("palm")) {
      const splittedData = lowerCased && lowerCased.split(" ");
      // console.log("splittedData", splittedData);
      let hand = "";
      if (splittedData[0].indexOf("l") !== -1) {
        hand = "left";
      } else {
        hand = "right";
      }
      // console.log("hand", hand);
      const position = `${splittedData[1]}-${splittedData[2]}`;
      // console.log("annotations, hand, position", annotations, hand, position);
      if (annotations[`${hand}-${position}`]) {
        return annotations[`${hand}-${position}`];
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  return false;
}

const getName = name => {
  let output = name;
  const split = name && name.split(" ");
  if (split.length === 3) {
    if (split[0] === "L.") {
      output = "Left ";
    }
    if (split[0] === "R.") {
      output = "Right ";
    }
    if (name.indexOf("PALM") !== -1) {
      output = `${output} ${split[1]} ${split[2]}`;
    } else {
      output = `${output} ${split[2]}`;
    }
  } else if (split.length === 2) {
    if (split[0] === "L.") {
      output = "Left ";
    }
    if (split[0] === "R.") {
      output = "Right ";
    }
    output = `${output} ${split[1]}`;
  }

  output = output.toLowerCase();

  return output;
};

const ImageComponent = props => {
  const { print, annotations, formatMessage } = props;
  // console.log("ImageComponent::props", props);

  let annotated = {};
  if (print && print.name) {
    annotated = getAnnotations(print.name, annotations);
  }

  // console.log("annotated", annotated);

  let imageTitle = "";
  if (annotated && annotated.reason && annotated.reason !== "NotAnnotated") {
    imageTitle = `${annotated.reason} : `;
  }
  if (annotated && annotated.note && annotated.reason !== "NotAnnotated") {
    imageTitle = `${imageTitle}${annotated.note}`;
  }

  return (
    <div
      className="segmented-print-container"
      style={{ display: "block" }}
      key={print.name}
    >
      <span style={{ display: "block" }}>
        {formatMessage({ id: getName(print.name) })}
      </span>
      <div
        className="segmented-print"
        style={{ position: "relative" }}
        title={
          annotated.reason && annotated.reason !== "NotAnnotated"
            ? annotated.reason + ":" + annotated.note
            : ""
        }
      >
        {annotated &&
        annotated.reason !== "NotAnnotated" &&
        ["Handicapped", "OtherReason"].includes(annotated.reason) === true ? (
          <Fragment>
            <span
              style={{
                position: "absolute",
                color: "black",
                justifyContent: "center",
                left: 0,
                top: 10,
                textAlign: "center",
                display: "block",
                width: "100%"
              }}
              // title={annotated.note || ""}
            >
              {formatMessage({ id: "annotated" })}
            </span>
            {/* <div title={ annotated.note || "" }>{annotated.note}</div> */}
          </Fragment>
        ) : (
          ""
        )}
        {annotated &&
        annotated.reason !== "NotAnnotated" &&
        ["Handicapped", "OtherReason", "0"].includes(annotated.reason) !=
          true ? (
          <Fragment>
            <div style={{ minHeight: 140 }} >
              {formatMessage({ id: "annotated" })}
            </div>
            {/* <div title={ annotated.note || "" }>{annotated.note}</div> */}
          </Fragment>
        ) : (
          <img src={print.b64Image} alt="segmented print" title={imageTitle} />
        )}
      </div>
    </div>
  );
};

function TenprintCardSegmented({
  formatMessage,
  history,
  scannedImage,
  cardType,
  segmentedPrints,
  requestUpdateJob,
  jobId,
  annotations,
  cardScanPreview,
  cardScanWorkflow,
  requestShowModal
}) {
  // console.log("TenprintCardSegmented :: jobId", jobId);
  // console.log("segmentedPrints", segmentedPrints);

  let images = [];

  if (cardScanPreview.tab === "flat" || !cardScanPreview.tab) {
    const filteredFingers = segmentedPrints.filter(item => {
      const name = item.name.toLowerCase();
      return name.indexOf("plain") != -1;
    });
    const left = filteredFingers.filter(item => {
      return item.name.indexOf("L.") != -1;
    });
    const right = filteredFingers.filter(item => {
      return item.name.indexOf("R.") != -1;
    });

    let repositionedLeft = Helper.repositionBiometrics(left);
    let repositionedRight = Helper.repositionBiometrics(right);

    let leftSlap = segmentedPrints.find(item => {
      return item.name.indexOf("L. SLAP") != -1;
    });
    let rightSlap = segmentedPrints.find(item => {
      return item.name.indexOf("R. SLAP") != -1;
    });

    if (repositionedLeft.length === 0) {
      repositionedLeft = [];
    }
    if (repositionedRight.length === 0) {
      repositionedRight = [];
    }
    if (!leftSlap) {
      leftSlap = {};
    }
    if (!rightSlap) {
      rightSlap = {};
    }

    let output = [...repositionedLeft, ...repositionedRight];
    if (Object.keys(leftSlap).length > 0) {
      output = [...output, leftSlap];
    }
    if (Object.keys(rightSlap).length > 0) {
      output = [...output, rightSlap];
    }

    images = output;
  } else if (cardScanPreview.tab === "rolled") {
    const filteredFingers = segmentedPrints.filter(item => {
      const name = item.name.toLowerCase();
      return name.indexOf("rolled") != -1;
    });

    const left = filteredFingers.filter(item => {
      return item.name.indexOf("L.") != -1;
    });
    const right = filteredFingers.filter(item => {
      return item.name.indexOf("R.") != -1;
    });

    let repositionedLeft = Helper.repositionBiometrics(left);
    let repositionedRight = Helper.repositionBiometrics(right);

    if (repositionedLeft.length === 0) {
      repositionedLeft = [];
    }
    if (repositionedRight.length === 0) {
      repositionedRight = [];
    }

    images = [...repositionedLeft, ...repositionedRight];
  } else if (cardScanPreview.tab === "palm") {
    const filteredFingers = segmentedPrints.filter(item => {
      const name = item.name.toLowerCase();
      return name.indexOf("palm") != -1;
    });

    let left = filteredFingers.filter(item => {
      return item.name.indexOf("L.") != -1;
    });
    let right = filteredFingers.filter(item => {
      return item.name.indexOf("R.") != -1;
    });

    if (left.length === 0) {
      left = [];
    }
    if (right.length === 0) {
      right = [];
    }

    images = [...left, ...right];
  } else {
    images = segmentedPrints;
  }

  // console.log("====================images",images);

  const finalData = [];
  images.forEach(item => {
    if (item) {
      finalData.push(item);
    }
  });

  // console.log("__________finalData___________",finalData);

  // console.log("finalData",finalData);

  let leftHand = [];
  let rightHand = [];
  let mixedHand = [];

  leftHand = finalData.filter(
    item => item.name.indexOf("L.") != -1 && item.name.indexOf("SLAP") === -1
  );
  rightHand = finalData.filter(
    item => item.name.indexOf("R.") != -1 && item.name.indexOf("SLAP") === -1
  );
  mixedHand = finalData.filter(item => item.name.indexOf("SLAP") != -1);

  // console.log("leftHand", leftHand);
  // console.log("rightHand", rightHand);
  // console.log("mixedHand", mixedHand);

  return (
    <WorkflowWrapper
      className="tenprint-card-scanned"
      top={
        <Fragment>
          <Button
            className="is-primary"
            text={formatMessage({ id: "back" })}
            // onClick={() => history.push("/authenticated/tenprint/card/scanned")}
            onClick={() =>
              requestShowModal({
                modalType: CONFIRMATION_MODAL,
                modalProps: {
                  action: () => {
                    history.push("/authenticated/tenprint/card/scanned");
                  },
                  message: "confirmationMsg"
                }
              })
            }
          />
          <Title
            is="4"
            text={formatMessage({ id: "title.tenprinCardResult" })}
          />
          {finalData &&
            finalData.length > 0 && (
              <Button
                className="is-primary"
                text={formatMessage({ id: "save" })}
                onClick={() => requestUpdateJob(parseInt(jobId, 10))}
              />
            )}
        </Fragment>
      }
      left={
        <TenprintCardScannedLeft
          formatMessage={formatMessage}
          cardType={cardType}
          image={scannedImage}
          cardScanPreview={cardScanPreview}
          cardScanWorkflow={cardScanWorkflow}
        />
      }
      main={
        <div className="scanned-image-wrapper">
          {leftHand &&
            leftHand.length > 0 && (
              <div className="scanned-image-container">
                {leftHand &&
                  leftHand.map(print => {
                    return (
                      <ImageComponent
                        print={print}
                        annotations={annotations}
                        formatMessage={formatMessage}
                      />
                    );
                  })}
              </div>
            )}

          {rightHand &&
            rightHand.length > 0 && (
              <div className="scanned-image-container">
                {rightHand &&
                  rightHand.map(print => {
                    return (
                      <ImageComponent
                        print={print}
                        annotations={annotations}
                        formatMessage={formatMessage}
                      />
                    );
                  })}
              </div>
            )}

          {mixedHand &&
            mixedHand.length > 0 && (
              <div className="scanned-image-container">
                {mixedHand &&
                  mixedHand.map(print => {
                    return (
                      <ImageComponent
                        print={print}
                        annotations={annotations}
                        formatMessage={formatMessage}
                      />
                    );
                  })}
              </div>
            )}

          {finalData &&
            finalData.length === 0 && (
              <div
                style={{
                  padding: 20,
                  background: "#FFF",
                  textAlign: "center",
                  height: "130px",
                  margin: "50px",
                  fontSize: 20,
                  padding: 50
                }}
              >
                {formatMessage({ id: "No Biometrics Found" })}
              </div>
            )}
        </div>
      }
      foot={<ProgressBar value="30" />}
    />
  );
}

const mapState = state => ({
  scannedImage: fullCardScanImageSelector(state),
  cardType: cardTypeSelector(state),
  segmentedPrints: cardSegmentedPrintsSelector(state),
  jobId: newJobIdSelector(state),
  annotations: cardScanAnnotationsSelector(state),
  cardScanPreview: cardScanPreviewSelector(state)
});

export default connect(
  mapState,
  {
    requestUpdateJob,
    cardScanWorkflow,
    requestShowModal
  }
)(withRouter(TenprintCardSegmented));
