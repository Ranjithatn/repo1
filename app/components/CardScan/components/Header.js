import React, { Fragment } from 'react';
import Button from "../../Button/Button";
import Title from '../../Title/Title';
import { displayError } from '../../Notification/PortalNotification';
import {CONFIRMATION_MODAL} from "../../Modal/ModalRoot"

const canAddNewRegion = (boxes) => {
  if ( boxes && boxes.length > 0 ) {
    let count = 0;
    boxes.forEach( item => {
      if ( item.Name.indexOf("RAND_") !== -1 ) {
        count++;
      }
    });
    if ( count !== 0 ) {
      displayError("Please select Region Label first.");
      return false;
    }
    else { return true; }
  }
  else {
    return true;
  }
}


const Header = props => {

  const {
    formatMessage, cardConfig, addRegions, toggleAddRegions,
    requestClearLatentEditorData,
    requestSegmentedCardScan,
    history,
    cardScanReset,
    boxes,
    requestShowModal,
    cards
  } = props;


  return (
    <div className="header">
      <Button
        text={formatMessage({ id: "back" })}
        className="is-primary"
        leftIcon="arrow-left"
        // onClick={() => {
        //   history.push("/authenticated/tenprint/card");
        //   requestClearLatentEditorData();
        //   cardScanReset();
        // }}
        onClick={
          ()=>{
            if ( cards.length === 0 ) {
              history.push("/authenticated/tenprint/card");
              requestClearLatentEditorData();
              cardScanReset();
            } else {
              requestShowModal({
                modalType: CONFIRMATION_MODAL,
                modalProps: {
                  action: () => {history.push("/authenticated/tenprint/card");requestClearLatentEditorData(); cardScanReset();},
                  message:"confirmationMsg"
                }
              });
            }
          }
        }
      />

      { cardConfig && cardConfig.Name === "Custom" &&
      <Button
        text="Add Region"
        className="is-primary"
        onClick={() => {
          if ( canAddNewRegion(boxes) ) {
            toggleAddRegions();
          }
        }}
        disabled={ addRegions }
        style={{ marginLeft: 20 }}
      />
      }

      <Title is="4" text={formatMessage({id: "title.tenprintInput"})} />
      <Button
        text={formatMessage({ id: "next" })}
        className="is-primary"
        rightIcon="arrow-right"
        onClick={ () => {
          requestSegmentedCardScan()
        } }
      />
    </div>
  );

}


export default Header;

