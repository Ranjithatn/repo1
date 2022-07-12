import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import NumericInput from "react-numeric-input";
import Modal from "../Modal";
import Button from "../../Button/Button";
import Image from "../../Image/Image";
import { requestHideModal } from "../../../actions/modal";
import {
  requestDeleteNewCrimeData,
  requestResetCrimeType
} from "../../../actions/tenprint";
import Label from "../../Label/Label";
import Title from "../../Title/Title";
import Switch from "../../Switch/Switch";
import Select from "../../Select/Select";
import Textarea from "../../Textarea/Textarea";
import Input from "../../Input/Input";
import { requestNewAction } from "../../../actions/jobs";
import { usernameSelector,lookupsSelector, lookupCrimeTypesSelector } from "../../../selectors/auth";
import Punishment from "../CriminalComponents/Punishment";
import AddRecord from "../CriminalComponents/AddRecord";
import AddedRecord from "../CriminalComponents/AddedRecord";
import Fingerprtint from "../CriminalComponents/Fingerprtint";
import BiographicData from "../CriminalComponents/BiographicData";
import CriminalHistory from "../CriminalComponents/CriminalHistory";
import CriminalData from "../CriminalComponents/CriminalData";
import { databaseSelector,MatchedUserRowIDSelector } from "../../../selectors/tenprint";
import {
  reg_numric,
  reg_currency,
  reg_alphanumric,
  reg_alpha
} from "../../../utils/regEx";
import "./UpdateCriminalModal.scss";
import {
  MatchedPersonInfoSelector,
  SelectedMatchSelector,
  tenprintVerifyLeftFingersSelector,
  tenprintVerifyRightFingersSelector,
  tenprintVerifyMugshotSelector
} from "../../../selectors/tenprint";
import { addNewCriminalSelector } from "../../../selectors/updateCriminalModal";
import {
  SelectedActionHistorySelector,
  ActionSelector,
  selectedJobSelector,
  jobsTypeSelector
} from "../../../selectors/jobs";
import Permissions from "../../Permissions"

const dayMonthYearFields = [
  'prison.year',
  'prison.month',
  'prison.days',
  'travelBan.year',
  'travelBan.month',
  'travelBan.days',
  'deportation.year',
  'deportation.month',
  'deportation.days',
  'exiling.year',
  'exiling.month',
  'exiling.days',
];


export class UpdateCriminalModal extends React.Component {
  constructor() {
    super();
    this.state = {
      lashing_checkbox: false,
      fine_checkbox: false,
      data: {
        prison: {
          year: 0,
          month: 0,
          days: 0
        },
        travelBan: {
          year: 0,
          month: 0,
          days: 0
        },
        exiling: {
          year: 0,
          month: 0,
          days: 0
        },
        deportation: {
          year: 0,
          month: 0,
          days: 0
        },
        // firstName: "",
        // lastName: "",
        // nationality: "",
        // biosamisid: "",
        // biogender: "",
        fileNumber: "",
        lashing: "",
        riyals: "",
        judgementIssuer: "",
        judgementNumber: "",

      }
    };
    this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
    this.handleInputClick = this.handleInputClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.isDisabled = this.isDisabled.bind(this);
  }

  componentDidCatch( error, info ) {
    console.log('----componentDidCatch::Error Occoured---');
    console.log( 'error, info', error, info );
  }


  handleCheckboxClick(e, name) {
    let data = Object.assign({}, this.state.data);
    data[name] = e.target.checked;
    this.setState({ data: data });
    // this.setState({ [name]: e.target.checked });
  }

  isDisabled() {
    console.log("isDisabled");
    const{ data } = this.state;
    if(this.props.JobType === "Latent") {
      
        if(!data.crimePlace||!data.eventClassCode||!data.crimeCity||!data.crimeRegion||!data.crimeDate||!data.caseInvestigationDepartment||!data.caseFileNumber){
          return true
        }
      }
      return false
  }
 

  handleInputClick(value, field) {
    // console.log("handleInputClick::value, field", value, field);
    let data = { ...this.state.data };
    if(field){

    if ( dayMonthYearFields.includes(field) ) {
      // console.log("add additional logic here");

      const fieldSplit = field && field.split(".");
      if ( field.indexOf("month") !== -1 && value <= 11 ) {
        data[fieldSplit[0]][fieldSplit[1]] = value;
      }
      else if ( field.indexOf("days") !== -1 && value <= 31 ) {
        data[fieldSplit[0]][fieldSplit[1]] = value;
      }
      else if ( field.indexOf("year") !== -1 && value <= 500 ) {
        data[fieldSplit[0]][fieldSplit[1]] = value;
      }

      this.setState({ data: data });
    }
    else {
      const fieldSplit = field && field.split(".");
      data[fieldSplit[0]][fieldSplit[1]] = value;
      this.setState({ data: data });
    }
}
  }
  handleInputChange(e, field) {
    console.log("e, field",e, field);
    let data = Object.assign({}, this.state.data);
    if (
      field === "firstName" ||
      field === "lastName" ||
      field === "nationality" ||
      field === "biogender" ||
      field.startsWith("judgementIssuer")
    ) {
      if (e.target.value == "" || reg_alpha.test(e.target.value)) {
        data[field] = e.target.value;
      }
    } else if (
      field === "fileNumber" ||
      field.startsWith("judgementNumber") ||
      field.startsWith("lashing")||field==="latentidentifier"
    ) {
      if (e.target.value == "" || reg_numric.test(e.target.value)) {
        data[field] = e.target.value;
      }
    } else if (field === "biosamisid") {
      if (e.target.value == "" || reg_alphanumric.test(e.target.value)) {
        data[field] = e.target.value;
      }
    } else if (field.startsWith("riyals")) {
      if (e.target.value === "" || reg_currency.test(e.target.value)) {
        data[field] = e.target.value;
      }
    } else {
      data[field] = e.target.value;
    }
    // data[field] = e.target.value;
    this.setState({ data: data });
  }

  render() {
    const {
      requestHideModal,
      formatMessage,
      history,
      MatchedUserInfo,
      ProbeMatch,
      LeftFingers,
      RightFingers,
      MugShot,
      JobType,
      newAction,
      selectedJob,
      SelectedActionHistory,
      requestNewAction,
      username,
      addNewCrimeData,
      requestDeleteNewCrimeData,
      requestResetCrimeType,
      database,
      lookups,
      rowId,
      crimeTypes,
      // fingerprintID,
    } = this.props;


    console.log("UpdateCriminalModal::this.props", this.props);



    const handleChange = e => {
      // console.log("handle click");
    };


    let button_name = "";
    button_name = newAction && newAction.split(" ");
    button_name = button_name[0];

    
    return (
      <Modal
        title={formatMessage({ id: newAction?newAction:"newAction" })}
        className="update-criminal-modal"
        requestHideModal={requestHideModal}
        content={
          <Fragment>
             
            <div className="record-center">
              {JobType !== "Latent" ? (
                <div>
                  {MugShot &&
                  MugShot !== "" &&
                  MugShot !== null &&
                  JobType !== "Custom" ? (
                    <div className="columns">
                      <div className="column">
                        <div className="img-block">
                          <Title
                            is="5"
                            text={formatMessage({ id: "mugshot" })}
                          />

                          <Image
                            src={"data:image/png;base64," + MugShot.thumbNail}
                            id="criminalImg"
                          />
                          {/* <Switch
                          id="person1"
                          value="person1"
                          className="is-primary is-rounded"
                        /> */}
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {/* {MatchedUserInfo.additionalMatchInfos && MatchedUserInfo.additionalMatchInfos.map((obj, index) => {
                    this.setState({data:[this.state.data,"qwerty"]})
                    console.log(this.state.data,'afsdfdsfsdf');
                  })} */}
                  <BiographicData
                    formatMessage={formatMessage}
                    MatchedUserInfo={MatchedUserInfo}
                    handleInputChange={this.handleInputChange}
                    data={this.state.data}
                  />
                  <div className="columns upper-margin">
                    <div className="column is-paddingless">
                      <div className="file-content">
                        <span className="filetext">
                          {formatMessage({ id: "fileNumber" })}
                        </span>
                        <div className="control">
                          <Input
                            type="tel"
                            maxLength="10"
                            className="input"
                            id="filenumber"
                            placeholder={formatMessage({
                              id: "#########(10 digits)"
                            })}
                            onChange={e => {
                              this.handleInputChange(e, "fileNumber");
                            }}
                            value={
                              this.state.data.fileNumber
                                ? this.state.data.fileNumber
                                : MatchedUserInfo.person
                                  ? MatchedUserInfo.person.fileNumber
                                  : ""
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="column is-paddingless">
                      <Title
                        is="5"
                        text={formatMessage({ id: "criminalDataFields" })}
                      />
                    </div>
                    <div className="column" />
                  </div>
                  <div className="criminal-fields">

                  { JobType !== "Latent" && database==="Latent"?
               
                   <CriminalData
                       formatMessage={formatMessage}
                       handleInputChange={this.handleInputChange}
                       lookups={lookups}
                       rowId={rowId}
                       crimeTypes={crimeTypes}
                   />:""
                    }


                    <div className="case-content">
                      <div className="case-field">
                        <span className="span-head">
                          {formatMessage({ id: "caseType" })}
                        </span>
                        <span className="span-head">
                          {formatMessage({ id: "desc" })}
                        </span>
                        <span />
                      </div>

                      <AddRecord formatMessage={formatMessage} />

                      {addNewCrimeData &&
                        addNewCrimeData.map((presentObj, index) => {
                          return (
                            <Fragment key={index}>
                              <AddedRecord
                                formatMessage={formatMessage}
                                presentObj={presentObj}
                                onClick={requestDeleteNewCrimeData}
                                index={index}
                              />
                            </Fragment>
                          );
                        })}
                    </div>

                    <Punishment
                      formatMessage={formatMessage}
                      handleCheckboxClick={this.handleCheckboxClick}
                      lashing_checkbox={this.state.lashing_checkbox}
                      fine_checkbox={this.state.fine_checkbox}
                      data={this.state.data}
                      handleInputClick={this.handleInputClick}
                      handleInputChange={this.handleInputChange}
                      index={""}
                    />
                  </div>
                </div>
              ) : (
                ""
              )}

              {JobType === "Latent" ? (
                (database === "Latent" || database === "Civil" || database === "Criminal") ? (
                  <div className="criminal-fields">


                    <CriminalData
                       formatMessage={formatMessage}
                       handleInputChange={this.handleInputChange}
                       MatchedUserInfo={MatchedUserInfo}
                       lookups={lookups}
                       data={this.state.data}
                       rowId={rowId}
                       crimeTypes={crimeTypes}
                    />


                  </div>
                ) : (
                  <div>
                    {MugShot &&
                    MugShot !== "" &&
                    MugShot !== null &&
                    JobType !== "Custom" ? (
                      <div className="columns">
                        <div className="column">
                          <div className="img-block">
                            <Title
                              is="5"
                              text={formatMessage({ id: "mugshot" })}
                            />

                            <Image
                              src={"data:image/png;base64," + MugShot.thumbNail}
                              id="criminalImg"
                            />
                            {/* <Switch
                        id="person1"
                        value="person1"
                        className="is-primary is-rounded"
                      /> */}
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    {/* {MatchedUserInfo.additionalMatchInfos && MatchedUserInfo.additionalMatchInfos.map((obj, index) => {
                  this.setState({data:[this.state.data,"qwerty"]})
                  console.log(this.state.data,'afsdfdsfsdf');
                })} */}
                    <BiographicData
                      formatMessage={formatMessage}
                      MatchedUserInfo={MatchedUserInfo}
                      handleInputChange={this.handleInputChange}
                      data={this.state.data}
                    />








                    { database === "Criminal" &&

                    <Fragment>

                    <div className="columns upper-margin">
                      <div className="column is-paddingless">
                        <div className="file-content">
                          <span className="filetext">
                            {formatMessage({ id: "fileNumber" })}
                          </span>
                          <div className="control">
                            <Input
                              type="tel"
                              maxLength="10"
                              className="input"
                              id="filenumber"
                              placeholder={formatMessage({
                                id: "#########(10 digits)"
                              })}
                              onChange={e => {
                                this.handleInputChange(e, "fileNumber");
                              }}
                              value={
                                this.state.data.fileNumber
                                  ? this.state.data.fileNumber
                                  : MatchedUserInfo.person
                                    ? MatchedUserInfo.person.fileNumber
                                    : ""
                              }
                            />
                          </div>
                        </div>
                      </div>


                    </div>








                    <div>


                      <div className="column is-paddingless">
                        <Title
                          is="5"
                          text={formatMessage({ id: "criminalDataFields" })}
                        />
                      </div>
                      <div className="column" />



                    <div className="criminal-fields">
                      <div className="case-content">
                        <div className="case-field">
                          <span className="span-head">
                            {formatMessage({ id: "caseType" })}
                          </span>
                          <span className="span-head">
                            {formatMessage({ id: "desc" })}
                          </span>
                          <span />
                        </div>
                        <AddRecord formatMessage={formatMessage} />

                        {addNewCrimeData &&
                          addNewCrimeData.map((presentObj, index) => {
                            return (
                              <Fragment key={index}>
                                <AddedRecord
                                  formatMessage={formatMessage}
                                  presentObj={presentObj}
                                  onClick={requestDeleteNewCrimeData}
                                  index={index}
                                />
                              </Fragment>
                            );
                          })}
                      </div>

                        <Punishment
                          formatMessage={formatMessage}
                          handleCheckboxClick={this.handleCheckboxClick}
                          lashing_checkbox={this.state.lashing_checkbox}
                          fine_checkbox={this.state.fine_checkbox}
                          data={this.state.data}
                          handleInputClick={this.handleInputClick}
                          handleInputChange={this.handleInputChange}
                          index={""}
                        />

                    </div>


                    </div>
                    </Fragment>
                    }







                  </div>
                )
              ) : (
                ""
              )}
              <Fingerprtint
                formatMessage={formatMessage}
                JobType={JobType}
                LeftFingers={LeftFingers}
                RightFingers={RightFingers}
              />
              { JobType !== "Latent" && MatchedUserInfo.additionalMatchInfos ? (
                <CriminalHistory
                  formatMessage={formatMessage}
                  MatchedUserInfo={
                    MatchedUserInfo.additionalMatchInfos
                      ? MatchedUserInfo.additionalMatchInfos
                      : ""
                  }
                  handleCheckboxClick={this.handleCheckboxClick}
                  lashing_checkbox={this.state.lashing_checkbox}
                  fine_checkbox={this.state.fine_checkbox}
                  data={this.state.data}
                  handleInputClick={this.handleInputClick}
                  handleInputChange={this.handleInputChange}
                />
              ) : (
                ""
              )}
            </div>
          </Fragment>
        }
        buttons={
          <Fragment>
            <div className="footer-content">
              <div className="left">
                <Button
                  className="is-primary"
                  text={formatMessage({ id: "back" })}
                  onClick={e => {
                    requestHideModal();
                    requestResetCrimeType();
                  }}
                  id="upmodbackbtn"
                />
              </div>
              <div className="right">
                <Button
                  className="is-primary"
                  text={formatMessage({ id: "cancel" })}
                  onClick={e => {
                    requestHideModal();
                    requestResetCrimeType();
                  }}
                  id="upmodcanbtn"
                />&nbsp;&nbsp;
                <Permissions version={2} type={ newAction === "Register Latent" ? "subsequentAction" : "" }>
                <Button
                  className="is-primary"
                  text={formatMessage({ id: button_name||"button" })}
                  disabled={this.isDisabled()}
                  onClick={e => {
                    requestNewAction({
                      newAction,
                      job: selectedJob,
                      username,
                      tcn: "",
                      typeOfAction: "subsequentAction",
                      refActionID: SelectedActionHistory,
                      verifyAction: true,
                      Note: "Action Updated",
                      state:this.state
                      // fingerprintID: fingerprintID,
                    });
                    // requestHideModal();
                    requestResetCrimeType();
                    // history.push("/authenticated/jobqueue");

                  }}
                  id="upmodupdatebtn"
                />
                </Permissions>
              </div>
            </div>
          </Fragment>
        }
      />
    );
  }
}

const mapState = state => ({
  MugShot: tenprintVerifyMugshotSelector(state),
  MatchedUserInfo: MatchedPersonInfoSelector(state),
  ProbeMatch: SelectedMatchSelector(state),
  LeftFingers: tenprintVerifyLeftFingersSelector(state),
  RightFingers: tenprintVerifyRightFingersSelector(state),
  JobType: jobsTypeSelector(state),
  newAction: ActionSelector(state),
  selectedJob: selectedJobSelector(state),
  username: usernameSelector(state),
  SelectedActionHistory: SelectedActionHistorySelector(state),
  addNewCrimeData: addNewCriminalSelector(state),
  database: databaseSelector(state),
  lookups:lookupsSelector(state),
  rowId:MatchedUserRowIDSelector(state),
  crimeTypes: lookupCrimeTypesSelector(state),
  // fingerprintID: state.tenprint.tenprintverifydata.matched.matchedFingerprintID,
});
export default connect(
  mapState,
  {
    requestHideModal,
    requestNewAction,
    requestDeleteNewCrimeData,
    requestResetCrimeType
  }
)(withRouter(UpdateCriminalModal));
