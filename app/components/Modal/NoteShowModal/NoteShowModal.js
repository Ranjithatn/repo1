import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import Modal from "../Modal";
import Title from "../../Title/Title";
import Button from "../../Button/Button";
import Switch from "../../Switch/Switch";
import { requestHideModal } from "../../../actions/modal";
import { ActionNoteSelector } from "../../../selectors/tenprint"
import "./NoteShowModal.scss";
import { translate } from "../../../utils/intl";



function translateNote(message) {

  const lang = localStorage.getItem("lang") || "en";
  if ( lang == 'en' ) { return message; }


  try {

    let updatedMessage = [];

    if ( message.indexOf(' - ') !== -1 ) {
      const splitted = message.split(' - ');
      splitted.forEach( str => {
        if ( str.indexOf('LatentId') !== -1 || str.indexOf('BioId') !== -1 ) {
          const split = str.split(' ');
          const translated = translate(split && split[0]);
          updatedMessage.push(`${translated} ${split[1]}`);
        }
        else {
          const translated = translate(str);
          updatedMessage.push(translated)
        }
      });

      if ( updatedMessage && updatedMessage.length > 0 ) { return updatedMessage.join(' - '); }
      else { return message; }
    }
    else if ( message.indexOf(':') !== -1 ) {
      const splitted = message.split(':');
      const translated = translate(splitted && splitted[0]);
      return `${translated}:${splitted && splitted[1]}` || message;
    }
    else if ( message.indexOf('No Criminal Report Information') !== -1 ) {
      const splitted = message.split(' ');
      const allExceptId = [ ...splitted ].slice(0,-1);

      const updatedStr = allExceptId.join(' ');
      const translated = translate(updatedStr);

      return `${translated} ${splitted && splitted[splitted.length - 1]}` || message;
    }
    else {
      return message;
    }


  }
  catch (e) {
    console.log("translateNote error occoured", e);
    return message;
  }


}











export const NoteShowModal = ({
  requestHideModal,
  formatMessage,
  ActionNote,
  history
}) => {

console.log("ActionNote",ActionNote);

  return (
    <Modal
      title={formatMessage({ id: "Action Note" })}
      className="newAction-modal"
      requestHideModal={requestHideModal}
      content={
        ActionNote&&<span>{translateNote(ActionNote)}</span>
      }
      buttons={
        <Fragment>
         
          <Button
            id="newAction-btn"
            className="is-primary"
            text={formatMessage({id: "close"})}
         onClick={requestHideModal}
            
          />
         
        </Fragment>
      }
    />
  );
};

const mapState = state => ({
  ActionNote:ActionNoteSelector(state)
});
export default connect(mapState, {
  requestHideModal,
})(withRouter(NoteShowModal));
