import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
// import { injectIntl } from "react-intl";

import Button from "../../Button/Button";
import Title from "../../Title/Title";
import Dropdown from "../../Dropdown/Dropdown";
import FileBrowser from "../../FileBrowser/filebrowser";
import DropdownItem from "../../Dropdown/DropdownItem";
import Subtitle from "../../Title/Subtitle";
import Label from "../../Label/Label";
import { requestInputFieldChanged } from "../../../actions/global";
import { CUSTOM_SEARCH_MODAL } from "../../Modal/ModalRoot";
import { requestShowModal } from "../../../actions/modal";
import { customSearchIdListSelector } from "../../../selectors/customSearch";

import "../CustomSearch.scss";

function CustomSearch({
  formatMessage,
  history,
  requestInputFieldChanged,
  requestShowModal,
  IdList
}) {
  let fillData=""
 if(IdList){
   fillData = field => {
     // console.log("field",field,IdList)
    return IdList.find(data => data.key === field)
      ? IdList.find(data => data.key === field).value
      : "";
  };}
  return (
    <Fragment>
      <div className="customsearch-top">
        <div className="left" />
        <div className="center">
          <Title is="3" text={formatMessage({ id: "CustomJobData" })} />
        </div>
        <div className="right">
          <Button
            text={formatMessage({ id: "back" })}
            className="is-primary"
            leftIcon="arrow-left"
            onClick={() => history.push("/authenticated/jobqueue")}
          />
          &nbsp;&nbsp;&nbsp;
          <Button
            text={formatMessage({ id: "next" })}
            className="is-primary"
            rightIcon="arrow-right"
            disabled="true"
          />&nbsp;&nbsp;&nbsp;
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
            <div className="input inputs">
              <Label
                htmlFor="searchfilenumber"
                text={fillData("SAMISID")
                  // IdList.find(data => data.key === "SAMISID")
                  //   ? IdList.find(data => data.key === "SAMISID").value
                  //   : ""
                }
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
            <div className="input inputs">
              <Label
                htmlFor="searchfilenumber"
                text={fillData("File Number")
                  // IdList.find(data => data.key === "File Number")
                  //   ? IdList.find(data => data.key === "File Number").value
                  //   : ""
                }
              />
            </div>
          </div>
          <div className="search-fields">
            <div className="label-text">
              <Label
                htmlFor="searchlatentid"
                text={formatMessage({ id: "LatentID" })}
              />
            </div>
            <div className="input inputs">
              <Label
                htmlFor="searchlatentid"
                text={fillData("LatentID")
                  // IdList.find(data => data.key === "File Number")
                  //   ? IdList.find(data => data.key === "File Number").value
                  //   : ""
                }
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
const mapState = state => ({
  IdList: customSearchIdListSelector(state)
});
export default connect(mapState, {
  requestInputFieldChanged,
  requestShowModal
})(withRouter(CustomSearch));
