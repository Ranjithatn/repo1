// @flow
import React, { Fragment } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import {
  requestActiveJobs,
  requestAscSort,
  requestRemoveFilter,
  requestShowFilteredData,
  requestOpenJob,
  requestShowJobFilteredData,
  requestHistorySort,
  requestCloseFilter,
  requestCloseActionFilter,
  requestSetpage,
  requestWildcardSearch,
  requestSetWildcardSearch,
  requestSetWildcardActionSearch,
  requestSystemPermissions
} from "../../actions/jobs";
import { requestShowModal } from "../../actions/modal";
import {requestTenprintVerify}from "../../actions/tenprint"
import {requestResetAditlogFilter}from "../../actions/auditlog"
import { requestInputFieldChanged } from "../../actions/global";
import {
  requestPageChanged,
  requestTableRowClicked
} from "../../actions/global";
import { requestShowNotification } from "../../actions/notifications";

import {
  selectedJobSelector,
  selectedActionSelector,
  actionHistoryListSelector,
  jobsPagesSelector,
  jobsMaxPagesSelector,
  jobsCurrentPageSelector,
  jobsTotalPagesSelector,
  jobsListSelector,
  ActionHistoryFilterSelector,
  jobfilterSelector,
  wildcardSearchTextSelector,
  wildacardActionSearchTextSelector
} from "../../selectors/jobs";

import {
  lookupsSelector
} from "../../selectors/auth";


import JobQueue from "../../components/JobQueue/JobQueue";
import ActionHistory from "../../components/ActionHistory/ActionHistory";

const mapState = state => ({
  jobsList: jobsListSelector(state),
  filter: ActionHistoryFilterSelector(state),
  jobFilter: jobfilterSelector(state),
  selectedJob: selectedJobSelector(state),
  selectedAction: selectedActionSelector(state),
  actionHistoryList: actionHistoryListSelector(state),
  jobsPages: jobsPagesSelector(state),
  jobsCurrentPage: jobsCurrentPageSelector(state),
  jobsMaxPages: jobsMaxPagesSelector(state),
  jobsTotalPages: jobsTotalPagesSelector(state),
  lookups: lookupsSelector(state),
  wildcardSearchTextSelector: wildcardSearchTextSelector(state),
  wildacardActionSearchTextSelector: wildacardActionSearchTextSelector(state),
});

const JobQueuePage = ({
  jobsPages,
  jobsCurrentPage,
  jobsMaxPages,
  jobsTotalPages,
  jobsList,
  filter,
  jobFilter,
  selectedJob,
  actionHistoryList,
  selectedAction,
  requestActiveJobs,
  requestShowModal,
  requestPageChanged,
  requestTenprintVerify,
  requestTableRowClicked,
  requestInputFieldChanged,
  requestRemoveFilter,
  requestShowFilteredData,
  requestAscSort,
  onClick,
  requestOpenJob,
  requestHistorySort,
  intl,
  requestShowJobFilteredData,
  requestCloseFilter,
  requestCloseActionFilter,
  requestSetpage,
  requestResetAditlogFilter,
  lookups,
  requestWildcardSearch,
  requestSetWildcardSearch,
  wildcardSearchTextSelector,
  requestSetWildcardActionSearch,
  wildacardActionSearchTextSelector,
  requestSystemPermissions
}) => {
  const { formatMessage } = intl;
  return (
    <Fragment>
      <JobQueue
        formatMessage={formatMessage}
        jobFilter={jobFilter}
        pages={jobsPages}
        currentPage={jobsCurrentPage}
        maxPages={jobsMaxPages}
        totalPages={jobsTotalPages}
        jobsList={jobsList}
        requestAscSort={requestAscSort}
        selectedJob={selectedJob}
        requestTableRowClicked={requestTableRowClicked}
        requestPageChanged={requestPageChanged}
        requestActiveJobs={requestActiveJobs}
        requestShowModal={requestShowModal}
        requestOpenJob={requestOpenJob}
        requestInputFieldChanged={requestInputFieldChanged}
        requestShowJobFilteredData={requestShowJobFilteredData}
        requestCloseFilter={requestCloseFilter}
        requestCloseActionFilter={requestCloseActionFilter}
        requestSetpage={requestSetpage}
        requestResetAditlogFilter={requestResetAditlogFilter}
        lookups={lookups}
        requestWildcardSearch={requestWildcardSearch}
        requestSetWildcardSearch={requestSetWildcardSearch}
        wildcardSearchTextSelector={wildcardSearchTextSelector}
        requestSystemPermissions={requestSystemPermissions}
      />
      {selectedJob && (
        <ActionHistory
        filter={filter}
        onClick={onClick}
        requestHistorySort={requestHistorySort}
          selectedJob={selectedJob}
          requestTenprintVerify={requestTenprintVerify}
          actionHistoryList={actionHistoryList}
          requestShowModal={requestShowModal}
          selectedAction={selectedAction}
          formatMessage={formatMessage}
          actionHistoryList={actionHistoryList}
          requestPageChanged={requestPageChanged}
          requestTableRowClicked={requestTableRowClicked}
          requestInputFieldChanged={requestInputFieldChanged}
          requestRemoveFilter={requestRemoveFilter}
          requestShowFilteredData={requestShowFilteredData}
 requestTenprintVerify={requestTenprintVerify}
          requestAscSort={requestAscSort}
          requestCloseActionFilter={requestCloseActionFilter}
          requestSetWildcardActionSearch={requestSetWildcardActionSearch}
          wildacardActionSearchTextSelector={wildacardActionSearchTextSelector}
        />
      )}
    </Fragment>
  );
};

// pass down all actions and state the components need
// translations passed down from the injectIntl HOC using formatMessage
export default connect(mapState, {
  requestActiveJobs,
  requestShowModal,
  requestPageChanged,
  requestTableRowClicked,
  requestInputFieldChanged,
  requestRemoveFilter,
  requestShowFilteredData,
  requestAscSort,
  requestOpenJob,
  requestShowJobFilteredData,
  requestTenprintVerify,
  requestHistorySort,
  requestCloseFilter,
  requestCloseActionFilter,
  requestSetpage,
  requestResetAditlogFilter,
  requestWildcardSearch,
  requestSetWildcardSearch,
  requestSetWildcardActionSearch,
  requestSystemPermissions
})(injectIntl(JobQueuePage));
