// @flow
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import { injectIntl } from "react-intl";
import ScannedImages from "../../components/ScannedBiometrics/ScannedBiometrics";
import "./ScannedBiometrics.scss";

export const ScannedBiometrics = ({ intl }) => {
  const { formatMessage } = intl;
  return (
    <Fragment>
      <div id="latent">
        <Route
          exact
          path="/authenticated/ScannedBiometrics/Scanned"
          render={() => <ScannedImages formatMessage={formatMessage}
           />}
        />
      </div>
    </Fragment>
  );
};

export default injectIntl(ScannedBiometrics);
