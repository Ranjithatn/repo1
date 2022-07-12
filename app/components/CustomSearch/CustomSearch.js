import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
// import { injectIntl } from "react-intl";

import Button from "../Button/Button";
import Title from "../Title/Title";
import Label from "../Label/Label";
import Input from "../Input/Input";
import { requestInputFieldChanged } from "../../actions/global";
import { requestShowModal } from "../../actions/modal";
import { requestUpdateSearchText } from "../../actions/customSearch";
import "./CustomSearch.scss";

function CustomSearch({
  formatMessage,
  history,
  requestInputFieldChanged,
  requestShowModal,
  requestUpdateSearchText,
  // customSearchData,
  fileNo,
  SAMISID,
  latentId
}) {
  return (
    <Fragment>
      {/* {console.log(customSearchData,'CustomDataCustomData')} */}
      <div className="customsearch-top">
        <Button
          text={formatMessage({ id: "cancel" })}
          className="is-primary"
          // leftIcon="arrow-left"
          onClick={() => history.push("/authenticated/jobqueue")}
        />
        <div className="left" />

        <div className="center" style={{ marginRight : "210px" }}>
          <Title is="3" text={formatMessage({ id: "CustomJobData" })} />
        </div>
      </div>
      <div className="search-content">
        <div className="search-selection">
          <div className="search-fields">
            <div className="label-text">
              <Label
                htmlFor="searchsamisid"
                text={formatMessage({ id: "SAMIS ID" })}
              />
            </div>
            <div className="inputs">
              <Input
                type="text"
                className="input"
                id="SAMISID"
                maxLength="10"
                value={SAMISID}
                placeholder={formatMessage({ id: "Enter ID" })}
                onChange={e => requestInputFieldChanged(e, "custom")}
              />
            </div>
          </div>
          <div className="search-fields">
            <div className="label-text">
              <Label
                htmlFor="searchfilenumber"
                text={formatMessage({ id: "fileNumber" })}
              />
            </div>
            <div className="inputs">
              <Input
                id="fileNo"
                type="tel"
                className="input"
                maxLength="10"
                value={fileNo}
                placeholder={formatMessage({ id: "Enter File Nos" })}
                onChange={e => {
                  requestInputFieldChanged(e, "custom");
                }}
              />
            </div>
          </div>
          <div className="search-fields">
            <div className="label-text">
              <Label
                htmlFor="searchlatentId"
                text={formatMessage({ id: "LatentID" })}
              />
            </div>
            
            <div className="inputs">
              <Input
                id="latentID"
                type="text"
                className="input"
                maxLength="10"
                value={latentId}
                placeholder={formatMessage({ id: "LatentID" })}
                onChange={e => {
                  // if (
                  //   e.target.value === "" ||
                  //   reg_numeric.test(e.target.value)
                  // ) {
                    requestInputFieldChanged(e, "custom");
                  }
                }
              // }
              />
            </div>
          </div>
    
          <div className="button-section">
            <Button
              text={formatMessage({ id: "Submit" })}
              className="is-primary"
              // leftIcon="arrow-left"
              onClick={() => {
                requestUpdateSearchText();
              }}
              disabled={!SAMISID && !fileNo && !latentId }
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
const mapState = state => {
  // customSearchData: customSearchDataSelector(state);
  return {
    SAMISID: state.customSearch.customSearch.SAMISID,
    fileNo: state.customSearch.customSearch.fileNo,
    latentId: state.customSearch.customSearch.latentID
  };
};

export default connect(mapState, {
  requestInputFieldChanged,
  requestShowModal,
  requestUpdateSearchText
})(withRouter(CustomSearch));
