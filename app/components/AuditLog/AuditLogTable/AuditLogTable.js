import React, { Fragment } from "react";
import { connect } from "react-redux";
import Icon from "../../Icon/Icon";
import Label from "../../Label/Label";
import Select from "../../Select/Select";
import Button from "../../Button/Button";
import Pagination from "../../Pagination/Pagination";
import {
  auditlogsPagesSelector,
  auditlogsTotalPagesSelector,
  auditlogsCurrentPageSelector,
  auditlogsMaxPagesSelector,
  auditPagingDataSelector,
  stausObjectSelector,
  crimeTypeObjectSelector
} from "../../../selectors/auditlog";
import { requrstAuditLogSort } from "../../../actions/auditlog";
import { requestPageChanged } from "../../../actions/global";
import {
  requestShowAuditLog,
  requestSetAuditLogFilter,
  requestResetAditlogFilter
} from "../../../actions/auditlog";
import { sortFields } from "../../../utils/sort";
// import { formatDate } from "../../../utils/date";
import HijriDatePicker from "../../HijriDatePicker";
import DateDisplay from '../../../utils/date';

class AuditLogTable extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      filter: {
        key: "",
        order: ""
      },
      startDate: "",
      endDate: "",
      status:""
      // filters: {
      //   type: '',
      //   terminalID: '',
      //   createdBy: '',
      //   modifiedBy: '',
      //   status: '',
      //   createdOn: '',
      //   modifiedOn: '',
      // }
    };
    this.sortByField = this.sortByField.bind(this);
    this.convertToArray = this.convertToArray.bind(this);
    this.inputChangeHandler = this.inputChangeHandler.bind(this);
  }

  componentDidMount() {
    const data = this.convertToArray(this.props.AuditLogData);
    this.setState({ data: data });
  }

  componentWillReceiveProps(props) {
    console.log("componentWillReceiveProps", props);
    if (props.AuditLogData !== null) {
      let data = this.convertToArray(props.AuditLogData);
      this.setState({ data: data, filter: { key: "" } });
      // console.log("componentWillReceiveProps::data",data);
      // const sorted_data = this.sortByField(this.state.filter.key, this.state.filter.order, null, data);
      // console.log("componentWillReceiveProps::sorted_data",sorted_data);
      // this.setState({ data: sorted_data });
    }
  }
  // componentWillUnmount(){

  //   // requestResetAditlogFilter;
  //   requestResetAditlogFilter();
  //   // console.log("hahaha")
  // }

  inputChangeHandler(key, val) {
    this.setState({ [key]: val });
  }

  // taking objects and converting it into array so we can easily add filter.
  convertToArray(data) {
    if (data !== null) {
      if (Object.keys(data).length > 0) {
        const final = [];
        Object.keys(data).map(res => {
          final.push(data[res]);
        });

        return final;
      } else {
        return data;
      }
    } else {
      data = [];
    }
  }

  sortByField(type, order, fieldType = "string", data) {
    let _data = null;
    if (data) {
      _data = data;
    } else {
      _data = this.state.data;
    }

    const output = sortFields(_data, type, order, fieldType);
    this.setState({ filter: { key: type, order: order }, data: output });
  }

  render() {

    const {
      AuditLogData,
      pages,
      totalPages,
      currentPage,
      maxPages,
      requestPageChanged,
      requestShowAuditLog,
      statusObject,
      crimeTypeObject,
      formatMessage,
      requestSetAuditLogFilter,
      requestResetAditlogFilter,
      requrstAuditLogSort
    } = this.props;

    const getStyle = type => {
      if (type === this.state.filter.key) {
        return { backgroundColor: "#EEE" };
      }
      return {};
    };

    let data = [];
    // if (this.state.data) {
    //   data = this.state.data;
    // } else {
    data = this.convertToArray(AuditLogData);
    // }

    // console.log("AuditLogData",AuditLogData);
    // console.log("this.state.data",this.state.data);

    return (
      <Fragment>
        <div className="table-control">
          <div className="columns">
            <div className="column">
              <div className="field">
                <Label
                  htmlFor="bioname"
                  text={formatMessage({ id: "startDate" })}
                />
                <HijriDatePicker
                  className="input"
                  id="startDate"
                  onChange={val => {
                    this.inputChangeHandler("startDate", val);
                  }}
                />
              </div>
            </div>
            <div className="column">
              <div className="field">
                <Label
                  htmlFor="bioname"
                  text={formatMessage({ id: "endDate" })}
                />
                <HijriDatePicker
                  className="input"
                  id="endDate"
                  onChange={val => {
                    this.inputChangeHandler("endDate", val);
                  }}
                />
              </div>
            </div>

            <div className="column">
              <div className="field">
                <Label text={formatMessage({ id: "jobStatus" })} />
                <Select
                  defaultValue={formatMessage({ id: "Select Status" })}
                  className="level-right"
                  formatMessage={formatMessage}
                  id="Status"
                  name="filter"
                  options={[
                    {
                      value: "New",
                      displayName: formatMessage({ id: "New" })
                    },
                    {
                      value: "Ready",
                      displayName: formatMessage({ id: "Ready" })
                    },
                    {
                      value: "In Progress",
                      displayName: formatMessage({ id: "inProgress" })
                    },
                    {
                      value: "Completed",
                      displayName: formatMessage({ id: "Completed" })
                    }
                  ]}
                  onChange={e=>this.setState({status:e.target.value})}
                  // options={statusObject}
                />
              </div>
            </div>
            <div className="column">
              <Button
                text={formatMessage({
                  id: "Submit"
                })}
                onClick={e => {
                  const start = `${this.state.startDate}`;
                  const end = `${this.state.endDate}`;
                  requestShowAuditLog("", Status.value || "", start, end, 1);
                  requestSetAuditLogFilter(
                    "",
                    Status.value || "",
                    start,
                    end,
                    0
                  );
                }}
                className="is-primary"
                disabled={(this.state.startDate===""&&this.state.endDate===""&&this.state.status==="")?true:false}
                // leftIcon="home"
              />
            </div>
            <div className="column" />
          </div>
        </div>
        <table className="table is-fullwidth is-bordered">
          <thead>
            <tr style={{ cursor: "pointer" }}>
              <th style={getStyle("type")}>
                {formatMessage({ id: "jobType" })}
                <span>
                  <Icon
                    icon="angle-up"
                    // onClick={() => {
                    //   this.sortByField("type", "asc");
                    // }}
                    onClick={() => requrstAuditLogSort("type", "asc", 1)}
                  />
                </span>
                <span>
                  <Icon
                    icon="angle-down"
                    // onClick={() => {
                    //   this.sortByField("type", "desc");
                    // }}
                    onClick={() => requrstAuditLogSort("status", "desc", 1)}
                  />
                </span>
              </th>
              <th style={getStyle("terminalID")}>
                {formatMessage({ id: "terminalId" })}
                <span>
                  <Icon
                    icon="angle-up"
                    // onClick={() => {
                    //   this.sortByField("terminalID", "asc");
                    // }}
                    onClick={() => requrstAuditLogSort("terminalID", "asc", 1)}
                  />
                </span>
                <span>
                  <Icon
                    icon="angle-down"
                    // onClick={() => {
                    //   this.sortByField("terminalID", "desc");
                    // }}
                    onClick={() => requrstAuditLogSort("terminalID", "desc", 1)}
                  />
                </span>
              </th>
              {/* <th>{formatMessage({ id: "Hit/No Hit" })}</th> */}
              <th style={getStyle("createdBy")}>
                {formatMessage({ id: "createdBy" })}
                <span>
                  <Icon
                    icon="angle-up"
                    // onClick={() => {
                    //   this.sortByField("createdBy", "asc");
                    // }}
                    onClick={() => requrstAuditLogSort("createdBy", "asc", 1)}
                  />
                </span>
                <span>
                  <Icon
                    icon="angle-down"
                    // onClick={() => {
                    //   this.sortByField("createdBy", "desc");
                    // }}
                    onClick={() => requrstAuditLogSort("createdBy", "desc", 1)}
                  />
                </span>
              </th>
              <th style={getStyle("modifiedBy")}>
                {formatMessage({ id: "modifiedBy" })}
                <span>
                  <Icon
                    icon="angle-up"
                    // onClick={() => {
                    //   this.sortByField("modifiedBy", "asc");
                    // }}
                    onClick={() => requrstAuditLogSort("modifiedBy", "desc", 1)}
                  />
                </span>
                <span>
                  <Icon
                    icon="angle-down"
                    // onClick={() => {
                    //   this.sortByField("modifiedBy", "desc");
                    // }}
                    onClick={() => requrstAuditLogSort("modifiedBy", "desc", 1)}
                  />
                </span>
              </th>
              <th style={getStyle("status")}>
                {formatMessage({ id: "status" })}
                <span>
                  <Icon
                    icon="angle-up"
                    onClick={() => requrstAuditLogSort("status", "asc", 1)}
                  />
                </span>
                <span>
                  <Icon
                    icon="angle-down"
                    onClick={() => requrstAuditLogSort("status", "desc", 1)}
                  />
                </span>
              </th>
              <th style={getStyle("createdOn")}>
                {formatMessage({ id: "createdOn" })}
                <span>
                  <Icon
                    icon="angle-up"
                    onClick={() => requrstAuditLogSort("createdOn", "asc", 1)}
                  />
                </span>
                <span>
                  <Icon
                    icon="angle-down"
                    onClick={() => requrstAuditLogSort("createdOn", "desc", 1)}
                  />
                </span>
              </th>
              <th style={getStyle("modifiedOn")}>
                {formatMessage({ id: "modifiedOn" })}
                <span>
                  <Icon
                    icon="angle-up"
                    onClick={() => requrstAuditLogSort("modifiedOn", "asc", 1)}
                  />
                </span>
                <span>
                  <Icon
                    icon="angle-down"
                    onClick={() => requrstAuditLogSort("modifiedOn", "desc", 1)}
                  />
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            {data &&
              Array.isArray(data) &&
              data.map((PresentObject, index) => {
                return (
                  <tr key={index}>
                    <td>{ formatMessage({id: PresentObject.type }) }</td>
                    <td>{PresentObject.terminalID}</td>
                    <td>{PresentObject.createdBy}</td>
                    <td>{PresentObject.modifiedBy}</td>
                    <td>{ formatMessage({id: PresentObject.status }) }</td>
                    <td><DateDisplay hijri={PresentObject.createdOn} gregorian={PresentObject.gregCreatedOn} /></td>
                    <td><DateDisplay hijri={PresentObject.modifiedOn} gregorian={PresentObject.gregModifiedOn} /></td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        <Pagination
          className={totalPages === 0 ? "hidden" : ""}
          pages={pages}
          nextPageText={formatMessage({ id: "nextPage" })}
          prevPageText={formatMessage({ id: "prevPage" })}
          totalPages={totalPages}
          currentPage={currentPage}
          maxPages={maxPages}
          onClick={e => requestPageChanged(e, "AuditLog")}
        />
      </Fragment>
    );
  }
}

const mapState = state => ({
  AuditLogData: auditPagingDataSelector(state),
  pages: auditlogsPagesSelector(state),
  totalPages: auditlogsTotalPagesSelector(state),
  currentPage: auditlogsCurrentPageSelector(state),
  maxPages: auditlogsMaxPagesSelector(state),
  statusObject: stausObjectSelector(state),
  crimeTypeObject: crimeTypeObjectSelector(state)
});
export default connect(
  mapState,
  {
    requestPageChanged,
    requestShowAuditLog,
    requestSetAuditLogFilter,
    requestResetAditlogFilter,
    requrstAuditLogSort
  }
)(AuditLogTable);
