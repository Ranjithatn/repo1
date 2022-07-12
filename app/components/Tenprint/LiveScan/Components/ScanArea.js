import React, { Fragment } from "react";
import Image from "../../../Image/Image";
import Button from "../../../Button/Button";

const readableErrorCode = error => {
  const data = error.replace(/([a-z])([A-Z])/g, "$1 $2");
  let splitted = data && data.split(" ");
  splitted.splice(0, 1);
  return splitted.join(" ");
};

export const ScanArea = props => {
  const { formatMessage, sendUserResponse } = props;
  const cleanCaptureArea = props.cleanCaptureArea || false;

  return (
    <div className="column is-half scan-container">
      {!props.liveScan &&
        props.impressionName.length > 0 &&
        props.step.length > 0 && (
          <div style={{ color: "white", textAlign: "center" }}>
            {props.impressionName.length > 0 && (
              <span>{props.impressionName}</span>
            )}{" "}
            : {props.step.length > 0 && <span>{props.step.replace(/([A-Z])/g, ' $1') }</span>}
          </div>
        )}

      {props.url &&  props.url !== "" && ! cleanCaptureArea ? (
        <div className="img-center" style={{ backgroundColor: "#FFF" }}>
          <Image src={props.url} />
        </div>
      ): ""}

      { ( ! props.url || cleanCaptureArea ) && (
        <div className="img-center" style={{ backgroundColor: "#FFF", minHeight: 450 }}>
          <div
            style={{
              textalign: "center",
              color: "#000",
              padding: "20px",
              fontSize: "20px",
              backgroundColor: "#FFF"
            }}
          >
            { cleanCaptureArea ?
              (<Fragment>
                  <h2 style={{ textAlign: "center" }}>
                    {formatMessage({ id: "cleanCaptureArea" })}
                  </h2>
              </Fragment>) :
              (<Fragment>
                {!props.started && (
                  <h2 style={{ textAlign: "center" }}>
                    {formatMessage({ id: "clickStartToBeginScan" })}
                  </h2>
                )}
                {props.started && (
                  <h2 style={{ textAlign: "center" }}>
                    {formatMessage({ id: "liveScanLoadingPreview" })}
                  </h2>
                )}
              </Fragment>)
            }


          </div>
        </div>
      )}

      <span
        className={
          props.supportedDecisions.length === 0 ? "hide" : "spancenter"
        }
      >
      	{props.response ? `${formatMessage({ id: "Action" })}: ${readableErrorCode(props.response)}` : ""}
      </span>

      <div
        className={
          props.supportedDecisions.length === 0 ? "hide" : "select-container"
        }
        // style={{ paddingBottom: 20 }}
      >
        <div className="select">
          <select
            className="select"
            defaultValue={
              props.supportedDecisions.length > 0 && props.supportedDecisions[0]
            }
            onChange={e => {
              props.onChange(e.target.value);
            }}
          >
            {props.supportedDecisions &&
              props.supportedDecisions.length > 0 &&
              props.supportedDecisions.map((item, index) => (
                <option key={index} value={item.value}>
                  {formatMessage({id:readableErrorCode(item.value)})}
                </option>
              ))}
          </select>
        </div>
        &nbsp;&nbsp;&nbsp;
        <Button
          className="is-primary level-left"
          text={formatMessage({ id: "Go" })}
          onClick={() => sendUserResponse()}
        />
      </div>
    </div>
  );
};

export default ScanArea;
