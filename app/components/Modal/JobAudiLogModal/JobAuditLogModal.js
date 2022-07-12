import React, { Fragment } from "react";
import { connect } from "react-redux";

import Modal from "../Modal";
import Title from "../../Title/Title";
import Button from "../../Button/Button";
import { requestHideModal } from "../../../actions/modal";
import { jobAuditLogDescriptionSelector } from "../../../selectors/auditlog";
import "./JobAuditLogModal.scss";

export const JobAuditLogModal = ({
    jobAuditLogDescription,
    formatMessage, 
    history,
    requestHideModal
}) => {
  return (
    <Modal
      title={formatMessage({ id: "Log Details" })}
      className="newAction-modal"
      requestHideModal={requestHideModal}
      content={
        <Fragment>
          <Title
            is="5"
            text={formatMessage({ id: "desc" })}
          />
          <span>
            {jobAuditLogDescription}
            </span>
          
        </Fragment>
      }
      buttons={
        <Fragment>
          <Button
            id="newAction-btn"
            className="is-primary"
            text={formatMessage({ id: "close" })}
            onClick={e => requestHideModal()}
          />
        </Fragment>
      }
      
    />
  );
};

const mapState = state => ({
  jobAuditLogDescription: jobAuditLogDescriptionSelector(state),
});
export default connect(mapState, {
  requestHideModal
})(JobAuditLogModal);
