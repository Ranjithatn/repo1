import React, { Fragment } from "react";
import ActionHistoryTable from "./ActionHistoryTable/ActionHistoryTable";
import ActionHistoryNavbar from "./ActionHistoryNavbar/ActionHistoryNavbar";
import Subtitle from "../Title/Subtitle";
import Pagination from "../Pagination/Pagination";

const ActionHistory = ({
  // pages,
  // currentPage,
  // maxPages,
  // totalPages,
  actionHistoryList,
  filter,
  onClick,
  formatMessage,
  requestTableRowClicked,
  requestShowModal,
  selectedAction,
  requestPageChanged,
  requestInputFieldChanged,
  requestRemoveFilter,
  selectedJob,
  requestTenprintVerify,
  requestShowFilteredData,
  requestAscSort,
  requestHistorySort,
  requestCloseActionFilter,
  requestSetWildcardActionSearch,
  wildacardActionSearchTextSelector
}) => {
  return (
    <Fragment>
      <div id="actionHistory-container">
        <ActionHistoryNavbar
          filter={filter}
          requestShowModal={requestShowModal}
          formatMessage={formatMessage}
          requestInputFieldChanged={requestInputFieldChanged}
          requestRemoveFilter={requestRemoveFilter}
          requestShowFilteredData={requestShowFilteredData}
          requestCloseActionFilter={requestCloseActionFilter}
          requestSetWildcardActionSearch={requestSetWildcardActionSearch}
          wildacardActionSearchTextSelector={wildacardActionSearchTextSelector}
        />
        {
          // actionHistoryList &&
          // actionHistoryList.length > 0 && (
            <div className="actionHistory-table-container">
              <ActionHistoryTable
                onClick={onClick}
                requestHistorySort={requestHistorySort}
                requestAscSort={requestAscSort}
                requestTenprintVerify={requestTenprintVerify}
                selectedJob={selectedJob}
                selectedAction={selectedAction}
                data={actionHistoryList}
                onClick={requestTableRowClicked}
                formatMessage={formatMessage}
                headers={[
                  formatMessage({ id: "actionType" }),
                  formatMessage({ id: "actionState" }),
                  formatMessage({ id: "tcn" }),
                  formatMessage({ id: "userId" }),
                  formatMessage({ id: "dateTime" })
                ]}
                // paging={
                //   <Pagination
                //     pages={pages}
                //     totalPages={totalPages}
                //     nextPageText={formatMessage({ id: "nextPage" })}
                //     prevPageText={formatMessage({ id: "prevPage" })}
                //     currentPage={currentPage}
                //     maxPages={maxPages}
                //     onClick={e => requestPageChanged(e, "actionHistory")}
                //   />
                // }
              />
            </div>
          // )
          }


        {actionHistoryList &&
          actionHistoryList.length === 0 && (
            <Subtitle is="6" text={formatMessage({ id: "noActionHistory" })} />
          )}
      </div>
    </Fragment>
  );
};

export default ActionHistory;
