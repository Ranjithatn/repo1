import React, { Fragment } from "react";
import Button from "../Button/Button";

function LatentTop({ formatMessage, history }) {
  return (
    <div className="head">
      <Button
        text={formatMessage({ id: "back" })}
        className="is-primary"
        leftIcon="arrow-left"
        onClick={() => history.goBack()}
      />&nbsp;&nbsp;&nbsp;&nbsp;
      <Button
        text={formatMessage({ id: "next" })}
        className="is-primary"
        rightIcon="arrow-right"
      />&nbsp;&nbsp;&nbsp;
    </div>
  );
}

export default LatentTop;
