// @flow
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import { injectIntl } from "react-intl";
import Latent from "../../components/Latent/Latent";
import LatentEditedImage from "../../components/Latent/LatentEditedImage/LatentEditedImage";
import LatentInnov from "../../components/Latent/LatentInnovatricsEditor/InnovatricsEditor";
import LatentVerify from "../../components/Latent/LatentVerify/LatentVerify";
import LatentScanSettings from "../../components/Latent/LatentScanSettings";
import TenprintVerify from "../../components/Tenprint/TenprintVerify/TenprintVerify";
import "./LatentPage.scss";


import { withRouter } from "react-router-dom";
import { cardScanReset } from "../../actions/cardScan";



import {
  tenprintVerifyLeftFingersSelector,
  tenprintVerifyRightFingersSelector,
  tenprintVerifyPersonInfosSelector,
  tenprintVerifyLeftMatchInfoSelector,
  tenprintVerifyRightMatchInfoSelector,
  tenprintVerifyUserMatchInfoSelector,
} from "../../selectors/tenprint";
let ComponentHandler = (props) => {

  if (
    ( props.LeftFingers && props.LeftFingers.fingers && props.LeftFingers.fingers.length < 2 ) ||
    ( props.RightFingers && props.RightFingers.fingers && props.RightFingers.fingers.length < 2 )
  ) {
    return <LatentVerify { ...props } />
  } else {
    return <TenprintVerify { ...props } />
  }

}


const mapState = state => ({
  LeftFingers: tenprintVerifyLeftFingersSelector(state),
  RightFingers: tenprintVerifyRightFingersSelector(state),
  PersonInfos: tenprintVerifyPersonInfosSelector(state),
  LeftMatches: tenprintVerifyLeftMatchInfoSelector(state),
  RightMatches: tenprintVerifyRightMatchInfoSelector(state),
  MatchInfos: tenprintVerifyUserMatchInfoSelector(state),
});

ComponentHandler = connect(mapState, {})(withRouter(ComponentHandler));



class LatentPage extends React.Component {

  componentDidMount() {
    // console.log("LatentPage::componentDidMount");
  }

  componentWillUnmount() {
    // console.log("LatentPage::componentWillUnmount::reset card scan");
    this.props.cardScanReset();
  }


  render() {

    const {
      intl,
      onClick,
      onChange,
      requestReceivedImage,
      imgUrl,
    } = this.props;

    const { formatMessage } = intl;


    return (
      <Fragment>
        <div id="latent">
          <Route
            exact
            path="/authenticated/latent"
            render={() => <Latent formatMessage={formatMessage} />}
          />
          <Route
            exact
            path="/authenticated/latent/LatentEditedImage"
            render={() => (
              <LatentEditedImage
                formatMessage={formatMessage}

              />
            )}
          />
          <Route
            exact
            path="/authenticated/latent/scanSettings"
            render={() => (
              <LatentScanSettings
                formatMessage={formatMessage}
              />
            )}
          />
          <Route
            exact
            path="/authenticated/latent/latentinnov"
            render={() => (
              <LatentInnov
                formatMessage={formatMessage}

              />
            )}
          />
          <Route
            exact
            path="/authenticated/latent/latentverify"
            // render={() => <LatentVerify formatMessage={formatMessage} />}
            // render={() => <TenprintVerify formatMessage={formatMessage} />}
            render={() => <ComponentHandler formatMessage={formatMessage} />}
          />
        </div>
      </Fragment>
    )

  }


}


export default connect( null, { cardScanReset } )( injectIntl(LatentPage) );
