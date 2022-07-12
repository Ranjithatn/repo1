const edge = require("edge");
const fs = require("fs");

const getImage = edge.func({
  assemblyFile: "CardScanInProc.dll",
  typeName: "CardScanInProc.StartUp",
  methodName: "GetImage"
});

// const getCroppedImages = edge.func({
//   assemblyFile: "CardScanInProc.dll",
//   typeName: "CardScanInProc.StartUp",
//   methodName: "GetCroppedImages"
// });

export function getScannedImageData(jsonString) {
  return new Promise((resolve, reject) => {
    getImage(jsonString, function(error, result) {
      if (error) reject(error);
      resolve(result);
    });
  });
}

// export function getSegmentedImagesData(path){
//   return new Promise((resolve, reject) => {
//     getCroppedImages(path, function (error, result) {
//       if (error) reject(error);
//       resolve(result);
//     });
//   });
// }
