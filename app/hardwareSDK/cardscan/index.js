import * as CardscanInProc from "./cardScanLib";

export function getScannedImageData(jsonString){
    return CardscanInProc.getScannedImageData(jsonString);
}

// export function getSegmentedImagesData(path){
//     return CardscanInProc.getSegmentedImagesData(path);
// }