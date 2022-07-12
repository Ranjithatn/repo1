import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import "./Footer.scss";
import { totalJobsSelector } from "../../selectors/jobs";
const appVersion = makeAppVersionString(
  window.require("electron").remote.app.getVersion()
);

function makeAppVersionString(str) {
  if (str.indexOf("-") > 0) {
    return str && str.split("-")[0];
  } else {
    return str;
  }
}
class Footer extends Component {
  state = {
    time: null
  };
  constructor(props) {
    super(props);
    this.cancelInterval = null;
  }
  componentDidMount() {
    this.cancelInterval = setInterval(() => {
      this.setState({
        time: new Date().toLocaleTimeString()
      });
    }, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.cancelInterval);
  }
  render() {
    const { formatMessage } = this.props.intl;

    return (
      <footer className="footer">
        {/* <div>
          <span>
            <span className="is-hidden-mobile">{formatMessage({id: "systemTime"})}&nbsp;</span>
            <b>{this.state.time}</b>
            &nbsp;
            {(() => {
              return new Date().toLocaleDateString();
            })()}
          </span>
        </div> */}
        <div>
          { this.props.username && ! this.props.hideLogin &&
          <span>
            <span className="is-hidden-mobile">
              {formatMessage({ id: "loggedInAs" })}&nbsp;
            </span>
            <b>{this.props.username}</b>
          </span>
          }
        </div>
        <div className="center">
          { ! this.props.hideConnectionStatus &&
          <span className="server-status" style={{ marginLeft: 50 }}>
            {formatMessage({ id: "Server status" })}{" "}:{" "}
            <span className={this.props.serverStatus}>
              <b>{this.props.serverStatus}</b>
            </span>
          </span>
          }
        </div>
        <div className="right">
          { this.props.totalJobs &&
          <span>
            <b>{this.props.totalJobs || "0"}</b>{" "}
            <span>{formatMessage({ id: "totalJobs" })}</span>
          </span>
          }
          &nbsp;&nbsp;
          <span>
            <span>
              {formatMessage({ id: "version" })} <b>{appVersion}</b>
            </span>
          </span>
          <span />
        </div>
      </footer>
    );
  }
}

const mapState = state => ({
  // totalJobs: state.jobs.totalCount,
  username: state.auth.username,
  serverStatus: state.app.serverStatus,
  totalJobs: totalJobsSelector(state)
});
export default connect(mapState)(injectIntl(Footer));
