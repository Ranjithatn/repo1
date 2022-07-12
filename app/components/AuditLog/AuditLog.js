import React, { Fragment } from "react";
import { connect } from "react-redux";
import AuditLogNavbar from "./AuditLogNavbar/AuditLogNavbar";
import AuditLogTable from "./AuditLogTable/AuditLogTable";
import Pagination from "../Pagination/Pagination";
import Subtitle from "../Title/Subtitle";
import {requestPageChanged} from "../../actions/global"
import "./AuditLog.scss";
import {
    auditlogsPagesSelector,
    auditlogsTotalPagesSelector,
    auditlogsCurrentPageSelector,
    auditlogsMaxPagesSelector
} from "../../selectors/auditlog"
const AuditLog = ({
    formatMessage,
    // pages,
    // totalPages,
    // currentPage,
    // maxPages,
    // requestPageChanged
   
  }) => {
    return (
        <Fragment>
            <AuditLogNavbar
            formatMessage={formatMessage}
            />
            <AuditLogTable
            formatMessage={formatMessage}
            />
             {/* <Pagination
                  pages={pages}
                  nextPageText={formatMessage({ id: "nextPage" })}
                  prevPageText={formatMessage({ id: "prevPage" })}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  maxPages={maxPages}
                  onClick={e => requestPageChanged(e, "AuditLog")}
                /> */}
            
           </Fragment> 
    )}
   
    export default AuditLog;