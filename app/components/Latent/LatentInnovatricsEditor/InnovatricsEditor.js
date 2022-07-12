import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
// import { injectIntl } from "react-intl";
import Button from "../../Button/Button";
import Subtitle from "../../Title/Subtitle";
import Title from "../../Title/Title";
import LatentEditor from "../../LatentEditor";
import Icon from "../../Icon/Icon";

import "./InnovatricsEditor.scss";
import {
  latentImageSelector,
  scannedImageSelector
} from "../../../selectors/latent";
import { fullCardScanImageSelector } from "selectors/jobs";
import { requestSaveSUD, requestSaveInnovSpinner, requestSaveInnovLicense } from "../../../actions/latent";
import {requestClearLatentEditorData} from "actions/jobs";
import {requestShowModal} from "../../../actions/modal"

import {CONFIRMATION_MODAL} from "../../Modal/ModalRoot"
const mapState = state => ({
  imgUrl: latentImageSelector(state),
  scannedImageURL: scannedImageSelector(state),
  scannedImage: fullCardScanImageSelector(state),
  spinner: state.latent.spinner,
  license: state.latent.license,
  locale: state.locale.lang,
  latentScan: state.latent.start,
});

export function LatentInnov({
  formatMessage,
  history,
  requestSaveSUD,
  imgUrl,
  scannedImageURL,
  scannedImage,
  requestClearLatentEditorData,
  requestShowModal,
  requestSaveInnovSpinner,
  requestSaveInnovLicense,
  spinner,
  license,
  locale,
  latentScan
}) {
  return (
    <Fragment>
      <div className="latent-innovatric-top">
        <div className="left">

            <div className="home-logo-icon" style={{ marginTop: 5 }}>
              <Icon icon="home fa-2x" onClick={() => {
              if (
                
                !latentScan
               
              ) {history.push("/authenticated/jobqueue")
                ;
              } else {
                requestShowModal({
                  modalType: CONFIRMATION_MODAL,
                  modalProps: {
                    action: () => {
                      history.push("/authenticated/jobqueue");
                     
                    },
                    message: "homeConfirmation"
                  }
                });
              }
            }} />
            </div>

        </div>
        <div className="center">
          <Title is="4" text={formatMessage({ id: "title.latentInput" })} />
        </div>
        <div className="right" style={ locale !== "en" ? { direction: 'rtl' } : {} }>
          <Button
            text={formatMessage({ id: "back" })}
            className="is-primary"
            // leftIcon="arrow-left"
            leftIcon={ locale === "en" ? "arrow-left" : 'arrow-right' }
            //rightIcon={ locale !== "en" ? "arrow-right" : '' }
            disabled={spinner}
            onClick={() => {
              if ( ! license ) {
                history.push("/authenticated/latent");
                requestClearLatentEditorData();
              } else {
              requestShowModal({
                modalType: CONFIRMATION_MODAL,
                modalProps: {
                  action: () => {history.push("/authenticated/latent");
                  requestClearLatentEditorData();
                },
                message:"confirmationMsg"
              }

            })} }}
          />
          &nbsp;&nbsp;&nbsp;
          <Button
            text={formatMessage({ id: "next" })}
            className="is-primary"
            // rightIcon="arrow-right"
            rightIcon={ locale === "en" ? "arrow-right" : 'arrow-left' }
            //leftIcon={ locale === "ar" ? "arrow-left" : '' }
            id="save"
            disabled={ spinner || ! license }
            // onClick={() =>
            //   // history.push("/authenticated/latent/LatentEditedImage")
            // }
          />
          &nbsp;&nbsp;&nbsp;
        </div>
      </div>
      <div className="latent-innovatric-content">
        <div className="latent-innovatric-selection">
          <div className="img">
            <LatentEditor
              imageurl={scannedImage ? scannedImage : imgUrl.imgdata.file.path}
              isScan={scannedImage}
              requestSaveSUD={requestSaveSUD}
              requestSaveInnovSpinner={requestSaveInnovSpinner}
              requestSaveInnovLicense={requestSaveInnovLicense}
              license={license}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
export default connect(mapState, {
  requestSaveSUD,
  requestClearLatentEditorData,
  requestShowModal,
  requestSaveInnovSpinner,
  requestSaveInnovLicense,
})(withRouter(LatentInnov));

// export default withRouter(LatentInnov);
