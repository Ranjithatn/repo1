import React, { Fragment } from "react";

function LeftContainer({ formatMessage, heading, content, extendedContent, contentPreview }) {
  return (
    <Fragment>
      {heading && <div className="header">{heading}</div>}
      {content && <div className="dark-container">{content}</div>}
      {contentPreview && <div className="biometrics--preview-screen">{contentPreview}</div>}
      { extendedContent && <div className="extendedContent">{extendedContent}</div>}
    </Fragment>
  );
}

export default LeftContainer;
