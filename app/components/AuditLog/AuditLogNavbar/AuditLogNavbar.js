import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Icon from "../../Icon/Icon";
import Button from "../../Button/Button";
import Image from "../../Image/Image";
import Title from "../../Title/Title";
import { requestShowAuditLog } from "../../../actions/auditlog"
export const AuditLogNavbar = ({ formatMessage, history, requestShowAuditLog }) => {
  return (
    <Fragment>
      <div className="audit-log-navbar" style={{ display: 'flex', justifyContent: 'space-between' }}>

        <div className="home-logo-icon">
          <Icon icon="home fa-2x" onClick={ (e) => { history.push("/authenticated/jobqueue"); } } />
        </div>

        <div className="">
          <Title is="4" text={formatMessage({ id: "AuditLogs" })} />
        </div>
        <div className="right">
        </div>
      </div>
    </Fragment>
  );
};
const mapState = ({ state }) => ({});
export default connect(mapState, { requestShowAuditLog })(withRouter(AuditLogNavbar));
