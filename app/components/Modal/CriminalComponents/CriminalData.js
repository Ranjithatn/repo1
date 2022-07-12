import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

import Label from "../../Label/Label";
import Title from "../../Title/Title";
import Textarea from "../../Textarea/Textarea";
import Input from "../../Input/Input";
import HijriDatePicker from "../../HijriDatePicker";
import Select from "../../Select/Select";
import { requestShowNotification } from "../../../actions/notifications";

// import "./UpdateCriminalModal.scss";
const regex = /($[a-z])|[A-Z][^A-Z]+/g;
function CriminalaData({
  formatMessage,
  MatchedUserInfo,
  handleInputChange,
  data={},
  lookups,
  rowId,
  crimeTypes,
  requestShowNotification,
}) {

  console.log("CriminalaData::data", data);

  // console.log("CriminalaData-------lookups",lookups);
  // console.log("CriminalaData-------MatchedUserInfo",MatchedUserInfo);
  // console.log("CriminalaData-------data",data);
  // console.log("CriminalaData-------rowId",rowId);
  // let latentCrimeType =
  //   lookups &&
  //   lookups
  //     .find(data => data.lookupName === "LatentCrimeType")
  //     .items.map(item => {
  //       return {
  //         displayName: item.englishText,
  //         value: item.englishText
  //       };
  //     });
  const lang = localStorage.getItem("lang") || "en";

  const latentCrimeType = [];

  const crimeCityOptions = lookups && Array.isArray(lookups) && lookups.find(data => data.lookupName === "LatentCrimeCity").items.map(item => {
    return {
      displayName: lang === "en" ? item.englishText : item.arabicText,
      value: item.id
    };
  });
  // console.log("crimeCityOptions",crimeCityOptions,lang);
  // console.log("crimeCityOptionsLookup",lookups);





  const crimeRegionOptions = lookups && Array.isArray(lookups) && lookups.find(data => data.lookupName === "LatentCrimeRegion").items.map(item => {
    return {
      displayName: lang === "en" ? item.englishText : item.arabicText,
      value: item.id
    };
  });
  // console.log("crimeRegionOptions",crimeRegionOptions);

  // const crimeTypeOptions = lookups.find(data => data.lookupName === "LatentCrimeType").items.map( item => {
  //   return {
  //     displayName: lang === "en" ? item.englishText : item.arabicText,
  //     value: item.id
  //   };
  // });


  // console.log("crimeTypes",crimeTypes);

  const codeOptions = crimeTypes.lookups.map(item => {
    return {
      displayName: `${item.eventDesc} - ${item.classDesc}`,
      value: `${item.eventCode}|${item.classCode}`,
    };
  });
  // console.log("codeOptions",crimeTypes.lookups);




  if (!crimeCityOptions) {
    requestShowNotification({
      message: formatMessage({ id: 'lookupNotFoundCrimeCity' }),
      type: "is-danger"
    });
  }
  if (!crimeRegionOptions) {
    requestShowNotification({
      message: formatMessage({ id: 'lookupNotFoundCrimeRegion' }),
      type: "is-danger"
    });
  }
  if (!codeOptions) {
    requestShowNotification({
      message: formatMessage({ id: 'lookupNotFoundEventClassCode' }),
      type: "is-danger"
    });
  }





  if (rowId && rowId === undefined || rowId === "abcd") {
    MatchedUserInfo = ""
  }
  return (
    <Fragment>
      <div className="crime-data">
        <div className="columns">
          <div className="column">
            <div className="control">
              <Label
                htmlFor="bioname"
                text={formatMessage({ id: "crimePlace" })}
              />
              <Input
                type="text"
                className="input"
                id="crimePlace"
                maxLength="25"
                onChange={e => {
                  handleInputChange(e, "crimePlace");
                }}
                placeholder={formatMessage({ id: "crimePlace" })}
                value={
                  data && data.crimePlace
                    ? data.crimePlace
                    : data.crimePlace === ""
                      ? ""
                      : MatchedUserInfo.person &&
                        MatchedUserInfo.person.extendedData
                        ? Array.isArray(MatchedUserInfo.person.extendedData) && MatchedUserInfo.person.extendedData.find(
                          data => data.key === "Crime Place"
                        )
                          ? Array.isArray(MatchedUserInfo.person.extendedData) && MatchedUserInfo.person.extendedData.find(
                            data => data.key === "Crime Place"
                          ).value
                          : ""
                        : ""
                }
              />
            </div>
          </div>


          {/*
          <div className="column">
            <div className="control">
              <Label
                htmlFor="crimeType"
                text={formatMessage({ id: "crimeType" })}
              />
              <Select
                defaultValue={
                  MatchedUserInfo.person && MatchedUserInfo.person.extendedData
                    ? MatchedUserInfo.person.extendedData.find(
                        data => data.key === "Crime Type"
                      )
                      ? MatchedUserInfo.person.extendedData.find(
                          data => data.key === "Crime Type"
                        ).value
                      : formatMessage({ id: "crimeType" })
                    : formatMessage({ id: "crimeType" })
                }
                className={"level-right "}
                formatMessage={formatMessage}
                name={formatMessage({ id: "crimeType" })}
                options={crimeTypeOptions}
                onChange={e => {
                  handleInputChange(e, "crimeType");
                }}
              />
            </div>
          </div>
          */}



          <div className="column">
            <div className="control">
              <Label
                htmlFor="eventCode"
                text={formatMessage({ id: "eventClassCode" })}
              />
              <Select
                className={"level-right "}
                formatMessage={formatMessage}
                name={formatMessage({ id: "eventClassCode" })}
                options={codeOptions}
                defaultValue={`${data.eventCode}|${data.classCode}`}
                onChange={e => {
                  handleInputChange(e, "eventClassCode");
                }}
              />
            </div>
          </div>


          {/*
          <div className="column">
            <div className="control">
              <Label
                htmlFor="classCode"
                text={formatMessage({ id: "classCode" })}
              />
              <Select
                defaultValue={
                  MatchedUserInfo.person && MatchedUserInfo.person.extendedData
                    ? MatchedUserInfo.person.extendedData.find(
                        data => data.key === "Class Code"
                      )
                      ? MatchedUserInfo.person.extendedData.find(
                          data => data.key === "Class Code"
                        ).value
                      : formatMessage({ id: "classCode" })
                    : formatMessage({ id: "classCode" })
                }
                className={"level-right "}
                formatMessage={formatMessage}
                name={formatMessage({ id: "classCode" })}
                options={ codeOptions }
                onChange={e => {
                  handleInputChange(e, "classCode");
                }}
              />
            </div>
          </div>
          */}





          <div className="column">
            <div className="control">
              <Label
                htmlFor="crimeRegion"
                text={formatMessage({ id: "crimeRegion" })}
              />
              <Select
                defaultValue={data.crimeRegion}
                className={"level-right "}
                formatMessage={formatMessage}
                name={formatMessage({ id: "crimeRegion" })}
                options={crimeRegionOptions}
                onChange={e => {
                  handleInputChange(e, "crimeRegion");
                }}
              />
            </div>
          </div>

          <div className="column">
            <div className="control">
              <Label
                htmlFor="crimeCity"
                text={formatMessage({ id: "crimeCity" })}
              />
              <Select
                defaultValue={data.crimeCity}
                className={"level-right "}
                formatMessage={formatMessage}
                name={formatMessage({ id: "crimeCity" })}
                options={crimeCityOptions}
                onChange={e => {
                  handleInputChange(e, "crimeCity");
                }}
              />
            </div>
          </div>

        </div>
        <div className="columns">
          <div className="column">
            <div className="control">
              <Label
                htmlFor="crimeDate"
                text={formatMessage({ id: "crimeDate" })}
              />

              <HijriDatePicker
                className="input"
                id="crimeDate"
                placeholder={formatMessage({ id: "crimeDate" })}
                value={
                  (data.crimeDate ? data.crimeDate :
                    MatchedUserInfo && MatchedUserInfo.person && MatchedUserInfo.person.extendedData && Array.isArray(MatchedUserInfo.person.extendedData) &&
                      MatchedUserInfo.person.extendedData.find(
                        data => data.key === "Date of Crime"
                      )
                      ? MatchedUserInfo && MatchedUserInfo.person && Array.isArray(MatchedUserInfo.person.extendedData) && MatchedUserInfo.person.extendedData.find(
                        data => data.key === "Date of Crime"
                      ).value
                      : null
                  )
                }
                // value="15/10/1433"
                onChange={e => {
                  // handleInputChange(e, "crimeDate");
                  handleInputChange({ target: { value: e } }, "crimeDate");
                }}
              />
            </div>
          </div>
          <div className="column is-two-fifths">
            <div className="control">
              <Label
                htmlFor="caseInvestigationDepartment"
                text={formatMessage({ id: "caseInvestigationDepartment" })}
              />
              <Input
                type="text"
                className="input"
                id="caseInvestigationDepartment"
                // maxLength="10"
                onChange={e => {
                  handleInputChange(e, "caseInvestigationDepartment");
                }}
                placeholder={formatMessage({ id: "caseInvestigationDepartment" })}
                value={
                  data.caseInvestigationDepartment
                    ? data.caseInvestigationDepartment
                    : data.caseInvestigationDepartment === ""
                      ? ""
                      : MatchedUserInfo.person &&
                        MatchedUserInfo.person.extendedData
                        ? Array.isArray(MatchedUserInfo.person.extendedData) && MatchedUserInfo.person.extendedData.find(
                          data => data.key === "Investigation Department"
                        )
                          ? Array.isArray(MatchedUserInfo.person.extendedData) && MatchedUserInfo.person.extendedData.find(
                            data => data.key === "Investigation Department"
                          ).value
                          : ""
                        : ""
                }
              />
            </div>
          </div>
          <div className="column">
            <div className="control">
              <Label
                htmlFor="casefilenumber"
                text={formatMessage({
                  id: "casefilenumber" //Case File Number
                })}
              />
              <Input
                type="text"
                className="input"
                id="casefilenumber"
                maxLength="10"
                onChange={e => {
                  handleInputChange(e, "caseFileNumber");
                }}
                placeholder={formatMessage({ id: "casefilenumber" })}
                value={
                  data.caseFileNumber
                    ? data.caseFileNumber
                    : data.caseFileNumber === ""
                      ? ""
                      : MatchedUserInfo.person &&
                        MatchedUserInfo.person.extendedData
                        ? Array.isArray(MatchedUserInfo.person.extendedData) && MatchedUserInfo.person.extendedData.find(
                          data => data.key === "Case File Number"
                        )
                          ? Array.isArray(MatchedUserInfo.person.extendedData) && MatchedUserInfo.person.extendedData.find(
                            data => data.key === "Case File Number"
                          ).value
                          : ""
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
                htmlFor="crimeNoteLong"
                text={formatMessage({ id: "crimeNoteLong" })}
              />
              <Input
                type="text"
                className="input"
                id="crimeNoteLong"
                maxLength="50"
                onChange={e => {
                  handleInputChange(e, "crimeNoteLong");
                }}
                placeholder={formatMessage({ id: "crimeNoteLong" })}
                value={
                  data.crimeNoteLong
                    ? data.crimeNoteLong
                    : data.crimeNoteLong === ""
                      ? ""
                      : MatchedUserInfo.person &&
                        MatchedUserInfo.person.extendedData
                        ? Array.isArray(MatchedUserInfo.person.extendedData) && MatchedUserInfo.person.extendedData.find(
                          data => data.key === "Note"
                        )
                          ? Array.isArray(MatchedUserInfo.person.extendedData) && MatchedUserInfo.person.extendedData.find(
                            data => data.key === "Note"
                          ).value
                          : ""
                        : ""
                }
              />
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="space-fill" />
        </div>
      </div>
    </Fragment>
  );
}
// export default CriminalaData;
export default connect(
  () => ({}),
  {
    requestShowNotification
  }
)(CriminalaData);
