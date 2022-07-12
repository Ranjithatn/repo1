import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Image from "../../../Image/Image";
import LeftContainer from "../../../WorkflowWrapper/LeftContainer";
// import "./TenprintVerifyLeft.scss";
// import "../TenprintVerifyLeft.scss";
import Svg from "../../../Svg/Svg";
let regex = /($[a-z])|[A-Z][^A-Z]+/g;
export function LatentVerifyLeft({
  formatMessage,
  history,
  LeftFingers,
  RightFingers,
  requestSetTenprintVerifyHand,
  SelectedHandInfo,
  MatchInfos,
  requestShowAdjudicator,
  adjudicatorPassImageData,
  LeftMatches,
  RightMatches,
  requestHideAdjudicator,
  jobType,
  actionType
}) {


  // console.log("LeftFingers, RightFingers", LeftFingers, RightFingers);

  return (
    <LeftContainer
      heading={formatMessage({ id: "probeData" })}
      content={
        <Fragment>
          <div className="svg-container">
            <div className="columns">
              <div className="column">
                {LeftFingers.fingers && Array.isArray(LeftFingers.fingers) && LeftFingers.fingers.map((name, i) => {
                  return (
                    <Fragment>
                      <div className="segmented-data-container">
                        <Image
                          src={"data:image/png;base64," + name.thumbNail}
                          // className={adjudicatorPassImageData ? adjudicatorPassImageData.position === name.position ? "myimgwhsideglow" : "myimgwhside" : "myimgwhside"}
                          id={name.position}
                          onClick={() => {
                            return requestHideAdjudicator(false);
                          }}
                        />
                      </div>
                      <span className="divcenter">
                        {name.position === "LeftRing" &&
                        jobType === "Latent" ? (
                          <span>{formatMessage({ id: "Unknown" })}</span>
                        ) : (
                           formatMessage({id:name.position})
                        )}
                      </span>
                    </Fragment>
                  );
                })}
              </div>
              <div className="column ">
                {RightFingers.fingers && Array.isArray(RightFingers.fingers) && RightFingers.fingers.map((name, i) => {
                  return (
                    <Fragment>
                      <div className="segmented-data-container">
                        <Image
                          src={"data:image/png;base64," + name.thumbNail}
                          className={
                            adjudicatorPassImageData
                              ? adjudicatorPassImageData.position ===
                                name.position
                                ? "myimgwhsideglow"
                                : "myimgwhside"
                              : "myimgwhside"
                          }
                          id={name.position}
                          onClick={() => {
                            return requestHideAdjudicator(false);
                          }}
                        />
                      </div>
                      <span className="divcenter">
                        {name.position.match(regex).join(" ")}
                      </span>
                    </Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </Fragment>
      }
    />
  );
}
export default withRouter(LatentVerifyLeft);
