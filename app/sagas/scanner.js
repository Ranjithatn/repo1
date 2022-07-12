import { call, put, takeLatest, select } from "redux-saga/effects";
import * as localStorage from "../utils/localStorage";
import { delay } from "redux-saga";
import { push } from "react-router-redux";
import {
  REQUEST_START_CARD_SCAN,
  REQUEST_START_CARD_SCAN_SUCCESS,
  REQUEST_START_CARD_SCAN_FAILED,
  REQUEST_SEGMENTED_CARD_SCAN,
  REQUEST_FETCH_SCAN_SOURCES,
  CARD_SCAN_RESET
} from "actions/actionTypes";
import {
  requestStartCardScanFailed,
  requestStartCardScanSuccess,
  requestSegmentedCardScanSuccess,
  requestSegmentedCardScanFailed,
  requestFetchScanSourcesSuccess,
  requestFetchScanSourcesFailed
} from "actions/scanner";
import {
  requestActiveJobs,
  requestClearLatentEditorData
} from "../actions/jobs";
import Api, { url } from "../api/";
import { startSpinner, stopSpinner } from "actions/spinner";
import { requestShowNotification } from "actions/notifications";
import {
  cardScanBoxesSelector,
  fullCardScanImageSelector,
  cardConfigSelector,
  cardImageDimensionsSelector,
  cardScanResolutionSelector
} from "selectors/jobs";
import * as CardConfigs from "CardConfigurations";
const fs = require("fs");
const path = require("path");
import demoCardImage from "images/fbiCard.png";
import {translate} from "../utils/intl"
import { cardScanWorkflow } from "actions/cardScan";

import { cardScanWorkflowSelector, cardScanSelector } from "selectors/cardScan";

import { settings, cardScanPath, generateFileName } from "../utils/electron";

import FORM1 from "../CardConfigurations/FORM1";
import FORM2 from "../CardConfigurations/FORM2";
import FORM2_P2 from "../CardConfigurations/FORM2_P2";
import FORM3 from "../CardConfigurations/FORM3";

let DWObject;
setupDynamSoft();

function setupDynamSoft() {
  if (
    process.env.NODE_ENV === "production" ||
    process.env.NODE_ENV === "development"
  ) {
    require("dwt");
    Dynamsoft.WebTwainEnv.ProductKey =
      "f0068NQAAAIDeKgsGhQ6v+6EjjVbihjUbA5FY8UKvain1YZSN8haUVuikxifmqeM8uMIQDrpvvIOhVIGlbm99GsCbE04WOfg=";
    Dynamsoft.WebTwainEnv.Trial = false;
    Dynamsoft.WebTwainEnv.ScanDirectly = true;
    Dynamsoft.WebTwainEnv.RegisterEvent("OnWebTwainReady", DynamsoftOnReady);
    function DynamsoftOnReady() {
      DWObject = Dynamsoft.WebTwainEnv.GetWebTwain("dwtcontrolContainer");
    }

    // DWObject.RegisterEvent("OnPostAllTransfers", () => {
    //   alert("Scanning has finished.");
    // });
  }
}

export function* watchRequestStartCardScan() {
  yield takeLatest(REQUEST_START_CARD_SCAN, callStartCardScan);
}

export function* watchRequestSegmentedCardScan() {
  yield takeLatest(REQUEST_SEGMENTED_CARD_SCAN, callStartSegmentedCardScan);
}

export function* watchRequestFetchScanSources() {
  yield takeLatest(REQUEST_FETCH_SCAN_SOURCES, callFetchScanSources);
}

export function* watchCardScanReset() {
  yield takeLatest(CARD_SCAN_RESET, callCardScanReset);
}

export function* callStartSegmentedCardScan() {
  yield put(startSpinner());
  yield call(delay, 1);

  try {
    const cardScan = yield select(cardScanSelector);

    // store all config info for yield, as it's difficult to call yield in a loop.
    const allYields = [];

    cardScan.segmented.forEach(card => {
      const scannedImage = card.image;
      const boxes = card.data.boxes;
      const imageDimensions = card.data.imageDimensions;
      const currCardConf = cardScan.workflow.cards && Array.isArray(cardScan.workflow.cards) && cardScan.workflow.cards.find(
        item => item.image === card.image
      );
      const scanResolution = currCardConf.resolution;
      const cardConfig = currCardConf.config;

      allYields.push({
        scannedImage,
        boxes,
        cardConfig,
        imageDimensions,
        scanResolution
      });
    });

    const finalImages = yield allYields.map(item =>
      call(
        makeSegmentedPrints,
        item.scannedImage,
        item.boxes,
        item.cardConfig,
        item.imageDimensions,
        item.scanResolution
      )
    );

    const segmentedPrints = [].concat.apply([], finalImages);

    yield put(requestSegmentedCardScanSuccess(segmentedPrints));
    yield put(push("/authenticated/tenprint/card/segmented"));
  } catch (e) {
    yield put(requestSegmentedCardScanFailed());
  } finally {
    yield put(stopSpinner());
  }
}

export function* callStartCardScan(action) {
  yield put(startSpinner());
  yield call(delay, 0);
  let {
    Resolution,
    cardType,
    selectedScanSource,
    onCompleted,
    config = {}
  } = action.payload;

  const cardScanWithPreview = action.payload.cardScanWithPreview
    ? action.payload.cardScanWithPreview
    : false;

  try {

    if (cardType === "demoCard") {

      // console.log("CardConfigs",CardConfigs);
      //todo remove.
      const res = 100;

      yield put(
        cardScanWorkflow({
          type: "CARD_SCAN_IMAGE",
          data: {
            image: demoCardImage,
            config: CardConfigs["DemoCard"](),
            resolution: res,
            type: "demo"
          }
        })
      );

      yield put(
        requestStartCardScanSuccess({
          cardImage: demoCardImage,
          cardConfig: CardConfigs["DemoCard"](),
          Resolution: res,
          cardType: "demoCard"
        })
      );
      if (onCompleted && typeof onCompleted === "function") {
        onCompleted();
      } else {
        yield put(push("/authenticated/tenprint/card/scanned"));
      }
    } else {
      const cardConfig = CardConfigs[cardType]();

      if (config && config.Page) {
        cardConfig.Page = config.Page;
      }

      if (config && config.CardType === "FORM2" && cardConfig.Page === 2) {
        cardConfig["CropRegions"] = CardConfigs["FORM2_P2"]().CropRegions;
      }

      if (cardType === "Custom") {
        cardConfig["CropRegions"] = [];
      }

      // return;
      const { Width, Height } = cardConfig.ScanArea;
      // Resolution = 500; //todo: remove when demo no longer needed
      // if (cardType === "custom") Resolution = 100;
      let image = yield call(startCardScan, {
        Resolution,
        selectedScanSource,
        Width: Width,
        Height: Height,
        cardScanWithPreview
      });

      // console.log("Image :::is::: image",image);
      // const base64Data = res.replace(/^data:image\/png;base64,/, "");
      // require("fs").writeFile("card.png", base64Data, 'base64', function(err) {
      //   console.log(err);
      // });

      yield put(
        cardScanWorkflow({
          type: "CARD_SCAN_IMAGE",
          data: {
            image: image,
            config: cardConfig,
            resolution: Resolution,
            type: cardType
          }
        })
      );

      yield put(
        requestStartCardScanSuccess({
          cardImage: image,
          cardConfig: cardConfig,
          Resolution: Resolution,
          cardType: cardType
        })
      );
      if (onCompleted && typeof onCompleted === "function") {
        onCompleted();
      }
    }
  } catch (e) {
    yield put(requestStartCardScanFailed());
    console.log("Card scan failed, error is ", e);
    yield put(
      requestShowNotification({
        message: e.message || e,
        type: "is-warning"
      })
    );
  } finally {
    yield put(stopSpinner());
  }
}

function dataURLtoBlob(dataURL) {
  // Decode the dataURL
  var binary = window && window.atob(dataURL && dataURL.split(",")[1]);
  // Create 8-bit unsigned array
  var array = [];
  for (var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  // Return our Blob object
  return new Blob([new Uint8Array(array)], { type: "image/png" });
}

function getCoordinate(x, y, x0, y0, angle) {
  const sinAngle = Math.sin(angle);
  const cosAngle = Math.cos(angle);
  let x2 = x0 + (x - x0) * cosAngle + (y - y0) * sinAngle;
  let y2 = y0 - (x - x0) * sinAngle + (y - y0) * cosAngle;
  return {
    x: x2,
    y: y2
  };
}

// make changes here
export function makeSegmentedPrints(
  b64Image,
  boxes,
  cardConfig,
  imageDimensions,
  scanResolution
) {
  // return customCardSegmentedImages( b64Image, boxes, cardConfig, imageDimensions, scanResolution );

  // console.log("boxes",boxes);
  // console.log("cardConfig",cardConfig);
  // console.log("imageDimensions",imageDimensions);
  // console.log("scanResolution",scanResolution);

  if (
    cardConfig.Name === "Custom" ||
    cardConfig.Name === "Demo Card" ||
    cardConfig.Name === "Palm Printing Card"
  ) {
    return customCardSegmentedImages(
      b64Image,
      boxes,
      cardConfig,
      imageDimensions,
      scanResolution
    );
  }

  return new Promise((resolve, reject) => {
    try {
      let result = [];
      const cropRegions = Object.keys(boxes);
      const heightRatio =
        (cardConfig.ScanArea.Height * scanResolution) / imageDimensions[1];
      const widthRatio =
        (cardConfig.ScanArea.Width * scanResolution) / imageDimensions[0];
      const img = new Image();
      img.onload = () => {
        cropRegions.forEach(region => {
          const canvas = document.createElement("canvas");
          const c = canvas.getContext("2d");
          const box = boxes[region];
          let { top, left, height, width, degrees } = box.style;
          let b64;

          if (cardConfig.Name != "Custom") {
            width = width * widthRatio;
            left = left * widthRatio;
            height = height * heightRatio;
            top = top * heightRatio;
          } else {
            width = width;
            height = height;
            left = left + 40;
            top = top + 45;
          }

          canvas.width = width;
          canvas.height = height;

          // debugger;

          if (degrees !== 0) {
            canvas.width = img.width;
            canvas.height = img.height;
            let pivotX;
            let pivotY;

            if (cardConfig.Name != "Custom") {
              pivotX = left + width - width / 2;
              pivotY = top + height - height / 2;
            } else {
              pivotX = left;
              pivotY = top;
            }

            // pivotX = left;
            // pivotY = top;

            const angle = (degrees * Math.PI) / 180;
            const canvas2 = document.createElement("canvas");
            const ctx2 = canvas2.getContext("2d");

            let c1 = getCoordinate(left, top, pivotX, pivotY, angle);
            let c2 = getCoordinate(left + width, top, pivotX, pivotY, angle);
            let c3 = getCoordinate(
              left + width,
              top + height,
              pivotX,
              pivotY,
              angle
            );
            let c4 = getCoordinate(left, top + height, pivotX, pivotY, angle);

            //get bounding box
            let bx1 = Math.min(c1.x, c2.x, c3.x, c4.x);
            let by1 = Math.min(c1.y, c2.y, c3.y, c4.y);
            let bx2 = Math.max(c1.x, c2.x, c3.x, c4.x);
            let by2 = Math.max(c1.y, c2.y, c3.y, c4.y);

            const sX = bx1,
              sY = by1,
              sW = bx2 - bx1,
              sH = by2 - by1,
              dX = 0,
              dY = 0,
              dW = sW,
              dH = sH,
              offsetX = angle > 0 ? -(sW - width) : sW - width,
              offsetY = angle > 0 ? sH - height : -(sH - height);

            c.drawImage(
              img,
              0,
              0,
              img.width,
              img.height,
              dX,
              dY,
              img.width,
              img.height
            );

            canvas2.width = width;
            canvas2.height = height;

            ctx2.translate(
              sW / 2 - (sW - width) / 2,
              sH / 2 - (sH - height) / 2
            );
            ctx2.rotate(-angle);
            ctx2.translate(-(sW / 2), -(sH / 2));
            ctx2.drawImage(canvas, sX, sY, sW, sH, dX, dY, dW, dH);
            b64 = canvas2.toDataURL("image/png");
          } else {
            // console.log("drawimage:left, top, width, height, width, height",left, top, width, height, width, height);
            c.drawImage(img, left, top, width, height, 0, 0, width, height);
            b64 = canvas.toDataURL("image/png");
          }

          const segmentedData = {
            name: region,
            b64Image: b64
          };

          // var file = dataURLtoBlob(b64);
          // var size = file.size;

          // var sizeKB = size/1000;
          // var sizeMB = size/1000000;
          // console.log("REGION: " + region + "    size", sizeMB, "MB", "-----", sizeKB, "KB");

          result.push(segmentedData);
        });

        resolve(result);
      };
      img.src = b64Image;
    } catch (e) {
      reject(new Error("segment prints failed:", e));
    }
  });
}

export function startCardScan({
  Resolution = 500,
  Width = 8.5,
  Height = 11,
  selectedScanSource,
  cardScanWithPreview
}) {
  return new Promise((resolve, reject) => {
    try {
      const dwtConfig = {
        IfShowProgressBar: false,
        IfShowIndicator: false,
        IfShowUI:
          cardScanWithPreview && cardScanWithPreview === true ? true : false,
        Unit: EnumDWT_UnitType ? EnumDWT_UnitType.TWUN_INCHES : 0,
        Resolution,
        IfDisableSourceAfterAcquire: true,
        IfAppendImage: false,
        IfFeederEnabled: false,
        MaxImagesInBuffer: 0,
        BitDepth: 8,
        PixelType: EnumDWT_PixelType.TWPT_GRAY
      };
      if (DWObject) {


        // DWObject.RegisterEvent("OnPostAllTransfers", () => {
        //   // alert("Scanning has finished.");
        //   // console.log("DWObject::OnPostAllTransfers::Scanning has finished");
        // });


        // DWObject.RegisterEvent('OnSourceUIClose', function() {
        //   // console.log("OnSourceUIClose");
        // });

        DWObject.IfShowFileDialog = false;

        // DWObject.Width = "400px";
        // DWObject.Height = "400px";

        const bSelected = DWObject.SelectSourceByIndex(selectedScanSource);
        if (bSelected) {
          function onB64Success(image) {
            const filePathName = `${cardScanPath}/${generateFileName(
              "cardscan"
            )}`;
            // put( cardScanWorkflow({
            //   type: "CARD_SCAN_INIT",
            //   data: {
            //     path: filePathName,
            //   }
            // }));

            // const _settings = settings();

            // DWObject.ChangeImageSize(0, parseInt(_settings.imageDimensions), parseInt(_settings.imageDimensions), 1);
            // DWObject.ChangeImageSize(0, parseInt(_settings.imageDimensions), parseInt(_settings.imageDimensions) + ( parseInt(_settings.imageDimensions) * parseFloat(0.4135) ), 1);

            DWObject.SaveAsPNG(
              // DWObject.SaveAsJPEG(
              // DWObject.SaveAsBMP(
              filePathName,
              0,
              () => {
                // console.log("default image successfully saved.");
                resolve(filePathName);
              },
              () => {
                // console.log("image saving failed.");
                reject("saving image failed.");
              }
            );

            // const b64 = makeBase64ImageData(
            //   image.getData(0, image.getLength())
            // );
            // resolve(b64);
          }

          function onB64Fail() {
            reject(DWObject.ErrorString);
          }

          function OnAcquireImageSuccess() {
            DWObject.ConvertToBase64([0], 0, onB64Success, onB64Fail);
            DWObject.CloseSource();
          }

          function OnAcquireImageFailure() {
            DWObject.CloseSource();
            reject(DWObject.ErrorString);
          }
          DWObject.SetOpenSourceTimeout(3000);
          DWObject.OpenSource();
          if (DWObject.ErrorCode === 0) {
            console.log(`
              scan started width: ${Width}
              scan started height: ${Height}
              scan resolution: ${Resolution}
            `);
            DWObject.SetImageLayout(0, 0, Width, Height); //left top right bottom
            DWObject.AcquireImage(
              dwtConfig,
              OnAcquireImageSuccess,
              OnAcquireImageFailure
            );
          } else {
            reject(DWObject.ErrorString);
          }
        } else {
          reject(DWObject.ErrorString);
        }
      } else {
        reject("DWObject not found");
      }
    } catch (e) {
      reject(e);
    }
  });
}

export function* callFetchScanSources() {
  // console.log("callFetchScanSources");
  yield put(startSpinner());
  yield call(delay, 150); // 100
  try {
    if (DWObject) {
      let result = [];
      const srcCount = DWObject.SourceCount; // Populate how many sources are installed in the system
      for (let i = 0; i < srcCount; i++) {
        result.push({
          displayName: DWObject.GetSourceNameItems(i),
          value: i
        });
      }

      if (result.length === 0) {
        // yield put(
        //   requestShowNotification({
        //     message: translate("No scanners found"),
        //     type: "is-warning"
        //   })
        // );
        const srcCount = DWObject.SourceCount;
        for (let i = 0; i < srcCount; i++) {
          result.push({
            displayName: DWObject.GetSourceNameItems(i),
            value: i
          });
        }
      }


      if (result.length === 0) {
        yield put(
          requestShowNotification({
            message: translate("No scanners found"),
            type: "is-warning"
          })
        );
      }

      yield put(requestFetchScanSourcesSuccess(result));
    } else {
      console.log("Scanning software is missing");
      // throw new Error("Scanning software is missing");
    }
  } catch (e) {
    console.log("error is ", e);
    yield put(requestFetchScanSourcesFailed());
    yield put(
      requestShowNotification({
        message: e,
        type: "is-warning"
      })
    );
  } finally {
    yield put(stopSpinner());
  }
}

export function makeBase64ImageData(str) {
  return "data:image/png;base64," + str;
}

export function* callCardScanReset() {
  // console.log("callCardScanReset");

    const workflow = yield select(cardScanWorkflowSelector);
    // console.log("workflow",workflow);

  const images = [];
  if (workflow.cards && workflow.cards.length > 0) {
    workflow.cards.forEach(card => {
      images.push(card.image);
    });
  }

  // delete all scanned images.
  if (images.length > 0) {
    images.forEach(image => {
      if (image.indexOf("data:imagepng;base64,") != -1) {
        return;
      }
      fs.unlink(image, err => {
        if (err) {
          console.log("error deleting card scan file");
        }
      });
      // unlinkSync
    });
  }

  yield put(requestClearLatentEditorData());
  // yield put ( requestSaveCardScanBoxes({ boxes: {}, imageDimensions: [] }) );
  // yield put ( requestResetCardScanBoxes() );
  CardConfigs["Custom"].CropRegions = [];
  yield put(cardScanWorkflow({ type: "RESET" }));

  const workflow2 = yield select(cardScanWorkflowSelector);
  console.log("::::RESET::::workflow2", workflow2);
}

export function customCardSegmentedImages(
  b64Image,
  boxes,
  cardConfig,
  imageDimensions,
  scanResolution
) {
  return new Promise((resolve, reject) => {
    try {
      let result = [];
      const cropRegions = Object.keys(boxes); // boxes

      const boxesArray = [];
      cropRegions.forEach(imageName => {
        const img = boxes[imageName];
        boxesArray.push(img);
      });

      const filteredBoxesArray = boxesArray.filter(
        item => item.fpLabel.indexOf("RAND_") === -1
      );

      const heightRatio =
        (cardConfig.ScanArea.Height * scanResolution) / imageDimensions[1];
      const widthRatio =
        (cardConfig.ScanArea.Width * scanResolution) / imageDimensions[0];

      const image = new Image();
      image.onload = () => {
        // console.log("image loaded....");

        filteredBoxesArray.forEach(img => {
          console.log("IMAGE:::::img:::::", img);
          let canvas = document.createElement("canvas");

          let b64;

          const name = img.fpLabel;

          let { width, height, top, left, degrees } = img.style;
          const imageWidth = imageDimensions[0];
          const imageHeight = imageDimensions[1];

          width = width * widthRatio;
          left = left * widthRatio;
          height = height * heightRatio;
          top = top * heightRatio;

          let newWidth = width;
          let newHeight = height;
          // if ( cardConfig.Name === "Demo Card" && img.fpLabel.indexOf("PLAIN") !== -1 ) {
          //   console.log("The current card is demo card", width, height, widthRatio, heightRatio);
          //   if ( width < height ) {
          //     let heightRatio = 200 / height;
          //     // console.log("heightRatio",heightRatio);
          //     let widthRatio = 200 / width;
          //     // console.log("widthRatio",widthRatio);
          //     const ratio = Math.max( heightRatio, widthRatio );
          //     // console.log("ratio",ratio);
          //     newWidth = 200 * ratio;
          //     newHeight = 200 * ratio;
          //   }
          //   console.log("FINAL::width, height", newWidth, newHeight);
          // }

          // required.. otherwise images wont open in the editor.
          if (width < height) {
            // let heightRatio = 200 / height;
            // console.log("heightRatio",heightRatio);
            // let widthRatio = 200 / width;
            // console.log("widthRatio",widthRatio);
            // const ratio = Math.max( heightRatio, widthRatio );
            // console.log("ratio",ratio);
            // newWidth = 210 * ratio;
            // newHeight = 200 * ratio;

            if (
              cardConfig.Name === "Palm Printing Card" &&
              img.fpLabel.indexOf("PALM") !== -1
            ) {
              let heightRatio = 600 / height;
              let widthRatio = 610 / width;
              const ratio = Math.max(heightRatio, widthRatio);
              newWidth = 610 * ratio;
              newHeight = 600 * ratio;
            } else {
              let heightRatio = 400 / height;
              let widthRatio = 420 / width;
              const ratio = Math.max(heightRatio, widthRatio);
              newWidth = 420 * ratio;
              newHeight = 400 * ratio;
            }
          }

          // canvas = document.createElement("canvas");
          canvas.width = newWidth;
          canvas.height = newHeight;
          // canvas.src = b64Image;

          const context = canvas.getContext("2d");

          if (degrees !== 0) {
            canvas.width = image.width;
            canvas.height = image.height;
            let pivotX;
            let pivotY;

            if (cardConfig.Name != "Custom") {
              pivotX = left + width - width / 2;
              pivotY = top + height - height / 2;
            } else {
              pivotX = left;
              pivotY = top;
            }

            // pivotX = left;
            // pivotY = top;

            const angle = (degrees * Math.PI) / 180;
            const canvas2 = document.createElement("canvas");
            const ctx2 = canvas2.getContext("2d");

            let c1 = getCoordinate(left, top, pivotX, pivotY, angle);
            let c2 = getCoordinate(left + width, top, pivotX, pivotY, angle);
            let c3 = getCoordinate(
              left + width,
              top + height,
              pivotX,
              pivotY,
              angle
            );
            let c4 = getCoordinate(left, top + height, pivotX, pivotY, angle);

            //get bounding box
            let bx1 = Math.min(c1.x, c2.x, c3.x, c4.x);
            let by1 = Math.min(c1.y, c2.y, c3.y, c4.y);
            let bx2 = Math.max(c1.x, c2.x, c3.x, c4.x);
            let by2 = Math.max(c1.y, c2.y, c3.y, c4.y);

            const sX = bx1,
              sY = by1,
              sW = bx2 - bx1,
              sH = by2 - by1,
              dX = 0,
              dY = 0,
              dW = sW,
              dH = sH,
              offsetX = angle > 0 ? -(sW - width) : sW - width,
              offsetY = angle > 0 ? sH - height : -(sH - height);

            context.drawImage(
              image,
              0,
              0,
              image.width,
              image.height,
              dX,
              dY,
              image.width,
              image.height
            );

            canvas2.width = width;
            canvas2.height = height;

            ctx2.translate(
              sW / 2 - (sW - width) / 2,
              sH / 2 - (sH - height) / 2
            );
            ctx2.rotate(-angle);
            ctx2.translate(-(sW / 2), -(sH / 2));
            ctx2.drawImage(canvas, sX, sY, sW, sH, dX, dY, dW, dH);
            b64 = canvas2.toDataURL("image/png");
          } else {
            context.drawImage(
              image, // actual image
              left, // crop left margin
              top, // crop top margin
              width, // crop width
              height, // crop height
              0, // where to place the cropped image in the canvas
              0, // where to place cropped image in the canvas
              newWidth, // cropped image width
              newHeight // cropped image heigjt
            );

            // context.scale(2.0,1.0);
            // context.drawImage();

            b64 = canvas.toDataURL("image/png");
          }

          const segmentedData = {
            name: name,
            b64Image: b64
          };

          // saveImageInFile( name, b64 ); // save image in file so we can test it.

          result.push(segmentedData);
        });

        resolve(result);
      };
      image.src = b64Image;
    } catch (e) {
      console.log("error occoured", e);
      reject(e);
    }
  });
}

export const saveImageInFile = (name, imageData) => {
  const base64Data = imageData.replace(/^data:image\/png;base64,/, "");
  fs.writeFile(`../../${name}.png`, base64Data, "base64", function(err) {
    if (err) {
      console.log("err", err);
    } else {
      console.log("successfully wrote file", `SCANNED_IMAGE.png`);
    }
  });
};
