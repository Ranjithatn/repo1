import React, { Fragment } from "react";
import { Switch, Route } from "react-router-dom";

import "./WorkflowWrapper.scss";

function WorkflowWrapper({ top, main, foot, left, className }) {
  return (
    <div style={{ position: "relative", flexGrow: "1" }}>
      <div className={"Workflow-Wrapper" + (className ? " " + className : "")}>
        <div className="top">{top}</div>
        <div className="left">{left}</div>
        <div id="WorkflowWrapper-main" className="main">
          {main}
        </div>
        {/* <div className="foot">{foot}</div> */}
      </div>
    </div>
  );
}

export default WorkflowWrapper;
