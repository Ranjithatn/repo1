import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import Modal from "../Modal";
import Title from "../../Title/Title";
import Button from "../../Button/Button";
import Switch from "../../Switch/Switch";
import { requestHideModal } from "../../../actions/modal";
import { requestInputFieldChanged } from "../../../actions/global";
import { requestNewAction } from "../../../actions/jobs";
import { requestShowModal, requestShowModalWithData } from "../../../actions/modal";
import { requestShowNotification } from "../../../actions/notifications";
import "./TenprintVerifyConfirmModal.scss";
import {
  MatchedUserRowIDSelector,
  ModalDataInfoSelector,

} from "../../../selectors/tenprint";
import {
  SelectedActionHistorySelector,
  ActionSelector,
  selectedJobSelector
} from "../../../selectors/jobs";
import { usernameSelector } from "../../../selectors/auth";
import Permissions from "../../Permissions"
export const TenprintVerifyConfirmModal = ({
  requestHideModal,
  formatMessage,
  selectedAction,
  requestInputFieldChanged,
  newAction,
  selectedJob,
  username,
  history,
  requestNewAction,
  SelectedActionHistory,
  MatchedUserRowID,
  ModalDataInfo,
  refActionID,
  requestShowModal,
  requestShowNotification,
  requestShowModalWithData
}) => {

  return (
    <Modal
      title={formatMessage({ id: "Action Menu" })}
      className="newAction-modal"
      requestHideModal={requestHideModal}
      content={
        <Fragment>
          {/* <Title is="5" text={formatMessage({ id: "Action Menu" })} /> */}
          {/* <Switch
            id="searchCriminalDB"

            value="Delete Latent Database with Biometric ID"
            text={formatMessage({ id: "Delete Latent Database with Biometric ID" })}
            className="is-primary is-rounded"

          /> */}

          {ModalDataInfo && ModalDataInfo.length > 0 && ModalDataInfo.map((currentObject, index) => {
            return (
              <Fragment key={index}>
                <Permissions version={2} type="subsequentAction">
                  <Switch
                    onChange={e => requestInputFieldChanged(e, "newAction")}
                    id={currentObject}
                    value={currentObject}
                    text={formatMessage({id:currentObject})}
                    className="is-primary is-rounded"
                    checked={newAction === currentObject}
                  />
                </Permissions>
              </Fragment>
            );
          })}

          {ModalDataInfo && ModalDataInfo.length > 0 && ModalDataInfo.map((CurrentDetails, index) => {
            return console.log(CurrentDetails, "CurrentDetails");
          })}
        </Fragment>
      }
      buttons={
        <Fragment>
          <Button
            id="newAction-btn"
            className="is-primary"
            text={formatMessage({ id: "Submit" })}
            disabled={!newAction}
            onClick={() => {
              if (
                newAction === "Update Criminal Data" ||
                newAction === "Update Criminal Biographics" ||
                newAction === "Update Latent Biometrics" ||
                newAction === "Update Criminal Record"
              ) {
                //MUGSHOT MODAL SHOULD CALL
                requestShowModal({ modalType: "UPDATE_CRIMINAL" });
              } else if (
                newAction === "Register Criminal Biographics" ||
                newAction === "Register Criminal Record" ||
                newAction === "Register Latent Biometrics" ||
                newAction === "Register Latent"
              ) {
                requestShowModal({ modalType: "UPDATE_CRIMINAL" });
              } else {
                if (newAction === "Mark Action Completed") {
                  requestNewAction({
                    newAction,
                    job: selectedJob,
                    username,
                    tcn: "",
                    typeOfAction: "subsequentAction",
                    refActionID: SelectedActionHistory,
                    verifyAction: true,
                    Note: "Action Updated"
                  });
                  history.push("/Authenticated/jobqueue");
                } else if (
                  newAction === "Delete Latent Biometrics" ||
                  newAction === "Delete Criminal Record"
                ) {
                  requestNewAction({
                    newAction,
                    job: selectedJob,
                    username,
                    tcn: "",
                    typeOfAction: "subsequentAction",
                    refActionID: SelectedActionHistory,
                    verifyAction: true,
                    Note: "Action Updated"
                  });
                 history.push("/Authenticated/jobqueue");
                } else if ( newAction === "Link Latent" ||newAction === "Delink Latent"||newAction === "Ignore Latent" || newAction === "Ignore Latent Hit" ) {
                  MatchedUserRowID === "" || MatchedUserRowID === "abcd" || MatchedUserRowID === -1 ? requestShowNotification({
                    message: formatMessage({
                      id: "pleaseSelectMatch"
                    }),
                    type: "is-warning"
                  }):
                  requestShowModalWithData({ modalType: "LINK_LATENT_MODAL" });
                }
                // else if ( newAction === "Delink Latent" ) {
                //   requestShowModal({ modalType: "DELINK_LATENT_MODAL" });
                // } else if ( newAction === "Ignore Latent" || newAction === "Ignore Latent Hit" ) {
                //   requestShowModal({ modalType: "IGNORE_LATENT_MODAL" });
                // }

                else if ( newAction === "Update Latent" ) {
                  MatchedUserRowID === "" || MatchedUserRowID === "abcd" || MatchedUserRowID === -1 ? requestShowNotification({
                    message: formatMessage({
                      id: "pleaseSelectMatch"
                    }),
                    type: "is-warning"
                  }):
                  requestShowModal({ modalType: "UPDATE_LATENT_MODAL" });
                } else if ( newAction === "Delete Latent" ) {
                  MatchedUserRowID === "" || MatchedUserRowID === "abcd" || MatchedUserRowID === -1 ? requestShowNotification({
                    message: formatMessage({
                      id: "pleaseSelectMatch"
                    }),
                    type: "is-warning"
                  }):
                  requestShowModal({ modalType: "DELETE_LATENT_MODAL" });
                }
                else {
                  requestShowNotification({
                    message: formatMessage({
                      id: "Please select the options before submit"
                    }),
                    type: "is-warning"
                  });
                }
              }
              // requestNewAction({
              //   newAction,
              //   job: selectedJob,
              //   username,
              //   tcn: "",
              //   typeOfAction: "subsequentAction",
              //   refActionID: SelectedActionHistory,
              //   verifyAction: true,
              //   Note: "Action Updated"
              // });
            }}
          />
        </Fragment>
      }
    />
  );
};

const mapState = state => ({
  newAction: ActionSelector(state),
  selectedJob: selectedJobSelector(state),
  username: usernameSelector(state),
  MatchedUserRowID: MatchedUserRowIDSelector(state),
  SelectedActionHistory: SelectedActionHistorySelector(state),
  ModalDataInfo: ModalDataInfoSelector(state),
  refActionID: SelectedActionHistorySelector(state)
});
export default connect(mapState, {
  requestHideModal,
  requestInputFieldChanged,
  requestNewAction,
  requestShowModal,
  requestShowNotification,
  requestShowModalWithData
})(withRouter(TenprintVerifyConfirmModal));
