import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
// import { injectIntl } from "react-intl";

import Button from "../Button/Button";
import Title from "../Title/Title";
import Dropdown from "../Dropdown/Dropdown";
import FileBrowser from "../FileBrowser/filebrowser";
import DropdownItem from "../Dropdown/DropdownItem";
import Subtitle from "../Title/Subtitle";
import LatentImg from "../../images/latent_mock.jpeg";
import {
  requestReceivedImage,
  requestShowScannedImage,
  requestImportImage,
  requestStartLatentScan
} from "../../actions/latent";
import { requestShowNotification } from "../../actions/notifications";
import { translate } from "../../utils/intl";

import "./Latent.scss";


const findImageWidthAndHeight = (image, notification) => {
  // console.log("findImageWidthAndHeight", image);
  const img = new Image();
  img.src = image.path;
  img.onload = function() {
    // console.log("this",this);
    if ( this.width > 1600 ) {
      // console.log("display notification.");
      notification({
        message: translate("renderingImageWillTakeTime"),
        type: "is-warning"
      });
    }
  };
}


export function Latent({
  formatMessage,
  history,
  onClick,
  onChange,
  requestReceivedImage,
  requestShowScannedImage,
  requestImportImage,
  requestStartLatentScan,
  requestShowNotification,
}) {
  return (
    <Fragment>
      <div className="latent-top">
        <Button
          text={formatMessage({ id: "cancel" })}
          className="is-primary"
          id="latentclose"
          onClick={() => history.push("/authenticated/jobqueue")}
        />
        <div className="left" />
        <div className="center" style={{marginRight: "200px"}}>
          <Title is="4" text={formatMessage({ id: "title.latentInput" })} />
        </div>
      </div>
      <div className="latent-content">
        <div className="latent-selection">
          <FileBrowser
            id="importbtn"
            onChange={event => {
              findImageWidthAndHeight(event.target.files[0], requestShowNotification);
              requestReceivedImage({
                file: event.target.files[0],
                base64: ""
              });
              requestImportImage(false);
              requestStartLatentScan()
            }}
            className="is-primary is-medium"
            text={formatMessage({ id: "import" })}
            leftIcon="download"
            fileStyle={{ display: "block", height: 45 }}
          />
          &nbsp;&nbsp;&nbsp;
          <Button
            className="is-primary is-medium"
            text={formatMessage({ id: "scan" })}
            leftIcon="print"
            onClick={() => {
              requestShowScannedImage(LatentImg);
              history.push("/authenticated/latent/scanSettings");
            }}
          />
        </div>
        <Subtitle is="5" text={formatMessage({ id: "msg.noImgScanned" })} />
        <Subtitle
          is="5"
          text={formatMessage({ id: "msg.pleaseChooseImage" })}
        />
      </div>
    </Fragment>
  );
}
export default connect(null, {
  requestReceivedImage,
  requestShowScannedImage,
  requestImportImage,
  requestStartLatentScan,
  requestShowNotification,
})(withRouter(Latent));
