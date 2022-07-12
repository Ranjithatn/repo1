import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import Modal from "../Modal";
import Title from "../../Title/Title";
import Button from "../../Button/Button";
import Switch from "../../Switch/Switch";
import { requestHideModal } from "../../../actions/modal";

import "./ConfirmationModal.scss";
import { requestStopLatentScan } from "../../../actions/latent";
export const ConfirmationModal = ({
  requestHideModal,
  formatMessage,
  action,
  message,
  history,
  requestStopLatentScan
}) => {

  return (
    <Modal
      title={formatMessage({ id: "confirm" })}
      className="newAction-modal"
      requestHideModal={requestHideModal}
      content={formatMessage({id:message})}
      buttons={
        <Fragment>
          <Button
            id="newAction-btn"
            className="is-primary"
            text={formatMessage({ id: "cancel" })}
            onClick={requestHideModal}
          />
          <Button
            id="newAction-btn"
            className="is-primary"
            text={formatMessage({ id: "Yes" })}
            onClick={() => { action();requestHideModal();requestStopLatentScan() } }
          />
        </Fragment>
      }
    />
  );
};

const mapState = state => ({});
export default connect(mapState, {
  requestHideModal,
  requestStopLatentScan
})(withRouter(ConfirmationModal));
