import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import WorkflowWrapper from "../../WorkflowWrapper/WorkflowWrapper";
import LeftContainer from "../../WorkflowWrapper/LiveScanLeftContainer";
import Button from "../../Button/Button";
import Icon from "../../Icon/Icon";
import Label from "../../Label/Label";
import Subtitle from "../../Title/Subtitle";
import Title from "../../Title/Title";
import "./CustomSearchVerify.scss";
import { requestModalData } from "../../../actions/tenprint";
import CustomSearchVerifyContent from "./CustomSearchVerifyContent/CustomSearchVerifyContent";
import CustomSearchVerifyTable from "./CustomSearchVerifyTable/CustomSearchVerifyTable";
import {
  customSearchSelectedPersonSelector,
  customSearchDatabaseSelector,
  customSearchIdListSelector
} from "../../../selectors/customSearch";
import {
  SelectedActionStatusSelector,
  jobsTypeSelector
} from "../../../selectors/jobs";

const CustomSerchVeify = ({
  formatMessage,
  history,
  customSearchPersonData,
  requestModalData,
  ActionStatus,
  database,
  searchId,
  jobType,
  locale
}) => {
  return (
    <WorkflowWrapper
      className="customsearchverify"
      top={
        <div className="biometrics-top">
          <div className="start">
            <Title
              is="6"
              // text={
              //   database
              //     ? formatMessage({ id: "search" }) +
              //       " : " +
              //       formatMessage({ id: database })
              //     : formatMessage({ id: "search" }) + " : "
              // }
              text={`${formatMessage({ id: "search" })} : ${
                database ? formatMessage({ id: database }) : ""
              }
                   | ${formatMessage({ id: "jobType" })} : ${
                jobType ? formatMessage({ id: jobType }) : ""
              }`}
            />
          </div>

          <div className="end">
     
            <Button
              className="is-primary"
              text={formatMessage({ id: "back" })}
              leftIcon={locale === "en" ? "arrow-left" : "arrow-right"}
              onClick={() => history.push("/authenticated/jobqueue")}
            />
            &nbsp;&nbsp;
            <Button
              text={formatMessage({ id: "next" })}
              className="is-primary"
              disabled={ActionStatus === "Completed"}
              rightIcon={locale === "en" ? "arrow-right" : "arrow-left"}
              onClick={() => requestModalData()}
            />
            &nbsp;&nbsp;
          </div>
        </div>
      }
      left={
        <LeftContainer
          heading={formatMessage({ id: "searchFilter" })}
          content={
            <div className="dark-container">
              {database === "Civil" && (
                <div className="innerFields">
                  <span> {formatMessage({ id: "SAMIS ID" }) + " : "} </span>
                  {searchId && searchId.find(data => data.key === "SAMISID") ? (
                    <span>
                      {" "}
                      {searchId.find(data => data.key === "SAMISID").value}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              )}
              {database === "Criminal" && (
                <div className="innerFields">
                  <span> {formatMessage({ id: "fileNos" }) + " : "} </span>
                  {searchId &&
                  searchId.find(data => data.key === "File Number") ? (
                    <span>
                      {" "}
                      {searchId.find(data => data.key === "File Number").value}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              )}
              {database === "Latent" && (
                <div className="innerFields">
                  <span> {formatMessage({ id: "LatentID" }) + " : "} </span>
                  {searchId &&
                  searchId.find(data => data.key === "LatentID") ? (
                    <span>
                      {" "}
                      {searchId.find(data => data.key === "LatentID").value}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              )}
            </div>
          }
        />
      }
      main={
        <Fragment>
          {customSearchPersonData ? (
            <Fragment>
              <CustomSearchVerifyContent
                formatMessage={formatMessage}
                database={database}
              />
              <CustomSearchVerifyTable
                formatMessage={formatMessage}
                ActionStatus={ActionStatus}
                database={database}
              />
            </Fragment>
          ) : (
            <div className="verify-blank">
              <Title is="3" text={formatMessage({ id: "noData" })} />
            </div>
          )}
        </Fragment>
      }
      foot={<div />}
    />
  );
};

const mapState = state => ({
  customSearchPersonData: customSearchSelectedPersonSelector(state),
  ActionStatus: SelectedActionStatusSelector(state),
  database: customSearchDatabaseSelector(state),
  searchId: customSearchIdListSelector(state),
  jobType: jobsTypeSelector(state),
  locale: state.locale.lang
});
export default connect(
  mapState,
  { requestModalData }
)(withRouter(CustomSerchVeify));
