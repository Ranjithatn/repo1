import React, { Fragment } from "react";
import Table from "../../Table/Table";
import "./ActionHistoryTable.scss";
// import { formatDate } from "../../../utils/date";
import Permissions from "../../Permissions";
import DateDisplay from '../../../utils/date';

const ActionHistoryTable = ({
  headers,
  data,
  onClick,
  paging,
  selectedAction,
  selectedJob,
  requestTenprintVerify,
  requestHistorySort,
  formatMessage
}) => {
  return (
    <Fragment>
      <Table
        className="is-bordered actionHistory-table"
        headers={headers}
        sortdata={"history"}
        requestHistorySort={requestHistorySort}
        formatMessage={formatMessage}
        data={data}
        content={
          data &&
          data.length > 0 &&
          data.map((action, i) => {


            // let perType = "";
            // // console.log("action.database",action.database);
            // if (action.database === "Civil") {
            //   perType = "menu.civil.viewresult";
            // }
            // if (action.database === "Criminal") {
            //   perType = "menu.criminal.viewresult";
            // }
            // if (action.database === "Latent") {
            //   perType = "menu.latent.viewresult";
            // }
                // <Permissions version={2} type={perType}></Permissions>


            return (
              <Fragment key={i}>
                  <tr
                    className={action.id === selectedAction ? "selected" : ""}
                    onClick={() => {
                      onClick(
                        action.id,
                        "actionHistory",
                        action.status,
                        action.actionType,
                        action.tcn
                      );
                      requestTenprintVerify({
                        JOBID: parseInt(action.id),
                        status: action.status,
                        formatMessage: formatMessage,
                        note: action.note
                      });
                    }}
                  >
                    <td>{formatMessage({ id: action.actionType })}</td>
                    <td>{formatMessage({ id:action.status})}</td>
                    <td>{action.tcn}</td>
                    <td>{formatMessage({ id: action.by })}</td>
                    <td><DateDisplay hijri={action.createdOn} gregorian={action.gregCreatedOn} /></td>
                  </tr>

              </Fragment>
            );
          })
        }
      />
      {paging}
    </Fragment>
  );
};

export default ActionHistoryTable;
