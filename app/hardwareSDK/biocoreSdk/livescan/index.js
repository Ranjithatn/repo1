import * as Livescan from "./livescan";

export function startCapture(
  onError,
  onPreviewData,
  onWorkflowCompleted,
  onUserRequest,
  onStatus,
  workflowName
) {
  return Livescan.startCapture(
    onError,
    onPreviewData,
    onWorkflowCompleted,
    onUserRequest,
    onStatus,
    workflowName
  );
}

export function stopCapture() {
  return Livescan.stopCapture();
}

export function setAnnotations(annotations) {
  return Livescan.setAnnotations(annotations);
}

export function sendUserResponse(response) {
  return Livescan.sendUserResponse(response);
}

export function getStatus() {
  return Livescan.queryStatus();
}
