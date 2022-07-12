import React, { Fragment } from "react";

import JobQueueNavbar from "./JobQueueNavbar/JobQueueNavbar";
import JobQueueTable from "./JobQueueTable/JobQueueTable";
import Pagination from "../Pagination/Pagination";
import Subtitle from "../Title/Subtitle";
import "./JobQueue.scss";

const JobQueue = ({
  pages,
  jobFilter,
  currentPage,
  maxPages,
  totalPages,
  requestActiveJobs,
  requestShowModal,
  jobsList,
  selectedJob,
  requestPageChanged,
  requestTableRowClicked,
  formatMessage,
  requestAscSort,
  requestOpenJob,
  requestInputFieldChanged,
  requestShowJobFilteredData,
  requestCloseFilter,
  requestCloseActionFilter,
  requestSetpage,
  requestResetAditlogFilter,
  lookups,
  requestWildcardSearch,
  requestSetWildcardSearch,
  wildcardSearchTextSelector,
  requestSystemPermissions
}) => {
  requestSetpage("home");
  requestResetAditlogFilter()
  return (
    <Fragment>
      <JobQueueNavbar
        jobFilter={jobFilter}
        formatMessage={formatMessage}
        requestActiveJobs={requestActiveJobs}
        requestShowModal={requestShowModal}
        requestInputFieldChanged={requestInputFieldChanged}
        requestShowJobFilteredData={requestShowJobFilteredData}
        requestCloseFilter={requestCloseFilter}
        requestCloseActionFilter={requestCloseActionFilter}
        lookups={lookups}
        requestWildcardSearch={requestWildcardSearch}
        requestSetWildcardSearch={requestSetWildcardSearch}
        wildcardSearchTextSelector={wildcardSearchTextSelector}
        requestSystemPermissions={requestSystemPermissions}
      />
      <div className="jobs-table-container">
        {//jobsList &&
          // jobsList.length > 0 && (
            <JobQueueTable
              requestOpenJob={requestOpenJob}
              formatMessage={formatMessage}
              selectedJob={selectedJob}
              data={jobsList}
              onClick={requestTableRowClicked}
              requestShowModal={requestShowModal}
              requestAscSort={requestAscSort}
              headers={[
                formatMessage({ id: "jobId" }),
                formatMessage({ id: "inputDateTime" }),
                formatMessage({ id: "userId" }),
                formatMessage({ id: "terminalId" }),
                formatMessage({ id: "jobType" }),
                formatMessage({ id: "status" }),
                formatMessage({ id: "Action" })
              ]}
              paging={
                jobsList &&
                <Pagination
                  pages={pages}
                  nextPageText={formatMessage({ id: "nextPage" })}
                  prevPageText={formatMessage({ id: "prevPage" })}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  maxPages={maxPages}
                  onClick={e => requestPageChanged(e, "jobQueue")}
                />
              }
            />
          //)
          }
      </div>
    </Fragment>
  );
};

export default JobQueue;
