import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import CardscanSettings from "components/CardscanSettings";

import Button from "../../Button/Button";
import Title from "../../Title/Title";
import "./TenprintCard.scss";
import { pageSelector } from "../../../selectors/jobs";
class TenprintCard extends Component<null, null> {
  render() {
    const { formatMessage, history, page } = this.props;
    return (
      <Fragment>
        <div className="main-top">
          <Button
            text={formatMessage({ id: "back" })}
            className="is-primary"
            // onClick={() => history.push("/authenticated/tenprint")}
            onClick={() => {
            
              if (page === "scanned") {
                history.push("/authenticated/ScannedBiometrics/Scanned");
              } else {
                history.push("/authenticated/tenprint");
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
        <CardscanSettings
          formatMessage={formatMessage}
          onCompleted={() =>
            history.push("/authenticated/tenprint/card/scanned")
          }
        />
      </Fragment>
    );
  }
}

const mapState = state => ({
  page: pageSelector(state)
});

export default connect(
  mapState,
  {}
)(withRouter(TenprintCard));
