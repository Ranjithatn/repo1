import React, { Fragment } from "react";
import { connect } from "react-redux";

import Modal from "../Modal";
import Button from "../../Button/Button";
import Image from "../../Image/Image";
import { requestHideModal } from "../../../actions/modal";
import Textarea from "../../Textarea/Textarea";
import "./ShowLivescanProbeModal.scss";
import { LivescanProbeModalSelector} from "../../../selectors/liveScan";

export const ShowLivescanProbeModal = ({
  requestHideModal,
  formatMessage,
  requestCapture,
  modalData
}) => {
  const { ProbeData, jobType } = modalData;
  // console.log("modalData",modalData);
  return (
    <Modal
      title={ProbeData.position}
      // title={ jobType === 'Latent' ? formatMessage({id: "Unknown"}) : ProbeData.position}
      className="mugshot-modal"
      requestHideModal={requestHideModal}
      content={
        <Fragment>
          <div className="mugshot-center">
            <Image
              id="fingerImg"
              src={
                ProbeData
                  ? ProbeData.image.Base64Data
                    ? "data:image/png;base64," + ProbeData.image.Base64Data
                    : ProbeData.image
                      ? "data:image/png;base64," + ProbeData.image
                      : ""
                  : ""
              }
            />
          </div>
        </Fragment>
      }
      buttons={
        <Fragment>
          <div className="footer-content">

            <div className="right">
              <Button
                id="cancelBtn"
                className="is-primary"
                text={formatMessage({ id: "close" })}
                onClick={requestHideModal}

              />
            </div>
          </div>
        </Fragment>
      }
    />
  );
};

const mapState = state => ({

  modalData:LivescanProbeModalSelector(state)
});

export default connect(mapState, {
  requestHideModal
})(ShowLivescanProbeModal);

