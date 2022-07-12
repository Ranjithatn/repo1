import React, { Fragment } from 'react';
import { connect } from "react-redux";
import { cardScanWorkflow, cardScanReset } from "../../actions/cardScan";
import { cardScanSelector, cardScanWorkflowSelector } from "../../selectors/cardScan";
import WorkflowWrapper from "../WorkflowWrapper/WorkflowWrapper";

import { requestStartCardScan, requestSegmentedCardScan } from "../../actions/scanner";
import { requestSaveCardScanBoxes, requestClearLatentEditorData } from "../../actions/jobs";
import { withRouter } from "react-router-dom";
import { cardScanAnnotationsSelector } from "../../selectors/jobs";
import {requestShowModal} from "../../actions/modal"
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Content from './components/Content';
import { requestSaveAnnotationsCustom } from "../../actions/jobs";

import './style.scss';


class CardScan extends React.Component {

  constructor() {
    super();
    this.state = {
      addRegions: false,
      annotationCompID: Math.random(),
    };
    this.toggleAddRegions = this.toggleAddRegions.bind(this);
  }


  toggleAddRegions() {
    // console.log("toggleAddRegions");
    this.setState({ addRegions: ! this.state.addRegions });
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log("Object.keys(this.props.annotations).length",Object.keys(this.props.annotations).length);
    // console.log("Object.keys(prevProps.annotations).length",Object.keys(prevProps.annotations).length);
    if ( this.props.annotationsType === "REQUEST_SAVE_ANNOTATIONS_CUSTOM" && ( Object.keys(this.props.annotations).length !== Object.keys(prevProps.annotations).length )  ) {
      this.setState({ annotationCompID: Math.random() });
    }

  }




  render() {

    // console.log("CardScan::this.props",this.props);
    // console.log("CardScan::this.state",this.state);

    const {
      formatMessage,
      cardScanWorkflow,
      requestStartCardScan,
      history,
      requestSegmentedCardScan,
      cardScanReset,
      cardScan,
      workflow,
      annotations,
      requestShowModal,
      requestSaveAnnotations,
    } = this.props;
    const { cards, activeCard } = workflow;

    // console.log("CardScan::cards",cards);

    const boxes = cards[activeCard] && cards[activeCard].config.CropRegions;


    return (
      <WorkflowWrapper
        className="component--cardscan tenprint-card-scanned"
        top={
          <Header
            history={history}
            formatMessage={ formatMessage }
            cardConfig={ cards[activeCard] && cards[activeCard].config || {} }
            addRegions={ this.state.addRegions }
            toggleAddRegions={ this.toggleAddRegions }
            requestClearLatentEditorData={ requestClearLatentEditorData }
            requestSegmentedCardScan={ requestSegmentedCardScan }
            cardScanReset={ cardScanReset }
            boxes={ boxes }
            requestShowModal={requestShowModal}
            cards={ cards }
          />
        }
        left={
          <Sidebar
            formatMessage={ formatMessage }
            cards={ cards }
            cardConfig={ cards[activeCard] && cards[activeCard].config || {} }
            activeCard={ activeCard }
            cardScanWorkflow={ cardScanWorkflow }
            requestStartCardScan={ requestStartCardScan }
            workflow={ workflow }
            addRegions={ this.state.addRegions }
            cardScan={ cardScan }
            annotations={ annotations }
            requestSaveAnnotations={ requestSaveAnnotations }
            annotationCompID={ this.state.annotationCompID }
            boxes={ boxes }
          />
        }
        main={
          <Fragment>
            { cards.length === 0 &&
              <div style={{ color: "#FFF", fontSize: 28, textAlign: "center", padding: "20px", flex: 1, alignSelf: "center" }}>{ formatMessage({ id: "noCardsScanned" }) }</div>
            }

            { cards.length > 0 &&
            <Content
              formatMessage={ formatMessage }
              cards={ cards }
              activeCard={ activeCard }
              cardScanWorkflow={ cardScanWorkflow }
              saveBoxes={ this.props.requestSaveCardScanBoxes }
              toggleAddRegions={ this.toggleAddRegions }
              addRegions={ this.state.addRegions }
              cardScan={ cardScan }
              annotations={ annotations }
            />
            }
          </Fragment>
        }
      />
    );

  }


}



const mapState = state => ({
  cardScan: cardScanSelector(state),
  workflow: cardScanWorkflowSelector(state),
  annotations: cardScanAnnotationsSelector(state),
  annotationsType: state.jobs.newJob.cardScan.type,
});
export default connect(mapState, {
  cardScanWorkflow,
  cardScanReset,
  requestStartCardScan,
  requestSaveCardScanBoxes,
  requestClearLatentEditorData,
  requestSegmentedCardScan,
  requestShowModal,
  requestSaveAnnotations: requestSaveAnnotationsCustom,
})( withRouter(CardScan) );


