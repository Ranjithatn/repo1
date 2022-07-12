import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Button from "../../Button/Button";
import Image from "../../Image/Image";
import Title from "../../Title/Title";
import Switch from "../../Switch/Switch";
import Icon from "../../Icon/Icon";
import Adjudicator from "../../Adjudicator";
import "./LatentVerify.scss";
import VerifierWorkflowWrapper from "../../WorkflowWrapper/VerifierWorkflowWrapper";
import LatentVerifyLeft from "./LatentVerifyLeft/LatentVerifyLeft";
import LatentVerifyMain from "./LatentVerifyMain/LatentVerifyMain";
import LatentVerifyTable from "./LatentVerifyTable/LatentVerifyTable";

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
  databaseSelector,
  panesSelector,
  tenprintVerifyLatentProbleDataSelector,
} from "../../../selectors/tenprint";
import {
  requestSetTenprintVerifyHand,
  requestSetTenprintVerifyMatchData,
  requestShowAdjudicator,
  requestMatchedPersonChanged,
  requestHideAdjudicator,
  requestModalData,
  requestTogglePaneVisibility
} from "../../../actions/tenprint";
// import { jobsTypeSelector } from "selectors/jobs";
import { requestShowModal } from "../../../actions/modal";
import {
  SelectedActionStatusSelector,
  SelectedActionTypeSelector,
  jobsTypeSelector
} from "../../../selectors/jobs";

export function LatentVerify({
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
  ActionStatus,
  actionType,
  requestHideAdjudicator,
  requestModalData,
  jobType,
  matchedRowID,
  database,
  panes,
  requestTogglePaneVisibility,
  latentProbeData,
  locale,
}) {

  // console.log("LatentVerify:::jobType", jobType );

  return (
    <VerifierWorkflowWrapper
      className="latentverify-main"
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
              //     ? formatMessage({ id: "search" }) + ": " + formatMessage({ id: database})
              //     : formatMessage({ id: "search" }) + ": "
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
          &nbsp;&nbsp;&nbsp;&nbsp;
            <Button
              leftIcon={panes.sidebar ? "expand" : "arrows-alt"}
              className="is-primary"
              // style={{ marginRight: 20 }}
              onClick={() => {
                if (panes.sidebar) {
                  // console.log("one");
                  requestTogglePaneVisibility({ pane: "all", visible: false });
                } else {
                  // console.log("two");
                  requestTogglePaneVisibility({ pane: "all", visible: true });
                }
              }}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button
              text={formatMessage({ id: "back" })}
              className="is-primary"
              //leftIcon="arrow-left"
              // rightIcon={ locale === "en" ? '' : 'arrow-right' }
              leftIcon={ locale === "en" ? 'arrow-left' : 'arrow-right' }
              onClick={() => {
                if (showAdjudicatorData) {
                  requestHideAdjudicator(false);
                  requestTogglePaneVisibility({ pane: "all", visible: true });
                } else {
                  history.push("/authenticated/jobqueue");
                }
              }}
            />&nbsp;&nbsp;&nbsp;&nbsp;
            <Button
              text={formatMessage({ id: "next" })}
              className="is-primary"
              disabled={ActionStatus === "Completed"}
              // rightIcon="arrow-right"
              // rightIcon={ locale === "en" ? 'arrow-right' : '' }
              // leftIcon={ locale === "en" ? '' : 'arrow-left' }
              rightIcon={ locale === "en" ? 'arrow-right' : 'arrow-left' }

              onClick={() => requestModalData()}
            />

            <div className="home-logo-icon" style={ locale === "en" ? { marginLeft: 20, marginTop: 5 } : { marginRight: 20, marginTop: 5 } }>
              <Icon icon="home fa-2x" onClick={ (e) => { history.push("/authenticated/jobqueue"); } } />
            </div>

          </div>
        </Fragment>
      }
      left={
        <LatentVerifyLeft
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
          actionType={actionType}
          jobType={jobType}
          panes={panes}
          requestTogglePaneVisibility={requestTogglePaneVisibility}
        />
      }
      main={
        <Fragment>
          <LatentVerifyMain
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
            actionType={actionType}
            jobType={jobType}
            panes={panes}
            requestTogglePaneVisibility={requestTogglePaneVisibility}
            latentProbeData={latentProbeData}
            // adjudicatorPassImageData={adjudicatorPassImageData}
          />
          <LatentVerifyTable
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
            panes={panes}
            requestTogglePaneVisibility={requestTogglePaneVisibility}
            database={database}
          />
        </Fragment>
      }
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
  actionType: SelectedActionTypeSelector(state),
  jobType: jobsTypeSelector(state),
  matchedRowID: MatchedUserRowIDSelector(state),
  database: databaseSelector(state),
  panes: panesSelector(state),
  latentProbeData: tenprintVerifyLatentProbleDataSelector(state),
  locale: state.locale.lang,
});
export default connect(mapState, {
  requestSetTenprintVerifyHand,
  requestSetTenprintVerifyMatchData,
  requestShowAdjudicator,
  requestShowModal,
  requestMatchedPersonChanged,
  requestHideAdjudicator,
  requestModalData,
  requestTogglePaneVisibility
})(withRouter(LatentVerify));
