import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import WorkflowWrapper from "../../WorkflowWrapper/WorkflowWrapper";
import LeftContainer from "../../WorkflowWrapper/LeftContainer";
import Button from "../../Button/Button";
import Image from "../../Image/Image";
// import Subtitle from "../Title/Subtitle";

import "./LatentImg.scss";

export function LatentImg({ formatMessage, history, imgUrl }) {
  return (
    // <div id="latent-img">Latent</div>
    <WorkflowWrapper
      className="latentimg-main"
      top={
        // <LatentTop history={history} formatMessage={formatMessage} />
        <div className="head">
          <Button
            text={formatMessage({ id: "back" })}
            className="is-primary"
            leftIcon="arrow-left"
            onClick={() => history.goBack()}
          />{" "}
          &nbsp;&nbsp;&nbsp;
          <Link to="/authenticated/latent/latentinnov">
            <Button
              text={formatMessage({ id: "next" })}
              className="is-primary"
              rightIcon="arrow-right"
            />
          </Link>
          &nbsp;&nbsp;&nbsp;
        </div>
      }
      left={
        <LeftContainer
          heading={formatMessage({ id: "scannedImage" })}
          content={
            <Fragment>
              <div className="img-container">
                <Image src={imgUrl.imgdata.file.path} alt="Latent Image" />
              </div>
              <div className="img-format-container">
                <div>
                  <span>{formatMessage({ id: "image" })}</span>
                </div>
                <Button
                  text={formatMessage({ id: "Add Image" })}
                  className="is-primary"
                  leftIcon="plus"
                />
              </div>
            </Fragment>
          }
        />
      }
      main={
        <div className="main-container">
          <div className="img">
            <Image src={imgUrl.imgdata.file.path} alt="Latent Image" />
          </div>
        </div>
      }
      foot={<div>Footer</div>}
    />
  );
}

export default withRouter(LatentImg);
