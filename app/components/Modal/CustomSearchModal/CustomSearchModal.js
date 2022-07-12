import React, { Fragment } from "react";
import { connect } from "react-redux";

import Modal from "../Modal";
import Title from "../../Title/Title";
import Button from "../../Button/Button";
import Switch from "../../Switch/Switch";
import { requestHideModal } from "../../../actions/modal";
import { requestInputFieldChanged } from "../../../actions/global";
import { requestNewAction, requestActionStart } from "../../../actions/jobs";
import { selectedJobSelector, NewSearchActionSelector,ActionStartSelector } from "selectors/jobs";
import { usernameSelector } from "selectors/auth";
import { customSearchDataSelector } from "../../../selectors/customSearch";
import Permissions from "../../Permissions";
import "./CustomSearchModal.scss";


export const CustomSearchModal = ({
  requestHideModal,
  formatMessage,
  selectedAction,
  requestInputFieldChanged,
  requestNewAction,
  newAction,
  selectedJob,
  username,
  all_actions,
  customSearchData,
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
          <Permissions version={2} type="menu.criminal.search">
          <Switch
            id="searchCriminalDB"
            onChange={e => requestInputFieldChanged(e, "newSearchAction")}
            value="Search Criminal"
            text={formatMessage({ id: "searchCriminalDB" })}
            className="is-primary is-rounded"
            checked={
              // newAction.includes("Search Civil") ||
              newAction.includes("Search Criminal")
                ? true
                : false
            }
            // disabled={
            //   newAction.includes("Search Civil")
            //     ? true
            //     : false
            // }
            disabled={
              customSearchData.fileNo === "" || !customSearchData.fileNo
            }
          />
       
         </Permissions>
          <Permissions version={2} type="menu.latent.customsearch">
            <Switch
              id="searchLatentDB"
              onChange={e =>
                requestInputFieldChanged(e, "newCustomSearchAction")
              }
              value="Search Latent"
              text={formatMessage({ id: "searchLatentDB" })}
              className="is-primary is-rounded"
              disabled={
                customSearchData.latentID === "" || !customSearchData.latentID
              }
              // checked={newAction === "Search Civil"}
            />
          </Permissions>
          <Permissions version={2} type="menu.civil.search">
            <Switch
              id="searchCivilDB"
              onChange={e =>
                requestInputFieldChanged(e, "newCustomSearchAction")
              }
              value="Search Civil"
              text={formatMessage({ id: "searchCivilDB" })}
              className="is-primary is-rounded"
              disabled={
                customSearchData.SAMISID === "" || !customSearchData.SAMISID
              
              }
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
            disabled={newAction.length <= 0 || actionStart}
            onClick={() => {
              requestActionStart(true);
              requestNewAction({
                newAction,
                job: selectedJob,
                username,
                refActionID: "",
                verifyAction: false,
                Note: "Action Created",
                typeOfAction: "Custom Search"
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
  all_actions: state.jobs.newSearchAction,
  newAction: NewSearchActionSelector(state),
  selectedJob: selectedJobSelector(state),
  username: usernameSelector(state),
  actionStart:ActionStartSelector(state),
  customSearchData: customSearchDataSelector(state)
});
export default connect(
  mapState,
  {
    requestHideModal,
    requestInputFieldChanged,
    requestNewAction,
    requestActionStart
  }
)(CustomSearchModal);
