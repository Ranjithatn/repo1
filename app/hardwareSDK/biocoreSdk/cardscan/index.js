import * as Cardscan from "./cardscan";

export function startCapture(onError, onScanning, onWorkflowCompleted, onUserRequest) {
  return Cardscan.startCapture(onError, onScanning, onWorkflowCompleted, onUserRequest);
}

export function stopCapture() {
  return Cardscan.stopCapture();
}

export function setAnnotations(annotations) {
  return Cardscan.setAnnotations(annotations);
}

export function sendUserResponse(response) {
  return Cardscan.sendUserResponse(response);
}