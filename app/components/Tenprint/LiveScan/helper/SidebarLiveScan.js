import React from "react";

import Svg from "../../../Svg/Svg";
import Select from "../../../Select/Select";
import Button from "../../../Button/Button";
const LivescanAPI = require("../../../../hardwareSDK/biocoreSdk/livescan/livescan");




export const SidebarLiveScan = (props) => {
  console.log("SidebarLiveScan::props",props);

  const {
    formatMessage,
    startScan,
    stopScan,
    liveScanWorkflow,
    liveScan,
    palmScan,
    palmScanWorkflow,
    history,
    palmScanRef,
  } = props;

  // console.log("SidebarLiveScan :: liveScan", liveScan);
  // console.log("SidebarLiveScan :: palmScan", palmScan);

  // console.log("SidebarLiveScan :: props", props);
  // console.log("SidebarLiveScan::palmScanRef", palmScanRef);


  let liveScanButtonText = formatMessage({ id: "startScan" });

  if ( liveScan.started && ! liveScan.completed ) {
    liveScanButtonText = formatMessage({ id: "stopScan" });
  }
  else if ( liveScan.completed ) {
    liveScanButtonText = formatMessage({ id: "restartScan" });
  }


  return (
    <div className={ props.liveScan.tab === "livescan" ? "dark" : "light" } style={ palmScan.started ? { width: "100%" } : {} }>


      <div
        className="img-container"
        onClick={ () => {
          if ( ! palmScan.stopped ) {
            props.liveScanWorkflow({ type: "SET_ACTIVE_TAB", data: "livescan" })
          }
        }}
      >
        <Svg
          className="svgrotate"
          width="35"
          height="50"
          viewBox="0 -5 50 60"
          d="M 44.2511 10.097C 42.4195 10.097 40.9329 11.5885 40.9329 13.4261L 40.872 28.3535C 40.872 28.3535 40.8771 29.3945 39.8801 29.3945C 38.8603 29.3945 38.8883 28.3535 38.8883 28.3535L 38.8908 6.82119C 38.8908 4.98358 37.4195 3.55573 35.5904 3.55573C 33.7588 3.55573 32.4524 4.98104 32.4524 6.82119L 32.4524 28.3535C 32.4524 28.3535 32.3408 29.4047 31.3565 29.4047C 30.3798 29.4047 30.3062 28.3535 30.3062 28.3535L 30.3062 3.23236C 30.3062 1.39474 28.9262 2.23698e-08 27.0946 2.23698e-08C 25.263 2.23698e-08 23.8703 1.39474 23.8703 3.23236L 23.8703 28.3535C 23.8703 28.3535 23.8196 29.3614 22.7668 29.3614C 21.7292 29.3614 21.7242 28.3535 21.7242 28.3535L 21.7216 9.692C 21.7216 7.85438 20.2858 6.70143 18.4568 6.70143C 16.6252 6.70143 15.2832 7.85438 15.2832 9.692L 15.2832 36.9659C 15.2832 36.9659 15.1031 38.1775 13.3705 36.177C 8.92593 31.0484 6.60995 30.0278 6.60995 30.0278C 6.60995 30.0278 2.39374 27.956 0.52664 31.6974C -0.827999 34.4106 0.607818 34.5582 2.81989 37.8899C 4.77831 40.8397 10.9708 48.6003 10.9708 48.6003C 10.9708 48.6003 18.3152 58.9948 28.2261 58.9948C 28.2261 58.9948 47.6381 59.8245 47.6381 40.5574L 47.5696 13.4281C 47.5671 11.5879 46.083 10.0964 44.2514 10.0964"
        />
        <Svg
          width="35"
          height="50"
          viewBox="0 -5 50 60"
          d="M 44.2511 10.097C 42.4195 10.097 40.9329 11.5885 40.9329 13.4261L 40.872 28.3535C 40.872 28.3535 40.8771 29.3945 39.8801 29.3945C 38.8603 29.3945 38.8883 28.3535 38.8883 28.3535L 38.8908 6.82119C 38.8908 4.98358 37.4195 3.55573 35.5904 3.55573C 33.7588 3.55573 32.4524 4.98104 32.4524 6.82119L 32.4524 28.3535C 32.4524 28.3535 32.3408 29.4047 31.3565 29.4047C 30.3798 29.4047 30.3062 28.3535 30.3062 28.3535L 30.3062 3.23236C 30.3062 1.39474 28.9262 2.23698e-08 27.0946 2.23698e-08C 25.263 2.23698e-08 23.8703 1.39474 23.8703 3.23236L 23.8703 28.3535C 23.8703 28.3535 23.8196 29.3614 22.7668 29.3614C 21.7292 29.3614 21.7242 28.3535 21.7242 28.3535L 21.7216 9.692C 21.7216 7.85438 20.2858 6.70143 18.4568 6.70143C 16.6252 6.70143 15.2832 7.85438 15.2832 9.692L 15.2832 36.9659C 15.2832 36.9659 15.1031 38.1775 13.3705 36.177C 8.92593 31.0484 6.60995 30.0278 6.60995 30.0278C 6.60995 30.0278 2.39374 27.956 0.52664 31.6974C -0.827999 34.4106 0.607818 34.5582 2.81989 37.8899C 4.77831 40.8397 10.9708 48.6003 10.9708 48.6003C 10.9708 48.6003 18.3152 58.9948 28.2261 58.9948C 28.2261 58.9948 47.6381 59.8245 47.6381 40.5574L 47.5696 13.4281C 47.5671 11.5879 46.083 10.0964 44.2514 10.0964"
        />
      </div>



      <div className="live-palm-sidebar">
      { ! palmScan.started &&
      <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 20, textAlign: 'center' }}>

        { ( ! palmScan.started && ! palmScan.stopped ) &&
        <div className="livescan-format-container">
          <div style={ liveScan.tab !== "livescan" ? { color: "#000" } : { color: "#FFF" } }>{ formatMessage({ id: "scannedImage" }) }</div>
        </div>
        }

        { ( ! palmScan.started && ! palmScan.stopped ) &&
        <Select
          className="is-small"
          onChange={ e => {
            liveScanWorkflow({ type: 'SET_LIVESCAN_TYPE', data: e.target.value });
          }}
          formatMessage={ formatMessage }
          id="livescanselect"
          name="annotation"
          priorityDefault={true}
          disabled={ liveScan.started || liveScan.completed || palmScan.started || palmScan.completed }
          options={[
            { value: "flat", displayName: formatMessage({ id: "Flat Prints" }) },
            { value: "rolled", displayName: formatMessage({ id: "Flat & Rolled Prints" }) }
          ]}
        />
        }

        {/*
        { (palmScan.started || palmScan.stopped) &&
        <Select
          className="is-small"
          formatMessage={ formatMessage }
          id="palmscanselect"
          name="selecttype"
          disabled={ palmScan.started || palmScan.stopped }
          placeholder="Palm Scan"
          options={[
            { value: "palmscan", displayName: formatMessage({ id: "Palm Scan" }) },
          ]}
        />
        }
        */}




        <div>
          { liveScan.tab === "livescan" && ! liveScan.started &&
          <Button
            className={`is-primary scancard-btn is-small livescan-button-start-stop`}
            disabled={ palmScan.started }
            text={ (liveScan.completed || (liveScan.loading && liveScan.loading.visible)) ? formatMessage({ id: "restartScan" }) : formatMessage({ id: "startScan" }) }
            onClick={ () => {
              // liveScanWorkflow({ type: 'START_SCAN' });
              // console.log("liveScan",liveScan);
              // console.log("liveScan.type",liveScan.type);
              // console.log("history",history);
              // console.log("palmScan",palmScan);

              if ( liveScan.tab === "palmscan" ) {
                // currently on palmscan tab
                // console.log("PalmScan tab, restart palmscan workflow...");
                liveScanWorkflow({ type: 'SET_LIVESCAN_TYPE', data: "rtlPalmPrints" });
                LivescanAPI.setAnnotations({ Annotations: { Annotation: [] } }); // reset all set annotations
                startScan();

              } else {

                if ( liveScan.completed ) {
                  // console.log("LiveScan tab, restart livescan workflow...")
                  // liveScanWorkflow({ type: 'RESET' });
                  // history.push("/authenticated/tenprint");

                  liveScanWorkflow({ type: 'RESET_EXCEPT_WEBCAM' });
                  liveScanWorkflow({ type: 'SET_LIVESCAN_TYPE', data: liveScan.type });
                  LivescanAPI.setAnnotations({ Annotations: { Annotation: [] } }); // reset all set annotations
                  startScan();
                } else {
                  startScan();
                }

              }

            }}
          />
          }

          { liveScan.started &&
          <Button
            className={`is-danger scancard-btn is-small`}
            // text={ formatMessage({ id: "stopScan" }) }
            text={ liveScanButtonText }
            // text={ (liveScan.completed || (liveScan.loading && liveScan.loading.visible)) ? formatMessage({ id: "restartScan" }) : formatMessage({ id: "startScan" }) }
            onClick={ () => {
              // console.log("I WAS CLICKED!!!!!!!!!!!!!!!!!!!!!!XYZ");

              // console.log("liveScan",liveScan);
              // console.log("liveScan.type",liveScan.type);
              // console.log("history",history);
              // console.log("palmScan",palmScan);


              if ( liveScan.completed ) {
                // console.log("INSIDE COMPLETED");
                // console.log("LiveScan tab, restart livescan workflow...")
                // liveScanWorkflow({ type: 'RESET' });
                // history.push("/authenticated/tenprint");

                liveScanWorkflow({ type: 'RESET_EXCEPT_WEBCAM' });
                liveScanWorkflow({ type: 'SET_LIVESCAN_TYPE', data: liveScan.type });
                LivescanAPI.setAnnotations({ Annotations: { Annotation: [] } }); // reset all set annotations
                startScan();
              }
              else if ( ! liveScan.completed && liveScan.started ) {
                // console.log("inside else if 22323");

                stopScan();
                LivescanAPI.setAnnotations({ Annotations: { Annotation: [] } });
                liveScanWorkflow({ type: 'STOP_SCAN' });

              }
              else {
                console.log("OUTSIDE COMPLETED");
                startScan();
              }

              // stopScan();
                    // LivescanAPI.stopCapture();
              // LivescanAPI.setAnnotations({ Annotations: { Annotation: [] } });
                    // liveScanWorkflow({ type: 'STOP_SCAN' });
            }}
          />
          }
        </div>

      </div>
      }


      { liveScan.tab === "palmscan" && ( palmScan.started || palmScan.stopped ) &&
      <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 20, textAlign: 'center' }}>
        <div className="livescan-format-container" style={{ color: 'black'}}>
          <div>{ formatMessage({ id: "palmScan" }) }</div>
        </div>

        <Select
          className="is-small"
          formatMessage={ formatMessage }
          id="palmscanselect"
          name="selecttype"
          disabled={ palmScan.started }
          placeholder="Palm Scan"
          options={[
            { value: "palmscan", displayName: formatMessage({ id: "palmScan" }) },
          ]}
          priorityDefault={true}
        />

        { liveScan.tab === "livescan" && ( palmScan.started || palmScan.stopped ) &&
        <Button
          className={`${ palmScan.started ? "is-danger" : palmScan.stopped ? "is-primary" : "is-danger" } scancard-btn is-small palmscan-button-start-stop`}

          // button is-primary scancard-btn is-small livescan-button-start-stop

          // className={`is-primary scancard-btn is-small livescan-button-start-stop`}
          // text={ (liveScan.completed || (liveScan.loading && liveScan.loading.visible)) ?
          //   formatMessage({ id: "restartScan" }) : formatMessage({ id: "startScan" }) }
          text={
            palmScan.started ? formatMessage({ id: "stopScan" }) :
            palmScan.stopped ? formatMessage({ id: "startScan" }) : formatMessage({ id: "startScan" })
          }


          // text={ formatMessage({ id: "stopScan" }) }
          onClick={ () => {
            // console.log("sidebar palm scan button click!!!");

            // console.log("ps:button:::liveScan",liveScan);
            // console.log("ps:button:::palmScan",palmScan);

            // palmScanWorkflow({type: 'STOP_PALM_SCAN'});
            // LivescanAPI.stopCapture();

            // stop palm scan
            if ( palmScan.started ) {
              // palmScanWorkflow({type: 'STOP_PALM_SCAN'});
              // LivescanAPI.stopCapture();
              // console.log("calling stop palm scan...", palmScanRef);
              palmScanRef && palmScanRef.stopScan && palmScanRef.stopScan();
            }
            // restart palm scan
            else if ( palmScan.stopped ) {
              // console.log("START THE PALM SCAN AGAIN!!!", palmScanRef)
              // liveScanWorkflow({ type: 'SET_LIVESCAN_TYPE', data: "rtlPalmPrints" });
              // LivescanAPI.setAnnotations({ Annotations: { Annotation: [] } }); // reset all set annotations
              // palmScanRef && palmScanRef.startScan && palmScanRef.startScan({ restart: true });
              palmScanWorkflow({type: 'START_SCAN'});
              palmScanRef && palmScanRef.startScan && palmScanRef.startScan();
            }
            // neither started nor stopped
            else {
              console.log("else calle.d..");
            }




              // liveScanWorkflow({ type: 'START_SCAN' });



              /*

              if ( liveScan.tab === "palmscan" ) {
                // currently on palmscan tab
                console.log("PalmScan tab, restart palmscan workflow...");
                liveScanWorkflow({ type: 'SET_LIVESCAN_TYPE', data: "rtlPalmPrints" });
                LivescanAPI.setAnnotations({ Annotations: { Annotation: [] } }); // reset all set annotations
                startScan();

              } else {

                if ( liveScan.completed ) {
                  console.log("LiveScan tab, restart livescan workflow...")
                  // liveScanWorkflow({ type: 'RESET' });
                  // history.push("/authenticated/tenprint");

                  liveScanWorkflow({ type: 'RESET_EXCEPT_WEBCAM' });
                  liveScanWorkflow({ type: 'SET_LIVESCAN_TYPE', data: liveScan.type });
                  LivescanAPI.setAnnotations({ Annotations: { Annotation: [] } }); // reset all set annotations
                  startScan();
                } else {
                  startScan();
                }

              }

              */














          }}
          // disabled={ palmScan.started }
        />
        }


      </div>
      }

      </div>




    </div>
  );

}


export default SidebarLiveScan;
