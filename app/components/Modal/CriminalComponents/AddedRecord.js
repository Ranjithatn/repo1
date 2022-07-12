import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import Modal from "../Modal";
import Button from "../../Button/Button";
import { requestHideModal } from "../../../actions/modal";
import { requestInputFieldChanged } from "../../../actions/global";
import Label from "../../Label/Label";
import Select from "../../Select/Select";
import Input from "../../Input/Input";
import Icon from "../../Icon/Icon";
import { requestSetAddnew } from "../../../actions/tenprint";
import CriminalHistory from "./CriminalHistory";

// import "./UpdateCriminalModal.scss";

export function AddedRecord({ formatMessage, presentObj, onClick, index,criminalHistory }) {
  const handleChange = e => {
    console.log("handle click");
  };

  return (
    <div className="case-field">
      <div className="control">
        <Input
          type="text"
          className="input"
          id="lashing"
          // disabled={!lashing_checkbox}
          onChange={e => {
            handleChange(e);
          }}
          value={presentObj.CaseType}
          disabled={ criminalHistory ? true : false }
        />
      </div>
      <div className="control">
        <Input
          type="text"
          className="input"
          id="crimeDesc"
          placeholder={formatMessage({
            id: "typeSubject"
          })}
          onChange={e => {
            handleChange(e);
          }}
          value={presentObj.Description}
          disabled={ criminalHistory ? true : false }
        />
      </div>
      <div className="icon-div">
      <Icon
          icon="trash"
          onClick={ criminalHistory ? () => {} : () => onClick(index)}
          title={ criminalHistory ? "" : formatMessage({ id: "deleteJob" })}
          disabled={ criminalHistory ? true : false }
        />

      </div>
    </div>
  );
}
export default connect(null, { requestInputFieldChanged, requestSetAddnew })(
  AddedRecord
);
