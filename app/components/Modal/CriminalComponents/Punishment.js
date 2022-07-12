import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import NumericInput from "react-numeric-input";
import Modal from "../Modal";
import Label from "../../Label/Label";
import Select from "../../Select/Select";
import Input from "../../Input/Input";
import Textarea from "../../Textarea/Textarea";
import HijriDatePicker from "../../HijriDatePicker";
// import index from "../../ErrorHandler";
import { formatDate } from '../../../utils/date';
// import "./UpdateCriminalModal.scss";

function Punishment({
  formatMessage,
  MatchedUserInfo,
  lashing_checkbox,
  fine_checkbox,
  handleCheckboxClick,
  handleInputClick,
  handleInputChange,
  data,
  index,
  criminalHistory
}) {


  console.log("MatchedUserInfo",MatchedUserInfo);


  const handleChange = e => {
    // console.log("handle click");
  };

  function getDays(totalDays, type) {
    if (type === "year") {
      totalDays = totalDays / 365;
      return parseInt(totalDays);
    } else if (type === "month") {
      let totalMonths = (totalDays % 365) / 30;

      return parseInt(totalMonths);
    } else if (type === "day") {
      let finalTotalDays = (totalDays % 365) % 30;

      return parseInt(finalTotalDays);
    }
  }

  const isDefaultChecked = (field, val) => {
    console.log("field, val",field, val);
    if (criminalHistory && val) {
      return true;
    }

    if (field === "x Lashing" || field === "x Riyals") {
      return false;
    } else {
      return MatchedUserInfo
        ? MatchedUserInfo.find(data => data.key === field) && MatchedUserInfo.find(data => data.key === field).value === "true"
          ? true
          : false
        : false;
    }
  };
  const isDate = field => {
    return MatchedUserInfo
      ? MatchedUserInfo.find(data => data.key === field) && MatchedUserInfo.find(data => data.key === field).value
      : "";
  };
  const isGetDays = (field, type, dvalue) => {
    return MatchedUserInfo
      ? getDays(
          MatchedUserInfo.find(data => data.key === field)
            ? MatchedUserInfo.find(data => data.key === field) && MatchedUserInfo.find(data => data.key === field).value
            : "",
          type
        )
      : dvalue;
  };
  const isValue = (field, type) => {
    return type
      ? type
      : type === ""
        ? ""
        : MatchedUserInfo
          ? MatchedUserInfo.find(data => data.key === field)
            ? MatchedUserInfo.find(data => data.key === field) && MatchedUserInfo.find(data => data.key === field).value
            : ""
          : "";
  };

  return (
    <div className="punishment-block">
      <Label text={formatMessage({ id: "punishment" })} />
      <div className="columns">
        <div className="column is-paddingless">
          <div className="dayselector-left">
            <div className="label-text">
              <Label text={formatMessage({ id: "prison" })} />
            </div>
            <div className="parts">
              <div className="part-fields">
                <Label text={formatMessage({ id: "year" })} />
                <NumericInput
                  className="input"
                  value={isGetDays("Prison", "year", data.prison.year)}
                  min={0}
                  max={99}
                  step={1}
                  precision={0}
                  size={5}
                  maxLength={2}
                  mobile
                  pattern="[0-9].[0-9][0-9]"
                  onChange={valueAsNumber => {
                    handleInputClick(valueAsNumber, "prison.year");
                  }}
                  title={
                    criminalHistory ? " " : "Please match the requested format."
                  }
                  disabled={criminalHistory ? true : false}
                />
              </div>
              <div className="part-fields">
                <Label text={formatMessage({ id: "month" })} />
                <NumericInput
                  className="input"
                  value={isGetDays("Prison", "month", data.prison.month)}
                  min={1}
                  max={11}
                  step={1}
                  precision={0}
                  size={5}
                  maxLength={2}
                  mobile
                  pattern="[0-9].[0-9][0-9]"
                  onChange={valueAsNumber => {
                    handleInputClick(valueAsNumber, "prison.month");
                  }}
                  title={
                    criminalHistory ? " " : "Please match the requested format."
                  }
                  disabled={criminalHistory ? true : false}
                />
              </div>
              <div className="part-fields">
                <Label text={formatMessage({ id: "days" })} />
                <NumericInput
                  className="input"
                  value={isGetDays("Prison", "day", data.prison.days)}
                  min={0}
                  max={31}
                  step={1}
                  precision={0}
                  size={5}
                  maxLength={2}
                  mobile
                  pattern="[0-9].[0-9][0-9]"
                  onChange={valueAsNumber => {
                    handleInputClick(valueAsNumber, "prison.days");
                  }}
                  title={
                    criminalHistory ? " " : "Please match the requested format."
                  }
                  disabled={criminalHistory ? true : false}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="column is-paddingless is-three-fifths">
          <div className="dayselector-right">
            <div className="label-text">
              <Label text={formatMessage({ id: "travelBan" })} />
            </div>
            <div className="parts">
              <div className="part-fields">
                <Label text={formatMessage({ id: "year" })} />
                <NumericInput
                  className="input"
                  value={isGetDays("Travel Ban", "year", data.travelBan.year)}
                  min={0}
                  max={99}
                  step={1}
                  precision={0}
                  size={5}
                  maxLength={2}
                  mobile
                  pattern="[0-9].[0-9][0-9]"
                  onChange={valueAsNumber => {
                    handleInputClick(valueAsNumber, "travelBan.year");
                  }}
                  title={
                    criminalHistory ? " " : "Please match the requested format."
                  }
                  disabled={criminalHistory ? true : false}
                />
              </div>
              <div className="part-fields">
                <Label text={formatMessage({ id: "month" })} />
                <NumericInput
                  className="input"
                  value={isGetDays("Travel Ban", "month", data.travelBan.month)}
                  min={1}
                  max={11}
                  step={1}
                  precision={0}
                  size={5}
                  maxLength={2}
                  mobile
                  pattern="[0-9].[0-9][0-9]"
                  onChange={valueAsNumber => {
                    handleInputClick(valueAsNumber, "travelBan.month");
                  }}
                  title={
                    criminalHistory ? " " : "Please match the requested format."
                  }
                  disabled={criminalHistory ? true : false}
                />
              </div>
              <div className="part-fields">
                <Label text={formatMessage({ id: "days" })} />
                <NumericInput
                  className="input"
                  value={isGetDays("Travel Ban", "day", data.travelBan.days)}
                  min={0}
                  max={31}
                  step={1}
                  precision={0}
                  size={5}
                  maxLength={2}
                  mobile
                  pattern="[0-9].[0-9][0-9]"
                  onChange={valueAsNumber => {
                    handleInputClick(valueAsNumber, "travelBan.days");
                  }}
                  title={
                    criminalHistory ? " " : "Please match the requested format."
                  }
                  disabled={criminalHistory ? true : false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="columns">
        <div className="column is-paddingless">
          <div className="dayselector-left">
            <div className="label-text-bot">
              <Label text={formatMessage({ id: "lashing" })} />
            </div>
            <div className="control control-checkbox">
              <Input
                className="mycheckbox"
                type="checkbox"
                onChange={e => {
                  handleCheckboxClick(e, "lashing_checkbox" + index);
                }}
                defaultChecked={isDefaultChecked(
                  "x Lashing",
                  isValue("Lashing", data["Lashing" + index])
                )}
                disabled={criminalHistory ? true : false}
              />
              <Input
                type="tel"
                maxLength="4"
                className="input"
                id="lashing"
                disabled={
                  // criminalHistory ? true : false
                  criminalHistory
                    ? true
                    : data["lashing_checkbox" + index]
                      ? !data["lashing_checkbox" + index]
                      : true
                  // MatchedUserInfo
                  //   ? MatchedUserInfo.find(data => data.key === "x Lashing")
                  //       .value === "true"
                  //     ? false
                  //     : true
                  //   : true
                }
                onChange={e => {
                  handleInputChange(e, "Lashing" + index);
                }}
                value={isValue("Lashing", data["Lashing" + index])}
              />
            </div>
          </div>
        </div>

        <div className="column is-paddingless is-three-fifths">
          <div className="dayselector-right">
            <div className="label-text-bot">
              <Label text={formatMessage({ id: "deportation" })} />
            </div>
            <div className="parts">
              <div className="part-fields">
                <NumericInput
                  className="input"
                  value={isGetDays(
                    "Deportation",
                    "year",
                    data.deportation.year
                  )}
                  min={0}
                  max={99}
                  step={1}
                  precision={0}
                  size={5}
                  maxLength={2}
                  mobile
                  pattern="[0-9].[0-9][0-9]"
                  onChange={valueAsNumber => {
                    handleInputClick(valueAsNumber, "deportation.year");
                  }}
                  title={
                    criminalHistory ? " " : "Please match the requested format."
                  }
                  disabled={criminalHistory ? true : false}
                />
              </div>
              <div className="part-fields">
                <NumericInput
                  className="input"
                  value={isGetDays(
                    "Deportation",
                    "month",
                    data.deportation.month
                  )}
                  min={1}
                  max={11}
                  step={1}
                  precision={0}
                  size={5}
                  maxLength={2}
                  mobile
                  pattern="[0-9].[0-9][0-9]"
                  onChange={valueAsNumber => {
                    handleInputClick(valueAsNumber, "deportation.month");
                  }}
                  title={
                    criminalHistory ? " " : "Please match the requested format."
                  }
                  disabled={criminalHistory ? true : false}
                />
              </div>
              <div className="part-fields">
                <NumericInput
                  className="input"
                  value={isGetDays("Deportation", "day", data.deportation.days)}
                  min={0}
                  max={31}
                  step={1}
                  precision={0}
                  size={5}
                  maxLength={2}
                  mobile
                  pattern="[0-9].[0-9][0-9]"
                  onChange={valueAsNumber => {
                    handleInputClick(valueAsNumber, "deportation.days");
                  }}
                  title={
                    criminalHistory ? " " : "Please match the requested format."
                  }
                  disabled={criminalHistory ? true : false}
                />
              </div>
            </div>
            <div className="label-text-final">
              <Label text={formatMessage({ id: "final" })} />
              <Input
                className="mycheckbox"
                type="checkbox"
                defaultChecked={isDefaultChecked("Final")}
                disabled={criminalHistory ? true : false}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="columns">
        <div className="column is-paddingless">
          <div className="dayselector-left">
            <div className="label-text-bot">
              <Label text={formatMessage({ id: "fine" })} />
            </div>
            <div className="control control-checkbox">
              <Input
                className="mycheckbox"
                type="checkbox"
                onChange={e => {
                  handleCheckboxClick(e, "fine_checkbox" + index);
                }}
                defaultChecked={isDefaultChecked(
                  "x Riyals",
                  isValue("Fine", data["riyals" + index])
                )}
                disabled={criminalHistory ? true : false}
              />
              <Input
                type="tel"
                maxLength="7"
                className="input"
                id="riyals"
                disabled={
                  // criminalHistory ? true : false
                  criminalHistory
                    ? true
                    : data["fine_checkbox" + index]
                      ? !data["fine_checkbox" + index]
                      : true
                  // MatchedUserInfo
                  //   ? MatchedUserInfo.find(data => data.key === "x Riyals")
                  //       .value === "true"
                  //     ? false
                  //     : true
                  //   : true
                }
                // disabled={!fine_checkbox}
                onChange={e => {
                  handleInputChange(e, "riyals" + index);
                }}
                value={isValue("Fine", data["riyals" + index])}
              />
            </div>
          </div>
        </div>
        <div className="column is-paddingless is-three-fifths">
          <div className="dayselector-right">
            <div className="label-text-bot">
              <Label text={formatMessage({ id: "exiling" })} />
            </div>
            <div className="parts">
              <div className="part-fields">
                <NumericInput
                  className="input"
                  value={isGetDays("Exiling", "year", data.exiling.year)}
                  min={0}
                  max={99}
                  step={1}
                  precision={0}
                  size={5}
                  maxLength={2}
                  mobile
                  pattern="[0-9].[0-9][0-9]"
                  onChange={valueAsNumber => {
                    handleInputClick(valueAsNumber, "exiling.year");
                  }}
                  title={
                    criminalHistory ? " " : "Please match the requested format."
                  }
                  disabled={criminalHistory ? true : false}
                />
              </div>
              <div className="part-fields">
                <NumericInput
                  className="input"
                  value={isGetDays("Exiling", "month", data.exiling.month)}
                  min={1}
                  max={11}
                  step={1}
                  precision={0}
                  size={5}
                  maxLength={2}
                  mobile
                  pattern="[0-9].[0-9][0-9]"
                  onChange={valueAsNumber => {
                    handleInputClick(valueAsNumber, "exiling.month");
                  }}
                  title={
                    criminalHistory ? " " : "Please match the requested format."
                  }
                  disabled={criminalHistory ? true : false}
                />
              </div>
              <div className="part-fields">
                <NumericInput
                  className="input"
                  value={isGetDays("Exiling", "day", data.exiling.days)}
                  min={0}
                  max={31}
                  step={1}
                  precision={0}
                  size={5}
                  maxLength={2}
                  mobile
                  pattern="[0-9].[0-9][0-9]"
                  onKeyDown={() => false}
                  onChange={valueAsNumber => {
                    handleInputClick(valueAsNumber, "exiling.days");
                  }}
                  title={
                    criminalHistory ? " " : "Please match the requested format."
                  }
                  disabled={criminalHistory ? true : false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="columns">
        <div className="column is-paddingless">
          <div className="dayselector-left">
            <div className="label-text-bot">
              <Label text={formatMessage({ id: "covenant" })} />
            </div>
            <div className="control">
              <Input
                className="mycheckbox single"
                type="checkbox"
                disabled={criminalHistory ? true : false}
                onChange={e => {
                  handleChange(e);
                }}
                defaultChecked={isDefaultChecked("Covenant")}
              />
            </div>
          </div>
        </div>
        <div className="column is-paddingless is-three-fifths">
          <div className="dayselector-right">
            <div className="label-text-bot">
              <Label text={formatMessage({ id: "criminalLibel" })} />
            </div>
            <div className="parts">
              <div className="part-fields">
                <Input
                  className="mycheckbox single"
                  type="checkbox"
                  defaultChecked={isDefaultChecked("Criminal Libel")}
                  disabled={criminalHistory ? true : false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="columns">
        <div className="column is-paddingless">
          <div className="dayselector-left">
            <div className="label-text-bot">
              <Label text={formatMessage({ id: "judgementDate" })} />
            </div>
            <div className="control">
              <HijriDatePicker
                className="input"
                id="upadtejudgementDate"
                disabled={criminalHistory ? true : false}
                onChange={e => {
                  handleChange(e);
                }}
                value={formatDate( isDate("Judgement Date") )}
              />
            </div>
          </div>
        </div>
        <div className="column is-paddingless is-three-fifths">
          <div className="dayselector-right">
            <div className="label-text-bot">
              <Label text={formatMessage({ id: "detentionDate" })} />
            </div>
            <div className="control">
              <HijriDatePicker
                className="input"
                id="updateDetentionDate"
                onChange={e => {
                  handleChange(e);
                }}
                disabled={criminalHistory ? true : false}
                placeholder={formatMessage({ id: "idType" })}
                value={formatDate( isDate("Detention Date") )}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="columns">
        <div className="column is-paddingless">
          <div className="dayselector-left">
            <div className="label-text-bot">
              <Label text={formatMessage({ id: "judgementIssuer" })} />
            </div>
            <div className="control">
              <Input
                type="text"
                maxLength="30"
                className="input"
                id="judgementIssuer"
                placeholder={formatMessage({
                  id: "judgementIssuer"
                })}
                disabled={criminalHistory ? true : false}
                onChange={e => {
                  handleInputChange(e, "judgementIssuer" + index);
                }}
                value={isValue(
                  "Judgement Issuer",
                  data["judgementIssuer" + index]
                )}
              />
            </div>
          </div>
        </div>
        <div className="column is-paddingless is-three-fifths">
          <div className="dayselector-right">
            <div className="label-text-bot">
              <Label
                text={formatMessage({
                  id: "judgementNumber"
                })}
              />
            </div>
            <div className="control">
              <Input
                type="text"
                maxLength="15"
                className="input"
                id="judgementNumber"
                placeholder={formatMessage({
                  id: "#########(15 digits)"
                })}
                disabled={criminalHistory ? true : false}
                onChange={e => {
                  handleInputChange(e, "judgementNumber" + index);
                }}
                value={isValue(
                  "Judgement Number",
                  data["judgementNumber" + index]
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Punishment;
