import React, { Fragment } from "react";

function LeftContainer({ formatMessage, heading, content, annotation,mugshot }) {
  return (
    <Fragment>
      <div className="header">{heading}</div>
      <div className="dark-container">{content}</div>    
      <div className="mugshot">{mugshot}</div>
      <div className="annotations">{annotation}</div>
      {/*<div className="mugshot">{mugshot}</div>*/}
    </Fragment>
  );
}

export default LeftContainer;
