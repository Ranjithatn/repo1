import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import NumericInput from "react-numeric-input";
import Modal from "../Modal";
import Label from "../../Label/Label";
import Title from "../../Title/Title";
import Select from "../../Select/Select";
import Input from "../../Input/Input";
import HijriDatePicker from "../../HijriDatePicker";

// import "./UpdateCriminalModal.scss";
const regex = /($[a-z])|[A-Z][^A-Z]+/g;
function BiographicData({
  formatMessage,
  MatchedUserInfo,
  handleInputChange,
  data
}) {
  const handleChange = e => {
    console.log("handle click", e.target.value);
    // return e.target.value
    // window.alert(e.target.value)
  };
  let idType = "";
  let idIssueDate = "";

  if (
    MatchedUserInfo.person &&
    MatchedUserInfo.person.extendedData &&
    MatchedUserInfo.person.extendedData.length > 0
  ) {
    MatchedUserInfo.person.extendedData.map(data => {
      if (data.key === "ID Type") {
        idType = data.value;
      }
      if (data.key === "ID Issued Date") {
        idIssueDate = data.value;
      }
    });
  }

  return (

    <Fragment>
      <div className="criminal-fields">
        <Title is="5" text={formatMessage({ id: "biographicdata" })} />
        <div className="columns">
          <div className="column">
            <div className="control">
              <Label
                htmlFor="bioname"
                text={formatMessage({ id: "firstName" })}
              />
              <Input
                type="text"
                className="input"
                id="biofirstname"
                maxLength="25"
                onChange={e => {
                  handleInputChange(e, "firstName");
                }}
                placeholder={formatMessage({ id: "firstName" })}
                value={
                  data.firstName
                    ? data.firstName
                    :data.firstName===""?"": MatchedUserInfo && MatchedUserInfo.person && MatchedUserInfo.person.name
                      ? MatchedUserInfo.person.name.split(" ")[0].replace(",", '')
                      : ""
                }
              />
            </div>
          </div>
          <div className="column">
            <div className="control">
              <Label
                htmlFor="bioname"
                text={formatMessage({ id: "lastName" })}
              />
              <Input
                type="text"
                className="input"
                id="biolastname"
                maxLength="25"
                onChange={e => {
                  handleInputChange(e, "lastName");
                }}
                placeholder={formatMessage({ id: "lastName" })}
                value={
                  data.lastName
                    ? data.lastName
                    :data.lastName===""?"": MatchedUserInfo && MatchedUserInfo.person && MatchedUserInfo.person.name
                      ? MatchedUserInfo.person.name.split(" ")[1].replace(",", '')
                      : ""
                }
              />
            </div>
          </div>
          <div className="column">
            <div className="control">
              <Label
                htmlFor="bionationality"
                text={formatMessage({ id: "nationality" })}
              />
              <Input
                type="text"
                className="input"
                id="bionationality"
                maxLength="20"
                onChange={e => {
                  handleInputChange(e, "nationality");
                }}
                placeholder={formatMessage({ id: "nationality" })}
                value={
                  data.nationality
                    ? data.nationality :data.nationality===""?"": MatchedUserInfo.person !== undefined
                      ? MatchedUserInfo.person.nationality
                      : ""
                }
              />
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="column">
            <div className="control">
              <Label
                htmlFor="biosamisid"
                text={formatMessage({ id: "SAMIS ID" })}
              />
              <Input
                type="text"
                className="input"
                id="biosamisid"
                maxLength="10"
                onChange={e => {
                  handleInputChange(e, "biosamisid");
                }}
                placeholder="#########"
                value={
                  data.biosamisid
                    ? data.biosamisid
                    :data.biosamisid===""?"": MatchedUserInfo.person !== undefined
                      ? MatchedUserInfo.person.samisid
                      : ""
                }

              />
            </div>
          </div>
          <div className="column">
            <div className="control">
              <Label htmlFor="biodate" text={formatMessage({ id: "dob" })} />
              <HijriDatePicker
                className="input"
                id="biodate"
                placeholder={formatMessage({ id: "dob" })}
                value={
                  MatchedUserInfo.person && MatchedUserInfo.person.dob
                    ? MatchedUserInfo.person.dob
                    : ""
                }
              />
            </div>
          </div>
          <div className="column">
            <div className="control">
              <Label
                htmlFor="biogender"
                text={formatMessage({ id: "gender" })}
              />
              <Input
                type="text"
                className="input"
                id="biogender"
                maxLength="10"
                onChange={e => {
                  handleInputChange(e, "biogender");
                }}
                placeholder={formatMessage({ id: "gender" })}
                value={
                  data.biogender
                    ? data.biogender
                    :data.biogender===""?"": MatchedUserInfo.person !== undefined
                      ? MatchedUserInfo.person.gender
                      : ""
                }

              />
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="column">
            <div className="control">
              <Label
                htmlFor="bioidtype"
                text={formatMessage({ id: "idType" })}
              />
              <Select
                // defaultValue="ID Type"
                className="level-right"
                formatMessage={formatMessage}
                id="1"
                name="idType"
                options={[
                  {
                    value: idType ? idType : "Passport",
                    displayName: idType ? idType : "Passport"
                  },
                  {
                    value: "Driving",
                    displayName: "Driving Lincence"
                  },
                  {
                    value: "Citizenship",
                    displayName: "Citizenship Card"
                  }
                ]}
              />
            </div>
          </div>
          <div className="column">
            <div className="control">
              <Label
                htmlFor="bioidissuedate"
                text={formatMessage({ id: "issueDate" })}
              />
              <HijriDatePicker
                className="input"
                id="bioidissuedate"
                onChange={e => {
                  handleChange(e);
                }}
                value={idIssueDate}
              />
            </div>
          </div>
          <div className="column" />
        </div>
        <div className="columns">
          <div className="space-fill" />
        </div>
      </div>
    </Fragment>
  );
}
export default BiographicData;
