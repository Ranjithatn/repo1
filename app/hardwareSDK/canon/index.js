import * as CanonInProc from "./canonLib";

export function captureFromCamera(){
    return CanonInProc.captureFromCamera();
}

export function startLiveView(){
    return CanonInProc.startLiveView();
}

export function stopLiveView(){
    return CanonInProc.stopLiveView();
}

export function dispose(){
    return CanonInProc.dispose();
}