import React, { Fragment } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import SidebarLiveScan from './helper/SidebarLiveScan';
import SidebarAnnotations from './helper/SidebarAnnotations';
import Label from "../../Label/Label";
import {
  liveScanWorkflow,
} from "../../../actions/liveScan";
import {
  palmScanSelector,
  // mugshotDataSelector,
  liveScanSelector,
} from "../../../selectors/liveScan";
import Annotations from "../../Annotations";
const LivescanAPI = require("../../../hardwareSDK/biocoreSdk/livescan/livescan");

export class LiveScanLeft extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { formatMessage } = this.props.intl;
    const {
      palmScan,
      palmScanWorkflow,
      canonData,
      liveScan,
      liveScanWorkflow,
      startScan,
      stopScan,
      requestShowModal,
      history,
    } = this.props;


    let sidebarHeading = "";

    if ( liveScan.tab === "livescan" ) {
      if ( liveScan.completed ) { sidebarHeading = formatMessage({ id: "scannedFingPrint" }); }
      sidebarHeading = formatMessage({ id: "scanFingerprints" });
    } else if ( liveScan.tab === "palmscan" ) {
      sidebarHeading = formatMessage({ id: "scanPalmprints" });
    } else if ( liveScan.tab === "mugshot" ) {
      sidebarHeading = formatMessage({ id: "capturedMugshot" });
    }

    console.log("LiveScanLeft::palmScan",palmScan);
    console.log("LiveScanLeft::liveScan",liveScan);
    console.log("LiveScanLeft::canonData",canonData);


    return (
      <Fragment>

        <div className="header">{ sidebarHeading }</div>

        <div className="dark-container">
          <SidebarLiveScan
            formatMessage={formatMessage}
            liveScanWorkflow={liveScanWorkflow}
            startScan={startScan}
            stopScan={stopScan}
            liveScan={liveScan}
            palmScan={palmScan}
            palmScanWorkflow={palmScanWorkflow}
            history={history}
          />
        </div>

        { ! liveScan.completed &&
        <div className="annotations">
          <SidebarAnnotations
            formatMessage={formatMessage}
            liveScanWorkflow={liveScanWorkflow}
            liveScan={liveScan}
            palmScan={palmScan}
            startScan={startScan}
          />
        </div>
        }

        { palmScan.started && (
        <div className="annotations">
          <Annotations
            formatMessage={formatMessage}
            reducerArea="liveScanPalm"
            useBiocore="true"
            palm="true"
          />
        </div>
        )}



        { liveScan.completed && ! palmScan.started &&
        <Fragment>

          <div className={`mugshotadd ${ liveScan.tab === "mugshot" ? "mugDark" : "mugLight" }`}>
            <div className="one" onClick={ () => {
              requestShowModal({ modalType: "MUG_SHOT" });
              liveScanWorkflow({ type: "SET_ACTIVE_TAB", data: "mugshot" });
            }}>
              <Label text={ (canonData.ImageData || liveScan.webcamImage != "" ) ? formatMessage({ id: "Update" }) : formatMessage({ id: "+Add" }) } />
            </div>
            <div className="two" onClick={ () => { liveScanWorkflow({ type: "SET_ACTIVE_TAB", data: "mugshot" }) } }>
              <Label text={ formatMessage({ id: "mugshot" }) } />
            </div>
          </div>

          <div className={`mugshotadd ${ liveScan.tab === "palmscan" ? "mugDark" : "mugLight" }`}>
            <div
              className="one"
              style={{ background: palmScan.started ? '#FF0000' : palmScan.completed ? '#43ca73' : '#43ca73' }}
              onClick={ () => {
                  liveScanWorkflow({ type: "SET_ACTIVE_TAB", data: "palmscan" })
                  if ( palmScan.started && ! palmScan.completed ) {
                    palmScanWorkflow({type: 'STOP_SCAN'});
                    LivescanAPI.stopCapture();
                  }
                  else if ( palmScan.completed ) { palmScanWorkflow({type: 'TOGGLE_VISIBILITY'}); }
                  else { palmScanWorkflow({type: 'START_SCAN'}); }
              }}
            >
              <Label text={ palmScan.started ? formatMessage({ id: "Stop" }) : palmScan.completed ? formatMessage({ id: "Update" }) : formatMessage({ id: "+Add" }) } />
            </div>
            <div className="two" onClick={ () => { liveScanWorkflow({ type: "SET_ACTIVE_TAB", data: "palmscan" }) } }>
              <Label style={{ color: liveScan.tab === "palmscan" ? '#FFF' : 'inherit'  }} text={formatMessage({ id: "palm" }) } />
            </div>
          </div>

        </Fragment>
        }


      </Fragment>
    )
  }


}


const mapState = state => ({
  state: state,
  palmScan: palmScanSelector(state),
  liveScan: liveScanSelector(state),
  // mugshotData: mugshotDataSelector(state),
});
const mapProps = {
  liveScanWorkflow,
};

export default connect(mapState, mapProps)( injectIntl(LiveScanLeft) );
