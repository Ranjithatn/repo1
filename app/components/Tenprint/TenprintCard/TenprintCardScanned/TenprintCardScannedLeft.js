import React, { Fragment } from "react";

import LeftContainer from "components/WorkflowWrapper/LeftContainer";
import Figure from "components/Figure";
import Annotations from "components/Annotations";
import './Sidebar.scss';


function TenprintCardScannedLeft({
  formatMessage,
  image,
  cardType,
  cardScanPreview,
  cardScanWorkflow,
}) {


  // console.log("cardScanPreview",cardScanPreview);


  const setActiveTab = (tab) => {
    cardScanWorkflow({
      type: "CARD_SCAN_PREVIEW_SET_TAB",
      data: tab
    })
  }

  return (
    <LeftContainer
      heading={formatMessage({ id: "scannedCards" })}
      contentPreview={
        <Fragment>

          <div className="component--card-preview-tab" style={{ marginBottom: 20 }}>
            <div className={`tab ${cardScanPreview.tab === "flat" ? 'active' : '' } ${ !cardScanPreview.tab ? 'active' : '' }`} onClick={ () => { setActiveTab('flat') } }>
           { formatMessage({ id: "Flat Prints" })}
            </div>
            <div className={`tab ${cardScanPreview.tab === "rolled" ? 'active' : '' }`} onClick={ () => { setActiveTab('rolled') } }>
            { formatMessage({ id: "rolledPrint" })}
            </div>
            <div className={`tab ${cardScanPreview.tab === "palm" ? 'active' : '' }`} onClick={ () => { setActiveTab('palm') } }>
            { formatMessage({ id: "palmPrint" })}
            </div>
          </div>

        </Fragment>
      }
      // extendedContent={
      //   <Annotations formatMessage={formatMessage} reducerArea="cardScan" />
      // }
    />
  );
}

export default TenprintCardScannedLeft;
