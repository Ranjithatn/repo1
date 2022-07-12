import React, { Fragment } from 'react';
import Figure from "../../Figure";
import LeftContainer from "../../WorkflowWrapper/LeftContainer";
import Annotations from "../../Annotations";
import { requestShowModal } from "../../../actions/modal";
import { CONFIRMATION_MODAL } from "../../Modal/ModalRoot";
import { connect } from "react-redux";
import { displayError } from '../../Notification/PortalNotification';




const canAddNewRegion = (boxes) => {
  if ( boxes && boxes.length > 0 ) {
    let count = 0;
    boxes.forEach( item => { if ( item.Name.indexOf("RAND_") !== -1 ) { count++; } });
    if ( count !== 0 ) { displayError("Please select Region Label first or delete the region."); return false; }
    else { return true; }
  }
  else { return true; }
}




const removeAnnotationsForCard = ( positions, annotations, save ) => {

  const positionNames = [];
  positions.forEach( item => {
    const name = item.Name;
    if ( name ) {
      const splitted = name && name.split(' ');
      if ( splitted.length === 3 ) {
        const handName = splitted[0].indexOf('R.') !== -1 ? "right" : "left";
        if ( name.indexOf('PALM') !== -1 ) {
          const fingerPosition = `${ splitted[1].toLowerCase() }-${ splitted[2].toLowerCase() }`;
          positionNames.push(`${handName}-${fingerPosition}`);
        } else {
          const fingerPosition = splitted[2].toLowerCase();
          positionNames.push(`${handName}-${fingerPosition}`);
        }
      }
    }
  });


  let updatedAnnotations = { ...annotations };
  positionNames.forEach( item => {
    delete updatedAnnotations[item];
  } )

  save(updatedAnnotations);
}


const Sidebar = props => {

  const {
    formatMessage,
    cards,
    activeCard,
    cardScanWorkflow,
    requestStartCardScan,
    workflow,
    cardConfig,
    annotations,
    requestSaveAnnotations,
    annotationCompID,
    cardScan,
    requestShowModal,
    boxes,
  } = props;





  const deleteCard = (data, index) => {
    cardScanWorkflow({ type: "CARD_SCAN_DELETE_CARD", cardIndex: index, data: data });

    const ann = removeAnnotationsForCard( data.config.CropRegions, annotations, requestSaveAnnotations );
  }



  const scanNewCard = () => {
    // console.log("scanNewCard::clicked", workflow);
    // console.log("scanNewCard::cardConfig",cardConfig);
    // console.log("scanNewCard::cardScan",cardScan);
    // requestStartCardScan(workflow.config);

    if ( ! canAddNewRegion(boxes) ) {
      return;
    }

    if ( Object.keys(workflow.previousCardData).length > 0 ) {

      requestStartCardScan({
        Resolution: workflow.config.Resolution,
        cardType: workflow.config.cardType,
        selectedScanSource: workflow.config.selectedScanSource,
        onCompleted: () => {
          // console.log("card scan :: onCompleted", workflow.cards.length);
          cardScanWorkflow({  type: "CARD_SCAN_CHANGE_ACTIVE_CARD", data: workflow.cards.length - 1 });
          workflow.config.onCompleted();
          // cardScanWorkflow({ type: "RESET_DELETED_CARD_DATA" });
        },
        config: {
          CardType: workflow.config.cardType,
          Page: cardConfig.Page ? cardConfig.Page + 1 : 1,
        }
      });

    } else {

      let page = cardConfig.Page ? cardConfig.Page + 1 : 1;
      // console.log("page",page);

      if ( workflow.config.cardType === "FORM2" ) {
        // console.log("INSIDE PALM SCAN CARD...");
        // console.log("workflow",workflow);
        // console.log("workflow.cards",workflow.cards);
        if ( workflow.cards.length > 0 ) {
          const existingCard = workflow.cards[0];
          if ( existingCard.config.Page === 1 ) {
            page = 2;
          } else { page = 1; }
          // console.log("existingCard",existingCard);
        }
      }

      requestStartCardScan({
        Resolution: workflow.config.Resolution,
        cardType: workflow.config.cardType,
        selectedScanSource: workflow.config.selectedScanSource,
        onCompleted: () => {
          // console.log("card scan :: onCompleted");
          cardScanWorkflow({  type: "CARD_SCAN_CHANGE_ACTIVE_CARD", data: workflow.activeCard+1 })
          workflow.config.onCompleted();
        },
        config: {
          CardType: workflow.config.cardType,
          Page: page,
        }
      });
    }

  }


  // console.log("cardConfig, cards",cardConfig, cards);

  let cardNumToscan = 0;
  if ( workflow.config.cardType === "FORM2" ) {
    if ( workflow.cards.length > 0 ) {
      const existingCard = workflow.cards[0];
      if ( existingCard.config.Page === 1 ) { cardNumToscan = 2; }
      else if ( existingCard.config.Page === 2 ) { cardNumToscan = 1; }
      else { cardNumToscan = 0; }
    }
  }



  return (
    <LeftContainer
      style={{ padding: 0 }}
      className="sidebar"
      heading={ formatMessage({ id: "scannedCards" }) }
      content={
        <div className="sidebar-wrapper">

          <div className="sidebar--card">

            { cardNumToscan === 1 &&
              <div className="card-image add-new" onClick={ scanNewCard }>
                <div className="card--title">{ formatMessage({ id: "scanPalmPrintingCard1" }) }</div>
              </div>
            }

            { cards && cards.length > 0 &&
              cards.map( (card, index) => {
                return (
                  <div
                    key={`${index}_${ Math.random() * 400 }`}
                    className={`card-image ${activeCard === index ? "active" : ""}`}
                    onClick={ () => {
                      if ( activeCard === index ) { return; }
                      if ( ! canAddNewRegion(boxes) ) { return; }
                      cardScanWorkflow({ type: "SET_ACTIVE_CARD", data: index }) }
                    }
                  >
                    <div>
                      <Figure is="96x96" src={ card.image } style={{ overflow: "hidden" }} />
                      <div className="card--title">{ card.config.Name }</div>
                    </div>
                    <div
                      className="card--delete"
                      // onClick={ () => { deleteCard(card, index) } }
                      onClick={ () => {
                        requestShowModal({
                          modalType: CONFIRMATION_MODAL,
                          modalProps: {
                            action: () => {
                              deleteCard(card, index);
                            },
                            message: "deleteScannedCard"
                          }
                        })
                      }}
                    >{ formatMessage({ id: "deleteCard" }) }</div>
                  </div>
                )
              })
            }

            { cards && cards.length === 0 && cardNumToscan === 0 &&
            <div className="card-image add-new" style={{ marginTop: 25, marginBottom: 25 }} onClick={ scanNewCard }>
              <div className="card--title" style={{ margin: "10px 0" }}>{ formatMessage({ id: "scanNewCard" }) }</div>
            </div>
            }


            { cardNumToscan !== 1 && cardConfig && cardConfig.TotalPages && cards.length < cardConfig.TotalPages &&
            <div className="card-image add-new" onClick={ scanNewCard }>
              <div className="card--title">{ cardConfig.Name === formatMessage({ id: "palmPrintingCard" }) ? formatMessage({ id: "scanPalmPrintingCard2" }) : formatMessage({ id: "scanNewCard" }) }</div>
            </div>
            }

          </div>

          {  cards && cards.length > 0 &&
          <div className="sidebar-annotations-wrapper">
            <Annotations key={ annotationCompID } formatMessage={formatMessage} reducerArea="cardScan" />
          </div>
          }

        </div>
      }
    />
  );

}


// export default Sidebar;
export default connect(
  () => {},
  {
    requestShowModal,
  }
)(Sidebar);
