import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Image from "../../../Image/Image";
import Button from "../../../Button/Button";
import Icon from "../../../Icon/Icon";
import Label from "../../../Label/Label";
import Subtitle from "../../../Title/Subtitle";
import Title from "../../../Title/Title";
import {
  customSearchSelectedPersonSelector,
  customSearchResponseSelector,
  matchedRowSelector
} from "../../../../selectors/customSearch";
// import { formatDate } from '../../../../utils/date';
import DateDisplay from "../../../../utils/date";
import _ from 'lodash';


const findById = (lookups, type, id, locale) => {
  if (isNaN(id)) {
    return id;
  }

  const recs = lookups.find(item => item.lookupName === type);
  const language = locale === "en" ? "englishText" : "arabicText";
  const output = recs && recs.items && recs.items.find(item => item.id == id);

  if (output && output[language]) {
    return output[language];
  } else {
    const output = recs && recs.items[id];
    if (output && output[language]) {
      return output[language];
    } else {
      return "";
    }
  }
};

const findLookupCrimeType = (crimeType, type, value) => {
  if (value) {
    value = parseInt(value);

    let _type = "";
    let _desc = "";
    if (type == "CrimeEvent") {
      _type = "eventCode";
      _desc = "eventDesc";
    } else {
      _type = "classCode";
      _desc = "classDesc";
    }

    const recs =
      crimeType &&
      crimeType.lookups.find(item => {
        return item[_type] === value;
      });

    if (recs) {
      return recs[_desc];
    } else {
      return value; // return the default value
    }
  }
  return;
};

const calculateDays = (days, months, years) => {
  let total = 0;
  total = total + parseInt(days);
  total = total + parseInt(months) * 30;
  total = total + parseInt(years) * 365;
  if (isNaN(total)) {
    // return `0 Days`;
    return 0;
  }

  return `${total} Days`;
};

const findExtendedData = (key, data) => {
  const obj = data.find(data => data.key === key);
  if (obj) {
    return obj.value || "";
  }
  return "";
};

export const CustomSearchVerifyContent = ({
  formatMessage,
  history,
  customSearchPersonData,
  database,
  response,
  lookups,
  locale,
  lookupCrimeTypes,
  matchedRowID
}) => {
  let idType = "";
  let idIssueDate = "";
  let idIssueDateGreg = "";
  const lang = localStorage.getItem("lang") || "en";


  // const biometricImage = `data:image/jpeg;base64,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`;



  // console.log("CustomSearchVerifyContent::customSearchPersonData",customSearchPersonData);
  console.log("CustomSearchVerifyContent::response",response);



let selectedRow = matchedRowID || 0;
console.log("selectedRow",selectedRow);


let latentInfoOfUser = null;
response.matchPersons.map( person => {
  if ( person && person.persons ) {
    person.persons.map( user => {
      if ( user.extendedData && user.extendedData.length > 0 ) {
        if ( latentInfoOfUser === null ) {
          latentInfoOfUser = user.extendedData;
        }
      }
    });
  }
});


const currPerson = response.matchPersons[selectedRow];

if ( currPerson && currPerson.persons && currPerson.persons[0] && currPerson.persons[0].extendedData && currPerson.persons[0].extendedData.length > 0 ) {
  latentInfoOfUser = currPerson.persons[0].extendedData;
}

console.log("latentInfoOfUser",latentInfoOfUser); 




const findBiometricByID = (id) => {
  let _data = null;

  response.fingerprintMatches.map( person => {
    if ( person.matchInfos ) {
      const data = _.find(person.matchInfos, { matchPersonTag: id });
      if ( data && Object.keys(data).length > 0 ) {
         _data = data;
      }
    }
  });

  return _data;
}



let currentUserBio = [];
// const currPerson = response.matchPersons[selectedRow];
if ( currPerson && currPerson.persons && currPerson.persons.length > 0 ) {
  currPerson.persons.map( user => {
    const bio = findBiometricByID(currPerson.tag);
    if ( bio && Object.keys(bio).length > 0 ) {
      currentUserBio.push(bio);
    }
  });
}
console.log("currentUserBio",currentUserBio);


const selectedCurrentPerson = currPerson && currPerson.persons[0] || {};















  if (
    customSearchPersonData &&
    customSearchPersonData.persons &&
    customSearchPersonData.persons[0].extendedData.length > 0
  ) {
    customSearchPersonData.persons[0].extendedData.map(data => {
      if (data.key === "ID Type") {
        idType = findById(lookups, "ID Type", data.value, locale);
      }
      if (data.key === "ID Issued Date") {
        idIssueDate = data.value;
      }
      if (data.key === "Gregorian ID Issued Date") {
        idIssueDateGreg = data.value;
      }
    });
  }
  function getDays(totalDays) {
    let Years = "",
      Months = "",
      Days = "";
    Years = totalDays / 365;
    Years = parseInt(Years);
    if (Years > 0) {
      Years = Years + " " + formatMessage({ id: "year" }) + " ";
    } else {
      Years = "";
    }
    Months = (totalDays % 365) / 30;
    Months = parseInt(Months);
    if (Months > 0) {
      Months = Months + " " + formatMessage({ id: "month" }) + " ";
    } else {
      Months = "";
    }
    Days = (totalDays % 365) % 30;
    Days = parseInt(Days);
    if (Days > 0) {
      Days = Days + " " + formatMessage({ id: "days" });
    } else {
      Days = "";
    }
    return Years + Months + Days;
  }

  const mugshot = "";
  const person = response.matchPersons[0].persons[0];
  let latentInfo = [];
  if (database === "Latent" ) {
    latentInfo =
      response &&
      response.matchPersons &&
      response.matchPersons.length > 0 &&
      response.matchPersons[0].additionalMatchInfos &&
      response.matchPersons[0].additionalMatchInfos.length > 0 &&
      response.matchPersons[0].additionalMatchInfos[0].additionalMatchDatas;
  }
  

  const getLatentValue = key => {
    const data = _.find(latentInfoOfUser, { key: key });
    if (data && data.value) {
      return data.value;
    }
    return;


    // if (latentInfo && latentInfo.length > 0) {
    //   const data = _.find(latentInfo, { key: key });
    //   if (data && data.value) {
    //     return data.value;
    //   }
    // }
    // return;
  };

  const getNameFromLookup = (key, value) => {
    let name = "";
    name =
      lookups &&
      Array.isArray(lookups) &&
      lookups.find(data => data.lookupName === key) &&
      lookups
        .find(data => data.lookupName === key)
        .items.filter(item => item.id == value)
        .map(item => (lang === "en" ? item.englishText : item.arabicText))[0];
    if (name) {
      return name;
    } else {
      return value;
    }
  };

  const displayCaseTypeFields = person => {
    const crimeCodes = findExtendedData("Crime Codes", person.extendedData);
    let fields = JSON.parse(crimeCodes);

    return (
      <Fragment>
        {fields &&
          fields.length > 0 &&
          fields.map((presentObj, index) => {
            return (
              <Fragment key={index}>
                <div className="criminal-class">
                  <div className="leftdiv">
                    <Label
                      style={{ fontWeight: "normal" }}
                      text={findLookupCrimeType(
                        lookupCrimeTypes,
                        "CrimeClass",
                        presentObj.CrimeClass
                      )}
                    />
                    <Label
                      style={{ marginLeft: 10, fontWeight: "bold" }}
                      text={findLookupCrimeType(
                        lookupCrimeTypes,
                        "CrimeEvent",
                        presentObj.CrimeEvent
                      )}
                    />
                  </div>
                </div>
              </Fragment>
            );
          })}
      </Fragment>
    );

    return <div />;
  };


  const selectedPerson = currPerson.persons[0];

  return (
    <div className="verify-content">
      <div className="record-center">
        <div className="columns">
          {selectedCurrentPerson.mugshot && selectedCurrentPerson.mugshot.image && (
            <div className="column" style={{ padding: 0, marginRight: 10 }}>
              <Image
                src={"data:image/png;base64," + selectedCurrentPerson.mugshot.image}
                id="mugshotImg1"
              />
            </div>
          )}
          {database === "Latent" && currPerson && currPerson.persons[0] && currPerson.persons[0].extendedData && currPerson.persons[0].extendedData.length > 0 && currPerson.persons[0].extendedData.length <= 20 ? (
            <Fragment style={{ border: "1px solid black" }}>
              {/* <div style={{border:"1px solid black"}}> */}
              <div
                className="column is-two-fifths"
                style={{ border: "1px solid black", borderRight: "none" }}
              >
                <div className="print-content">
                  <div className="leftdiv">
                    <Label text={formatMessage({ id: "LatentID" })} />
                  </div>
                  <div className="right">
                    <Label text={getLatentValue("Latent Identifier")} />
                  </div>
                </div>

                <div className="print-content">
                  <div className="leftdiv">
                    <Label text={formatMessage({ id: "classCode" })} />
                  </div>
                  <div className="right">
                    <Label
                      text={findLookupCrimeType(
                        lookupCrimeTypes,
                        "CrimeClass",
                        getLatentValue("Class Code")
                      )}
                    />
                  </div>
                </div>
                <div className="print-content">
                  <div className="leftdiv">
                    <Label text={formatMessage({ id: "eventCode" })} />
                  </div>
                  <div className="right">
                    <Label
                      text={findLookupCrimeType(
                        lookupCrimeTypes,
                        "CrimeEvent",
                        getLatentValue("Event Code")
                      )}
                    />
                  </div>
                </div>

                <div className="print-content">
                  <div className="leftdiv">
                    <Label
                      text={formatMessage({
                        id: "caseInvestigationDepartment"
                      })}
                    />
                  </div>
                  <div className="right">
                    <Label text={getLatentValue("Investigation Department")} />
                  </div>
                </div>
                <div className="print-content">
                  <div className="leftdiv">
                    <Label text={formatMessage({ id: "crimeNoteLong" })} />
                  </div>
                  <div className="right">
                    <Label text={getLatentValue("Note")} />
                  </div>
                </div>
              </div>
              <div
                className="column is-two-fifths"
                style={{ border: "1px solid black", borderLeft: "none" }}
              >
                <div className="print-content">
                  <div className="leftdiv">
                    <Label text={formatMessage({ id: "crimePlace" })} />
                  </div>
                  <div className="right">
                    <Label text={getLatentValue("Crime Place")} />
                  </div>
                </div>
                <div className="print-content">
                  <div className="leftdiv">
                    <Label text={formatMessage({ id: "crimeCity" })} />
                  </div>
                  <div className="right">
                    <Label
                      text={getNameFromLookup(
                        "LatentCrimeCity",
                        getLatentValue("City")
                      )}
                    />
                  </div>
                </div>
                <div className="print-content">
                  <div className="leftdiv">
                    <Label text={formatMessage({ id: "crimeRegion" })} />
                  </div>
                  <div className="right">
                    <Label
                      text={getNameFromLookup(
                        "LatentCrimeRegion",
                        getLatentValue("Region")
                      )}
                    />
                  </div>
                </div>
                <div className="print-content">
                  <div className="leftdiv">
                    <Label text={formatMessage({ id: "crimeDate" })} />
                  </div>
                  <div className="right">
                    <Label text={getLatentValue("Date of Crime")} />
                  </div>
                  {/* <div className="right">
                    <Label text={getLatentValue("Gregorian Date of Crime")} />
                  </div> */}
                </div>
                <div className="print-content">
                  <div className="leftdiv">
                    {/* <Label text={formatMessage({ id: "caseFileNumber" })} /> */}
                  </div>
                  <div className="right">
                    <Label text={getLatentValue("Gregorian Date of Crime")} />
                  </div>
                </div>
                <div className="print-content">
                  <div className="leftdiv">
                    <Label text={formatMessage({ id: "casefilenumber" })} />
                  </div>
                  <div className="right">
                    <Label text={getLatentValue("Case File Number")} />
                  </div>
                </div>
              </div>
              {/* </div> */}
            </Fragment>
          ) : (
            <div className="column is-three-fifths">
              <div className="print-content">
                <div className="leftdiv">
                  <Label text={formatMessage({ id: "name" })} />
                </div>
                <div className="right">
                  <Label text={selectedPerson.name} />
                </div>
              </div>
              {database !== "Latent" && (
                <div className="print-content">
                  <div className="leftdiv">
                    <Label text={formatMessage({ id: "SAMIS ID" })} />
                  </div>
                  <div className="right">
                    <Label text={selectedPerson.samisid} />
                  </div>
                </div>
              )}

              <div className="print-content">
                <div className="leftdiv">
                  <Label text={formatMessage({ id: "gender" })} />
                </div>
                <div className="right">
                  <Label text={selectedPerson.gender} />
                </div>
              </div>
              <div className="print-content">
                <div className="leftdiv">
                  <Label text={formatMessage({ id: "dob" })} />
                </div>
                <div className="right">
                  <Label
                    text={
                      <DateDisplay
                        hijri={selectedPerson.dob}
                        gregorian={selectedPerson.gregDOB}
                        time={false}
                        invalid={true}
                        validGreg={true}
                      />
                    }
                  />
                </div>
              </div>
              <div className="print-content">
                <div className="leftdiv">
                  <Label text={formatMessage({ id: "nationality" })} />
                </div>
                <div className="right">
                  <Label
                    text={findById(
                      lookups,
                      "Nationality",
                      selectedPerson.nationality,
                      locale
                    )}
                  />
                </div>
              </div>

              {idType && (
                <div className="print-content">
                  <div className="leftdiv">
                    <Label text={formatMessage({ id: "idType" })} />
                  </div>
                  <div className="right">
                    <Label text={idType} />
                  </div>
                </div>
              )}

              {idIssueDate && (
                <div className="print-content">
                  <div className="leftdiv">
                    <Label text={formatMessage({ id: "issueDate" })} />
                  </div>
                  <div className="right">
                    <Label
                      text={
                        <DateDisplay
                          hijri={idIssueDate}
                          gregorian={idIssueDateGreg}
                          time={false}
                          invalid={true}
                        />
                      }
                    />
                  </div>
                </div>
              )}

              {database === "Civil" ? (
                ""
              ) : (
                <Fragment>
                  <div className="print-content">
                    <div className="leftdiv">
                      <Label text={formatMessage({ id: "policeFileNumber" })} />
                    </div>
                    <div className="right">
                      <Label text={selectedPerson.fileNumber} />
                    </div>
                  </div>
                </Fragment>
              )}
            </div>
          )}
        </div>
      </div>

      {database === "Criminal" ? (
        <Fragment key={index}>
          <div className="information">
            <Label text={formatMessage({ id: "recordHistory" })} />
            <div className="crime-block">
              <Title is="6" text={formatMessage({ id: "crimeCodes" })} />

              <div className="punishment">{displayCaseTypeFields(selectedPerson)}</div>

              <Title
                is="6"
                text={formatMessage({ id: "judgementInformation" })}
              />

              <div className="punishment">
                <div className="print-content">
                  <div className="leftdiv">
                    <Label text={formatMessage({ id: "prison" })} />
                  </div>
                  <div className="right">
                    <Label
                      text={calculateDays(
                        findExtendedData("Jail Day Count", selectedPerson.extendedData),
                        findExtendedData(
                          "Jail Month Count",
                          selectedPerson.extendedData
                        ),
                        findExtendedData("Jail Year Count", selectedPerson.extendedData)
                      )}
                    />
                  </div>

                  <div className="left1">
                    <Label text={formatMessage({ id: "travelBan" })} />
                  </div>
                  <div className="right1">
                    <Label
                      // text={ getDays( findExtendedData( "Travel Ban", person.extendedData ) ) }
                      text={calculateDays(
                        findExtendedData(
                          "Travel Ban Day Count",
                          selectedPerson.extendedData
                        ),
                        findExtendedData(
                          "Travel Ban Month Count",
                          selectedPerson.extendedData
                        ),
                        findExtendedData(
                          "Travel Ban Year Count",
                          selectedPerson.extendedData
                        )
                      )}
                    />
                  </div>
                </div>

                <div className="print-content">
                  <div className="leftdiv">
                    <Label text={formatMessage({ id: "deportFinal" })} />
                  </div>
                  <div className="right">
                    <Label
                      text={
                        findExtendedData(
                          "Deport Final",
                          selectedPerson.extendedData
                        ) === "True"
                          ? "Yes"
                          : "No"
                      }
                    />
                  </div>
                  <div className="left1">
                    <Label text={formatMessage({ id: "deportation" })} />
                  </div>
                  <div className="right1">
                    <Label
                      text={calculateDays(
                        findExtendedData(
                          "Deport Day Count",
                          selectedPerson.extendedData
                        ),
                        findExtendedData(
                          "Deport Month Count",
                          selectedPerson.extendedData
                        ),
                        findExtendedData(
                          "Deport Year Count",
                          selectedPerson.extendedData
                        )
                      )}
                    />
                  </div>
                </div>
                <div className="print-content">
                  <div className="leftdiv">
                    <Label text={formatMessage({ id: "fine" })} />
                  </div>
                  <div className="right">
                    <Label
                      text={findExtendedData("Fine", selectedPerson.extendedData)}
                    />
                  </div>
                  <div className="left1">
                    <Label text={formatMessage({ id: "exiling" })} />
                  </div>
                  <div className="right1">
                    <Label
                      text={calculateDays(
                        findExtendedData(
                          "Exiling Day Count",
                          selectedPerson.extendedData
                        ),
                        findExtendedData(
                          "Exiling Month Count",
                          selectedPerson.extendedData
                        ),
                        findExtendedData(
                          "Exiling Year Count",
                          selectedPerson.extendedData
                        )
                      )}
                    />
                  </div>
                </div>
                <div className="print-content">
                  <div className="leftdiv">
                    <Label
                      text={formatMessage({
                        id: "criminalLibel"
                      })}
                    />
                  </div>
                  <div className="right">
                    <Label
                      text={
                        findExtendedData(
                          "Criminal Libel",
                          selectedPerson.extendedData
                        ) === "True"
                          ? "Yes"
                          : "No"
                      }
                    />
                  </div>
                  <div className="left1">
                    <Label text={formatMessage({ id: "covenant" })} />
                  </div>
                  <div className="right1">
                    <Label
                      text={
                        findExtendedData("Covenant", selectedPerson.extendedData) ===
                        "True"
                          ? "Yes"
                          : "No"
                      }
                    />
                  </div>
                </div>
                <div className="print-content">
                  <div className="leftdiv">
                    <Label
                      text={formatMessage({
                        id: "judgementDate"
                      })}
                    />
                  </div>
                  <div className="right">
                    <Label
                      text={
                        <DateDisplay
                          hijri={findExtendedData(
                            "Judgement Date",
                            selectedPerson.extendedData
                          )}
                          gregorian={findExtendedData(
                            "Gregorian Judgement Date",
                            selectedPerson.extendedData
                          )}
                          time={false}
                          invalid={true}
                        />
                      }
                    />
                  </div>
                  <div className="left1">
                    <Label
                      text={formatMessage({
                        id: "arrestDate"
                      })}
                    />
                  </div>
                  <div className="right1">
                    <Label
                      text={
                        <DateDisplay
                          hijri={findExtendedData(
                            "Arrest Date",
                            selectedPerson.extendedData
                          )}
                          gregorian={findExtendedData(
                            "Gregorian Arrest Date",
                            selectedPerson.extendedData
                          )}
                          time={false}
                          invalid={true}
                        />
                      }
                    />
                  </div>
                </div>

                <div className="print-content">
                  <div className="leftdiv">
                    <Label
                      text={formatMessage({
                        id: "judgementIssuer"
                      })}
                    />
                  </div>
                  <div className="right">
                    <Label
                      text={findExtendedData(
                        "Judgement Issuer",
                        selectedPerson.extendedData
                      )}
                    />
                  </div>
                  <div className="left1">
                    <Label
                      text={formatMessage({
                        id: "judgementNumber"
                      })}
                    />
                  </div>
                  <div className="right1">
                    <Label
                      text={findExtendedData(
                        "Judgement Number",
                        selectedPerson.extendedData
                      )}
                    />
                  </div>
                </div>

                <div className="print-content">
                  <div className="leftdiv">
                    <Label
                      text={formatMessage({
                        id: "haddLashing"
                      })}
                    />
                  </div>
                  <div className="right">
                    <Label
                      text={findExtendedData(
                        "Hadd Lashing",
                        selectedPerson.extendedData
                      )}
                    />
                  </div>
                  <div className="left1">
                    <Label
                      text={formatMessage({
                        id: "tazeerLashing"
                      })}
                    />
                  </div>
                  <div className="right1">
                    <Label
                      text={findExtendedData(
                        "Tazeer Lashing",
                        selectedPerson.extendedData
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      ) : (
        ""
      )}





      { currentUserBio && currentUserBio.length > 0 &&
        <div className="bio--container">
          <div className="biometric-sec-heading">{ formatMessage({ id: selectedCurrentPerson.name }) }</div>

          <div className="all-bio-images">
          { currentUserBio && currentUserBio.map( (user, index) => {
            console.log("currentUserBio::user",user)
            return(
              <div key={index} className="biometric-container">
                <a title={ formatMessage({ id: "download" }) } href={`data:image/jpeg;base64,${user.image}`} download="image.png"><img src={`data:image/jpeg;base64,${user.image}`} /></a>
                <div className="biometric-heading">{ formatMessage({ id: user.fingerprintPosition || "Unknown Finger" }) }</div>
              </div>
            )
          }) }
          </div>

        </div>
      }




    </div>
  );
};

const mapState = state => ({
  customSearchPersonData: customSearchSelectedPersonSelector(state),
  response: customSearchResponseSelector(state),
  lookups: state.auth.lookups,
  lookupCrimeTypes: state.auth.lookupCrimeTypes,
  locale: state.locale.lang,
   matchedRowID: matchedRowSelector(state),
});
export default connect(
  mapState,
  {}
)(CustomSearchVerifyContent);



/*

                <div className="biometric-heading">{ formatMessage({ id: fingerprintPosition || "Unknown Finger" }) }</div>
                <a title={ formatMessage({ id: "download" }) } href={biometricImage} download="image.png"><img src={biometricImage} /></a>



  let fingerprintImage = "";
  let fingerprintPosition = "";
  if ( response && response.fingerprintMatches && response.fingerprintMatches.length > 0 && response.fingerprintMatches[0] && response.fingerprintMatches[0].matchInfos && response.fingerprintMatches[0].matchInfos[0] && response.fingerprintMatches[0].matchInfos[0].image ) {
    fingerprintImage = response.fingerprintMatches[0].matchInfos[0].image;
    fingerprintPosition = response.fingerprintMatches[0].matchInfos[0].fingerprintPosition || "";
  }
  const biometricImage = `data:image/jpeg;base64,${fingerprintImage}`;



      { fingerprintImage &&
        <div className="biometric-container">
          <div className="biometric-heading">{ formatMessage({ id: fingerprintPosition || "Unknown Finger" }) }</div>
          <a title={ formatMessage({ id: "download" }) } href={biometricImage} download="image.png"><img src={biometricImage} /></a>
        </div>
      }

*/