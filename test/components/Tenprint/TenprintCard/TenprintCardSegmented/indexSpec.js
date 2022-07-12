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

// import fs from 'fs';



function getAnnotations(forRegion, annotations) {
  if (typeof forRegion === "string" && forRegion.length) {
    const lowerCased = forRegion.toLowerCase();
    if (lowerCased.includes("rolled ") || lowerCased.includes("plain ")) {
      const splitOn = lowerCased.includes("rolled ") ? "rolled " : "plain ";
      const split = lowerCased.split(splitOn);
      const firstLetter = lowerCased[0];
      const handSide = firstLetter === "r" ? "right" : "left";
      const position = split[split.length -1 ];
      if (annotations[handSide+"-"+position]) {
        return annotations[handSide+"-"+position];
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  return false;
}

function TenprintCardSegmented({
  formatMessage,
  history,
  scannedImage,
  cardType,
  segmentedPrints,
  requestUpdateJob,
  jobId,
  annotations
}) {
  console.log("TenprintCardSegmented :: jobId", jobId );
  return (
    <WorkflowWrapper
      className="tenprint-card-scanned"
      top={
        <Fragment>
          <Button
            className="is-primary"
            text={formatMessage({ id: "back" })}
            onClick={() => history.push("/authenticated/tenprint/card/scanned")}
          />
          <Title
            is="4"
            text={formatMessage({ id: "title.tenprinCardResult" })}
          />
          <Button
            className="is-primary"
            text={formatMessage({ id: "save" })}
            onClick={() => requestUpdateJob(parseInt(jobId, 10))}
          />
        </Fragment>
      }
      left={
        <TenprintCardScannedLeft
          formatMessage={formatMessage}
          cardType={cardType}
          image={scannedImage}
        />
      }
      main={
        <Fragment>
          <div className="grid-image">
            {segmentedPrints &&
              segmentedPrints.map(print => {

                // if ( print.b64Image ) {
                //   const base64Image = print.b64Image.split(';base64,').pop();
                //   fs.writeFile(`TESTING---${print.name}.png`, base64Image, {encoding: 'base64'}, function(err) {
                //     console.log('File created', print.name);
                //   });
                // }

                const annotated = getAnnotations(
                  print.name,
                  annotations
                );
                return (
                  <div className="segmented-print-container" key={print.name}>
                    <span>{formatMessage({ id: print.name })}</span>
                    <div
                      className="segmented-print"
                      title={ annotated.reason ? formatMessage({id: "hasBeenAnnotated"}) : "" }
                    >
                      {annotated ? (
                        <Fragment>
                          <div>{formatMessage({id: annotated.reason})}</div>
                          <div>{annotated.note}</div>
                        </Fragment>
                      ) : (
                        <img src={print.b64Image} alt="segmented print" />
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </Fragment>
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
  annotations: cardScanAnnotationsSelector(state)
});

export default connect(mapState, {
  requestUpdateJob
})(withRouter(TenprintCardSegmented));
