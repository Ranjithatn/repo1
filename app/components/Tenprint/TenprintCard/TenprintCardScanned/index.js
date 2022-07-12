import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import WorkflowWrapper from "../../../WorkflowWrapper/WorkflowWrapper";
import TenprintCardScannedNav from "./TenprintCardScannedNav";
import TenprintCardScannedLeft from "./TenprintCardScannedLeft";
import TenprintCardScannedContent from "./TenprintCardScannedContent";
import {
  fullCardScanImageSelector,
  cardConfigSelector,
  cardTypeSelector,
  scanResolutionSelector,
  cardScanBoxesSelector,
  cardScanAnnotationsSelector
} from "selectors/jobs";
import { requestShowModal } from "actions/modal";

import { requestSegmentedCardScan } from "actions/scanner";
import { requestSaveCardScanBoxes, requestClearLatentEditorData, requestSaveAnnotations } from "actions/jobs";
import ProgressBar from "../../../ProgressBar/ProgressBar";
import "./TenprintCardScanned.scss";


class TenprintCardScanned extends React.Component {


  constructor() {
    super();
    this.state = {
      addRegions: false,
    };
    this.toggleAddRegions = this.toggleAddRegions.bind(this);
  }


  toggleAddRegions() {
    this.setState({ addRegions: ! this.state.addRegions });
  }



  render() {

    const {
      formatMessage,
      history,
      scannedImage,
      cardConfig,
      cardType,
      boxes,
      resolution,
      requestSaveCardScanBoxes,
      requestSegmentedCardScan,
      requestClearLatentEditorData
    } = this.props;

    return (
      <WorkflowWrapper
        className="tenprint-card-scanned"
        top={
          <TenprintCardScannedNav
            history={history}
            nextClicked={() => requestSegmentedCardScan()}
            requestClearLatentEditorData={requestClearLatentEditorData}
            formatMessage={formatMessage}
            toggleAddRegions={this.toggleAddRegions}
            cardConfig={cardConfig}
            addRegions={this.state.addRegions}
            boxes={boxes}
          />
        }
        left={
          <TenprintCardScannedLeft
            formatMessage={formatMessage}
            cardType={cardType}
            image={scannedImage}
          />
        }
        main={
          <TenprintCardScannedContent
            formatMessage={formatMessage}
            scannedImage={scannedImage}
            resolution={resolution}
            boxes={boxes}
            saveBoxes={requestSaveCardScanBoxes}
            cardConfig={cardConfig}
            addRegions={this.state.addRegions}
            toggleAddRegions={this.toggleAddRegions}
          />
        }
        foot={<ProgressBar value="30" />}
      />
    );


  } // render ends here


}





const mapState = state => ({
  scannedImage: fullCardScanImageSelector(state),
  cardConfig: cardConfigSelector(state),
  boxes: cardScanBoxesSelector(state),
  cardType: cardTypeSelector(state),
  resolution: scanResolutionSelector(state),
});

export default connect(mapState, {
  requestSaveCardScanBoxes,
  requestSegmentedCardScan,
  requestClearLatentEditorData,
})(withRouter(TenprintCardScanned));
