import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { CRIMINAL_PRINT } from "../../../Modal/ModalRoot";
import Button from "../../../Button/Button";
import Icon from "../../../Icon/Icon";
import Label from "../../../Label/Label";
import Subtitle from "../../../Title/Subtitle";
import Title from "../../../Title/Title";
import Switch from "../../../Switch/Switch";
import { tenprintVerifyPersonInfosSelector } from "../../../../selectors/tenprint";
import {
  customSearchSelectedPersonSelector,
  matchedRowSelector,
  customSearchResponseSelector,
  customSearchIdListSelector
} from "../../../../selectors/customSearch";
import { requestShowModal } from "../../../../actions/modal";
import { setPersonData } from "../../../../actions/customSearch";
import { requestMatchedPersonChanged } from "../../../../actions/tenprint";
import _ from "lodash";
import "../CustomSearchVerify.scss";

const findByKey = (data, key) => {
  const res = _.find(data, { key: key });
  if (res && res.value) {
    return res.value;
  }
  return "";
};

const CustomSearchVerifyTable = ({
  formatMessage,
  history,
  PersonInfos,
  setPersonData,
  selctedPersonInfos,
  requestMatchedPersonChanged,
  matchedRowID,
  requestShowModal,
  ActionStatus,
  database,
  searchId,
  response,
  matcherPersonUserId
}) => {
  let latentInfoOfUser = null;
  response.matchPersons.map(person => {
    if (person && person.persons) {
      person.persons.map(user => {
        if (user.extendedData && user.extendedData.length > 0) {
          if (latentInfoOfUser === null) {
            latentInfoOfUser = user.extendedData;
          }
        }
      });
    }
  });
  console.log("latentInfoOfUser", latentInfoOfUser);

  const handleSwitchToggle = (e, data) => {
    // console.log("data",data);
    // if (data.index === data.matchedRowID) {
    //   return requestMatchedPersonChanged(
    //     -1,
    //     data.personDet,
    //     e,
    //     data.personDet.id
    //   );
    // }

    if (
      data.index === data.matchedRowID &&
      data.personDet.persons[0].id === matcherPersonUserId
    ) {
      return requestMatchedPersonChanged(
        -1,
        { ...data.personDet, latentDetails: latentInfoOfUser },
        e,
        0
      );
    }

    return requestMatchedPersonChanged(
      data.index,
      { ...data.personDet, latentDetails: latentInfoOfUser },
      e,
      data.personDet.persons[0].id
    );
  };
  return (
    <div className="verify-table">
      <div className="match-bar">
        <Title is="5" text={formatMessage({ id: "matches" })} />
      </div>

      <table className="table is-fullwidth is-marginless">
        <thead>
          <tr>
            <th>{formatMessage({ id: "name" })}</th>
            <th>{formatMessage({ id: "SAMIS ID" })}</th>
            <th>{formatMessage({ id: "fileNumber" })}</th>
            <th>{formatMessage({ id: "latentidentifier" })}</th>
            {/* <th>{formatMessage({ id: "database" })}</th> */}
            <th>{formatMessage({ id: "select" })}</th>
            <th>{formatMessage({ id: "info" })}</th>
            <th>{formatMessage({ id: "matched" })} </th>
          </tr>
        </thead>

        <tbody>
          {response.matchPersons &&
            response.matchPersons.length > 0 &&
            response.matchPersons.map((personDet, index) => {
              // console.log("PersonDetails",personDet)
              let PersonDetails = { person: {} };
              // console.log("PersonDetails",PersonDetails)
              return (
                //  {console.log(PersonDetails,"PersonInfos===>")}
                <tr
                  key={index}
                  className={
                    selctedPersonInfos.id === personDet.id ? "selected" : ""
                  }
                  onClick={e => setPersonData(personDet, index)}
                >
                  <td>{formatMessage({ id: personDet.persons[0].name })}</td>
                  <td>{personDet.persons[0].samisid}</td>
                  <td>{personDet.persons[0].fileNumber}</td>
                  <td>
                    {findByKey(
                      personDet.persons[0].extendedData,
                      "Latent Identifier"
                    )}
                  </td>
                  {/* <td>{database}</td> */}
                  <td>
                   
                    {database === "Latent" ? (
                      searchId &&
                      searchId.find(data => data.key === "LatentID") &&
                      searchId.find(data => data.key === "LatentID").value ===
                        findByKey(
                          personDet.persons[0].extendedData,
                          "Latent Identifier"
                        ) ? (
                        <Switch
                          id={personDet.tag}
                          // onChange={e =>
                          //   handleSwitchToggle(e, {
                          //     index,
                          //     personDet,
                          //     matchedRowID
                          //   })
                          // }

                          onChange={e => {
                            console.log(
                              "index, personDet, matchedRowID",
                              index,
                              personDet,
                              matchedRowID
                            );
                            return handleSwitchToggle(e, {
                              index,
                              personDet,
                              matchedRowID
                            });
                          }}
                          value={personDet.tag}
                          disabled={ActionStatus === "Completed"}
                          // id={personDet.persons[0].name}
                          // onChange={e => requestInputFieldChanged(e, "newJob")}
                          // value={personDet.persons[0].name}
                          text=""
                          className="is-primary is-rounded"
                          // checked={matchedRowID === index}
                        />
                      ) : (
                        ""
                      )
                    ) : (
                      <Switch
                        id={personDet.tag}
                        // onChange={e =>
                        //   handleSwitchToggle(e, {
                        //     index,
                        //     personDet,
                        //     matchedRowID
                        //   })
                        // }

                        onChange={e => {
                          console.log(
                            "index, personDet, matchedRowID",
                            index,
                            personDet,
                            matchedRowID
                          );
                          return handleSwitchToggle(e, {
                            index,
                            personDet,
                            matchedRowID
                          });
                        }}
                        value={personDet.tag}
                        disabled={ActionStatus === "Completed"}
                        // id={personDet.persons[0].name}
                        // onChange={e => requestInputFieldChanged(e, "newJob")}
                        // value={personDet.persons[0].name}
                        text=""
                        className="is-primary is-rounded"
                        // checked={matchedRowID === index}
                      />
                    )}
                  </td>

                  <td>
                    <Icon
                      onClick={() =>
                        requestShowModal({
                          modalType: CRIMINAL_PRINT,
                          modalProps: {
                            info: personDet,
                            latentInfo: latentInfoOfUser
                          }
                        })
                      }
                      icon="external-link"
                      title={formatMessage({ id: "openMug" })}
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                  <td>
                    {personDet.decision === "Matched" &&
                    ActionStatus === "Completed" ? (
                      <Icon
                        icon="check"
                        title={formatMessage({ id: "matched" })}
                      />
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

const mapState = state => ({
  PersonInfos: tenprintVerifyPersonInfosSelector(state),
  selctedPersonInfos: customSearchSelectedPersonSelector(state),
  matchedRowID: matchedRowSelector(state),
  response: customSearchResponseSelector(state),
  searchId: customSearchIdListSelector(state),
  matcherPersonUserId: state.tenprint.MatchedPersonUserID
});
export default connect(
  mapState,
  {
    setPersonData,
    requestMatchedPersonChanged,
    requestShowModal
  }
)(withRouter(CustomSearchVerifyTable));
