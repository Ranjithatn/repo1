import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import Modal from "../Modal";
import Title from "../../Title/Title";
import Button from "../../Button/Button";
import Switch from "../../Switch/Switch";
import { requestHideModal } from "../../../actions/modal";
import { ActionNoteSelector } from "../../../selectors/tenprint"
import Input from "../../Input/Input";
import Label from "../../Label/Label";
import { requestNewAction } from "../../../actions/jobs";
import { requestStoreLinkData,requestResetlinkData } from "../../../actions/tenprint";
import {
  SelectedActionHistorySelector,
  ActionSelector,
  selectedJobSelector
} from "../../../selectors/jobs";
import { usernameSelector } from "../../../selectors/auth";
import { MatchedPersonInfoSelector,tenprintSelector,MatchedUserRowIDSelector  } from "../../../selectors/tenprint";
import { linkDatalSelector } from "../../../selectors/updateCriminalModal";
// import "./NoteShowModal.scss";
import _ from 'lodash';


export const DeleteLatentModal = ({
  requestHideModal,
  formatMessage,
  history,
  requestNewAction,
  newAction,
  username,
  selectedJob,
  SelectedActionHistory,
  MatchedUserInfo,
  linkData,
  requestResetlinkData,
  PersonInfos,
  rowid
}) => {
  console.log("MatchedUserInfo",MatchedUserInfo);
  console.log("PersonInfos",PersonInfos);

  // console.log("MatchedUserInfo.additionalMatchInfos[0].additionalMatchDatas",MatchedUserInfo.additionalMatchInfos[0].additionalMatchDatas);


  let latentId = "";

  // if ( MatchedUserInfo.additionalMatchInfos && MatchedUserInfo.additionalMatchInfos.length>0&&MatchedUserInfo.additionalMatchInfos[0].additionalMatchDatas && MatchedUserInfo.additionalMatchInfos[0].additionalMatchDatas.length > 0 ) {
  //   const data = MatchedUserInfo.additionalMatchInfos[0].additionalMatchDatas;
  //   const found = data.find( item => item.key === "Latent Identifier" );
  //   // console.log("found",found);
  //   latentId = found.value;
  // } else if ( MatchedUserInfo.persons && MatchedUserInfo.persons[0].extendedData.length > 0 ) {
  //   const data = MatchedUserInfo.persons[0].extendedData;
  //   const found = data.find( item => item.key === "Latent Identifier" );
  //   // console.log("found2",found);
  //   latentId = found.value;
  // }


  if ( MatchedUserInfo && MatchedUserInfo.additionalMatchInfos && MatchedUserInfo.additionalMatchInfos.length > 0  ) {
    const additionalMatchDatas = MatchedUserInfo.additionalMatchInfos[0].additionalMatchDatas;
    if ( additionalMatchDatas && additionalMatchDatas.length > 0 ) {
      const data = _.find( additionalMatchDatas, { key: 'Latent Identifier' } );
      if ( data && data.value ) {
        latentId = data.value;
      }
    }
  }


  if ( ! latentId ) {
    const additionalMatchDatas = MatchedUserInfo.latentDetails;
    if ( additionalMatchDatas && additionalMatchDatas.length > 0 ) {
      const data = _.find( additionalMatchDatas, { key: 'Latent Identifier' } );
      if ( data && data.value ) {
        latentId = data.value;
      }
    }
  }



  console.log("latentId",latentId);


  let selectedRowID = rowid;
  console.log("selectedRowID",selectedRowID);


  const bioId = PersonInfos && PersonInfos.fingerprintMatches[ selectedRowID ] && PersonInfos && PersonInfos.fingerprintMatches[ selectedRowID ].matchInfos[0].bioId || "";
  // const matchedPersonId = PersonInfos && PersonInfos.fingerprintMatches[ selectedRowID ] && PersonInfos && PersonInfos.fingerprintMatches[ selectedRowID ].matchInfos[0].matchPersonTag || "";
  // const matchedPersonId = MatchedUserInfo && MatchedUserInfo.persons && MatchedUserInfo.persons[selectedRowID] && MatchedUserInfo.persons[selectedRowID].id;
  const samisid = PersonInfos && PersonInfos.matchPersons[ selectedRowID ] && PersonInfos && PersonInfos.matchPersons[ selectedRowID ].persons[0].samisid || "";

  let matchedPersonId = MatchedUserInfo && MatchedUserInfo.persons && MatchedUserInfo.persons[selectedRowID] && MatchedUserInfo.persons[selectedRowID].id;
  // if ( ! matchedPersonId ) {
  //   matchedPersonId = MatchedUserInfo.id;
  // }


  console.log("selectedRowID",selectedRowID);
  console.log("bioId",bioId);
  console.log("matchedPersonId",matchedPersonId);
  console.log("PersonInfos",PersonInfos);
  console.log("MatchedUserInfo",MatchedUserInfo);
  console.log("linkData",linkData);

  return (
    <Modal
      title={formatMessage({ id: "deleteLatent" })}
      className="newAction-modal"
      requestHideModal={ () => {
        requestHideModal();
        requestStoreLinkData("", "");
      }}
      content={
        <Fragment>

          { ( ! matchedPersonId || matchedPersonId==="abcd" || matchedPersonId === -1 ||matchedPersonId ==="" ) &&
            <div style={{ marginBottom: "20px", background: "#ff3b3e", padding: "10px 20px", color: "#FFF", borderRadius: "5px" }}>{ formatMessage({id: "pleaseSelectMatch"}) }</div>
          }

          <p>{formatMessage({id: "deleteLatentMessage"})}</p>
          <p>{formatMessage({id: "latentidentifier"})}: { latentId }</p>
          <p>{formatMessage({id: "matchedPersonId"})}: { matchedPersonId || "" }</p>
        </Fragment>
      }
      buttons={
        <Fragment>

          <Button
            id="save-job"
            className="is-primary"
            text={formatMessage({ id: "confirm" })}
            disabled={ ! latentId || ! matchedPersonId }
            onClick={() => {
              requestNewAction({
                newAction,
                job: selectedJob,
                username,
                tcn: "",
                typeOfAction: "subsequentAction",
                refActionID: SelectedActionHistory,
                verifyAction: true,
                Note: "Action Updated",
                matchedPersonId: matchedPersonId,
                bioId: bioId,
                latendID: latentId,
                samisid:samisid
              });
              // history.push("/Authenticated/jobqueue");
              // requestHideModal();
            }}
          />

          <Button
            id="newAction-btn"
            className="is-primary"
            text={formatMessage({id: "close"})}
            onClick={()=>{
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
});
export default connect(mapState, {
  requestHideModal,
  requestHideModal,
  requestNewAction,
  requestStoreLinkData,
  requestResetlinkData
})(withRouter(DeleteLatentModal));
