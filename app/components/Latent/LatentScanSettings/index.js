import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import CardscanSettings from "components/CardscanSettings";
import Button from "../../Button/Button";
import Title from "../../Title/Title";
import "./LatentScanSettings.scss";
import {requestStopLatentScan} from "../../../actions/latent"
export class LatentScanSettings extends Component<null, null> {
  render() {
    const {
      formatMessage,
      history,
      requestStopLatentScan
    } = this.props;
    return (
      <Fragment>
        <div className="main-top">
          <Button
            text={formatMessage({ id: "back" })}
            className="is-primary"
            onClick={() => history.push("/authenticated/latent")}
            // onClick={() =>  requestShowModal({
            //   modalType: CONFIRMATION_MODAL,
            //   modalProps: {
            //     action: () => {requestShowAuditLog("", "", "", "", 1);requestCloseLiveScanProgress()},
            //     message:"confirmationMsg"
            //   }
            // })}

          />
          <Title is="4" text={formatMessage({ id: "title.latentScan" })} />
        </div>
        <CardscanSettings
          formatMessage={formatMessage}
          type="latent"
          onCompleted={() =>{
            history.push("/authenticated/latent/latentinnov");
            requestStopLatentScan()}
          }
        />
      </Fragment>
    );
  }
}

const mapState = state => ({
});

export default connect(mapState, {
  requestStopLatentScan
})(withRouter(LatentScanSettings));
