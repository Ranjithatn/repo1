import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import WorkflowWrapper from "../WorkflowWrapper/WorkflowWrapper";
import LeftContainer from "../WorkflowWrapper/LeftContainer";
import Button from "../Button/Button";
import Dropdown from "../Dropdown/Dropdown";
import DropdownItem from "../Dropdown/DropdownItem";
import Title from "../Title/Title";
import Subtitle from "../Title/Subtitle";

import "./Tenprint.scss";
import {requestStartScanType} from "../../actions/jobs"
import { liveScanSelector } from "../../selectors/liveScan";
import { pageSelector } from "../../selectors/jobs";
import Permissions from '../Permissions';
import { liveScanWorkflow } from "../../actions/liveScan";


export class Tenprint extends React.Component {
  constructor() {
    super();
  }

  render() {
    const { formatMessage, history, liveScan, page,requestStartScanType, liveScanWorkflow } = this.props;

    return (

      <Fragment>
        <div className="main-top">
          <Button
            text={formatMessage({ id: "cancel" })}
            className="is-primary"
            onClick={() => {
              history.push("/authenticated/jobqueue");
              if (page === "scanned") {
                history.push("/authenticated/ScannedBiometrics/Scanned");
              } else {
                history.push("/authenticated/jobqueue");
              }

              // history.goBack()

              // if ( liveScan.status === "RESET" ) {
              // } else {
              //   history.push("/authenticated/jobqueue");
              // }
            }}
          />
          <Title is="4" text={formatMessage({ id: "title.tenprintInput" })} />
        </div>
        <div className="main-content">
          <div className="tenprint-selection">
            <Permissions version={2} type="menu.criminal.enroll">
              <Button
                className="is-primary is-medium scancard-btn"
                // onClick={() => history.push("/authenticated/tenprint/card")}
                onClick={() => requestStartScanType("Cardscan")}
                text={formatMessage({ id: "scanCard" })}
                leftIcon="print"
              />
            </Permissions>
            &nbsp;&nbsp;&nbsp;
            <Permissions version={2} type="menu.criminal.enroll">
              <Button
                className="is-primary is-medium"
                // onClick={() => history.push("/authenticated/tenprint/livescan")}
                onClick={() => {
                  liveScanWorkflow({type: "RESET"});
                  requestStartScanType("Livescan")
                } }
                text={formatMessage({ id: "liveScan" })}
                leftIcon="hand-paper-o"
              />
            </Permissions>
          </div>
          <Subtitle
            is="5"
            text={formatMessage({ id: "msg.chooseTenprintInput" })}
          />
        </div>
      </Fragment>
    );
  }
  // render ends here
}

// export default withRouter(Tenprint);
const mapState = state => ({
  liveScan: liveScanSelector(state),
  page: pageSelector(state)
});

export default connect(mapState, {requestStartScanType, liveScanWorkflow})(withRouter(Tenprint));
