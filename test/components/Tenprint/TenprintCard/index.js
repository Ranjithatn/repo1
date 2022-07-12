import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import CardscanSettings from "components/CardscanSettings";

import Button from "../../Button/Button";
import Title from "../../Title/Title";
import "./TenprintCard.scss";
class TenprintCard extends Component<null, null> {
  render() {
    const {
      formatMessage,
      history
    } = this.props;
    return (
      <Fragment>
        <div className="main-top">
          <Button
            text={formatMessage({ id: "back" })}
            className="is-primary"
            onClick={() => history.push("/authenticated/tenprint")}
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
});

export default connect(mapState, {
})(withRouter(TenprintCard));
