import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
// import { injectIntl } from "react-intl";

import Button from "../../Button/Button";
import Title from "../../Title/Title";
import Subtitle from "../../Title/Subtitle";
import Label from "../../Label/Label";
import Icon from "../../Icon/Icon";
import { jobAuditLogSelector } from "../../../selectors/auditlog";
import { selectedJobSelector } from "../../../selectors/jobs";
import { requestShowModal } from "../../../actions/modal";
import { requestJobAuditLogs } from "../../../actions/auditlog";
import { sortFields } from "../../../utils/sort";
import DateDisplay from '../../../utils/date';

import "./JobAuditLog.scss";

export class JobAuditLog extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      filter: {
        key: "",
        order: ""
      }
    };
    this.sortByField = this.sortByField.bind(this);
    this.convertToArray = this.convertToArray.bind(this);
  }

  componentDidMount() {
    const data = this.convertToArray(this.props.jobAuditLog);
    this.setState({ data: data });
  }

  componentWillReceiveProps(props) {
    let data = this.convertToArray(props.jobAuditLog);
    this.setState({ data: data, filter: { key: "" } });
  }

  // taking objects and converting it into array so we can easily add filter.
  convertToArray(data) {
    console.log("convertToArray data", data);
    console.log("Object.keys(data).length", Object.keys(data).length);
    if (Object.keys(data).length > 0) {
      const final = [];
      Object.keys(data).map(res => {
        final.push(data[res]);
      });
      console.log("final", final);
      return final;
    } else {
      return [];
    }
  }
  sortByField(type, order, fieldType = "string", data) {
    console.log("type", type);
    console.log("order", order);
    console.log("fieldType", fieldType);
    console.log("data", data);

    let _data = null;
    if (data) {
      _data = data;
      console.log("inside data, its", data);
    } else {
      _data = this.state.data;
    }

    const output = sortFields(_data, type, order, fieldType);
    this.setState({ filter: { key: type, order: order }, data: output });
  }

  render() {
    const {
      formatMessage,
      history,
      jobAuditLog,
      requestShowModal,
      jobId,
      requestJobAuditLogs
    } = this.props;

    const getStyle = type => {
      if (type === this.state.filter.key) {
        return { backgroundColor: "#EEE" };
      }
      return {};
    };

    let data = null;
    if (this.state.data && this.state.data.length > 0) {
      data = this.state.data;
    } else {
      data = this.convertToArray(jobAuditLog);
    }

    return (
      <Fragment>
        <div className="internallog-top" style={{ display: 'flex', justifyContent: 'space-between' }}>

          <div className="home-logo-icon">
            <Icon icon="home fa-2x" onClick={ (e) => { history.push("/authenticated/jobqueue"); } } />
          </div>

          <div>
            <Title
              is="4"
              text={formatMessage({ id: "jobId" }) + " : " + jobId}
            />
          </div>
          <div>
            <Button
              text={formatMessage({ id: "refresh" })}
              className="is-primary"
              leftIcon="refresh"
              onClick={() =>
                requestJobAuditLogs({ job: jobId, type: "refresh" })
              }
            />
            &nbsp;&nbsp;&nbsp;
          </div>
        </div>

        <table className="table is-fullwidth is-marginless ">
        <thead>
          <tr>
            <th style={getStyle("createdOn")}>
              {formatMessage({ id: "dateTime" })}
              <span>
                <Icon
                  icon="angle-up"
                  onClick={() => {
                    this.sortByField("createdOn", "asc");
                  }}
                />
              </span>
              <span>
                <Icon
                  icon="angle-down"
                  onClick={() => {
                    this.sortByField("createdOn", "desc");
                  }}
                />
              </span>
            </th>
            <th style={getStyle("changedBy")}>
              {formatMessage({ id: "user" })}
              <span>
                <Icon
                  icon="angle-up"
                  onClick={() => {
                    this.sortByField("changedBy", "asc");
                  }}
                />
              </span>
              <span>
                <Icon
                  icon="angle-down"
                  onClick={() => {
                    this.sortByField("changedBy", "desc");
                  }}
                />
              </span>
            </th>

            <th style={getStyle("terminalID")}>
              {formatMessage({ id: "terminalId" })}
              <span>
                <Icon
                  icon="angle-up"
                  onClick={() => {
                    this.sortByField("terminalID", "asc");
                  }}
                />
              </span>
              <span>
                <Icon
                  icon="angle-down"
                  onClick={() => {
                    this.sortByField("terminalID", "desc");
                  }}
                />
              </span>
            </th>

            <th style={getStyle("action")}>
              {formatMessage({ id: "Action" })}
              <span>
                <Icon
                  icon="angle-up"
                  onClick={() => {
                    this.sortByField("action", "asc");
                  }}
                />
              </span>
              <span>
                <Icon
                  icon="angle-down"
                  onClick={() => {
                    this.sortByField("action", "desc");
                  }}
                />
              </span>
            </th>
            <th style={getStyle("changeDescription")}>
              {formatMessage({ id: "Message" })}
              <span>
                <Icon
                  icon="angle-up"
                  onClick={() => {
                    this.sortByField("changeDescription", "asc");
                  }}
                />
              </span>
              <span>
                <Icon
                  icon="angle-down"
                  onClick={() => {
                    this.sortByField("changeDescription", "desc");
                  }}
                />
              </span>
            </th>
            <th />
          </tr>
          </thead>
          <tbody>
          {data.map((presentObject, index) => {
            return (
              <tr key={index}>
                <td><DateDisplay hijri={presentObject.createdOn} gregorian={presentObject.gregCreatedOn} /></td>
                <td>{presentObject.changedBy}</td>
                <td>{presentObject.terminalID || ""}</td>
                <td>{formatMessage({ id : presentObject.action})}</td>
                <td className="textwrap">{presentObject.changeDescription}</td>
                <td>
                  <span>
                    <Icon
                      onClick={e =>
                        requestShowModal({
                          modalType: "JOB_AUDITLOG_MODAL",
                          modalProps: presentObject.changeDescription
                        })
                      }
                      icon="external-link"
                      title={formatMessage({ id: "showDetails" })}
                    />
                  </span>
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </Fragment>
    );
  }
}

const mapState = state => ({
  jobAuditLog: jobAuditLogSelector(state),
  jobId: selectedJobSelector(state)
});
export default connect(mapState, { requestShowModal, requestJobAuditLogs })(
  withRouter(JobAuditLog)
);
