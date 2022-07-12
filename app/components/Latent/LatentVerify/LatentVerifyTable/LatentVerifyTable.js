import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Image from "../../../Image/Image";
import Icon from "../../../Icon/Icon";
import Switch from "../../../Switch/Switch";
import { requestShowModal } from "../../../../actions/modal";
import { CRIMINAL_PRINT } from "../../../Modal/ModalRoot";
export function LatentVerifyTable({
  formatMessage,
  history,
  LeftFingers,
  RightFingers,
  PersonInfos,
  SelectedHandInfo,
  LeftMatches,
  RightMatches,
  passobject,
  requestSetTenprintVerifyMatchData,
  requestMatchedPersonChanged,
  MatchInfos,
  SelectedRow,
  requestShowModal,
  ActionStatus,
  matchedRowID,
  panes,
  requestTogglePaneVisibility,
  database
}) {

  console.log("LatentVerifyTable::PersonInfos, SelectedHandInfo, SelectedRow, matchedRowID", PersonInfos, SelectedHandInfo, SelectedRow, matchedRowID );





  const handleSetTenprintVerifyMatchData = ( index  ) => {
    // console.log("handleSetTenprintVerifyMatchData::index", index, SelectedHandInfo.position);
    requestSetTenprintVerifyMatchData({
      MatchID: index,
      position: SelectedHandInfo.position,
      Results: RightMatches.fingers,
      SelectedRow: index
    });
  }




if ( SelectedRow === 0 ) {

  if (SelectedHandInfo.position === "Left" && LeftMatches.fingers.length > 0 ) {
    setTimeout(function() {
      handleSetTenprintVerifyMatchData({
        MatchID: 0,
        position: SelectedHandInfo.position,
        Results: LeftMatches.fingers,
        SelectedRow: 0
      });
    }, 100);
  } else if (SelectedHandInfo.position === "Right" || RightMatches.fingers.length  > 0 ) {
    setTimeout(function() {
      handleSetTenprintVerifyMatchData({
        MatchID: 0,
        position: SelectedHandInfo.position,
        Results: RightMatches.fingers,
        SelectedRow: 0
      });
    }, 100);
  }

}




  const handleSwitchToggle = (e, data) => {
    console.log("::handleSwitchToggle:: e, data", e, data);
    // data = index, PersonDetails

    if (data.index === data.matchedRowID) {
      return requestMatchedPersonChanged(
        "abcd",
        data.PersonDetails,
        e,
        data.PersonDetails.id
      );
    }
    else {
      return requestMatchedPersonChanged(
        data.index,
        data.PersonDetails,
        e,
        data.PersonDetails.id
      );
    }
  };

  if (!panes.table) {
    return null;
  }

  return (
    <div>
      {PersonInfos.length !== 0 ? (
        <table className="table is-fullwidth is-marginless">
          <tr>
            <th>{formatMessage({ id: "name" })}</th>
            {/* <th>{formatMessage({ id: "SAMIS ID" })}</th> */}
            {database === "Latent" ? (
              <th>{formatMessage({ id: "BioID" })}</th>
            ) : database === "Criminal" || database === "Civil" ? (
              <th>{formatMessage({ id: "SAMIS ID" })}</th>
            ) : (
              ""
            )}
            {/* <th>{formatMessage({ id: "fileNumber" })}</th> */}
            {database === "Latent" || database === "Civil" ? (
              ""
            ) : (
              <th>{formatMessage({ id: "fileNumber" })}</th>
            )}
            <th>{formatMessage({ id: "Score" })}</th>
            <th>{formatMessage({ id: "select" })}</th>
            <th>{formatMessage({ id: "info" })}</th>
            <th>{formatMessage({ id: "decision" })} </th>
          </tr>
          {PersonInfos && PersonInfos.length > 0 && PersonInfos.map((PersonDetails, index) => {
            let currentPerson = {};
            if ( PersonDetails.persons && Array.isArray(PersonDetails.persons) && PersonDetails.persons.length > 0 ) {
              currentPerson = PersonDetails.persons[0];
            }
            console.log("-- table", SelectedRow, index)
            console.log("matchedRowID",matchedRowID);

            return (
              <tr 
                key={index}
                className={ SelectedRow && SelectedRow.SelectedRow === index ? "selected" : "" }
                // className={SelectedRow && SelectedRow.SelectedRow === index ? "selected" : SelectedRow === index ? "selected" : ""}
                onClick={() => {
                  // console.log("hello - row clicked", index, SelectedHandInfo, LeftMatches, RightMatches )
                  if (SelectedHandInfo.position === "Left" && LeftMatches.fingers.length > 0 ) {
                    handleSetTenprintVerifyMatchData({
                      MatchID: index,
                      position: SelectedHandInfo.position,
                      Results: LeftMatches.fingers,
                      SelectedRow: index
                    });
                  } else if (SelectedHandInfo.position === "Right" || RightMatches.fingers.length  > 0 ) {
                    handleSetTenprintVerifyMatchData({
                      MatchID: index,
                      position: SelectedHandInfo.position,
                      Results: RightMatches.fingers,
                      SelectedRow: index
                    });
                  }
                }}
              >
                <td>{currentPerson.name}</td>

                {/*
                <td>
                  {database === "Latent"
                    ? PersonDetails.person.extendedData.find(
                        data => data.key === "Latent Identifier"
                      ).value
                    : PersonDetails.person[0].samisid}
                </td>
                */}

                <td>
                  {database === "Latent"
                    ?PersonDetails.additionalMatchInfos.length>0? PersonDetails.additionalMatchInfos[0].additionalMatchDatas.find(
                        data => data.key === "Latent Identifier"
                      ).value
                    : currentPerson.samisid : currentPerson.samisid}
                </td>


                {database === "Criminal" ? (
                  <td>{currentPerson.fileNumber}</td>
                ) : (
                  ""
                )}

                <td>{PersonDetails.score}</td>
                <td style={{paddingLeft:0}} id="switchTdLatent" >
                  <Switch
                    id={PersonDetails.tag}
                    onChange={ e => {
                        handleSwitchToggle(e, {
                          index,
                          PersonDetails,
                          matchedRowID
                        })
                      }
                    }
                    value={PersonDetails.tag}
                    disabled={ActionStatus === "Completed"}
                    id={currentPerson.name}
                    // onChange={e => requestInputFieldChanged(e, "newJob")}
                    value={currentPerson.name}
                    text=""
                    className="is-primary is-rounded"
                    // checked={matchedRowID === index}
                    // checked={ PersonDetails.decision === "Matched" ? true : false }
                  />
                </td>
                <td>
                  <Icon
                    onClick={() =>
                      requestShowModal({
                        modalType: CRIMINAL_PRINT,
                        modalProps: {
                          info: PersonDetails
                        }
                      })
                    }
                    icon="external-link"
                    title={formatMessage({ id: "openMug" })}
                  />
                  &nbsp;&nbsp;
                </td>
                <td>
                  { PersonDetails.decision }
                </td>
              </tr>
            );
          })}
        </table>
      ) : (
        ""
      )}
    </div>
  );
}
export default withRouter(LatentVerifyTable);
