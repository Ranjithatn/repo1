import React, { Fragment } from "react";
import { connect } from "react-redux";

import Modal from "../Modal";
import Title from "../../Title/Title";
import Button from "../../Button/Button";
import Switch from "../../Switch/Switch";
import { requestHideModal } from "../../../actions/modal";
import { requestInputFieldChanged } from "../../../actions/global";
import { requestSubmitPrints } from "../../../actions/jobs";
import "./SubmitPrintsModal.scss";

export const SubmitPrintsModal = ({
  requestHideModal,
  formatMessage,
  selectedSearchOption,
  requestInputFieldChanged,
  requestSubmitPrints
}) => {
  return (
    <Modal
      title={formatMessage({ id: "submitPrints" })}
      className="submitPrints-modal"
      requestHideModal={requestHideModal}
      content={
        <Fragment>
          <Title
            is="5"
            text={formatMessage({ id: "newAction.searchOptions" })}
          />
          <Switch
            id="submitPrints-crminalDatabase"
            onChange={e => requestInputFieldChanged(e, "submitPrints")}
            value="Search Criminal Database"
            text={formatMessage({ id: "searchCriminalDB" })}
            className="is-primary is-rounded"
            checked={selectedSearchOption === "Search Criminal Database"}
          />
          <Switch
            id="submitPrints-civilDatabase"
            onChange={e => requestInputFieldChanged(e, "submitPrints")}
            value="Search Latent Database"
            text={formatMessage({ id: "searchLatentDB" })}
            className="is-primary is-rounded"
            checked={selectedSearchOption === "Search Latent Database"}
          />
          <Switch
            id="submitPrints-latentDatabase"
            onChange={e => requestInputFieldChanged(e, "submitPrints")}
            value="Search Civil Database"
            text={formatMessage({ id: "searchCivilDB" })}
            className="is-primary is-rounded"
            checked={selectedSearchOption === "Search Civil Database"}
          />
        </Fragment>
      }
      buttons={
        <Fragment>
          <Button
            id="submitPrints-btn"
            className="is-primary"
            text={formatMessage({id: "Submit"})}
            disabled={!selectedSearchOption}
            onClick={() => requestSubmitPrints()}
          />
        </Fragment>
      }
    />
  );
};

const mapState = state => ({
  selectedSearchOption: state.jobs.newJob.selectedSearchOption
});

export default connect(mapState, {
  requestHideModal,
  requestInputFieldChanged,
  requestSubmitPrints
})(SubmitPrintsModal);
