import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { BiometricsDetailsSelector } from "../../selectors/jobs";
import Image from "../Image/Image";
import WorkflowWrapper from "../WorkflowWrapper/WorkflowWrapper";
import LeftContainer from "../WorkflowWrapper/LiveScanLeftContainer";
import Button from "../Button/Button";
import Svg from "../Svg/Svg";
import Icon from "../Icon/Icon";
import Label from "../Label/Label";
import Subtitle from "../Title/Subtitle";
import Title from "../Title/Title";
import { requestShowModal } from "../../actions/modal";
import { LIVESCAN_PROBE } from "../Modal/ModalRoot";
import { reg_space } from "../../utils/regEx";
import "./ScannedBiometrics.scss";

import {
  showSelectedBiometricsSelector,
  showBiometricsMugshot
} from "../../selectors/scannedBiometrics";
import { jobsTypeSelector,actionHistoryListSelector } from "../../selectors/jobs";
// import { requestShowMugshot } from "../../actions/liveScan";
import {
  requestScannedImageModal,
  requestSelectedBiometrics,
  requestBiometricMugshot,
  requestUpdateJobBiometrics,
  requestRemoveBiometricMugshot
} from "../../actions/scannedBiometrics";
import { requestSetpage } from "../../actions/jobs";
import Permissions from "../Permissions";
const doesBiometricsHaveMugshotData = biometrics => {
  if (biometrics && biometrics.length < 1) {
    // console.log("doesBiometricsHaveMugshotData", biometrics);
    return false;
  }
  const found =
    biometrics &&
    biometrics.filter(data => {
      return data.type === "Mugshot";
    });

  if (found && found.length > 0) {
    return true;
  }
  return false;
};

const doesBiometricsHavePalmData = biometrics => {
  if (biometrics && biometrics.length < 1) {
    // console.log("doesBiometricsHavePalmData", biometrics);
    return false;
  }
  return true;
};

export const ScannedBiometrics = ({
  biometricData,
  formatMessage,
  history,
  showSelectedBiometrics,
  requestSelectedBiometrics,
  requestShowModal,
  jobType,
  requestScannedImageModal,
  requestBiometricMugshot,
  showBiometricMug,
  requestUpdateJobBiometrics,
  requestRemoveBiometricMugshot,
  requestSetpage,
  locale,
  actionHistoryList
}) => {
  if (history) {
    const routeChangeListener = history.listen(location => {
      if (location.pathname != "/authenticated/ScannedBiometrics/Scanned") {
        // console.log("route changed location", location);
        // change the state, set the selected option back to fingerprint.
        requestSelectedBiometrics({
          selected: "fingerprint",
          title: "titlebio.fingerprint"
        });
        requestRemoveBiometricMugshot();
        routeChangeListener(); // remove the listener now.
      }
    });
  }

  // console.log("ScannedBiometrics::biometricData", biometricData);

  // const jobTypeName = ( biometricData && biometricData.FingerImages && biometricData.FingerImages.Fingers && biometricData.FingerImages.Fingers.Unknown && biometricData.FingerImages.Fingers.Unknown.length > 0 ) ? "Latent" : "Tenprint"
  const jobTypeName =
    biometricData.data &&
    biometricData &&
    biometricData.data.biometrics &&
    biometricData.data.biometrics.length === 1
      ? "Latent"
      : "Tenprint";

  // console.log("jobTypeName", jobTypeName);
  // console.log("jobType", jobType);
  const hasMugshot = doesBiometricsHaveMugshotData(biometricData.MugShotImage);
  const hasPalmPrints = doesBiometricsHavePalmData(biometricData.PalmImages);
  return (
    <WorkflowWrapper
      className="scanned-biometrics"
      top={
        <div className="biometrics-top">
          <div className="start" />
          <div className="center">
            <Title
              is="4"
              text={formatMessage({
                id:
                  jobTypeName === "Latent"
                    ? "LatentJobData"
                    : showSelectedBiometrics.selected === "mugshot"
                      ? "Mugshot"
                      : showSelectedBiometrics.selected === "palm"
                        ? "Palm Print Job Data"
                        : "TenprintJobData"
              })}
            />
          </div>
          <div className="end">
            <Button
              className="is-primary"
              text={formatMessage({ id: "back" })}
              leftIcon={ locale === "en" ? 'arrow-left' :'' }
              rightIcon={ locale === "en" ? '' : 'arrow-right' }

              onClick={() => history.push("/authenticated/jobqueue")}
            />
            &nbsp;&nbsp;
            { actionHistoryList.length === 0 &&
            <Permissions version={2} type="update">
              <Button
                className="is-primary"
                text={formatMessage({ id: "Update" })}
                rightIcon={ locale === "en" ? 'arrow-right' : '' }
                leftIcon={ locale === "en" ? '' : 'arrow-left' }

                // disabled="true"
                onClick={() => {
                  requestUpdateJobBiometrics(), requestSetpage("scanned");
                }}
              />
            </Permissions>}
            &nbsp;&nbsp;
          </div>
        </div>
      }
      left={
        <LeftContainer
          heading={formatMessage({ id: showSelectedBiometrics.title })}
          content={
            <Fragment>
              <div
                className={
                  jobType === "Latent"
                    ? "dark"
                    : showSelectedBiometrics.selected === "fingerprint"
                      ? "dark"
                      : "light"
                }
                onClick={() =>
                  requestSelectedBiometrics({
                    selected: "fingerprint",
                    title: "titlebio.fingerprint"
                  })
                }
              >
                <div className="img-container">
                  <Svg
                    className="svgrotate"
                    width="35"
                    height="50"
                    viewBox="0 -5 50 60"
                    d="M 44.2511 10.097C 42.4195 10.097 40.9329 11.5885 40.9329 13.4261L 40.872 28.3535C 40.872 28.3535 40.8771 29.3945 39.8801 29.3945C 38.8603 29.3945 38.8883 28.3535 38.8883 28.3535L 38.8908 6.82119C 38.8908 4.98358 37.4195 3.55573 35.5904 3.55573C 33.7588 3.55573 32.4524 4.98104 32.4524 6.82119L 32.4524 28.3535C 32.4524 28.3535 32.3408 29.4047 31.3565 29.4047C 30.3798 29.4047 30.3062 28.3535 30.3062 28.3535L 30.3062 3.23236C 30.3062 1.39474 28.9262 2.23698e-08 27.0946 2.23698e-08C 25.263 2.23698e-08 23.8703 1.39474 23.8703 3.23236L 23.8703 28.3535C 23.8703 28.3535 23.8196 29.3614 22.7668 29.3614C 21.7292 29.3614 21.7242 28.3535 21.7242 28.3535L 21.7216 9.692C 21.7216 7.85438 20.2858 6.70143 18.4568 6.70143C 16.6252 6.70143 15.2832 7.85438 15.2832 9.692L 15.2832 36.9659C 15.2832 36.9659 15.1031 38.1775 13.3705 36.177C 8.92593 31.0484 6.60995 30.0278 6.60995 30.0278C 6.60995 30.0278 2.39374 27.956 0.52664 31.6974C -0.827999 34.4106 0.607818 34.5582 2.81989 37.8899C 4.77831 40.8397 10.9708 48.6003 10.9708 48.6003C 10.9708 48.6003 18.3152 58.9948 28.2261 58.9948C 28.2261 58.9948 47.6381 59.8245 47.6381 40.5574L 47.5696 13.4281C 47.5671 11.5879 46.083 10.0964 44.2514 10.0964"
                  />
                  <Svg
                    width="35"
                    height="50"
                    viewBox="0 -5 50 60"
                    d="M 44.2511 10.097C 42.4195 10.097 40.9329 11.5885 40.9329 13.4261L 40.872 28.3535C 40.872 28.3535 40.8771 29.3945 39.8801 29.3945C 38.8603 29.3945 38.8883 28.3535 38.8883 28.3535L 38.8908 6.82119C 38.8908 4.98358 37.4195 3.55573 35.5904 3.55573C 33.7588 3.55573 32.4524 4.98104 32.4524 6.82119L 32.4524 28.3535C 32.4524 28.3535 32.3408 29.4047 31.3565 29.4047C 30.3798 29.4047 30.3062 28.3535 30.3062 28.3535L 30.3062 3.23236C 30.3062 1.39474 28.9262 2.23698e-08 27.0946 2.23698e-08C 25.263 2.23698e-08 23.8703 1.39474 23.8703 3.23236L 23.8703 28.3535C 23.8703 28.3535 23.8196 29.3614 22.7668 29.3614C 21.7292 29.3614 21.7242 28.3535 21.7242 28.3535L 21.7216 9.692C 21.7216 7.85438 20.2858 6.70143 18.4568 6.70143C 16.6252 6.70143 15.2832 7.85438 15.2832 9.692L 15.2832 36.9659C 15.2832 36.9659 15.1031 38.1775 13.3705 36.177C 8.92593 31.0484 6.60995 30.0278 6.60995 30.0278C 6.60995 30.0278 2.39374 27.956 0.52664 31.6974C -0.827999 34.4106 0.607818 34.5582 2.81989 37.8899C 4.77831 40.8397 10.9708 48.6003 10.9708 48.6003C 10.9708 48.6003 18.3152 58.9948 28.2261 58.9948C 28.2261 58.9948 47.6381 59.8245 47.6381 40.5574L 47.5696 13.4281C 47.5671 11.5879 46.083 10.0964 44.2514 10.0964"
                  />
                </div>
                <div className="livescan-format-container">
                  <span>{formatMessage({ id: "scannedImage" })}</span>
                </div>
              </div>
            </Fragment>
          }
          mugshot={
            <Fragment>
              {jobType === "Latent" ? (
                ""
              ) : (
                <Fragment>
                  {hasMugshot && (
                    <div
                      className={
                        "mugshot1 " +
                        (showSelectedBiometrics.selected === "mugshot"
                          ? " mugDark "
                          : " mugLight ")
                      }
                      onClick={() => {
                        requestSelectedBiometrics({
                          selected: "mugshot",
                          title: "titlebio.mugshot"
                        });
                        requestBiometricMugshot({
                          probeBiometricsId: biometricData.MugShotImage[0].id,
                          matchedBiometricsId: ""
                        });
                      }}
                    >
                      <Icon
                        icon="camera fa-3x"
                        title={formatMessage({
                          id: "mugshot"
                        })}
                      />
                      <Label text={formatMessage({ id: "mugshot" })} />
                    </div>
                  )}
                  {hasPalmPrints && (
                    <div className="palm ">
                      <div
                        className={
                          showSelectedBiometrics.selected === "palm"
                            ? "dark"
                            : "light"
                        }
                        onClick={() =>
                          requestSelectedBiometrics({
                            selected: "palm",
                            title: "titlebio.palm"
                          })
                        }
                      >
                        <div className="img-container">
                          <Svg
                            className="svgrotate"
                            width="35"
                            height="50"
                            viewBox="0 -5 50 60"
                            d="M 44.2511 10.097C 42.4195 10.097 40.9329 11.5885 40.9329 13.4261L 40.872 28.3535C 40.872 28.3535 40.8771 29.3945 39.8801 29.3945C 38.8603 29.3945 38.8883 28.3535 38.8883 28.3535L 38.8908 6.82119C 38.8908 4.98358 37.4195 3.55573 35.5904 3.55573C 33.7588 3.55573 32.4524 4.98104 32.4524 6.82119L 32.4524 28.3535C 32.4524 28.3535 32.3408 29.4047 31.3565 29.4047C 30.3798 29.4047 30.3062 28.3535 30.3062 28.3535L 30.3062 3.23236C 30.3062 1.39474 28.9262 2.23698e-08 27.0946 2.23698e-08C 25.263 2.23698e-08 23.8703 1.39474 23.8703 3.23236L 23.8703 28.3535C 23.8703 28.3535 23.8196 29.3614 22.7668 29.3614C 21.7292 29.3614 21.7242 28.3535 21.7242 28.3535L 21.7216 9.692C 21.7216 7.85438 20.2858 6.70143 18.4568 6.70143C 16.6252 6.70143 15.2832 7.85438 15.2832 9.692L 15.2832 36.9659C 15.2832 36.9659 15.1031 38.1775 13.3705 36.177C 8.92593 31.0484 6.60995 30.0278 6.60995 30.0278C 6.60995 30.0278 2.39374 27.956 0.52664 31.6974C -0.827999 34.4106 0.607818 34.5582 2.81989 37.8899C 4.77831 40.8397 10.9708 48.6003 10.9708 48.6003C 10.9708 48.6003 18.3152 58.9948 28.2261 58.9948C 28.2261 58.9948 47.6381 59.8245 47.6381 40.5574L 47.5696 13.4281C 47.5671 11.5879 46.083 10.0964 44.2514 10.0964"
                          />
                          <Svg
                            width="35"
                            height="50"
                            viewBox="0 -5 50 60"
                            d="M 44.2511 10.097C 42.4195 10.097 40.9329 11.5885 40.9329 13.4261L 40.872 28.3535C 40.872 28.3535 40.8771 29.3945 39.8801 29.3945C 38.8603 29.3945 38.8883 28.3535 38.8883 28.3535L 38.8908 6.82119C 38.8908 4.98358 37.4195 3.55573 35.5904 3.55573C 33.7588 3.55573 32.4524 4.98104 32.4524 6.82119L 32.4524 28.3535C 32.4524 28.3535 32.3408 29.4047 31.3565 29.4047C 30.3798 29.4047 30.3062 28.3535 30.3062 28.3535L 30.3062 3.23236C 30.3062 1.39474 28.9262 2.23698e-08 27.0946 2.23698e-08C 25.263 2.23698e-08 23.8703 1.39474 23.8703 3.23236L 23.8703 28.3535C 23.8703 28.3535 23.8196 29.3614 22.7668 29.3614C 21.7292 29.3614 21.7242 28.3535 21.7242 28.3535L 21.7216 9.692C 21.7216 7.85438 20.2858 6.70143 18.4568 6.70143C 16.6252 6.70143 15.2832 7.85438 15.2832 9.692L 15.2832 36.9659C 15.2832 36.9659 15.1031 38.1775 13.3705 36.177C 8.92593 31.0484 6.60995 30.0278 6.60995 30.0278C 6.60995 30.0278 2.39374 27.956 0.52664 31.6974C -0.827999 34.4106 0.607818 34.5582 2.81989 37.8899C 4.77831 40.8397 10.9708 48.6003 10.9708 48.6003C 10.9708 48.6003 18.3152 58.9948 28.2261 58.9948C 28.2261 58.9948 47.6381 59.8245 47.6381 40.5574L 47.5696 13.4281C 47.5671 11.5879 46.083 10.0964 44.2514 10.0964"
                          />
                        </div>
                        <div className="livescan-format-container">
                          <span>{formatMessage({ id: "palm" })}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </Fragment>
              )}
            </Fragment>
          }
        />
      }
      main={
        <Fragment>
          {biometricData.data &&
            biometricData.data.biometrics &&
            biometricData.data.biometrics.length > 0 && (
              <div
                className={
                  jobType === "Latent"
                    ? "grid-5fingers"
                    : showSelectedBiometrics.selected === "fingerprint"
                      ? "grid-5fingers"
                      : "hide"
                }
              >
                {biometricData && biometricData.FingerImages
                  ? Object.keys(biometricData.FingerImages.Fingers).map(key => {
                      console.log(
                        "biometricData.FingerImages.Fingers[key]",
                        biometricData.FingerImages.Fingers[key]
                      );
                      if (
                        biometricData.FingerImages.Fingers[key].length === 0
                      ) {
                        // return <div className="segmented-print-container" />;
                      }

                      return biometricData.FingerImages.Fingers[key].map(
                        (print, index) => {
                          // console.log("print is", print);
                          let annotationTitle = "";
                          if (print.annotation) {
                            annotationTitle = print.annotation;
                          }
                          if (print.annotationNote) {
                            annotationTitle =
                              annotationTitle + " :" + print.annotationNote;
                          }

                          return (
                            <Fragment key={index}>
                              <div
                                className="segmented-print-container"
                                key={print.position}
                                style={{ position: "relative" }}
                                title={annotationTitle || ""}
                              >
                                <div className="segmented-print">
                                  {print.annotation &&
                                  print.annotation !== "NotAnnotated"
                                   ? (
                                    <span
                                      style={{
                                        position: "absolute",
                                        color: "black",
                                        justifyContent: "center",
                                        top: 0,
                                        textAlign: "center",
                                        display: "block",
                                        width: "100%"
                                      }}
                                      // title={annotated.note || ""}
                                    >
                                      {formatMessage({ id: "annotated" })}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                  {print.thumbNail !== "" ? (
                                    <div style={{ margin: "10px 0" }}>
                                    <Image
                                      onClick={() =>
                                        requestScannedImageModal({
                                          probeBiometricsId: print.id,
                                          matchedBiometricsId: ""
                                        })
                                      }
                                      src={
                                        "data:image/png;base64," +
                                        print.thumbNail
                                      }
                                    />
                                    </div>
                                  ) : (
                                    <div>
                                    </div>
                                  )}
                                </div>
                                {formatMessage({ id: print.position })}
                              </div>
                            </Fragment>
                          );
                        }
                      );
                    })
                  : ""}
              </div>
            )}

          {biometricData && biometricData.FourFingersImages ? (
            <div
              className={
                showSelectedBiometrics.selected === "fingerprint" &&
                Object.keys(biometricData.FourFingersImages.Fingers).length ===
                  3
                  ? "grid-3fingers"
                  : showSelectedBiometrics.selected === "fingerprint" &&
                    Object.keys(biometricData.FourFingersImages.Fingers)
                      .length === 4
                    ? "grid-4fingers"
                    : "hide"
              }
            >
              {Object.keys(biometricData.FourFingersImages.Fingers).map(key =>
                biometricData.FourFingersImages.Fingers[key].map(
                  (print, index) => {

                    let annotationTitle = "";
                    if (print.annotation) {
                      annotationTitle = print.annotation;
                    }
                    if (print.annotationNote) {
                      annotationTitle = `${annotationTitle} : ${
                        print.annotationNote
                      }`;
                    }

                    if (print.position === "Both Thumbs") {
                      annotationTitle = "";
                    }

                    return (
                      <Fragment>
                        <div
                          className="segmented-print-container"
                          key={print.position}
                          style={{ position: "relative" }}
                          title={annotationTitle || ""}
                        >
                          <div className="segmented-print">

                            {print.annotation &&
                            print.annotation !== "NotAnnotated"
                             ? (
                              <span
                                style={{
                                  position: "absolute",
                                  color: "black",
                                  justifyContent: "center",
                                  top: 0,
                                  textAlign: "center",
                                  display: "block",
                                  width: "100%"
                                }}
                                // title={annotated.note || ""}
                              >
                                {formatMessage({ id: "annotated" })}
                              </span>
                            ) : (
                              ""
                            )}

                            {print.thumbNail !== "" ? (
                              <div style={{ margin: "10px 0" }}>
                              <Image
                                onClick={() =>
                                  requestScannedImageModal({
                                    probeBiometricsId: print.id,
                                    matchedBiometricsId: ""
                                  })
                                }
                                src={"data:image/png;base64," + print.thumbNail}
                              />
                              </div>
                            ) : (
                              <div>
                              </div>
                            )}
                          </div>
                          <span>{formatMessage({ id: print.position })}</span>
                        </div>
                      </Fragment>
                    );
                  }
                )
              )}
            </div>
          ) : (
            ""
          )}
          <div
            className={
              showSelectedBiometrics.selected === "mugshot"
                ? "scan-container"
                : "hide"
            }
          >
            {showBiometricMug && (
              <div className="img-center">
                <Image src={"data:image/png;base64," + showBiometricMug} />
              </div>
            )}
          </div>
          {biometricData && biometricData.PalmImages ? (
            <div
              className={
                showSelectedBiometrics.selected === "palm"
                  ? "grid-5fingers"
                  : "hide"
              }
            >
              {biometricData.PalmImages.map((print, index) => {
                let annotationTitle = "";
                if (print.annotation) {
                  annotationTitle = print.annotation;
                }
                if (print.annotationNote) {
                  annotationTitle = `${annotationTitle} : ${
                    print.annotationNote
                  }`;
                }
                return (
                  <Fragment key={index}>
                    <div
                      className="segmented-print-container"
                      key={print.position}
                      style={{ position: "relative" }}
                      title={annotationTitle || ""}
                    >
                      <div
                        className="segmented-print"
                      >


                        {print.annotation &&
                        print.annotation !== "NotAnnotated"
                         ? (
                          <span
                            style={{
                              position: "absolute",
                              color: "black",
                              justifyContent: "center",
                              top: 0,
                              textAlign: "center",
                              display: "block",
                              width: "100%"
                            }}
                            // title={annotated.note || ""}
                          >
                            {formatMessage({ id: "annotated" })}
                          </span>
                        ) : (
                          ""
                        )}


                        {print.thumbNail !== "" ? (
                          <div style={{ margin: "10px 0" }}>
                          <Image
                            onClick={() =>
                              requestScannedImageModal({
                                probeBiometricsId: print.id,
                                matchedBiometricsId: ""
                              })
                            }
                            src={"data:image/png;base64," + print.thumbNail}
                          />
                          </div>
                        ) : (
                          <div>
                          </div>
                        )}
                      </div>
                      <span>
                        {jobType === "Latent"
                          ? formatMessage({ id: "Unknown" })
                          : formatMessage({ id: print.position })}
                      </span>
                    </div>
                  </Fragment>
                );
              })}
            </div>
          ) : (
            ""
          )}
        </Fragment>
      }
      foot={<div />}
    />
  );
};

const mapState = state => ({
  actionHistoryList:actionHistoryListSelector(state),
  biometricData: BiometricsDetailsSelector(state),
  showSelectedBiometrics: showSelectedBiometricsSelector(state),
  showBiometricMug: showBiometricsMugshot(state),
  jobType: jobsTypeSelector(state),
  locale: state.locale.lang,
});
export default connect(
  mapState,
  {
    requestSelectedBiometrics,
    requestShowModal,
    requestScannedImageModal,
    requestBiometricMugshot,
    requestUpdateJobBiometrics,
    requestRemoveBiometricMugshot,
    requestSetpage
  }
)(withRouter(ScannedBiometrics));
