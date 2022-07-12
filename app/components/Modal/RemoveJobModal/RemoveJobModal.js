import React, { Fragment } from "react";
import { connect } from "react-redux";

import Modal from "../Modal";
import { requestHideModal } from "../../../actions/modal";
import { requestRemoveJob } from "../../../actions/jobs";
import Title from "../../Title/Title";
import Button from "../../Button/Button";
import "./RemoveJobModal.scss";

export const RemoveJobModal = ({ requestHideModal, requestRemoveJob, jobId,formatMessage }) => {
  return (
    <Modal
      className="removeJob-modal"
      title={formatMessage({id:"removeJob"})}
      className="removeJob-modal"
      requestHideModal={requestHideModal}
      content={
        <Fragment>
          <Title is="6" text={formatMessage({ id:"Are you sure you want to remove Job ID "}) + jobId + "?"} />
        </Fragment>
      }
      buttons={
        <Fragment>
          <Button id="removeJob-cancel-btn" text={formatMessage({id:"cancel"})} onClick={requestHideModal} />
          <Button id="removeJob-btn" className="is-primary" text={formatMessage({id:"Yes"})} onClick={() => requestRemoveJob(parseInt(jobId))} />
        </Fragment>
      }
    />
  );
};

export default connect(null, {
  requestHideModal,
  requestRemoveJob
})(RemoveJobModal);