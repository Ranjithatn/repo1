import React, { Fragment } from "react";
import { Switch, Route } from "react-router-dom";

import "./WorkflowWrapper.scss";

function VerifierWorkflowWrapper({ top, main, foot, left, className, panes }) {
  if ( ! panes ) { panes = {}; }
  return (
    <div style={{ position: "relative", flexGrow: "1" }}>
      <div className={"VerifierWorkflow-Wrapper" + (className ? " " + className : "")}>
        <div className={`top ${ ! panes.sidebar ? 'full' : '' }`}>{top}</div>
        { panes.sidebar &&
          <div className="left">{left}</div>
        }
        <div id="VerifierWorkflowWrapper-main" className={`main ${ ! panes.sidebar ? 'full' : '' }`}>
          {main}
        </div>
      </div>
    </div>
  );
}

export default VerifierWorkflowWrapper;
