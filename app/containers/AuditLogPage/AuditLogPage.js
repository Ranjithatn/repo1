import React, { Component, Fragment } from "react";
import { Route } from "react-router-dom";
import { injectIntl } from "react-intl";
import AuditLog from "components/AuditLog/AuditLog";
import JobAuditLog from "components/AuditLog/JobAuditLog/JobAuditLog";
import "./AuditLogPage.scss";

const AuditLogPage = ({ intl }) => {
  const { formatMessage } = intl;

  return (
    <div id="auditlog">
      <Route
        exact
        path="/authenticated/auditlog/logs"
        render={() => <AuditLog formatMessage={formatMessage} />}
      />
      <Route
        exact
        path="/authenticated/auditlog/joblogs"
        render={() => <JobAuditLog formatMessage={formatMessage} />}
      />
    </div>
  );
};
export default injectIntl(AuditLogPage);
