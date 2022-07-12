import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Image from "../../../Image/Image";
import Icon from "../../../Icon/Icon";
import Switch from "../../../Switch/Switch";
import Title from "../../../Title/Title";
import { requestShowModal } from "../../../../actions/modal";
import { CRIMINAL_PRINT } from "../../../Modal/ModalRoot";
// MatchedUserRowID

export function TenprintVerifyTable({
  formatMessage,
  history,
  // LeftFingers,
  // RightFingers,
  // PersonInfos,
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
  tenprint,
  requestSetTenprintVerifyHand,
  panes,
  requestTogglePaneVisibility,
  database
}) {
  const handleSwitchToggle = (e, data) => {
    // data = index, PersonDetails
    if (data.index === data.matchedRowID) {
      return requestMatchedPersonChanged(
        -1,
        data.PersonDetails,
        e,
        data.PersonDetails.id
      );
    }
    return requestMatchedPersonChanged(
      data.index,
      data.PersonDetails,
      e,
      data.PersonDetails.id
    );
  };
  // console.log("TABLE tenprint", tenprint);
  const PersonInfos = tenprint.tenprint.matchPersons;

  if ( ! panes.table ) { return null; }

  return (
    <div className="tenprint-verify-table">
      {PersonInfos.length !== 0 ? (
        <div>
          <div className="match-bar">
          <Title is="5" text={formatMessage({ id: "matches" })} />
        </div>
        <table className="table is-fullwidth is-marginless">
          <thead>
          <tr>
            <th>{formatMessage({ id: "name" })}</th>
            {/* <th>{database==="Latent"?formatMessage({ id: "Latent ID" }):database==="Criminal"?formatMessage({ id: "SAMIS ID" })}</th> */}
            {database==="Latent"? <th>{formatMessage({ id: "BioID" })}</th>:database==="Criminal"||database==="Civil"? <th>{formatMessage({ id: "SAMIS ID" })}</th>:""}
            {database==="Latent"||database==="Civil"?"":<th>{formatMessage({ id: "fileNumber" })}</th>}
            <th>{formatMessage({ id: "Score" })}</th>
            <th>{formatMessage({ id: "select" })}</th>
            <th>{formatMessage({ id: "info" })}</th>
            <th>{formatMessage({ id: "decision" })} </th>
          </tr>
          </thead>
          <tbody>
          {PersonInfos.map((PersonDetails, index) => {
            // console.log("table PersonDetails, index", PersonDetails, index);
            return (
              <tr
                key={index}
                className={SelectedRow === index ? "selected" : ""}
                onClick={() => {
                  // console.log("CLICKED!!!!", SelectedHandInfo);
                  requestSetTenprintVerifyHand({
                    position: SelectedHandInfo.position
                  });
                  if (
                    SelectedHandInfo.position === "Left" ||
                    SelectedHandInfo.position === "LeftHandFlat"
                  ) {
                    requestSetTenprintVerifyMatchData({
                      MatchID: index,
                      position: SelectedHandInfo.position,
                      Results: LeftMatches.fingers,
                      SelectedRow: index
                    });
                  } else if (
                    SelectedHandInfo.position === "Right" ||
                    SelectedHandInfo.position === "RightHandFlat"
                  ) {
                    requestSetTenprintVerifyMatchData({
                      MatchID: index,
                      position: SelectedHandInfo.position,
                      Results: RightMatches.fingers,
                      SelectedRow: index
                    });
                  } else if (SelectedHandInfo.position === "LeftHandRolled") {
                    requestSetTenprintVerifyMatchData({
                      MatchID: index,
                      position: SelectedHandInfo.position,
                      Results: [],
                      SelectedRow: index
                    });
                  } else if (SelectedHandInfo.position === "RightHandRolled") {
                    requestSetTenprintVerifyMatchData({
                      MatchID: index,
                      position: SelectedHandInfo.position,
                      Results: [],
                      SelectedRow: index
                    });
                  } else if ( SelectedHandInfo.position === "Mugshot" ) {
                    requestSetTenprintVerifyMatchData({
                      MatchID: index,
                      position: SelectedHandInfo.position,
                      Results: [],
                      SelectedRow: index
                    });
                  }
                  else {
                    requestSetTenprintVerifyMatchData({
                      MatchID: index,
                      position: SelectedHandInfo.position,
                      Results: [],
                      SelectedRow: index
                    });
                  }
                }}
              >
                <td>
                  {" "}
                  {PersonDetails.person.name}
                </td>
                <td>{database==="Latent"?PersonDetails.person.extendedData.find(
                              data => data.key === "Latent Identifier"
                            ).value:PersonDetails.person.samisid}</td>
                {database==="Criminal"?<td>{PersonDetails.person.fileNumber}</td>:""}
                <td>{ PersonDetails.score }</td>
                <td>
                  <Switch
                    id={PersonDetails.tag}
                    onChange={e => {
                      requestSetTenprintVerifyHand({
                        position: SelectedHandInfo.position
                      });
                      handleSwitchToggle(e, {
                        index,
                        PersonDetails,
                        matchedRowID
                      });
                    }}
                    value={PersonDetails.tag}
                    disabled={ActionStatus === "Completed"}
                    id={PersonDetails.person.name}
                    value={PersonDetails.person.name}
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
                  {/* {PersonDetails.decision === "Matched" &&
                  ActionStatus === "Completed" ? (
                    <Icon
                      icon="check"
                      title={formatMessage({ id: "matched" })}
                    />
                  ) : (
                    ""
                  )} */}
                </td>
                <td>
                  { PersonDetails.decision }
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
export default withRouter(TenprintVerifyTable);
