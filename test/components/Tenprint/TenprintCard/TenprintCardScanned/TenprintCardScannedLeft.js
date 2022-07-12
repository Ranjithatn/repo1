import React, { Fragment } from "react";

import LeftContainer from "components/WorkflowWrapper/LeftContainer";
import Figure from "components/Figure";
import Annotations from "components/Annotations";

function TenprintCardScannedLeft({
  formatMessage,
  image,
  cardType,
}) {
  return (
    <LeftContainer
      heading={formatMessage({ id: "scannedCards" })}
      content={
        <Fragment>
          {image && <Figure is="96x96" src={image} />}
          <div className="tenprint-format-container">
            <div className="selected-card-title">
              {formatMessage({ id: "title.selectedCard" })}
            </div>
            <div>{formatMessage({ id: cardType })}</div>
          </div>
        </Fragment>
      }
      extendedContent={
        <Annotations formatMessage={formatMessage} reducerArea="cardScan" />
      }
    />
  );
}

export default TenprintCardScannedLeft;
