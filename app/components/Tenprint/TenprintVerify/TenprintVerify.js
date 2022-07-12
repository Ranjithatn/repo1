import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Image from "../../Image/Image";
import WorkflowWrapper from "../../WorkflowWrapper/VerifierWorkflowWrapper";
import Button from "../../Button/Button";
import Title from "../../Title/Title";
import TenprintVerifyLeft from "./TenprintVerifyLeft/TenprintVerifyLeft";
import TenprintVerifyMain from "./TenprintVerifyMain/TenprintVerifyMain";
import TenprintVerifyTable from "./TenprintVerifyTable/TenprintVerifyTable";

import "./TenprintVerify.scss";

import {
  tenprintVerifyLeftFingersSelector,
  tenprintVerifyRightFingersSelector,
  tenprintVerifyPersonInfosSelector,
  tenprintVerifySelectedHandInfoSelector,
  tenprintVerifyLeftMatchInfoSelector,
  tenprintVerifyRightMatchInfoSelector,
  tenprintVerifyUserMatchInfoSelector,
  showAdjudicatorSelector,
  adjudicatorPassImageDataSelector,
  SelectedRowSelector,
  SelectedMatchSelector,
  adjudicatorImageDataSelector,
  MatchedUserRowIDSelector,
  tenprintVerifyRaw,
  adjudicatorResultSelector,
  databaseSelector,
  panesSelector
} from "../../../selectors/tenprint";
import {
  requestSetTenprintVerifyHand,
  requestSetTenprintVerifyMatchData,
  requestShowAdjudicator,
  requestMatchedPersonChanged,
  requestModalData,
  requestHideAdjudicator,
  requestTogglePaneVisibility
} from "../../../actions/tenprint";
import { requestShowModal } from "../../../actions/modal";
import { setTimeout } from "timers";
import {
  SelectedActionStatusSelector,
  SelectedActionTypeSelector,
  jobsTypeSelector
} from "../../../selectors/jobs";


import {
  // requestSelectedBiometrics,
  requestBiometricMugshot,
  requestScannedImageModal,
} from "../../../actions/scannedBiometrics";

// TENPRINT_VERIFY_CONFIRM
// let regex = /($[a-z])|[A-Z][^A-Z]+/g;
function TenprintVerify({
  formatMessage,
  history,
  LeftFingers,
  RightFingers,
  PersonInfos,
  requestSetTenprintVerifyHand,
  SelectedHandInfo,
  LeftMatches,
  RightMatches,
  MatchInfos,
  requestSetTenprintVerifyMatchData,
  requestShowAdjudicator,
  showAdjudicatorData,
  requestShowModal,
  SelectedRow,
  selectedMatch,
  ImageData,
  adjudicatorPassImageData,
  requestMatchedPersonChanged,
  requestModalData,
  ActionStatus,
  ActionType,
  requestHideAdjudicator,
  matchedRowID,
  tenprint,
  adjudicator,
  database,
  panes,
  requestTogglePaneVisibility,
  requestBiometricMugshot,
  requestScannedImageModal,
  jobType,
}) {
  // console.log("TenprintVerify SelectedHandInfo", SelectedHandInfo);
  // console.log("TenprintVerify:::jobType", jobType);

  // console.log("history is mystery", history);

  const routeChangeListener = history.listen(location => {
    // console.log("location", location);
    if (location.pathname != "/authenticated/tenprint/tenprintverify") {
      // console.log("route changed location", location);
      requestTogglePaneVisibility({ pane: "all", visible: true });
      routeChangeListener();
    }
  });

  return (
    <WorkflowWrapper
      className="tenprintverify-main"
      panes={panes}
      top={
        <Fragment>
          <div className="left">
            <Title
              is="6"
              text={`${formatMessage({ id: "search" })} : ${ database ? formatMessage({ id: database}) : "" }
                   | ${formatMessage({ id: "jobType" })} : ${ jobType ? formatMessage({ id: jobType}) : "" }`}
              // text={
              //   database
              //     ? formatMessage({ id: "search" }) + " : " + formatMessage({ id: database })
              //     : formatMessage({ id: "search" }) + " : "
              // }
            />
          </div>
          <div className="center">
            {ActionStatus === "Completed" ? (
              <Title is="4" text={formatMessage({ id: "statusCompleted" })} />
            ) : (
              ""
            )}
          </div>
          <div className="right">
            <Button
              leftIcon={panes.sidebar ? "expand" : "arrows-alt"}
              className="is-primary"
              onClick={() => {
                if (panes.sidebar) {
                  requestTogglePaneVisibility({ pane: "all", visible: false });
                } else {
                  requestTogglePaneVisibility({ pane: "all", visible: true });
                }
              }}
            />&nbsp;&nbsp;&nbsp;&nbsp;
            <Button
              text={formatMessage({ id: "back" })}
              className="is-primary"
              leftIcon="arrow-left"
              onClick={() => {
                if (!showAdjudicatorData) {
                  history.push("/authenticated/jobqueue");
                } else {
                  requestSetTenprintVerifyHand({ position: tenprint.selected });
                  requestTogglePaneVisibility({ pane: "all", visible: true });
                }
              }}
              // onClick={() => history.push("/authenticated/jobqueue")}
            />&nbsp;&nbsp;&nbsp;&nbsp;
            <Button
              text={formatMessage({ id: "next" })}
              className="is-primary"
              disabled={ActionStatus === "Completed"}
              rightIcon="arrow-right"
              onClick={() => requestModalData()}
            />
          </div>
        </Fragment>
      }
      left={
        <TenprintVerifyLeft
          formatMessage={formatMessage}
          LeftFingers={LeftFingers}
          RightFingers={RightFingers}
          requestSetTenprintVerifyHand={requestSetTenprintVerifyHand}
          SelectedHandInfo={SelectedHandInfo}
          MatchInfos={MatchInfos}
          requestShowAdjudicator={requestShowAdjudicator}
          adjudicatorPassImageData={adjudicatorPassImageData}
          LeftMatches={LeftMatches}
          RightMatches={RightMatches}
          SelectedRow={SelectedRow}
          requestHideAdjudicator={requestHideAdjudicator}
          tenprint={tenprint}
          panes={panes}
          requestTogglePaneVisibility={requestTogglePaneVisibility}
        />
      }
      main={
        <Fragment>
          <TenprintVerifyMain
            formatMessage={formatMessage}
            LeftFingers={LeftFingers}
            RightFingers={RightFingers}
            SelectedHandInfo={SelectedHandInfo}
            MatchInfos={MatchInfos}
            showAdjudicatorData={showAdjudicatorData}
            LeftMatches={LeftMatches}
            RightMatches={RightMatches}
            SelectedRow={SelectedRow}
            selectedMatch={selectedMatch}
            ImageData={ImageData}
            requestShowAdjudicator={requestShowAdjudicator}
            PersonInfos={PersonInfos}
            tenprint={tenprint}
            adjudicator={adjudicator}
            matchedRowID={matchedRowID}
            panes={panes}
            requestTogglePaneVisibility={requestTogglePaneVisibility}
            // adjudicatorPassImageData={adjudicatorPassImageData}
            requestBiometricMugshot={requestBiometricMugshot}
            requestScannedImageModal={requestScannedImageModal}
          />
          <TenprintVerifyTable
            formatMessage={formatMessage}
            PersonInfos={PersonInfos}
            LeftMatches={LeftMatches}
            RightMatches={RightMatches}
            SelectedHandInfo={SelectedHandInfo}
            requestSetTenprintVerifyMatchData={
              requestSetTenprintVerifyMatchData
            }
            MatchInfos={MatchInfos}
            SelectedRow={SelectedRow}
            requestShowModal={requestShowModal}
            requestMatchedPersonChanged={requestMatchedPersonChanged}
            ActionStatus={ActionStatus}
            matchedRowID={matchedRowID}
            tenprint={tenprint}
            requestSetTenprintVerifyHand={requestSetTenprintVerifyHand}
            panes={panes}
            requestTogglePaneVisibility={requestTogglePaneVisibility}
            database={database}
          />
        </Fragment>
      }
      foot={<div>Footer</div>}
    />
  );
}

const mapState = state => ({
  LeftFingers: tenprintVerifyLeftFingersSelector(state),
  RightFingers: tenprintVerifyRightFingersSelector(state),
  PersonInfos: tenprintVerifyPersonInfosSelector(state),
  SelectedHandInfo: tenprintVerifySelectedHandInfoSelector(state),
  LeftMatches: tenprintVerifyLeftMatchInfoSelector(state),
  RightMatches: tenprintVerifyRightMatchInfoSelector(state),
  MatchInfos: tenprintVerifyUserMatchInfoSelector(state),
  showAdjudicatorData: showAdjudicatorSelector(state),
  adjudicatorPassImageData: adjudicatorPassImageDataSelector(state),
  selectedMatch: SelectedMatchSelector(state),
  SelectedRow: SelectedRowSelector(state),
  ImageData: adjudicatorImageDataSelector(state),
  ActionStatus: SelectedActionStatusSelector(state),
  ActionType: SelectedActionTypeSelector(state),
  matchedRowID: MatchedUserRowIDSelector(state),
  tenprint: tenprintVerifyRaw(state),
  adjudicator: adjudicatorResultSelector(state),
  database: databaseSelector(state),
  panes: panesSelector(state),
  jobType: jobsTypeSelector(state),
});

export default connect(mapState, {
  requestSetTenprintVerifyHand,
  requestSetTenprintVerifyMatchData,
  requestShowAdjudicator,
  requestShowModal,
  requestMatchedPersonChanged,
  requestModalData,
  requestHideAdjudicator,
  requestTogglePaneVisibility,
  requestBiometricMugshot,
  requestScannedImageModal,
})(withRouter(TenprintVerify));
