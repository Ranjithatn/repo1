import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import Modal from "../Modal";
import Button from "../../Button/Button";
import Image from "../../Image/Image";
import { requestHideModal } from "../../../actions/modal";
import { requestStartPrint, requestStopPrint } from "../../../actions/jobs";
import Label from "../../Label/Label";
import Switch from "../../Switch/Switch";
import Title from "../../Title/Title";
import Select from "../../Select/Select";
import InputField from "../../InputField/InputField";
import Textarea from "../../Textarea/Textarea";
import "./CriminalPrintModal.scss";
import DateDisplay, { formatDate } from "../../../utils/date";
import saveLog from "../../../utils/logs";


// const html2canvas = require("html2canvas");
// const jsPDF = require("jspdf");
let regex = /($[a-z])|[A-Z][^A-Z]+/g;
import {
  tenprintPersonModalSelector,
  MatchedPersonInfoSelector,
  SelectedMatchSelector,
  MatchedUserRowIDSelector,
  tenprintVerifyLeftFingersSelector,
  tenprintVerifyRightFingersSelector
} from "../../../selectors/tenprint";
import {
  ActionHeaderSelector,
  selectedJobSelector,
  selectedTcnSelector,
  printSelector
} from "../../../selectors/jobs";

import jsPDF from "jspdf";
import domtoimage from "dom-to-image";
// import pdf from "html-pdf";

// const phantomjs = require('phantomjs-prebuilt');
// const phantomjsBinPath = phantomjs.path;

// const electron = window.require('electron');
// const { app } = window.require('electron').remote;
// const { BrowserWindow } = window.require('electron');

const { app, BrowserWindow } = window.require("electron").remote;
import fs from "fs";
import path from "path";
import { tempPath } from "../../../utils/electron";

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
  console.log("findLookupCrimeType", crimeType);
  value=parseInt(value);
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
  const item = data.filter(item => item.key === key);
  // console.log("item",item);
  return (item && item[0] && item[0].value) || "";
};

export class CriminalPrintModal extends Component {
  constructor(props) {
    super(props);
    this.printDocument = this.printDocument.bind(this);
    this.exportDocument = this.exportDocument.bind(this);
    this.printContentToPDF = this.printContentToPDF.bind(this);
  }

  exportDocument() {
    const wrapper = document.getElementById("printRecord");
    window.print();
  }

  printContentToPDF() {
    // console.log("printContentToPDF");
    console.log("tempPath", tempPath);

    const htmlContent = document.getElementById("printRecord1").outerHTML;
    const html =
      "data:text/html;charset=UTF-8," + encodeURIComponent(htmlContent);

    let window_to_PDF = new BrowserWindow({ show: false });
    window_to_PDF.loadURL(html);

    const option = {
      landscape: false,
      printBackground: true,
      pageSize: "A4"
    };

    setTimeout(() => {
      window_to_PDF.webContents.printToPDF(option, function(err, data) {
        if (err) {
          // console.log("err", err);
          return;
        }
        try {
          console.log("try", err);
          const filePathGenerated = path.join(tempPath, "print-pdf.pdf");

          if (!fs.existsSync(tempPath)) {
            fs.mkdirSync(tempPath);
          }

          saveLog({
            name: 'criminal print modal',
            tempPath: tempPath,
            htmlContent: htmlContent,
            option: option,
            filePathGenerated: filePathGenerated,
            data: data,
          }, true);

          fs.writeFileSync(filePathGenerated, data);
          document.getElementById("download-pdf-file").click();
        } catch (err) {
          console.log("catch err", err);
          saveLog({
            name: 'criminal print modal',
            tempPath: tempPath,
            htmlContent: htmlContent,
            option: option,
            err: err,
          }, true);

        }
      });
    }, 1000);

    // console.log("outside timeout");
  }

  async printDocument() {
    // console.log("printing..");
    this.props.requestStartPrint();

    setTimeout(async () => {
      const node = document.getElementById("printRecord");
      const img = await domtoimage.toPng(node);
      // console.log("generated img length", img.length);

      const doc = new jsPDF();

      const width = doc.internal.pageSize.width;
      let height = doc.internal.pageSize.height;
      // pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
      if (img.length < 105025) {
        height = height / 2.5;
      }
      doc.addImage(img, "PNG", 0, 0, width, height);
      doc.save("user-record.pdf");
      this.props.requestStopPrint();
    }, 300);

    return;

    // 1
    // const specialElementHandlers = {
    //   '#bypassme': function(element, renderer) { return true; },
    //   '#editor': function(element, renderer) { return true; },
    // };

    // const body = document.getElementById("printRecord");
    // const doc = new jsPDF()
    //   doc.fromHTML( body , 20, 20, {
    //     elementHandlers: specialElementHandlers,
    //     pagesplit: true,
    //   },
    //   (a,b) => {
    //     console.log("done", a,b);
    //     doc.save('user-record.pdf');
    //   }
    // );

    const wrapper = document.getElementById("printRecord");
    window.print();
    return;
  }

  render() {
    const {
      requestHideModal,
      formatMessage,
      history,
      PersonData,
      ActionHeader,
      JobId,
      Tcn,
      printStart,
      requestStartPrint,
      requestStopPrint,
      lookups,
      locale,
      lookupCrimeTypes
    } = this.props;

    console.log("CriminalPrintModal::this.props", this.props);



// if ( ! PersonData.info.additionalMatchInfos[0] ) {
//   PersonData.info.additionalMatchInfos[0] = {
//     additionalMatchDatas: this.props.latentInfo,
//   }
// }


if ( PersonData.info.persons[0] && PersonData.info.persons[0].extendedData && PersonData.info.persons[0].extendedData.length > 0 ) {
  PersonData.info.additionalMatchInfos[0] = {
    additionalMatchDatas: PersonData.info.persons[0].extendedData,
  }
}


let personHasExtendedData = false;
// if ( PersonData.info.persons[0] && PersonData.info.persons[0].extendedData && PersonData.info.persons[0].extendedData.length > 0 ) { personHasExtendedData = true; }

if ( PersonData.info.persons[0] && PersonData.info.persons[0].mugshot && PersonData.info.persons[0].mugshot.image ) { personHasExtendedData = true; }
console.log("personHasExtendedData",personHasExtendedData);

// if ( PersonData.info.persons[0] && PersonData.info.persons[0].extendedData && PersonData.info.persons[0].extendedData.length > 0 ) { personHasExtendedData = true; }




    let idType = "";
    let idIssueDate = "";
    let idIssueDateGreg = "";

    if (
      PersonData.info.person &&
      PersonData.info.additionalMatchInfos[0].extendedData &&
      PersonData.info.additionalMatchInfos[0].extendedData.length > 0
    ) {
      PersonData.info.additionalMatchInfos[0].extendedData.map(data => {
        if (data.key === "ID Type") {
          idType = data.value;
        }
        if (data.key === "ID Issued Date") {
          idIssueDate = formatDate(data.value);
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

    const getCrimeDate = data => {
      console.log("data", data);
      const date = data && data.find(data => data.key === "Date of Crime");
      // console.log("getCrimeDate date is date", date);
      if (date) {
        return formatDate(new Date(parseInt(date.value))).toString();
      } else {
        return "";
      }
    };

    const displayCaseTypeFields = person => {
      if ( ! person.extendedData || person.extendedData.length === 0 ) { return ""; }
      const crimeCodes = findExtendedData("Crime Codes", person.extendedData);
      let fields = JSON.parse(crimeCodes);

      return (
        <Fragment>
          {fields &&
            fields.length > 0 &&
            fields.map((presentObj, index) => {
              return (
                <Fragment key={index}>
                  <div style={{ display: "flex", width: "100%" }}>
                    <div style={{ display: "flex" }}>
                      <Label
                        style={{ fontSize: "1rem", fontWeight: "400" }}
                        text={findLookupCrimeType(
                          lookupCrimeTypes,
                          "CrimeClass",
                          presentObj.CrimeClass
                        )}
                      />
                      <Label
                        style={{
                          marginLeft: 10,
                          fontSize: "1rem",
                          fontWeight: "600"
                        }}
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

    return (
      <div webpreferences="nativeWindowOpen=yes">
        <Modal
          title={
            ActionHeader === "Search Latent" ||
            ActionHeader === "Custom Search Latent"
              ? formatMessage({ id: "latentPrint" })
              : ActionHeader === "Search Criminal" ||
                ActionHeader === "Custom Search Criminal"
              ? formatMessage({ id: "criminalPrint" })
              : ActionHeader === "Search Civil" ||
                ActionHeader === "Custom Search Civil"
              ? formatMessage({ id: "civilPrint" })
              : ActionHeader === "Custom Search"
              ? formatMessage({ id: "customPrint" })
              : ""
          }
          className="criminal-print-modal"
          requestHideModal={requestHideModal}
          content={
            <Fragment>
              {printStart
                ? PersonData
                  ? PersonData.info
                    ? PersonData.info.persons
                      ? PersonData.info.persons.map((person, index) => {
                          return (
                            <div
                              id="printRecord"
                              style={
                                locale === "ar"
                                  ? { direction: "rtl" }
                                  : { direction: "ltr" },{pageBreakInside:"avoid"}
                              }
                            >
                              {ActionHeader === "Search Criminal" ||
                              ActionHeader === "Custom Search Criminal" ||
                              ActionHeader === "Custom Search Civil" ||
                              ( ActionHeader === "Custom Search Latent" && person && person.mugshot && person.mugshot.image ) ||
                              ActionHeader === "Search Civil" ? (
                                <div className="record-center" id="divToPrint" style={{pageBreakInside:"avoid"}}>
                                  <div className="columns">
                                    <div className="column">
                                      {person.mugshot.image ? (
                                        <Image
                                          src={
                                            person.mugshot
                                              ? person.mugshot.image
                                                ? "data:image/png;base64," +
                                                  person.mugshot.image
                                                : ""
                                              : ""
                                          }
                                          id="mugshotImg1"
                                        />
                                      ) : (
                                        <div
                                          style={{
                                            width: "198px",
                                            background: "#FFF",
                                            height: "166px",
                                            textAlign: "center",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            fontSize: "20px",
                                            border: "1px solid #999"
                                          }}
                                        >
                                          N/A
                                        </div>
                                      )}
                                    </div>
                                    <div className="column is-three-fifths">
                                      <div className="print-content">
                                        <div className="left">
                                          <Label
                                            text={formatMessage({ id: "name" })}
                                          />
                                        </div>
                                        <div className="right">
                                          <Label
                                            text={
                                              person.name ? person.name : ""
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div className="print-content">
                                        <div className="left">
                                          <Label
                                            text={formatMessage({
                                              id: "SAMIS ID"
                                            })}
                                          />
                                        </div>
                                        <div className="right">
                                          <Label
                                            text={
                                              person.samisid
                                                ? person.samisid
                                                : ""
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div className="print-content">
                                        <div className="left">
                                          <Label
                                            text={formatMessage({
                                              id: "gender"
                                            })}
                                          />
                                        </div>
                                        <div className="right">
                                          <Label
                                            text={
                                              person.gender ? person.gender : ""
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div className="print-content">
                                        <div className="left">
                                          <Label
                                            text={formatMessage({ id: "dob" })}
                                          />
                                        </div>
                                        <div className="right">
                                          <Label
                                            text={
                                              person.dob ? (
                                                <DateDisplay
                                                  hijri={person.dob}
                                                  gregorian={person.gregDOB}
                                                  time={false}
                                                  invalid={true}
                                                  validGreg={true}
                                                />
                                              ) : (
                                                ""
                                              )
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div className="print-content">
                                        <div className="left">
                                          <Label
                                            text={formatMessage({
                                              id: "nationality"
                                            })}
                                          />
                                        </div>
                                        <div className="right">
                                          <Label
                                            text={findById(
                                              lookups,
                                              "Nationality",
                                              person.nationality,
                                              locale
                                            )}
                                          />
                                        </div>
                                      </div>
                                      {idType ? (
                                        <Fragment>
                                          <div className="print-content">
                                            <div className="left">
                                              <Label
                                                text={formatMessage({
                                                  id: "idType"
                                                })}
                                              />
                                            </div>
                                            <div className="right">
                                              <Label text={idType} />
                                            </div>
                                          </div>
                                          <div className="print-content">
                                            <div className="left">
                                              <Label
                                                text={formatMessage({
                                                  id: "ID Issue Date"
                                                })}
                                              />
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
                                        </Fragment>
                                      ) : (
                                        ""
                                      )}
                                      <div className="print-content">
                                        <div className="left">
                                          <Label
                                            text={formatMessage({
                                              id: "jobId"
                                            })}
                                          />
                                        </div>
                                        <div className="right">
                                          <Label text={JobId} />
                                        </div>
                                      </div>
                                      {Tcn ? (
                                        <div className="print-content">
                                          <div className="left">
                                            <Label
                                              text={formatMessage({
                                                id: "tcn"
                                              })}
                                            />
                                          </div>
                                          <div className="right">
                                            <Label text={Tcn} />
                                          </div>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                      {person.fileNumber ? (
                                        <div className="print-content">
                                          <div className="left">
                                            <Label
                                              text={formatMessage({
                                                id: "policeFileNumber"
                                              })}
                                            />
                                          </div>
                                          <div className="right">
                                            <Label
                                              text={
                                                person.fileNumber
                                                  ? person.fileNumber
                                                  : ""
                                              }
                                            />
                                          </div>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>
                                  <hr />
                                </div>
                              ) : (
                                ""
                              )}
                              {(ActionHeader === "Search Criminal" ||
                                ActionHeader === "Custom Search Latent" ||
                                ActionHeader === "Custom Search Civil" ||
                                ActionHeader === "Custom Search Criminal") &&
                                PersonData.info.additionalMatchInfos &&
                                PersonData.info.additionalMatchInfos.length >
                                  0 &&
                                PersonData.info.additionalMatchInfos.map(
                                  (obj, index) => {
                                    // additionalMatchDatas
                                    return Array.isArray(obj.extendedData) &&
                                      obj.extendedData.find(
                                        data => data.key === "ID Type"
                                      ) ? (
                                      ""
                                    ) : (
                                      <div className="information" key={index}>
                                        <Label
                                          text={
                                            formatMessage({
                                              id: "recordHistory"
                                            }) +
                                            "  " +
                                            (index + 1)
                                          }
                                        />
                                        <div className="crime-block">
                                          <Title
                                            is="6"
                                            text={formatMessage({
                                              id: "caseType"
                                            })}
                                          />
                                          <div className="punishment">
                                            {obj.extendedData &&
                                              obj.extendedData.length > 0 &&
                                              JSON.parse(
                                                Array.isArray(
                                                  obj.extendedData
                                                ) &&
                                                  obj.extendedData.find(
                                                    data =>
                                                      data.key ===
                                                      "Criminal Class"
                                                  ).value
                                              ).map((presentObj, index) => {
                                                return (
                                                  <Fragment key={index}>
                                                    <div className="criminal-class">
                                                      <div className="left">
                                                        <Label
                                                          text={
                                                            presentObj.CaseType
                                                          }
                                                        />
                                                      </div>
                                                      <div className="right">
                                                        <Label
                                                          text={
                                                            presentObj.Description
                                                          }
                                                        />
                                                      </div>
                                                    </div>
                                                  </Fragment>
                                                );
                                              })}
                                          </div>

                                          <Title
                                            is="6"
                                            text={formatMessage({
                                              id: "punishment"
                                            })}
                                          />
                                          <div className="punishment">
                                            <div className="print-content">
                                              <div className="left">
                                                <Label
                                                  text={formatMessage({
                                                    id: "prison"
                                                  })}
                                                />
                                              </div>
                                              <div className="right">
                                                <Label
                                                  text={
                                                    obj.extendedData.find(
                                                      data =>
                                                        data.key === "Prison"
                                                    )
                                                      ? getDays(
                                                          obj.extendedData.find(
                                                            data =>
                                                              data.key ===
                                                              "Prison"
                                                          ).value
                                                        )
                                                      : ""
                                                  }
                                                />
                                              </div>
                                              <div className="left1">
                                                <Label
                                                  text={formatMessage({
                                                    id: "travelBan"
                                                  })}
                                                />
                                              </div>
                                              <div className="right1">
                                                <Label
                                                  text={
                                                    obj.extendedData.find(
                                                      data =>
                                                        data.key ===
                                                        "Travel Ban"
                                                    )
                                                      ? getDays(
                                                          obj.extendedData.find(
                                                            data =>
                                                              data.key ===
                                                              "Travel Ban"
                                                          ).value
                                                        )
                                                      : ""
                                                  }
                                                />
                                              </div>
                                            </div>

                                            <div className="print-content">
                                              <div className="left">
                                                <Label
                                                  text={formatMessage({
                                                    id: "lashing"
                                                  })}
                                                />
                                              </div>
                                              <div className="right">
                                                <Label
                                                  text={
                                                    obj.extendedData.find(
                                                      data =>
                                                        data.key === "x Lashing"
                                                    )
                                                      ? obj.extendedData.find(
                                                          data =>
                                                            data.key ===
                                                            "x Lashing"
                                                        ).value === "true"
                                                        ? obj.extendedData.find(
                                                            data =>
                                                              data.key ===
                                                              "Lashing"
                                                          ).value
                                                        : ""
                                                      : ""
                                                  }
                                                />
                                              </div>
                                              <div className="left1">
                                                <Label
                                                  text={formatMessage({
                                                    id: "deportation"
                                                  })}
                                                />
                                              </div>
                                              <div className="right1">
                                                <Label
                                                  text={
                                                    obj.extendedData.find(
                                                      data =>
                                                        data.key ===
                                                        "Deportation"
                                                    )
                                                      ? getDays(
                                                          obj.extendedData.find(
                                                            data =>
                                                              data.key ===
                                                              "Deportation"
                                                          ).value
                                                        )
                                                      : ""
                                                  }
                                                />
                                              </div>
                                            </div>
                                            {obj.extendedData.find(
                                              data => data.key === "Final"
                                            ) ? (
                                              obj.extendedData.find(
                                                data => data.key === "Final"
                                              ).value === "true" ? (
                                                <div className="print-content">
                                                  <div className="left">
                                                    <Label
                                                      text={formatMessage({
                                                        id: "final"
                                                      })}
                                                    />
                                                  </div>
                                                  <div className="right">
                                                    <Label text={""} />
                                                  </div>
                                                </div>
                                              ) : (
                                                ""
                                              )
                                            ) : (
                                              ""
                                            )}
                                            <div className="print-content">
                                              <div className="left">
                                                <Label
                                                  text={formatMessage({
                                                    id: "fine"
                                                  })}
                                                />
                                              </div>
                                              <div className="right">
                                                <Label
                                                  text={
                                                    obj.extendedData.find(
                                                      data =>
                                                        data.key === "x Riyals"
                                                    )
                                                      ? obj.extendedData.find(
                                                          data =>
                                                            data.key ===
                                                            "x Riyals"
                                                        ).value === "true"
                                                        ? obj.extendedData.find(
                                                            data =>
                                                              data.key ===
                                                              "Fine"
                                                          ).value
                                                        : ""
                                                      : ""
                                                  }
                                                />
                                              </div>
                                              <div className="left1">
                                                <Label
                                                  text={formatMessage({
                                                    id: "exiling"
                                                  })}
                                                />
                                              </div>
                                              <div className="right1">
                                                <Label
                                                  text={
                                                    obj.extendedData.find(
                                                      data =>
                                                        data.key === "Exiling"
                                                    )
                                                      ? getDays(
                                                          obj.extendedData.find(
                                                            data =>
                                                              data.key ===
                                                              "Exiling"
                                                          ).value
                                                        )
                                                      : ""
                                                  }
                                                />
                                              </div>
                                            </div>
                                            <div className="print-content">
                                              {obj.extendedData.find(
                                                data =>
                                                  data.key === "Criminal Libel"
                                              ) ? (
                                                obj.extendedData.find(
                                                  data =>
                                                    data.key ===
                                                    "Criminal Libel"
                                                ).value === "true" ? (
                                                  <Fragment>
                                                    <div className="left">
                                                      <Label
                                                        text={formatMessage({
                                                          id: "criminalLibel"
                                                        })}
                                                      />
                                                    </div>
                                                    <div className="right">
                                                      <Label text={""} />
                                                    </div>
                                                  </Fragment>
                                                ) : (
                                                  ""
                                                )
                                              ) : (
                                                ""
                                              )}

                                              {obj.extendedData.find(
                                                data => data.key === "Covenant"
                                              ) ? (
                                                obj.extendedData.find(
                                                  data =>
                                                    data.key === "Covenant"
                                                ).value === "true" ? (
                                                  <Fragment>
                                                    <div className="left1">
                                                      <Label
                                                        text={formatMessage({
                                                          id: "covenant"
                                                        })}
                                                      />
                                                    </div>
                                                    <div className="right1">
                                                      <Label text={""} />
                                                    </div>
                                                  </Fragment>
                                                ) : (
                                                  ""
                                                )
                                              ) : (
                                                ""
                                              )}
                                            </div>

                                            <div className="print-content">
                                              <div className="left">
                                                <Label
                                                  text={formatMessage({
                                                    id: "judgementDate"
                                                  })}
                                                />
                                              </div>
                                              <div className="right">
                                                <Label
                                                  text={formatDate(
                                                    obj.extendedData.find(
                                                      data =>
                                                        data.key ===
                                                        "Judgement Date"
                                                    ).value
                                                  )}
                                                />
                                              </div>
                                              <div className="left1">
                                                <Label
                                                  text={formatMessage({
                                                    id: "detentionDate"
                                                  })}
                                                />
                                              </div>
                                              <div className="right1">
                                                <Label
                                                  text={formatDate(
                                                    obj.extendedData.find(
                                                      data =>
                                                        data.key ===
                                                        "Detention Date"
                                                    ).value
                                                  )}
                                                />
                                              </div>
                                            </div>

                                            <div className="print-content">
                                              <div className="left">
                                                <Label
                                                  text={formatMessage({
                                                    id: "judgementIssuer"
                                                  })}
                                                />
                                              </div>
                                              <div className="right">
                                                <Label
                                                  text={
                                                    obj.extendedData.find(
                                                      data =>
                                                        data.key ===
                                                        "Judgement Issuer"
                                                    ).value
                                                  }
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
                                                  text={
                                                    obj.extendedData.find(
                                                      data =>
                                                        data.key ===
                                                        "Judgement Number"
                                                    ).value
                                                  }
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  }
                                )}

                              {ActionHeader === "Search Latent" ||
                              ActionHeader === "Custom Search Latent" ? (
                                <div className="latent-desc">
                                  {PersonData.info ? (
                                    PersonData.info.additionalMatchInfos ? (
                                      PersonData.info.additionalMatchInfos
                                        .length > 0 ? (
                                        PersonData.info.additionalMatchInfos[0]
                                          .additionalMatchDatas ? (
                                          PersonData.info
                                            .additionalMatchInfos[0]
                                            .additionalMatchDatas.length > 0 ? (
                                            PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                              data =>
                                                data.key === "Latent Identifier"
                                            ) ? (
                                              <Fragment>
                                                <div className="latent--main">
                                                  <div className="print-content">
                                                    <div className="left">
                                                      <Label
                                                        text={formatMessage({
                                                          id: "latentidentifier"
                                                        })}
                                                      />
                                                    </div>
                                                    <div className="right">
                                                      <Label
                                                        text={
                                                          PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                            data =>
                                                              data.key ===
                                                              "Latent Identifier"
                                                          ).value
                                                        }
                                                      />
                                                    </div>
                                                    <div className="left1">
                                                      <Label
                                                        text={formatMessage({
                                                          id: "crimePlace"
                                                        })}
                                                      />
                                                    </div>
                                                    <div className="right1">
                                                      <Label
                                                        text={
                                                          PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                            data =>
                                                              data.key ===
                                                              "Crime Place"
                                                          )
                                                            ? PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                                data =>
                                                                  data.key ===
                                                                  "Crime Place"
                                                              ).value
                                                            : ""
                                                        }
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="print-content">
                                                    <div className="left">
                                                      <Label
                                                        text={formatMessage({
                                                          id: "classCode"
                                                        })}
                                                      />
                                                    </div>
                                                    <div className="right">
                                                      <Label
                                                        text={findLookupCrimeType(
                                                          lookupCrimeTypes,
                                                          "CrimeClass",
                                                          PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                            data =>
                                                              data.key ===
                                                              "Class Code"
                                                          )
                                                            ? PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                                data =>
                                                                  data.key ===
                                                                  "Class Code"
                                                              ).value
                                                            : ""
                                                        )}
                                                      />
                                                    </div>
                                                    <div className="left1">
                                                      <Label
                                                        text={formatMessage({
                                                          id: "crimeCity"
                                                        })}
                                                      />
                                                    </div>
                                                    <div className="right1">
                                                      <Label
                                                        text={findById(
                                                          lookups,
                                                          "LatentCrimeCity",
                                                          PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                            data =>
                                                              data.key ===
                                                              "City"
                                                          )
                                                            ? PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                                data =>
                                                                  data.key ===
                                                                  "City"
                                                              ).value
                                                            : "",
                                                          locale
                                                        )}
                                                      />
                                                    </div>
                                                  </div>

                                                  <div className="print-content">
                                                    <div className="left">
                                                      <Label
                                                        text={formatMessage({
                                                          id: "eventCode"
                                                        })}
                                                      />
                                                    </div>
                                                    <div className="right">
                                                      <Label
                                                        text={findLookupCrimeType(
                                                          lookupCrimeTypes,
                                                          "CrimeEvent",
                                                          PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                            data =>
                                                              data.key ===
                                                              "Event Code"
                                                          )
                                                            ? PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                                data =>
                                                                  data.key ===
                                                                  "Event Code"
                                                              ).value
                                                            : ""
                                                        )}
                                                      />
                                                    </div>
                                                    <div className="left1">
                                                      <Label
                                                        text={formatMessage({
                                                          id: "crimeRegion"
                                                        })}
                                                      />
                                                    </div>
                                                    <div className="right1">
                                                      <Label
                                                        text={findById(
                                                          lookups,
                                                          "LatentCrimeRegion",
                                                          PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                            data =>
                                                              data.key ===
                                                              "Region"
                                                          )
                                                            ? PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                                data =>
                                                                  data.key ===
                                                                  "Region"
                                                              ).value
                                                            : "",
                                                          locale
                                                        )}
                                                      />
                                                    </div>
                                                  </div>

                                                  <div className="print-content">
                                                    <div className="left">
                                                      <Label
                                                        text={formatMessage({
                                                          id:
                                                            "caseInvestigationDepartment"
                                                        })}
                                                      />
                                                    </div>
                                                    <div className="right">
                                                      <Label
                                                        text={
                                                          PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                            data =>
                                                              data.key ===
                                                              "Investigation Department"
                                                          )
                                                            ? PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                                data =>
                                                                  data.key ===
                                                                  "Investigation Department"
                                                              ).value
                                                            : ""
                                                        }
                                                      />
                                                    </div>
                                                    <div className="left1">
                                                      <Label
                                                        text={formatMessage({
                                                          id: "crimeDate" //Date of Crime
                                                        })}
                                                      />
                                                    </div>
                                                    <div className="right1">
                                                      <Label
                                                        text={getCrimeDate(
                                                          PersonData.info
                                                            .additionalMatchInfos[0]
                                                            .additionalMatchDatas
                                                        )}
                                                      />
                                                    </div>
                                                    {/* <div className="left1">
                                      <Label
                                        text={formatMessage({
                                          id: "latentidentifier"
                                        })}
                                      />
                                    </div>
                                    <div className="right1">
                                      <Label
                                        text={
                                          PersonData.info.additionalMatchInfos[0].extendedData.find(
                                            data =>
                                              data.key === "Latent Identifier"
                                          ).value
                                        }
                                      />
                                    </div> */}
                                                  </div>

                                                  <div className="print-content">
                                                    <div className="left">
                                                      <Label
                                                        text={formatMessage({
                                                          id: "crimeNoteLong"
                                                        })}
                                                      />
                                                    </div>
                                                    <div className="right">
                                                      <Label
                                                        text={
                                                          PersonData.info.additionalMatchInfos[0].exteadditionalMatchDatasndedData.find(
                                                            data =>
                                                              data.key ===
                                                              "Note"
                                                          )
                                                            ? PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                                data =>
                                                                  data.key ===
                                                                  "Note"
                                                              ).value
                                                            : ""
                                                        }
                                                      />
                                                    </div>

                                                    <div className="left1">
                                                      <Label
                                                        text={formatMessage({
                                                          id: "casefilenumber" //Case File Number
                                                        })}
                                                      />
                                                    </div>
                                                    <div className="right1">
                                                      <Label
                                                        text={
                                                          PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                            data =>
                                                              data.key ===
                                                              "Case File Number"
                                                          )
                                                            ? PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                                data =>
                                                                  data.key ===
                                                                  "Case File Number"
                                                              ).value
                                                            : ""
                                                        }
                                                      />
                                                    </div>
                                                  </div>
                                                </div>
                                              </Fragment>
                                            ) : (
                                              ""
                                            )
                                          ) : (
                                            ""
                                          )
                                        ) : (
                                          ""
                                        )
                                      ) : (
                                        ""
                                      )
                                    ) : (
                                      ""
                                    )
                                  ) : (
                                    ""
                                  )}

                                  <div className="latent--desc">
                                    <Label
                                      text={formatMessage({ id: "desc" })}
                                    />
                                    <div className="columns is-paddingless">
                                      <div className="column ">
                                        <Label text="" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          );
                        })
                      : ""
                    : ""
                  : ""
                : ""}
              {/* visible part */}
              {!printStart ? (
                <div
                  id="printRecord1"
                  style={
                    locale === "ar"
                      ? { direction: "rtl" }
                      : { direction: "ltr" }
                  }
                >
                  {ActionHeader === "Search Criminal" ||
                  ActionHeader === "Custom Search Criminal" ||
                  ActionHeader === "Custom Search Civil" ||
                  ( ActionHeader === "Custom Search Latent" && personHasExtendedData ) ||
                  ActionHeader === "Search Civil"
                    ? PersonData
                      ? PersonData.info
                        ? PersonData.info.persons
                          ? PersonData.info.persons.map((person, index) => {
                              return (
                                <div className="record-center" id="divToPrint">
                                  <div
                                    style={{ width: "100%", display: "flex",pageBreakInside:"avoid" }}
                                  >
                                    <div
                                      style={{
                                        flexDirection: "column",
                                        justifyContent: "right",
                                        width: "40%",
                                        pageBreakInside:"avoid"
                                      }}
                                    >
                                      {person.mugshot &&
                                      person.mugshot.image ? (
                                        <Image
                                          style={{
                                            objectFit: "contain",
                                            maxHeight: "200px",
                                            minHeight: "200px",
                                            borderWidth: 0.5,
                                            borderColor: "grey",
                                            borderStyle: "solid"
                                          }}
                                          src={
                                            person.mugshot
                                              ? person.mugshot.image
                                                ? "data:image/png;base64," +
                                                  person.mugshot.image
                                                : ""
                                              : ""
                                          }
                                          id="mugshotImg1"
                                        />
                                      ) : (
                                        <div
                                          style={{
                                            width: "198px",
                                            background: "#FFF",
                                            height: "166px",
                                            textAlign: "center",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            fontSize: "20px",
                                            border: "1px solid #999"
                                          }}
                                        >
                                          N/A
                                        </div>
                                      )}
                                    </div>
                                    <div
                                      style={{
                                        flexDirection: "column",
                                        justifyContent: "right",
                                        width: "60%",
                                        pageBreakInside:"avoid"
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          width: "100%"
                                        }}
                                      >
                                        <div
                                          style={{
                                            flexDirection: "column",
                                            justifyContent: "right",
                                            width: "30%"
                                          }}
                                        >
                                          <Label
                                            style={{
                                              fontSize: "1rem",
                                              fontWeight: "400",
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "right"
                                            }}
                                            text={formatMessage({ id: "name" })}
                                          />
                                        </div>
                                        <div
                                          style={{
                                            flexDirection: "column",
                                            justifyContent: "right",
                                            width: "70%"
                                          }}
                                        >
                                          <Label
                                            style={{
                                              fontSize: "1rem",
                                              fontWeight: "600",
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "right"
                                            }}
                                            text={
                                              person.name ? person.name : ""
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div
                                        style={{
                                          display: "flex",
                                          width: "100%"
                                        }}
                                      >
                                        <div
                                          style={{
                                            flexDirection: "column",
                                            justifyContent: "right",
                                            width: "30%"
                                          }}
                                        >
                                          <Label
                                            style={{
                                              fontSize: "1rem",
                                              fontWeight: "400",
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "right"
                                            }}
                                            text={formatMessage({
                                              id: "SAMIS ID"
                                            })}
                                          />
                                        </div>
                                        <div
                                          style={{
                                            flexDirection: "column",
                                            justifyContent: "right",
                                            width: "70%"
                                          }}
                                        >
                                          <Label
                                            style={{
                                              fontSize: "1rem",
                                              fontWeight: "600",
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "right"
                                            }}
                                            text={
                                              person.samisid
                                                ? person.samisid
                                                : ""
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div
                                        style={{
                                          display: "flex",
                                          width: "100%"
                                        }}
                                      >
                                        <div
                                          style={{
                                            flexDirection: "column",
                                            justifyContent: "right",
                                            width: "30%"
                                          }}
                                        >
                                          <Label
                                            style={{
                                              fontSize: "1rem",
                                              fontWeight: "400",
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "right"
                                            }}
                                            text={formatMessage({
                                              id: "gender"
                                            })}
                                          />
                                        </div>
                                        <div
                                          style={{
                                            flexDirection: "column",
                                            justifyContent: "right",
                                            width: "70%"
                                          }}
                                        >
                                          <Label
                                            style={{
                                              fontSize: "1rem",
                                              fontWeight: "600",
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "right"
                                            }}
                                            text={
                                              person.gender ? person.gender : ""
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div
                                        style={{
                                          display: "flex",
                                          width: "100%"
                                        }}
                                      >
                                        <div
                                          style={{
                                            flexDirection: "column",
                                            justifyContent: "right",
                                            width: "30%"
                                          }}
                                        >
                                          <Label
                                            style={{
                                              fontSize: "1rem",
                                              fontWeight: "400",
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "right"
                                            }}
                                            text={formatMessage({ id: "dob" })}
                                          />
                                        </div>
                                        <div
                                          style={{
                                            flexDirection: "column",
                                            justifyContent: "right",
                                            width: "70%"
                                          }}
                                        >
                                          <Label
                                            style={{
                                              fontSize: "1rem",
                                              fontWeight: "600",
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "right"
                                            }}
                                            text={
                                              person.dob ? (
                                                <DateDisplay
                                                  hijri={person.dob}
                                                  gregorian={person.gregDOB}
                                                  time={false}
                                                  invalid={true}
                                                  validGreg={true}
                                                />
                                              ) : (
                                                ""
                                              )
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div
                                        style={{
                                          display: "flex",
                                          width: "100%"
                                        }}
                                      >
                                        <div
                                          style={{
                                            flexDirection: "column",
                                            justifyContent: "right",
                                            width: "30%"
                                          }}
                                        >
                                          <Label
                                            style={{
                                              fontSize: "1rem",
                                              fontWeight: "400",
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "right"
                                            }}
                                            text={formatMessage({
                                              id: "nationality"
                                            })}
                                          />
                                        </div>
                                        <div
                                          style={{
                                            flexDirection: "column",
                                            justifyContent: "right",
                                            width: "70%"
                                          }}
                                        >
                                          <Label
                                            style={{
                                              fontSize: "1rem",
                                              fontWeight: "600",
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "right"
                                            }}
                                            text={findById(
                                              lookups,
                                              "Nationality",
                                              person.nationality,
                                              locale
                                            )}
                                          />
                                        </div>
                                      </div>
                                      {findExtendedData(
                                        "ID Type",
                                        person.extendedData
                                      ) ? (
                                        <Fragment>
                                          <div
                                            style={{
                                              display: "flex",
                                              width: "100%"
                                            }}
                                          >
                                            <div
                                              style={{
                                                flexDirection: "column",
                                                justifyContent: "right",
                                                width: "30%"
                                              }}
                                            >
                                              <Label
                                                style={{
                                                  fontSize: "1rem",
                                                  fontWeight: "400",
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  alignItems: "right"
                                                }}
                                                text={formatMessage({
                                                  id: "idType"
                                                })}
                                              />
                                            </div>
                                            <div
                                              style={{
                                                flexDirection: "column",
                                                justifyContent: "right",
                                                width: "70%"
                                              }}
                                            >
                                              <Label
                                                style={{
                                                  fontSize: "1rem",
                                                  fontWeight: "600",
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  alignItems: "right"
                                                }}
                                                text={findById(
                                                  lookups,
                                                  "ID Type",
                                                  findExtendedData(
                                                    "ID Type",
                                                    person.extendedData
                                                  )
                                                )}
                                              />
                                            </div>
                                          </div>
                                          <div
                                            style={{
                                              display: "flex",
                                              width: "100%"
                                            }}
                                          >
                                            <div
                                              style={{
                                                flexDirection: "column",
                                                justifyContent: "right",
                                                width: "30%"
                                              }}
                                            >
                                              <Label
                                                style={{
                                                  fontSize: "1rem",
                                                  fontWeight: "400",
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  alignItems: "right"
                                                }}
                                                text={formatMessage({
                                                  id: "idIssueDate"
                                                })}
                                              />
                                            </div>
                                            <div
                                              style={{
                                                flexDirection: "column",
                                                justifyContent: "right",
                                                width: "70%"
                                              }}
                                            >
                                              <Label
                                                style={{
                                                  fontSize: "1rem",
                                                  fontWeight: "600",
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  alignItems: "right"
                                                }}
                                                text={
                                                  <DateDisplay
                                                    hijri={findExtendedData(
                                                      "ID Issued Date",
                                                      person.extendedData
                                                    )}
                                                    gregorian={findExtendedData(
                                                      "Gregorian ID Issued Date",
                                                      person.extendedData
                                                    )}
                                                    time={false}
                                                    invalid={true}
                                                  />
                                                }
                                              />
                                            </div>
                                          </div>
                                        </Fragment>
                                      ) : (
                                        ""
                                      )}

                                      {Tcn ? (
                                        <div
                                          style={{
                                            display: "flex",
                                            width: "100%"
                                          }}
                                        >
                                          <div
                                            style={{
                                              flexDirection: "column",
                                              justifyContent: "right",
                                              width: "30%"
                                            }}
                                          >
                                            <Label
                                              style={{
                                                fontSize: "1rem",
                                                fontWeight: "400",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "right"
                                              }}
                                              text={formatMessage({
                                                id: "tcn"
                                              })}
                                            />
                                          </div>
                                          <div
                                            style={{
                                              flexDirection: "column",
                                              justifyContent: "right",
                                              width: "70%"
                                            }}
                                          >
                                            <Label
                                              style={{
                                                fontSize: "1rem",
                                                fontWeight: "600",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "right"
                                              }}
                                              text={Tcn}
                                            />
                                          </div>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                      {person.fileNumber ? (
                                        <div
                                          style={{
                                            display: "flex",
                                            width: "100%"
                                          }}
                                        >
                                          <div
                                            style={{
                                              flexDirection: "column",
                                              justifyContent: "right",
                                              width: "30%"
                                            }}
                                          >
                                            <Label
                                              style={{
                                                fontSize: "1rem",
                                                fontWeight: "400",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "right"
                                              }}
                                              text={formatMessage({
                                                id: "policeFileNumber"
                                              })}
                                            />
                                          </div>
                                          <div
                                            style={{
                                              flexDirection: "column",
                                              justifyContent: "right",
                                              width: "70%"
                                            }}
                                          >
                                            <Label
                                              style={{
                                                fontSize: "1rem",
                                                fontWeight: "600",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "right"
                                              }}
                                              text={
                                                person.fileNumber
                                                  ? person.fileNumber
                                                  : ""
                                              }
                                            />
                                          </div>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>

                                  {(ActionHeader === "Search Criminal" ||
                                    ( ActionHeader === "Custom Search Latent" && person.extendedData && person.extendedData.length > 0 ) ||
                                    // ActionHeader === "Custom Search Civil" ||
                                    ActionHeader ===
                                      "Custom Search Criminal") && (
                                    // PersonData.info.persons &&
                                    // PersonData.info.persons.length > 0 &&

                                    <div
                                      style={{
                                        margin: "10px 0",
                                        display: "flex",
                                        flexDirection: "column",
                                        pageBreakInside:"avoid"
                                      }}
                                      key={index}
                                    >
                                      { console.log("Person Details:: person", person) }
                                      <Label
                                        style={{
                                          fontSize: "1.2rem",
                                          fontWeight: "600",
                                          display: "flex",
                                          flexDirection: "column",
                                          alignItems: "right",
                                          paddingLeft: "5px",
                                          marginBottom: "1px"
                                        }}
                                        text={
                                          formatMessage({ id: "recordHistory" })
                                          // +
                                          // "  " +
                                          // (index + 1)
                                        }
                                      />
                                      <div
                                        style={{
                                          border: "1px solid black",
                                          padding: "2px"
                                        }}
                                      >
                                        <Title
                                          style={{
                                            width: "100% !important",
                                            display: "flex",
                                            flexDirection: "column",
                                            marginBottom: "0",
                                            padding: "5px",
                                            fontSize: "1rem"
                                          }}
                                          is="6"
                                          text={formatMessage({
                                            id: "crimeCodes"
                                          })}
                                        />
                                        <div
                                          style={{ border: "1px solid black" }}
                                        >
                                          {displayCaseTypeFields(person)}
                                        </div>

                                        <Title
                                          style={{
                                            width: "100% !important",
                                            display: "flex",
                                            flexDirection: "column",
                                            marginBottom: "0",
                                            padding: "5px",
                                            fontSize: "1rem"
                                          }}
                                          is="6"
                                          text={formatMessage({
                                            id: "judgementInformation"
                                          })}
                                        />
                                        <div
                                          style={{ border: "1px solid black" }}
                                        >
                                          <div
                                            style={{
                                              display: "flex",
                                              width: "100% !important"
                                            }}
                                          >
                                            {calculateDays(
                                              findExtendedData(
                                                "Jail Day Count",
                                                person.extendedData
                                              ),
                                              findExtendedData(
                                                "Jail Month Count",
                                                person.extendedData
                                              ),
                                              findExtendedData(
                                                "Jail Year Count",
                                                person.extendedData
                                              )
                                            ) !== 0 && (
                                              <Fragment>
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    width: "20%"
                                                  }}
                                                >
                                                  <Label
                                                    style={{
                                                      fontSize: "1rem",
                                                      fontWeight: "400",
                                                      display: "flex",
                                                      flexDirection: "column",
                                                      alignItems: "right"
                                                    }}
                                                    text={formatMessage({
                                                      id: "prison"
                                                    })}
                                                  />
                                                </div>
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    width: "30%"
                                                  }}
                                                >
                                                  <Label
                                                    style={{
                                                      fontSize: "1rem",
                                                      fontWeight: "600",
                                                      display: "flex",
                                                      flexDirection: "column",
                                                      alignItems: "right"
                                                    }}
                                                    text={calculateDays(
                                                      findExtendedData(
                                                        "Jail Day Count",
                                                        person.extendedData
                                                      ),
                                                      findExtendedData(
                                                        "Jail Month Count",
                                                        person.extendedData
                                                      ),
                                                      findExtendedData(
                                                        "Jail Year Count",
                                                        person.extendedData
                                                      )
                                                    )}
                                                  />
                                                </div>
                                              </Fragment>
                                            )}

                                            {calculateDays(
                                              findExtendedData(
                                                "Travel Ban Day Count",
                                                person.extendedData
                                              ),
                                              findExtendedData(
                                                "Travel Ban Month Count",
                                                person.extendedData
                                              ),
                                              findExtendedData(
                                                "Travel Ban Year Count",
                                                person.extendedData
                                              )
                                            ) !== 0 && (
                                              <Fragment>
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    width: "20%"
                                                  }}
                                                >
                                                  <Label
                                                    style={{
                                                      fontSize: "1rem",
                                                      fontWeight: "400",
                                                      display: "flex",
                                                      flexDirection: "column",
                                                      alignItems: "right"
                                                    }}
                                                    text={formatMessage({
                                                      id: "travelBan"
                                                    })}
                                                  />
                                                </div>
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    width: "30%"
                                                  }}
                                                >
                                                  <Label
                                                    style={{
                                                      fontSize: "1rem",
                                                      fontWeight: "600",
                                                      display: "flex",
                                                      flexDirection: "column",
                                                      alignItems: "right"
                                                    }}
                                                    text={calculateDays(
                                                      findExtendedData(
                                                        "Travel Ban Day Count",
                                                        person.extendedData
                                                      ),
                                                      findExtendedData(
                                                        "Travel Ban Month Count",
                                                        person.extendedData
                                                      ),
                                                      findExtendedData(
                                                        "Travel Ban Year Count",
                                                        person.extendedData
                                                      )
                                                    )}
                                                  />
                                                </div>
                                              </Fragment>
                                            )}
                                          </div>

                                          <div
                                            style={{
                                              display: "flex",
                                              width: "100% !important"
                                            }}
                                          >
                                            {findExtendedData(
                                              "Deport Final",
                                              person.extendedData
                                            ) === "True" && (
                                              <Fragment>
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    width: "20%"
                                                  }}
                                                >
                                                  <Label
                                                    style={{
                                                      fontSize: "1rem",
                                                      fontWeight: "400",
                                                      display: "flex",
                                                      flexDirection: "column",
                                                      alignItems: "right"
                                                    }}
                                                    text={formatMessage({
                                                      id: "deportFinal"
                                                    })}
                                                  />
                                                </div>
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    width: "30%"
                                                  }}
                                                >
                                                  <Label
                                                    style={{
                                                      fontSize: "1rem",
                                                      fontWeight: "600",
                                                      display: "flex",
                                                      flexDirection: "column",
                                                      alignItems: "right"
                                                    }}
                                                    text={
                                                      findExtendedData(
                                                        "Deport Final",
                                                        person.extendedData
                                                      ) === "True"
                                                        ? "Yes"
                                                        : "No"
                                                    }
                                                  />
                                                </div>
                                              </Fragment>
                                            )}

                                            {calculateDays(
                                              findExtendedData(
                                                "Deport Day Count",
                                                person.extendedData
                                              ),
                                              findExtendedData(
                                                "Deport Month Count",
                                                person.extendedData
                                              ),
                                              findExtendedData(
                                                "Deport Year Count",
                                                person.extendedData
                                              )
                                            ) !== 0 && (
                                              <Fragment>
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    width: "20%"
                                                  }}
                                                >
                                                  <Label
                                                    style={{
                                                      fontSize: "1rem",
                                                      fontWeight: "400",
                                                      display: "flex",
                                                      flexDirection: "column",
                                                      alignItems: "right"
                                                    }}
                                                    text={formatMessage({
                                                      id: "deportation"
                                                    })}
                                                  />
                                                </div>
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    width: "30%"
                                                  }}
                                                >
                                                  <Label
                                                    style={{
                                                      fontSize: "1rem",
                                                      fontWeight: "600",
                                                      display: "flex",
                                                      flexDirection: "column",
                                                      alignItems: "right"
                                                    }}
                                                    text={calculateDays(
                                                      findExtendedData(
                                                        "Deport Day Count",
                                                        person.extendedData
                                                      ),
                                                      findExtendedData(
                                                        "Deport Month Count",
                                                        person.extendedData
                                                      ),
                                                      findExtendedData(
                                                        "Deport Year Count",
                                                        person.extendedData
                                                      )
                                                    )}
                                                  />
                                                </div>
                                              </Fragment>
                                            )}
                                          </div>
                                          {person.extendedData.find(
                                            data => data.key === "Final"
                                          ) ? (
                                            person.extendedData.find(
                                              data => data.key === "Final"
                                            ).value ? (
                                              <div
                                                style={{
                                                  display: "flex",
                                                  width: "100% !important"
                                                }}
                                              >
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    width: "20%"
                                                  }}
                                                >
                                                  <Label
                                                    style={{
                                                      fontSize: "1rem",
                                                      fontWeight: "400",
                                                      display: "flex",
                                                      flexDirection: "column",
                                                      alignItems: "right"
                                                    }}
                                                    text={formatMessage({
                                                      id: "final"
                                                    })}
                                                  />
                                                </div>
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    width: "30%"
                                                  }}
                                                >
                                                  <Label
                                                    style={{
                                                      fontSize: "1rem",
                                                      fontWeight: "600",
                                                      display: "flex",
                                                      flexDirection: "column",
                                                      alignItems: "right"
                                                    }}
                                                    text={
                                                      ""
                                                      // person.extendedData.find(
                                                      //   data => data.key === "Final"
                                                      // )
                                                      //   ? person.extendedData.find(
                                                      //       data => data.key === "Final"
                                                      //     ).value
                                                      //   : ""
                                                    }
                                                  />
                                                </div>
                                              </div>
                                            ) : (
                                              ""
                                            )
                                          ) : (
                                            ""
                                          )}
                                          <div
                                            style={{
                                              display: "flex",
                                              width: "100% !important"
                                            }}
                                          >
                                            {findExtendedData(
                                              "Fine",
                                              person.extendedData
                                            ) && (
                                              <Fragment>
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    width: "20%"
                                                  }}
                                                >
                                                  <Label
                                                    style={{
                                                      fontSize: "1rem",
                                                      fontWeight: "400",
                                                      display: "flex",
                                                      flexDirection: "column",
                                                      alignItems: "right"
                                                    }}
                                                    text={formatMessage({
                                                      id: "fine"
                                                    })}
                                                  />
                                                </div>
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    width: "30%"
                                                  }}
                                                >
                                                  <Label
                                                    style={{
                                                      fontSize: "1rem",
                                                      fontWeight: "600",
                                                      display: "flex",
                                                      flexDirection: "column",
                                                      alignItems: "right"
                                                    }}
                                                    text={findExtendedData(
                                                      "Fine",
                                                      person.extendedData
                                                    )}
                                                  />
                                                </div>
                                              </Fragment>
                                            )}

                                            {calculateDays(
                                              findExtendedData(
                                                "Exiling Day Count",
                                                person.extendedData
                                              ),
                                              findExtendedData(
                                                "Exiling Month Count",
                                                person.extendedData
                                              ),
                                              findExtendedData(
                                                "Exiling Year Count",
                                                person.extendedData
                                              )
                                            ) !== 0 && (
                                              <Fragment>
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    width: "20%"
                                                  }}
                                                >
                                                  <Label
                                                    style={{
                                                      fontSize: "1rem",
                                                      fontWeight: "400",
                                                      display: "flex",
                                                      flexDirection: "column",
                                                      alignItems: "right"
                                                    }}
                                                    text={formatMessage({
                                                      id: "exiling"
                                                    })}
                                                  />
                                                </div>
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    width: "30%"
                                                  }}
                                                >
                                                  <Label
                                                    style={{
                                                      fontSize: "1rem",
                                                      fontWeight: "600",
                                                      display: "flex",
                                                      flexDirection: "column",
                                                      alignItems: "right"
                                                    }}
                                                    text={calculateDays(
                                                      findExtendedData(
                                                        "Exiling Day Count",
                                                        person.extendedData
                                                      ),
                                                      findExtendedData(
                                                        "Exiling Month Count",
                                                        person.extendedData
                                                      ),
                                                      findExtendedData(
                                                        "Exiling Year Count",
                                                        person.extendedData
                                                      )
                                                    )}
                                                  />
                                                </div>
                                              </Fragment>
                                            )}
                                          </div>
                                          <div
                                            style={{
                                              display: "flex",
                                              width: "100% !important"
                                            }}
                                          >
                                            {findExtendedData(
                                              "Criminal Libel",
                                              person.extendedData
                                            ) ? (
                                              findExtendedData(
                                                "Criminal Libel",
                                                person.extendedData
                                              ) === "True" ? (
                                                <Fragment>
                                                  <div
                                                    style={{
                                                      display: "flex",
                                                      width: "20%"
                                                    }}
                                                  >
                                                    <Label
                                                      style={{
                                                        fontSize: "1rem",
                                                        fontWeight: "400",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "right"
                                                      }}
                                                      text={formatMessage({
                                                        id: "criminalLibel"
                                                      })}
                                                    />
                                                  </div>
                                                  <div
                                                    style={{
                                                      display: "flex",
                                                      width: "30%"
                                                    }}
                                                  >
                                                    <Label
                                                      style={{
                                                        fontSize: "1rem",
                                                        fontWeight: "600",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "right"
                                                      }}
                                                      text={
                                                        findExtendedData(
                                                          "Criminal Libel",
                                                          person.extendedData
                                                        ) === "True"
                                                          ? "Yes"
                                                          : "No"
                                                      }
                                                    />
                                                  </div>
                                                </Fragment>
                                              ) : (
                                                ""
                                              )
                                            ) : (
                                              ""
                                            )}

                                            {findExtendedData(
                                              "Covenant",
                                              person.extendedData
                                            ) ? (
                                              findExtendedData(
                                                "Covenant",
                                                person.extendedData
                                              ) === "True" ? (
                                                <Fragment>
                                                  <div
                                                    style={{
                                                      display: "flex",
                                                      width: "20%"
                                                    }}
                                                  >
                                                    <Label
                                                      style={{
                                                        fontSize: "1rem",
                                                        fontWeight: "400",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "right"
                                                      }}
                                                      text={formatMessage({
                                                        id: "covenant"
                                                      })}
                                                    />
                                                  </div>
                                                  <div
                                                    style={{
                                                      display: "flex",
                                                      width: "30%"
                                                    }}
                                                  >
                                                    <Label
                                                      style={{
                                                        fontSize: "1rem",
                                                        fontWeight: "600",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "right"
                                                      }}
                                                      text={
                                                        findExtendedData(
                                                          "Covenant",
                                                          person.extendedData
                                                        ) === "True"
                                                          ? "Yes"
                                                          : "No"
                                                      }
                                                    />
                                                  </div>
                                                </Fragment>
                                              ) : (
                                                ""
                                              )
                                            ) : (
                                              ""
                                            )}
                                          </div>

                                          <div
                                            style={{
                                              display: "flex",
                                              width: "100% !important"
                                            }}
                                          >
                                            <div
                                              style={{
                                                display: "flex",
                                                width: "20%"
                                              }}
                                            >
                                              <Label
                                                style={{
                                                  fontSize: "1rem",
                                                  fontWeight: "400",
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  alignItems: "right"
                                                }}
                                                text={formatMessage({
                                                  id: "judgementDate"
                                                })}
                                              />
                                            </div>
                                            <div
                                              style={{
                                                display: "flex",
                                                width: "30%"
                                              }}
                                            >
                                              <Label
                                                style={{
                                                  fontSize: "1rem",
                                                  fontWeight: "600",
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  alignItems: "right"
                                                }}
                                                text={
                                                  <DateDisplay
                                                    hijri={findExtendedData(
                                                      "Judgement Date",
                                                      person.extendedData
                                                    )}
                                                    gregorian={findExtendedData(
                                                      "Gregorian Judgement Date",
                                                      person.extendedData
                                                    )}
                                                    time={false}
                                                    invalid={true}
                                                  />
                                                }
                                              />
                                            </div>
                                            <div
                                              style={{
                                                display: "flex",
                                                width: "20%"
                                              }}
                                            >
                                              <Label
                                                style={{
                                                  fontSize: "1rem",
                                                  fontWeight: "400",
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  alignItems: "right"
                                                }}
                                                text={formatMessage({
                                                  id: "arrestDate"
                                                })}
                                              />
                                            </div>
                                            <div
                                              style={{
                                                display: "flex",
                                                width: "30%"
                                              }}
                                            >
                                              <Label
                                                style={{
                                                  fontSize: "1rem",
                                                  fontWeight: "600",
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  alignItems: "right"
                                                }}
                                                text={
                                                  <DateDisplay
                                                    hijri={findExtendedData(
                                                      "Arrest Date",
                                                      person.extendedData
                                                    )}
                                                    gregorian={findExtendedData(
                                                      "Gregorian Arrest Date",
                                                      person.extendedData
                                                    )}
                                                    time={false}
                                                    invalid={true}
                                                  />
                                                }
                                              />
                                            </div>
                                          </div>

                                          <div
                                            style={{
                                              display: "flex",
                                              width: "100% !important"
                                            }}
                                          >
                                            <div
                                              style={{
                                                display: "flex",
                                                width: "20%"
                                              }}
                                            >
                                              <Label
                                                style={{
                                                  fontSize: "1rem",
                                                  fontWeight: "400",
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  alignItems: "right"
                                                }}
                                                text={formatMessage({
                                                  id: "judgementIssuer"
                                                })}
                                              />
                                            </div>
                                            <div
                                              style={{
                                                display: "flex",
                                                width: "30%"
                                              }}
                                            >
                                              <Label
                                                style={{
                                                  fontSize: "1rem",
                                                  fontWeight: "600",
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  alignItems: "right"
                                                }}
                                                text={findExtendedData(
                                                  "Judgement Issuer",
                                                  person.extendedData
                                                )}
                                              />
                                            </div>
                                            <div
                                              style={{
                                                display: "flex",
                                                width: "20%"
                                              }}
                                            >
                                              <Label
                                                style={{
                                                  fontSize: "1rem",
                                                  fontWeight: "400",
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  alignItems: "right"
                                                }}
                                                text={formatMessage({
                                                  id: "judgementNumber"
                                                })}
                                              />
                                            </div>
                                            <div
                                              style={{
                                                display: "flex",
                                                width: "30%"
                                              }}
                                            >
                                              <Label
                                                style={{
                                                  fontSize: "1rem",
                                                  fontWeight: "600",
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  alignItems: "right"
                                                }}
                                                text={findExtendedData(
                                                  "Judgement Number",
                                                  person.extendedData
                                                )}
                                              />
                                            </div>
                                          </div>

                                          <div
                                            style={{
                                              display: "flex",
                                              width: "100% !important"
                                            }}
                                          >
                                            {findExtendedData(
                                              "Hadd Lashing",
                                              person.extendedData
                                            ) && (
                                              <Fragment>
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    width: "20%"
                                                  }}
                                                >
                                                  <Label
                                                    style={{
                                                      fontSize: "1rem",
                                                      fontWeight: "400",
                                                      display: "flex",
                                                      flexDirection: "column",
                                                      alignItems: "right"
                                                    }}
                                                    text={formatMessage({
                                                      id: "haddLashing"
                                                    })}
                                                  />
                                                </div>
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    width: "30%"
                                                  }}
                                                >
                                                  <Label
                                                    style={{
                                                      fontSize: "1rem",
                                                      fontWeight: "600",
                                                      display: "flex",
                                                      flexDirection: "column",
                                                      alignItems: "right"
                                                    }}
                                                    text={findExtendedData(
                                                      "Hadd Lashing",
                                                      person.extendedData
                                                    )}
                                                  />
                                                </div>
                                              </Fragment>
                                            )}
                                            {findExtendedData(
                                              "Tazeer Lashing",
                                              person.extendedData
                                            ) && (
                                              <Fragment>
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    width: "20%"
                                                  }}
                                                >
                                                  <Label
                                                    style={{
                                                      fontSize: "1rem",
                                                      fontWeight: "400",
                                                      display: "flex",
                                                      flexDirection: "column",
                                                      alignItems: "right"
                                                    }}
                                                    text={formatMessage({
                                                      id: "tazeerLashing"
                                                    })}
                                                  />
                                                </div>
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    width: "30%"
                                                  }}
                                                >
                                                  <Label
                                                    style={{
                                                      fontSize: "1rem",
                                                      fontWeight: "600",
                                                      display: "flex",
                                                      flexDirection: "column",
                                                      alignItems: "right"
                                                    }}
                                                    text={findExtendedData(
                                                      "Tazeer Lashing",
                                                      person.extendedData
                                                    )}
                                                  />
                                                </div>
                                              </Fragment>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  <hr />
                                </div>
                              );
                            })
                          : ""
                        : ""
                      : ""
                    : ""}

                  {ActionHeader === "Search Latent" ||
                  ActionHeader === "Custom Search Latent" ? (
                    <div>
                      {console.log("PersonData.info", PersonData.info)}
                      {PersonData.info ? (
                        PersonData.info.additionalMatchInfos ? (
                          PersonData.info.additionalMatchInfos.length > 0 ? (
                            PersonData.info.additionalMatchInfos[0]
                              .additionalMatchDatas ? (
                              PersonData.info.additionalMatchInfos[0]
                                .additionalMatchDatas.length > 0 ? (
                                PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                  data => data.key === "Latent Identifier"
                                ) ? (
                                  <Fragment>
                                    <div
                                      style={{
                                        border: "1px solid black",
                                        borderRadius: "5px",
                                        padding: "5px"
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          width: "100% !important"
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            width: "20%"
                                          }}
                                        >
                                          <Label
                                            style={{
                                              fontSize: "1rem",
                                              fontWeight: "400",
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "right"
                                            }}
                                            text={formatMessage({
                                              id: "latentidentifier"
                                            })}
                                          />
                                        </div>
                                        <div
                                          style={{
                                            display: "flex",
                                            width: "30%"
                                          }}
                                        >
                                          <Label
                                            style={{
                                              fontSize: "1rem",
                                              fontWeight: "600",
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "right"
                                            }}
                                            text={
                                              PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                data =>
                                                  data.key ===
                                                  "Latent Identifier"
                                              ).value
                                            }
                                          />
                                        </div>
                                        <div
                                          style={{
                                            display: "flex",
                                            width: "20%"
                                          }}
                                        >
                                          <Label
                                            style={{
                                              fontSize: "1rem",
                                              fontWeight: "400",
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "right"
                                            }}
                                            text={formatMessage({
                                              id: "crimePlace"
                                            })}
                                          />
                                        </div>
                                        <div
                                          style={{
                                            display: "flex",
                                            width: "30%"
                                          }}
                                        >
                                          <Label
                                            style={{
                                              fontSize: "1rem",
                                              fontWeight: "600",
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "right"
                                            }}
                                            text={
                                              PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                data =>
                                                  data.key === "Crime Place"
                                              )
                                                ? PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                    data =>
                                                      data.key === "Crime Place"
                                                  ).value
                                                : ""
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div
                                        style={{
                                          display: "flex",
                                          width: "100% !important"
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            width: "20%"
                                          }}
                                        >
                                          <Label
                                            style={{
                                              fontSize: "1rem",
                                              fontWeight: "400",
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "right"
                                            }}
                                            text={formatMessage({
                                              id: "classCode" //Case File Number
                                            })}
                                          />
                                        </div>
                                        <div
                                          style={{
                                            display: "flex",
                                            width: "30%"
                                          }}
                                        >
                                          <Label
                                            style={{
                                              fontSize: "1rem",
                                              fontWeight: "600",
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "right"
                                            }}
                                            text={findLookupCrimeType(
                                              lookupCrimeTypes,
                                              "CrimeClass",
                                              PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                data =>
                                                  data.key === "Class Code"
                                              )
                                                ? PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                    data =>
                                                      data.key === "Class Code"
                                                  ).value
                                                : ""
                                            )}
                                          />
                                        </div>
                                        <div
                                          style={{
                                            display: "flex",
                                            width: "20%"
                                          }}
                                        >
                                          <Label
                                            style={{
                                              fontSize: "1rem",
                                              fontWeight: "400",
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "right"
                                            }}
                                            text={formatMessage({
                                              id: "crimeCity"
                                            })}
                                          />
                                        </div>
                                        <div
                                          style={{
                                            display: "flex",
                                            width: "30%"
                                          }}
                                        >
                                          <Label
                                            style={{
                                              fontSize: "1rem",
                                              fontWeight: "600",
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "right"
                                            }}
                                            text={findById(
                                              lookups,
                                              "LatentCrimeCity",
                                              PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                data => data.key === "City"
                                              )
                                                ? PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                    data => data.key === "City"
                                                  ).value
                                                : "",
                                              locale
                                            )}
                                          />
                                        </div>
                                      </div>
                                      <div
                                        style={{
                                          display: "flex",
                                          width: "100% !important"
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            width: "20%"
                                          }}
                                        >
                                          <Label
                                            style={{
                                              fontSize: "1rem",
                                              fontWeight: "400",
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "right"
                                            }}
                                            text={formatMessage({
                                              id: "eventCode"
                                            })}
                                          />
                                        </div>
                                        <div
                                          style={{
                                            display: "flex",
                                            width: "30%"
                                          }}
                                        >
                                          <Label
                                            style={{
                                              fontSize: "1rem",
                                              fontWeight: "600",
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "right"
                                            }}
                                            text={findLookupCrimeType(
                                              lookupCrimeTypes,
                                              "CrimeEvent",
                                              PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                data =>
                                                  data.key === "Event Code"
                                              )
                                                ? PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                    data =>
                                                      data.key === "Event Code"
                                                  ).value
                                                : ""
                                            )}
                                          />
                                        </div>
                                        <div
                                          style={{
                                            display: "flex",
                                            width: "20%"
                                          }}
                                        >
                                          <Label
                                            style={{
                                              fontSize: "1rem",
                                              fontWeight: "400",
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "right"
                                            }}
                                            text={formatMessage({
                                              id: "crimeRegion"
                                            })}
                                          />
                                        </div>
                                        <div
                                          style={{
                                            display: "flex",
                                            width: "30%"
                                          }}
                                        >
                                          <Label
                                            style={{
                                              fontSize: "1rem",
                                              fontWeight: "600",
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "right"
                                            }}
                                            text={findById(
                                              lookups,
                                              "LatentCrimeRegion",
                                              PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                data => data.key === "Region"
                                              )
                                                ? PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                    data =>
                                                      data.key === "Region"
                                                  ).value
                                                : "",
                                              locale
                                            )}
                                          />
                                        </div>
                                      </div>
                                      <div
                                        style={{
                                          display: "flex",
                                          width: "100% !important"
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            width: "20%"
                                          }}
                                        >
                                          <Label
                                            style={{
                                              fontSize: "1rem",
                                              fontWeight: "400",
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "right"
                                            }}
                                            text={formatMessage({
                                              id: "caseInvestigationDepartment"
                                            })}
                                          />
                                        </div>
                                        <div
                                          style={{
                                            display: "flex",
                                            width: "30%"
                                          }}
                                        >
                                          <Label
                                            style={{
                                              fontSize: "1rem",
                                              fontWeight: "600",
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "right"
                                            }}
                                            text={
                                              PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                data =>
                                                  data.key ===
                                                  "Investigation Department"
                                              )
                                                ? PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                    data =>
                                                      data.key ===
                                                      "Investigation Department"
                                                  ).value
                                                : ""
                                            }
                                          />
                                        </div>
                                        <div
                                          style={{
                                            display: "flex",
                                            width: "20%"
                                          }}
                                        >
                                          <Label
                                            style={{
                                              fontSize: "1rem",
                                              fontWeight: "400",
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "right"
                                            }}
                                            text={formatMessage({
                                              id: "crimeDate" //Date of Crime
                                            })}
                                          />
                                        </div>
                                        <div
                                          style={{
                                            display: "flex",
                                            width: "30%"
                                          }}
                                        >
                                          <Label
                                            style={{
                                              fontSize: "1rem",
                                              fontWeight: "600",
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "right"
                                            }}
                                            text={
                                              <DateDisplay
                                                hijri={findExtendedData(
                                                  "Date of Crime",
                                                  PersonData.info
                                                    .additionalMatchInfos[0]
                                                    .additionalMatchDatas
                                                )}
                                                gregorian={findExtendedData(
                                                  "Gregorian Date of Crime",
                                                  PersonData.info
                                                    .additionalMatchInfos[0]
                                                    .additionalMatchDatas
                                                )}
                                                time={false}
                                                invalid={true}
                                              />
                                            }
                                          />
                                        </div>
                                        {/* <div className="left1">
                                      <Label
                                        text={formatMessage({
                                          id: "latentidentifier"
                                        })}
                                      />
                                    </div>
                                    <div className="right1">
                                      <Label
                                        text={
                                          PersonData.info.additionalMatchInfos[0].extendedData.find(
                                            data =>
                                              data.key === "Latent Identifier"
                                          ).value
                                        }
                                      />
                                    </div> */}
                                      </div>

                                      <div
                                        style={{
                                          display: "flex",
                                          width: "100% !important"
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            width: "20%"
                                          }}
                                        >
                                          <Label
                                            style={{
                                              fontSize: "1rem",
                                              fontWeight: "400",
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "right"
                                            }}
                                            text={formatMessage({
                                              id: "crimeNoteLong"
                                            })}
                                          />
                                        </div>
                                        <div
                                          style={{
                                            display: "flex",
                                            width: "30%"
                                          }}
                                        >
                                          <Label
                                            style={{
                                              fontSize: "1rem",
                                              fontWeight: "600",
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "right"
                                            }}
                                            text={
                                              PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                data => data.key === "Note"
                                              )
                                                ? PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                    data => data.key === "Note"
                                                  ).value
                                                : ""
                                            }
                                          />
                                        </div>

                                        <div
                                          style={{
                                            display: "flex",
                                            width: "20%"
                                          }}
                                        >
                                          <Label
                                            style={{
                                              fontSize: "1rem",
                                              fontWeight: "400",
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "right"
                                            }}
                                            text={formatMessage({
                                              id: "casefilenumber" //Case File Number
                                            })}
                                          />
                                        </div>
                                        <div
                                          style={{
                                            display: "flex",
                                            width: "30%"
                                          }}
                                        >
                                          <Label
                                            style={{
                                              fontSize: "1rem",
                                              fontWeight: "600",
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "right"
                                            }}
                                            text={
                                              PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                data =>
                                                  data.key ===
                                                  "Case File Number"
                                              )
                                                ? PersonData.info.additionalMatchInfos[0].additionalMatchDatas.find(
                                                    data =>
                                                      data.key ===
                                                      "Case File Number"
                                                  ).value
                                                : ""
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </Fragment>
                                ) : (
                                  ""
                                )
                              ) : (
                                ""
                              )
                            ) : (
                              ""
                            )
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )
                      ) : (
                        ""
                      )}
                      <div className="latent--desc">
                        <Label text={formatMessage({ id: "desc" })} />
                        <div>
                          <div
                            className="column "
                            style={{
                              border: "1px solid black",
                              borderRadius: "5px",
                              height: "2rem"
                            }}
                          >
                            <Label text="" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}
              {/* visible part end */}
            </Fragment>
          }
          buttons={
            <Fragment>
              <div className="footer-content">
                <div className="left" />
                <div className="right">
                  <Button
                    className="is-primary"
                    text={formatMessage({ id: "export" })}
                    onClick={() => {
                      this.printContentToPDF();
                    }}
                    id="closebtn"
                  />
                  {/*
                    Custom Print PDF
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <Button
                    className="is-primary"
                    text={formatMessage({ id: "export" })}
                    onClick={() => {
                      requestStartPrint();
                      this.printDocument();
                    }}
                    id="closebtn"
                  />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <Button
                    className="is-primary"
                    text={formatMessage({ id: "print" })}
                    onClick={() => {
                      this.exportDocument();
                    }}
                    id="closebtn"
                  />
                  */}
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <Button
                    className="is-primary"
                    id="closebtn"
                    text={formatMessage({ id: "cancel" })}
                    onClick={requestHideModal}
                    id="closebtn"
                  />
                </div>
              </div>
            </Fragment>
          }
        />

        <a
          href={`${tempPath}\\print-pdf.pdf`}
          id="download-pdf-file"
          style={{ display: "none" }}
        />
      </div>
    );
  }
}
const mapState = state => ({
  PersonData: tenprintPersonModalSelector(state),
  ActionHeader: ActionHeaderSelector(state),
  Tcn: selectedTcnSelector(state),
  JobId: selectedJobSelector(state),
  printStart: printSelector(state),
  lookups: state.auth.lookups,
  locale: state.locale.lang,
  lookupCrimeTypes: state.auth.lookupCrimeTypes
  // lookupCrimeTypes
});
export default connect(
  mapState,
  { requestHideModal, requestStartPrint, requestStopPrint }
)(withRouter(CriminalPrintModal));
