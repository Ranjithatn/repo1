// @flow

import React, { Component, Fragment } from "react";
import { Route } from "react-router-dom";
import { injectIntl } from "react-intl";
import Tenprint from "components/Tenprint/Tenprint";
import TenprintCard from "components/Tenprint/TenprintCard";
import TenprintCardScanned from "components/Tenprint/TenprintCard/TenprintCardScanned";
import TenprintCardSegmented from "components/Tenprint/TenprintCard/TenprintCardSegmented";
import TenprintVerify from "../../components/Tenprint/TenprintVerify/TenprintVerify";
import TenprintLiveScan from "../../components/Tenprint/LiveScan/LiveScan";
import "./TenprintPage.scss";
import { connect } from "react-redux";

import CardScan from '../../components/CardScan';

import { cardScanReset } from "../../actions/cardScan";
import { requestClearLatentEditorData } from "../../actions/jobs";



class TenprintPage extends React.Component {


  // componentDidMount() {
  //   console.log("TenprintPage::componentDidMount");
  // }


  componentWillUnmount() {
    this.props.cardScanReset();
    this.props.requestClearLatentEditorData();
  }


  render() {

    const { formatMessage } = this.props.intl;


    return (
      <div id="tenprint">
        <Route
          exact
          path="/authenticated/tenprint"
          render={() => <Tenprint formatMessage={formatMessage} />}
        />

        <Route
          exact
          path="/authenticated/tenprint/card"
          render={() => <TenprintCard formatMessage={formatMessage} />}
        />

        <Route
          exact
          path="/authenticated/tenprint/card/scanned"
          render={() => <CardScan formatMessage={formatMessage} />}
          // render={() => <TenprintCardScanned formatMessage={formatMessage} />}
        />

        <Route
          exact
          path="/authenticated/tenprint/card/segmented"
          render={() => <TenprintCardSegmented formatMessage={formatMessage} />}
        />
        <Route
          exact
          path="/authenticated/tenprint/livescan"
          render={() => <TenprintLiveScan formatMessage={formatMessage} />}
        />

        <Route
          exact
          path="/authenticated/tenprint/tenprintverify"
          render={() => <TenprintVerify formatMessage={formatMessage} />}
        />
      </div>
    );



  }


}



// export default injectIntl(TenprintPage);
export default connect( null, {
  cardScanReset,
  requestClearLatentEditorData,
})( injectIntl(TenprintPage) );





/*

import CardScan from '../../components/CardScan';

const TenprintPage = ({ intl }) => {
  const { formatMessage } = intl;

  return (
    <div id="tenprint">
      <Route
        exact
        path="/authenticated/tenprint"
        render={() => <Tenprint formatMessage={formatMessage} />}
      />

      <Route
        exact
        path="/authenticated/tenprint/card"
        render={() => <TenprintCard formatMessage={formatMessage} />}
      />

      <Route
        exact
        path="/authenticated/tenprint/card/scanned"
        render={() => <CardScan formatMessage={formatMessage} />}
        // render={() => <TenprintCardScanned formatMessage={formatMessage} />}
      />

      <Route
        exact
        path="/authenticated/tenprint/card/segmented"
        render={() => <TenprintCardSegmented formatMessage={formatMessage} />}
      />
      <Route
        exact
        path="/authenticated/tenprint/livescan"
        render={() => <TenprintLiveScan formatMessage={formatMessage} />}
      />

      <Route
        exact
        path="/authenticated/tenprint/tenprintverify"
        render={() => <TenprintVerify formatMessage={formatMessage} />}
      />
    </div>
  );
};

// pass down all actions and state the components need

// translations passed down from the injectIntl HOC using formatMessage

export default injectIntl(TenprintPage);

*/
