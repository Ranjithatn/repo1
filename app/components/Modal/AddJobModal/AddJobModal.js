import React, { Fragment } from "react";
import { connect } from "react-redux";

import Modal from "../Modal";
import Switch from "../../Switch/Switch";
import Title from "../../Title/Title";
import Button from "../../Button/Button";
import { requestInputFieldChanged, requestPageChanged } from "../../../actions/global";
import { requestHideModal } from "../../../actions/modal";
import { requestCreateJob } from "../../../actions/jobs";
import Textarea from "../../Textarea/Textarea";
import "./AddjobModal.scss";
import Permissions from "../../Permissions";


const options = [
  { value: "Tenprint", displayName: "Tenprint" },
  { value: "Latent", displayName: "Latent" },
  { value: "Custom Search", displayName: "Custom Search" },
  // { value: "FileNumber", displayName: "FileNumber" }
];

export const AddJobModal = ({
  requestHideModal,
  requestCreateJob,
  requestInputFieldChanged,
  transactionType,
  formatMessage,
  requestPageChanged,
}) => {
  return (
    <Modal
      title={formatMessage({ id: "newJob" })}
      className="addjob-modal"
      requestHideModal={requestHideModal}
      content={
        <Fragment>
          <Title is="5" text={formatMessage({ id: "caseEntry" })} />

          <Switch
            id="newjob-tenprint"
            onChange={e => requestInputFieldChanged(e, "newJob")}
            value="Tenprint"
            text={formatMessage({ id: "Tenprint" })}
            className="is-primary is-rounded"
            checked={transactionType === "Tenprint"}
          />

          <Switch
            id="newjob-latent"
            onChange={e => requestInputFieldChanged(e, "newJob")}
            value="Latent"
            text={formatMessage({ id: "Latent" })}
            className="is-primary is-rounded"
            checked={transactionType === "Latent"}
          />

          <Switch
            id="newjob-samisid"
            onChange={e => requestInputFieldChanged(e, "newJob")}
            value="Custom"
            text={formatMessage({ id: "Custom Search" })}
            className="is-primary is-rounded"
            checked={transactionType === "Custom"}
          />

        </Fragment>
      }

      buttons={
        <Fragment>
          <div>
            {/*
            <Button
              id="save-job"
              className="is-primary"
              disabled={!transactionType}
              text={formatMessage({ id: "save" })}
              onClick={() => {

                requestCreateJob({
                  number: new Date().getTime(),
                  transactionType,
                  start: false
                });

                requestPageChanged( { target: { tagName: "A", id: "1" } }, "jobQueue");

              } }
            />
            */}
            <Button
              className="is-primary"
              text={formatMessage({ id: "cancel" })}
              onClick={requestHideModal}
            />
          </div>
          <Button
            id="start-job"
            className="is-primary"
            text={formatMessage({ id: "start" })}
            disabled={!transactionType}
            onClick={ () => {
              requestCreateJob({
                number: new Date().getTime(),
                transactionType,
                start: true
              });
              requestPageChanged( { target: { tagName: "A", id: "1" } }, "jobQueue");
              }
            }
          />
        </Fragment>
      }
    />
  );
};

const mapState = state => ({
  transactionType: state.jobs.newJob.transactionType,
  memo: state.jobs.newJob.memo
});

export default connect(mapState, {
  requestHideModal,
  requestInputFieldChanged,
  requestCreateJob,
  requestPageChanged,
})(AddJobModal);
