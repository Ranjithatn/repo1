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
import { requestSetAddnew } from "../../../actions/tenprint";
import { newCrimeTypeSelector } from "../../../selectors/updateCriminalModal";
// import "./UpdateCriminalModal.scss";

export function AddRecord({
  formatMessage,
  requestInputFieldChanged,
  requestSetAddnew,
  newCrimeType
}) {
  return (
    <div className="case-field">
      <div className="control">
        <Select
          defaultValue="Filter"
          formatMessage={formatMessage}
          id="CaseType"
          name="CrimeType"
          value={newCrimeType.CaseType}
          onChange={e => requestInputFieldChanged(e, "addCrimeType")}
          options={[
            {
              value: "Drug",
              displayName: formatMessage({
                id: "Drug"
              })
            },
            {
              value: "Murder",
              displayName: formatMessage({
                id: "Murder"
              })
            },
            {
              value: "Robbery",
              displayName: formatMessage({
                id: "Robbery"
              })
            }
          ]}
        />
      </div>
      <div className="control">
        <Input
          type="text"
          className="input"
          id="Description"
          placeholder={formatMessage({
            id: "typeSubject"
          })}
          value={newCrimeType.Description}
          onChange={e => requestInputFieldChanged(e, "addCrimeType")}
        />
      </div>
      <Button
        className="is-primary is-rounded"
        leftIcon="plus"
        // style={{ marginRight: 18 }}
        // text={formatMessage({ id: "+" })}
        onClick={e => {
          requestSetAddnew();
        }}
        disabled={!newCrimeType.CaseType || !newCrimeType.Description}
        id="upmodbackbtn"
      />
    </div>
  );
}
const mapState = state => ({
  newCrimeType: newCrimeTypeSelector(state)
});
export default connect(mapState, {
  requestInputFieldChanged,
  requestSetAddnew
})(AddRecord);
