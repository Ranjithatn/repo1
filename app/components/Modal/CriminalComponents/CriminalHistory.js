import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import Modal from "../Modal";
import Button from "../../Button/Button";
import { requestHideModal } from "../../../actions/modal";
import Label from "../../Label/Label";
import AddedRecord from "./AddedRecord";
import Punishment from "./Punishment";

// import "./UpdateCriminalModal.scss";

function CriminalHistory({
  formatMessage,
  MatchedUserInfo,
  handleCheckboxClick,
  lashing_checkbox,
  fine_checkbox,
  handleInputClick,
  handleInputChange,
  data
}) {
  return (
    <Fragment>
      {MatchedUserInfo &&
        MatchedUserInfo.map((obj, index) => {
          const criminalclass = obj.additionalMatchDatas.find( data => data.key === "Criminal Class" );
          return (
            <div className="criminal-fields" key={index}>
              <Label
                text={
                  formatMessage({ id: "recordHistory" }) + "  " + (index + 1)
                }
              />
              <div className="case-content">
                {obj.additionalMatchDatas&&obj.additionalMatchDatas.length > 0 ? (
                  <div className="case-field">
                    <span className="span-head">
                      {formatMessage({ id: "caseType" })}
                    </span>
                    <span className="span-head">
                      {formatMessage({ id: "desc" })}
                    </span>
                    <span />
                  </div>
                ) : (
                  ""
                )}

                {obj.additionalMatchDatas&&obj.additionalMatchDatas.length > 0 && criminalclass && criminalclass.value &&
                  criminalclass && criminalclass.value.map((presentObj, index) => {
                   
                    return (
                      <Fragment key={index}>
                        <AddedRecord
                          formatMessage={formatMessage}
                          presentObj={presentObj}
                          criminalHistory={true}
                        />
                      </Fragment>
                    );
                  })}
              </div>
              {/* {data.push({["lashing"+index]:""})} */}
              <Fragment key={index}>
                <Punishment
                  formatMessage={formatMessage}
                  MatchedUserInfo={obj.additionalMatchDatas?obj.additionalMatchDatas:{}}
                  handleCheckboxClick={handleCheckboxClick}
                  lashing_checkbox={lashing_checkbox}
                  fine_checkbox={fine_checkbox}
                  data={data}
                  index={index}
                  handleInputClick={handleInputClick}
                  handleInputChange={handleInputChange}
                  criminalHistory={true}
                />
              </Fragment>
            </div>
          );
        })}
    </Fragment>
  );
}
export default CriminalHistory;