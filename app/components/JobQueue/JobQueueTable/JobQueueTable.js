import React, { Fragment } from "react";
import { connect } from "react-redux";
import Table from "../../Table/Table";
import Icon from "../../Icon/Icon";
import { requestShowNotification } from "../../../actions/notifications";
import {
  REMOVE_JOB,
  NEW_ACTION,
  CUSTOM_SEARCH_MODAL
} from "../../Modal/ModalRoot";
import "./JobQueueTable.scss";
import { requestLogout } from "../../../actions/auth";
import { requestSetLocale } from "../../../actions/locale";
import { requestJobAuditLogs } from "../../../actions/auditlog";
import { requestGetJobSearchText } from "../../../actions/customSearch";
// import { formatDate } from '../../../utils/date';
import DateDisplay from "../../../utils/date";

import Permissions from "../../Permissions";

export const JobQueueTable = ({
  headers,
  data,
  onClick,
  paging,
  formatMessage,
  requestShowModal,
  requestAscSort,
  selectedJob,
  requestOpenJob,
  userrole,
  locale,
  requestShowNotification,
  requestJobAuditLogs,
  requestGetJobSearchText
}) => {
  // headers.push("Action");
  return (
    <Fragment>
      <Table
        className="is-bordered jobQueue-table is-hoverable"
        headers={headers}
        disableSort={["Action"]}
        sortdata={"job"}
        requestAscSort={requestAscSort}
        data={data}
        formatMessage={formatMessage}
        content={
          data &&
          data.length > 0 &&
          data.map((job, i) => {
            return (
              <Fragment key={i.toString()}>
                <tr
                  onClick={() =>
                    onClick(job.id, "jobQueue", job.status, job.type)
                  }
                  className={job.id == selectedJob ? "selected" : ""}
                >
                  <td> {job.id}</td>
                  <td>
                    <DateDisplay
                      hijri={job.createdOn}
                      gregorian={job.gregCreatedOn}
                    />
                  </td>
                  <td>{formatMessage({ id: job.createdBy })}</td>
                  <td>{job.terminalID}</td>
                  <td>{formatMessage({ id: job.type })}</td>
                  <td>
                    <div className="td-status-actions">
                      <span>{formatMessage({ id: job.status })}</span>
                    </div>
                  </td>
                  <td>
                    <div className="td-actions">
                      {job.type !== "Custom" ? (
                        <Permissions version={2} type="search">
                          <span
                            onClick={event => {
                              // event.stopPropagation();
                              job.status !== "New"
                                ? requestShowModal({ modalType: NEW_ACTION })
                                : requestShowNotification({
                                    message: "Biometrics not Scanned ",
                                    type: "is-warning"
                                  });
                            }}
                          >
                            {formatMessage({ id: "action" })}
                          </span>
                        </Permissions>
                      ) : (
                        <Permissions version={2} type="search">
                          <span
                            onClick={event => {
                              job.status !== "New"
                                ? (requestGetJobSearchText(job.id),
                                  requestShowModal({
                                    modalType: CUSTOM_SEARCH_MODAL
                                  }))
                                : requestShowNotification({
                                    message: "Data not entered",
                                    type: "is-warning"
                                  });
                            }}
                          >
                            {formatMessage({ id: "action" })}
                          </span>
                        </Permissions>
                      )}

                      <span>
                        <a>
                          {" "}
                          <Icon
                            onClick={event => {
                              // event.stopPropagation();
                              requestOpenJob({
                                jobID: job.id,
                                jobStatus: job.status,
                                jobType: job.type
                              });
                              // onClick(job.id, "setSelectedJob");
                              onClick(job.id, "jobQueue", job.status, job.type);
                            }}
                            icon="external-link"
                            title={formatMessage({ id: "openJob" })}
                          />
                        </a>
                        <a>
                          <Icon
                            onClick={() =>
                              requestJobAuditLogs({ job: job.id, type: "open" })
                            }
                            icon="list-ul"
                            title={formatMessage({ id: "openAuditLog" })}
                          />
                        </a>

                        <Permissions version={2} type="menu.job.delete">
                          <a>
                            {" "}
                            <Icon
                              icon="trash"
                              onClick={event => {
                                event.stopPropagation();
                                requestShowModal({
                                  modalType: REMOVE_JOB,
                                  modalProps: { jobId: job.id }
                                });
                              }}
                              title={formatMessage({ id: "deleteJob" })}
                            />
                          </a>
                        </Permissions>
                      </span>
                    </div>
                  </td>
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
const mapState = ({ auth, locale }) => ({
  userrole: auth.roles,
  locale: locale.displayName
});
export default connect(
  mapState,
  {
    requestShowNotification,
    requestJobAuditLogs,
    requestGetJobSearchText
  }
)(JobQueueTable);
// export default JobQueueTable;
