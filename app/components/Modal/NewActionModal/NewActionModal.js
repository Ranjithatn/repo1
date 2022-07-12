import React, { Fragment } from "react";
import { connect } from "react-redux";

import Modal from "../Modal";
import Title from "../../Title/Title";
import Button from "../../Button/Button";
import Switch from "../../Switch/Switch";
import { requestHideModal } from "../../../actions/modal";
import { requestInputFieldChanged } from "../../../actions/global";
import { requestNewAction, requestSetCivilSearch,requestActionStart } from "../../../actions/jobs";
import { selectedJobSelector, NewSearchActionSelector,ActionStartSelector } from "selectors/jobs";
import { usernameSelector } from "selectors/auth";
import "./NewActionModal.scss";
import Permissions from '../../Permissions';

export const NewActionModal = ({
  requestHideModal,
  formatMessage,
  selectedAction,
  requestInputFieldChanged,
  requestNewAction,
  newAction,
  selectedJob,
  username,
  all_actions,
  requestSetCivilSearch,
  isCivil,
  requestActionStart,
  actionStart
}) => {



  return (
    <Modal
      title={formatMessage({ id: "submitPrints" })}
      className="newAction-modal"
      requestHideModal={requestHideModal}
      content={
        <Fragment>
          <Title
            is="5"
            text={formatMessage({ id: "newAction.searchOptions" })}
          />
          <Permissions version={2} type="menu.criminal.biosearch">
            <Switch
              id="searchCriminalDB"
              onChange={e => requestInputFieldChanged(e, "newSearchAction")}
              value="Search Criminal"
              text={formatMessage({ id: "searchCriminalDB" })}
              className="is-primary is-rounded"
              // checked={isCivil||newAction.indexOf('Search Criminal')>-1}
              checked={
                newAction.indexOf("Search Civil") > -1 ||
                newAction.indexOf("Search Criminal") > -1
                  ? true
                  : false
              }
              disabled={newAction.indexOf("Search Civil") > -1 ? true : false}
            />
          </Permissions>

          <Permissions type="menu.latent.search">
            <Switch
              id="searchLatentDB"
              onChange={e => requestInputFieldChanged(e, "newSearchAction")}
              value="Search Latent"
              text={formatMessage({ id: "searchLatentDB" })}
              className="is-primary is-rounded"
              // checked={newAction === "Search Latent"}
            />
          </Permissions>

          <Permissions version={2} type="menu.civil.biosearch">
          <Switch
            id="searchCivilDB"
            onChange={e => requestInputFieldChanged(e, "newSearchAction")}
            value="Search Civil"
            text={formatMessage({ id: "searchCivilDB" })}
            className="is-primary is-rounded"
            // checked={newAction === "Search Civil"}
          />
          </Permissions>

        </Fragment>
      }
      buttons={
        <Fragment>
          <Button
            id="newAction-btn"
            className="is-primary"

            text={formatMessage({ id: "Submit" })}
            disabled={newAction.length<=0 || actionStart}
            onClick={() => {
              requestActionStart(true);
              requestNewAction({
                newAction,
                job: selectedJob,
                username,
                refActionID: "",
                verifyAction: false,
                Note: "Action Created",
                typeOfAction: "search"
              });
              // requestHideModal();
            }}
          />
        </Fragment>
      }
    />
  );
};

const mapState = state => ({
  isCivil: state.jobs.isCivil,
  all_actions: state.jobs.newSearchAction,
  newAction: NewSearchActionSelector(state),
  selectedJob: selectedJobSelector(state),
  actionStart:ActionStartSelector(state),
  username: usernameSelector(state)
});
export default connect(mapState, {
  requestHideModal,
  requestInputFieldChanged,
  requestNewAction,
  requestSetCivilSearch,
  requestActionStart
})(NewActionModal);
