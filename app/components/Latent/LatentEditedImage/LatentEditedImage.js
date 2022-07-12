import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
// import { injectIntl } from "react-intl";
// import {NEW_ACTION} from "../../Modal/ModalRoot"
import Button from "../../Button/Button";
import Image from "../../Image/Image";
import Title from "../../Title/Title";
// import blkimage from "../../../images/fingerprint.jpg";
// import { requestShowModal } from "../../../actions/modal";
import { requestSaveLatentEditedImage } from "../../../actions/latent";
import {latentSUDSelector} from "../../../selectors/latent"
import "./LatentEditedImage.scss";
import {requestShowModal} from "../../../actions/modal"
import {CONFIRMATION_MODAL} from "../../Modal/ModalRoot"
import {requestStopLatentScan} from "../../../actions/latent"
import Permissions from "../../Permissions";
import Select from "../../Select/Select";
import Label from "../../Label/Label";



const modality = [
  "Finger",
  // "Palm",
  // "Edge",
]

const impression = [
  "Flat",
  "Roll",
]

// reducers cardscan.js
const position = [
  // "Unknown",
  // "L. PLAIN LITTLE",
  // "L. PLAIN RING",
  // "L. PLAIN MIDDLE",
  // "L. PLAIN INDEX",
  // "R. PLAIN LITTLE",
  // "R. PLAIN RING",
  // "R. PLAIN MIDDLE",
  // "R. PLAIN INDEX",
  // "R. ROLLED THUMB",
  // "R. ROLLED INDEX",
  // "R. ROLLED MIDDLE",
  // "R. ROLLED RING",
  // "R. ROLLED LITTLE",
  // "L. ROLLED THUMB",
  // "L. ROLLED INDEX",
  // "L. ROLLED MIDDLE",
  // "L. ROLLED RING",
  // "L. ROLLED LITTLE",
  // "L. SLAP",
  // "R. SLAP",
  // "L. PLAIN THUMB",
  // "R. PLAIN THUMB",

  "Unknown Finger",
  "Right Thumb",
  "Right Index",
  "Right Middle",
  "Right Ring",
  "Right Little",
  "Left Thumb",
  "Left Index",
  "Left Middle",
  "Left Ring",
  "Left Little",
  "Right Four Fingers",
  "Left Four Fingers",
  "Both Thumbs",

  // "Unknown Palm",
  // "Right Full Palm",
  // "Left Full Palm",
  // "Right Upper Palm",
  // "Left Upper Palm",
  // "Right Lower Palm",
  // "Left Lower Palm",
  // "Right Righter",
  // "Left Righter",

  // "Unknown Face Position",
  // "Frontal Face",
  // "Right Profile Face",
  // "Left Profile Face",
  // "Right Angled Face",
  // "Left Angled Face",
]


class LatentEditedImage extends React.Component {

  constructor() {
    super();
    this.state = {
      modality: "Finger",
      impression: "Flat",
      position: "Unknown Finger",
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.generateOptions = this.generateOptions.bind(this);
  }



  handleInputChange(id, value) {
    this.setState({ [id]: value });
  }


  generateOptions( options ) {
    const output = [ { value: "", displayName: this.props.formatMessage({ id: "select" }) } ];
    options.map( item => {
      // console.log("item",item);
      output.push({ value: item, displayName: this.props.formatMessage({ id: item }) });
    });
    return output;
  }



  render() {

    const {
      formatMessage,
      history,
      requestSaveLatentEditedImage,
      SUDData,
      requestShowModal,
      requestStopLatentScan,
      locale,
    } = this.props;


    // const formatMessage = (data) => {
    //   console.log("formatMessage::data",data.id);
    //   return this.props.formatMessage(data);
    // }


    const modaliies = this.generateOptions(modality);
    const impressions = this.generateOptions(impression);
    const positions = this.generateOptions(position);

    return (
      <Fragment>
        <div className="latent-editedimg-top">
          <div className="left" />
          <div className="center">
            <Title is="4" text={formatMessage({ id: "LatentJobData" })} />
          </div>
          <div
            className="right"
            style={locale !== "en" ? { direction: "rtl" } : {}}
          >
            <Button
              text={formatMessage({
                id: "back"
              })}
              className="is-primary"             
              leftIcon={locale === "en" ? "arrow-left" : "arrow-right"}            
              onClick={() =>
                requestShowModal({
                  modalType: CONFIRMATION_MODAL,
                  modalProps: {
                    action: () => {
                      history.push("/authenticated/latent/latentinnov");
                    },
                    message: "confirmationMsg"
                  }
                })
              }
            />
            &nbsp;&nbsp;&nbsp;
            <Permissions version={2} type="menu.latent.update">
              <Button
                text={formatMessage({
                  id: "Submit"
                })}
                className="is-primary"
                // rightIcon="arrow-right"

                // rightIcon={ locale === "en" ? "arrow-right" : '' }
                // leftIcon={ locale !== "en" ? "arrow-right" : '' }

                rightIcon={locale === "en" ? "arrow-right" : "arrow-left"}
                onClick={() => {
                  // console.log("submit called :: done");
                  requestSaveLatentEditedImage(SUDData, {
                    modality: this.state.modality,
                    impression: this.state.impression,
                    position: this.state.position
                  });
                  requestStopLatentScan();
                }}
                disabled={
                  !this.state.modality ||
                  !this.state.impression ||
                  !this.state.position
                }
              />
            </Permissions>
            &nbsp;&nbsp;&nbsp;
          </div>
        </div>
        <div className="latent-editedimg-content">
          <div className="latent-editedimg-selection">
            {/* <Image src={blkimage} /> */}
            <div className="column scan-container">
              <div className="img-center">
                <Image src={"data:image/png;base64," + SUDData} />
              </div>
            </div>
          </div>

          <div className="user-options">
            <h2>{formatMessage({ id: "Select Options" })}</h2>

            <div className="item">
              <Label
                text={formatMessage({ id: "modality" })}
                htmlFor="modality"
              />
              <Select
                value={this.state.modality}
                // style={{  }}
                id="modality"
                options={modaliies}
                formatMessage={formatMessage}
                // value="Finger"
                onChange={e => {
                  this.handleInputChange("modality", e.target.value);
                }}
              />
            </div>

            <div className="item">
              <Label
                text={formatMessage({ id: "impression" })}
                htmlFor="impression"
                disabled={this.state.modality === "Palm"}
              />
              <Select
                value={this.state.impression}
                // style={{  }}
                id="impression"
                options={impressions}
                formatMessage={formatMessage}
                // value="Flat"
                onChange={e => {
                  this.handleInputChange("impression", e.target.value);
                }}
                disabled={this.state.modality === "Palm"}
              />
            </div>

            <div className="item">
              <Label
                text={formatMessage({ id: "position" })}
                htmlFor="position"
              />
              <Select
                value={this.state.position}
                // style={{  }}
                id="position"
                options={positions}
                formatMessage={formatMessage}
                // value="Unknown Finger"
                onChange={e => {
                  this.handleInputChange("position", e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </Fragment>
    );

  }



}



const mapState = state => ({
  SUDData: latentSUDSelector(state),
  locale: state.locale.lang,
});
export default connect(mapState, {
  requestSaveLatentEditedImage,
  requestShowModal,
  requestStopLatentScan
})(withRouter(LatentEditedImage));




/*
export function LatentEditedImage({
  formatMessage,
  history,
  requestSaveLatentEditedImage,
  SUDData,
  requestShowModal,
  requestStopLatentScan
}) {
  return (
    <Fragment>
      <div className="latent-editedimg-top">
        <div className="left" />
        <div className="center">
          <Title is="4" text={formatMessage({ id: "LatentJobData" })} />
        </div>
        <div className="right">
          <Button
            text={formatMessage({
              id: "back"
            })}
            className="is-primary"
            leftIcon="arrow-left"
            // onClick={() => history.push("/authenticated/latent/latentinnov")}
            onClick={() =>  requestShowModal({
              modalType: CONFIRMATION_MODAL,
              modalProps: {
                action: () => {history.push("/authenticated/latent/latentinnov");

              },
                message:"confirmationMsg"
              }
            })}
          />
          &nbsp;&nbsp;&nbsp;
          <Permissions type="bio.app.latent.updater">
          <Button
            text={formatMessage({
              id: "Submit"
            })}
            className="is-primary"
            rightIcon="arrow-right"
            onClick={() => {requestSaveLatentEditedImage(SUDData);
              requestStopLatentScan()}}
          />
          </Permissions>
          &nbsp;&nbsp;&nbsp;
        </div>
      </div>
      <div className="latent-editedimg-content">
        <div className="latent-editedimg-selection">
          <div className="column scan-container">
            <div className="img-center">
              <Image src={"data:image/png;base64," + SUDData} />
            </div>
          </div>
        </div>
      </div>


      <div className="user-options">

        <div className="item">

          <Select
            value={this.state.protocol}
            style={{ ...inputStyle, ...selectStyle, minWidth: 100 }}
            id="serverProtocol"
            options={[
              { value: "http", displayName: formatMessage({ id: "HTTP" }) },
              { value: "https", displayName: formatMessage({ id: "HTTPS" }) },
            ]}
            formatMessage={formatMessage}
            onChange={e => {
              this.handleInputChange(e, "protocol");
            }}
          />


        </div>


      </div>


    </Fragment>
  );
}
const mapState = state => ({
  SUDData: latentSUDSelector(state)
});
export default connect(mapState, {
  requestSaveLatentEditedImage,
  requestShowModal,
  requestStopLatentScan
})(withRouter(LatentEditedImage));

*/
