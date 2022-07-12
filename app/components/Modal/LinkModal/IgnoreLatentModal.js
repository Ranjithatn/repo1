import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import Modal from "../Modal";
import Title from "../../Title/Title";
import Button from "../../Button/Button";
import Switch from "../../Switch/Switch";
import { requestHideModal } from "../../../actions/modal";
import { ActionNoteSelector } from "../../../selectors/tenprint";
import Input from "../../Input/Input";
import Label from "../../Label/Label";
import { requestNewAction } from "../../../actions/jobs";
import {
  requestStoreLinkData,
  requestResetlinkData
} from "../../../actions/tenprint";
import {
  SelectedActionHistorySelector,
  ActionSelector,
  selectedJobSelector
} from "../../../selectors/jobs";
import { usernameSelector } from "../../../selectors/auth";
import {
  MatchedPersonInfoSelector,
  tenprintSelector,
  MatchedUserRowIDSelector,
  databaseSelector
} from "../../../selectors/tenprint";
import { linkDatalSelector } from "../../../selectors/updateCriminalModal";
// import { reg_numric } from "../../../utils/regEx";
// import "./NoteShowModal.scss";

export const IgnoreLatentModal = ({
  requestHideModal,
  formatMessage,
  history,
  requestNewAction,
  newAction,
  username,
  selectedJob,
  SelectedActionHistory,
  MatchedUserInfo,
  requestStoreLinkData,
  linkData,
  requestResetlinkData,
  PersonInfos,
  rowid,
  state,
  database
}) => {
  const reg_numric = /^[0-9\b]*$/;
  function handleLatentInputChange(val) {
    if (val === "" || reg_numric.test(val)) {
      requestStoreLinkData(val, "");
    }
  }
  let latentId = MatchedUserInfo.person
    ?MatchedUserInfo.person.extendedData!==null?  MatchedUserInfo.person.extendedData.find(
        data => data.key === "Latent Identifier"
      )
      ? MatchedUserInfo.person.extendedData.find(
          data => data.key === "Latent Identifier"
        ).value
      : undefined
    : undefined:undefined;

  let selectedRowID = rowid;

  const bioId = PersonInfos.fingerprintMatches[ selectedRowID ] && PersonInfos.fingerprintMatches[ selectedRowID ].matchInfos[0].bioId || "";
  const matchedPersonId = PersonInfos.fingerprintMatches[ selectedRowID ] && PersonInfos.fingerprintMatches[ selectedRowID ].matchInfos[0].matchPersonTag || "";

  const latentID = state.modal && state.modal.latentId || "";
  console.log("modal state latentID", latentID);

  database==="Civil"?customLabel="MatchedSamisId":database==="Criminal"?customLabel="MatchedFileNo":database==="Latent"?customLabel="MatchedLatentId":""
  // let bioId = "";

  // // if( rowid!==""&&rowid!=="abcd"){
  // //   console.log("rowid",rowid)
  // // bioId=PersonInfos.fingerprintMatches[rowid].matchInfos[0].bioId}

  // bioId = PersonInfos.fingerprintMatches[rowid || 0].matchInfos[0].bioId;

  // if (
  //   latentId !== undefined &&
  //   linkData.latentId === undefined &&
  //   linkData.bioId === "" &&
  //   rowid !== "" &&
  //   rowid !== "abcd"
  // ) {
  //   requestStoreLinkData(latentId, bioId);
  // }

  return (
    <Modal
      title={formatMessage({ id: "ignoreLatent" })}
      className="newAction-modal"
      requestHideModal={ () => {
        requestHideModal();
        requestStoreLinkData("", "");
      }}
      content={
        <Fragment>

          { ! bioId &&
            <div style={{ marginBottom: "20px", background: "#ff3b3e", padding: "10px 20px", color: "#FFF", borderRadius: "5px" }}>{ formatMessage({id: "pleaseSelectMatch"}) }</div>
          }

          <div className="control">
            <Label
              htmlFor="LatentID"
              text={formatMessage({ id: "RegisteredLatentId" })}
            />
            <Input
              type="text"
              className="input"
              id="LatentID"
              placeholder={formatMessage({
                id: "LatentID"
              })}
              value={latentID || ""}
              disabled={true}
              // onChange={e => requestStoreLinkData(e.target.value, "")}
              onChange={e => handleLatentInputChange(e.target.value)}
            />
          </div>

          <div className="control" style={{ marginTop: 20 }}>
            <Label htmlFor="BioID" text={formatMessage({ id: customLabel })} />
            <Input
              type="text"
              className="input"
              id="BioID"
              placeholder={formatMessage({
                id: "BioID"
              })}
              disabled={true}
              value={linkData.bioId || bioId || ""}
              // onChange={e => requestInputFieldChanged(e, "addCrimeType")}
            />
          </div>
        </Fragment>
      }
      buttons={
        <Fragment>
          <Button
            id="save-job"
            className="is-primary"
            disabled={ ! bioId || ! latentID }
            text={formatMessage({ id: "save" })}
            onClick={() => {
              requestNewAction({
                newAction,
                job: selectedJob,
                username,
                tcn: "",
                typeOfAction: "LatentsubsequentAction",
                refActionID: SelectedActionHistory,
                verifyAction: true,
                Note: "Action Updated",
                matchedPersonId: matchedPersonId,
                bioId: bioId,
                latentID: latentID,
              });
              requestStoreLinkData("", "");
              // history.push("/Authenticated/jobqueue");
              // requestHideModal();
            }}
          />

          <Button
            id="newAction-btn"
            className="is-primary"
            text={formatMessage({ id: "close" })}
            onClick={() => {
              requestHideModal();
              requestResetlinkData();
              requestStoreLinkData("", "");
            }}
          />
        </Fragment>
      }
    />
  );
};

const mapState = state => ({
  // ActionNote:ActionNoteSelector(state)
  newAction: ActionSelector(state),
  selectedJob: selectedJobSelector(state),
  username: usernameSelector(state),
  SelectedActionHistory: SelectedActionHistorySelector(state),
  MatchedUserInfo: MatchedPersonInfoSelector(state),
  linkData: linkDatalSelector(state),
  PersonInfos: tenprintSelector(state),
  rowid: MatchedUserRowIDSelector(state),
  database:databaseSelector(state),
  state: state,
});
export default connect(
  mapState,
  {
    requestHideModal,
    requestNewAction,
    requestStoreLinkData,
    requestResetlinkData
  }
)(withRouter(IgnoreLatentModal));
