import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import NumericInput from "react-numeric-input";
import Modal from "../Modal";
import Label from "../../Label/Label";
import Image from "../../Image/Image";
import { reg_space } from "../../../utils/regEx";
// import "./UpdateCriminalModal.scss";

import { sortFingers } from "../../Tenprint/TenprintVerify/Helper";

function Fingerprtint({ formatMessage, JobType, LeftFingers, RightFingers }) {
  // console.log("Fingerprtint :: LeftFingers, RightFingers",LeftFingers, RightFingers);

  let sortedLeftFingers = LeftFingers;
  let sortedRightFingers = RightFingers;

  if (
    sortedLeftFingers &&
    sortedLeftFingers.fingers &&
    sortedLeftFingers.fingers.length > 0
  ) {
    sortedLeftFingers = sortFingers(LeftFingers);
  }

  if (
    sortedRightFingers &&
    sortedRightFingers.fingers &&
    sortedRightFingers.fingers.length > 0
  ) {
    sortedRightFingers = sortFingers(RightFingers);
  }

  // if ( sortedLeftFingers.fingers.length === 0 && LeftFingers.fingers.length > 0 ) { sortedLeftFingers = LeftFingers; }
  // if ( sortedRightFingers.fingers.length === 0 && RightFingers.fingers.length > 0 ) { sortedRightFingers = RightFingers; }

  // console.log("sortedLeftFingers",sortedLeftFingers);
  // console.log("sortedRightFingers",sortedRightFingers);

  return (
    <Fragment>
      {JobType !== "Custom" ? (
        <div className="tenprint-fields">
          <Label text={formatMessage({ id: "fingerprints" })} />
          <div className="columns">
            {sortedLeftFingers && sortedLeftFingers.length > 0 ? (
              <div className="column">
                {sortedLeftFingers.map((name, i) => {
                  return (
                    <Fragment>
                      <div
                        key={name + i}
                        className="segmented-data-container"
                        title={
                          name.annotation
                            ? name.annotation + ":" + name.annotationNote
                            : ""
                        }
                      >
                        {name.thumbNail !== "" ? (
                          <Image
                            src={"data:image/png;base64," + name.thumbNail}
                            id={name.position}
                          />
                        ) : (
                          <span title={name.annotationNote}>
                            {name.annotation}
                          </span>
                        )}
                      </div>
                      <span className="impression-name">
                        {name.position === "LeftRing" &&
                        JobType === "Latent" ? (
                          <span>{formatMessage({ id: "Unknown" })}</span>
                        ) : (
                          formatMessage({ id: name.position })
                        )}
                      </span>
                      {/* <Switch
                        id={name.position + i}
                        value={name.position}
                        className="is-primary is-rounded"
                      /> */}
                    </Fragment>
                  );
                })}
              </div>
            ) : (
              ""
            )}
            {sortedRightFingers && sortedRightFingers.length > 0 ? (
              <div className="column ">
                {sortedRightFingers.map((name, i) => {
                  return (
                    <Fragment>
                      <div
                        className="segmented-data-container"
                        title={
                          name.annotation
                            ? name.annotation + ":" + name.annotationNote
                            : ""
                        }
                      >
                        {name.thumbNail !== "" ? (
                          <Image
                            src={"data:image/png;base64," + name.thumbNail}
                            id={name.position}
                          />
                        ) : (
                          <span title={name.annotationNote}>
                            {name.annotation}s
                          </span>
                        )}
                      </div>

                      <span className="impression-name">
                        {formatMessage({ id: name.position })}
                      </span>
                      {/* <Switch
                        id={name.position + i}
                        value={name.position}
                        className="is-primary is-rounded"
                      /> */}
                    </Fragment>
                  );
                })}
              </div>
            ) : (
              ""
            )}
          </div>
          {/* <span className="noteLabel">
            {" "}
            {formatMessage({ id: "registerNote" })}{" "}
          </span> */}
        </div>
      ) : (
        ""
      )}
    </Fragment>
  );
}
export default Fingerprtint;
