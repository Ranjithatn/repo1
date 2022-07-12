import { createSelector } from "reselect";


export const fingerNameSelector = createSelector (
    state => state.liveScan.positionDetails.annotationFinger,
    fingerName => fingerName
  );
  export const fingerPositionSelector = createSelector (
    state => state.liveScan.positionDetails.annotationPosition,
    fingerPosition => fingerPosition
  );
  export const completedFPSelector = createSelector (
    state => state.liveScan.finalCompletedData,
    completedData => completedData
  );
   export const completedRolledFPSelector = createSelector (
    state => state.liveScan.finalCompletedRolledData,
    completedRolledData => completedRolledData
  );
  export const annotationReasonSelector = createSelector (
    state => state.liveScan.annotationReason,
    annotationReason => annotationReason
  );
  export const annotationNotesSelector = createSelector (
    state => state.liveScan.annotationNotes,
    annotationNotes => annotationNotes
  );
  export const annotatedFingersSelector = createSelector (
    state => state.liveScan.annotatedFingers,
    annotatedFingers => annotatedFingers
  );
  export const mugshotDataSelector = createSelector (
    state => state.liveScan.mugshotData,
    mugshotData => mugshotData
  );

  export const LivescanProbeModalSelector = createSelector (
    state => {
    
      let jobType = 'Tenprint';
      if ( state.jobs && state.jobs.jobsById && Object.keys(state.jobs.jobsById).length < 4 ) {
        jobType = "Latent";
      }

      if ( state.jobs && state.jobs.jobsById && state.jobs.jobsById[ Object.keys(state.jobs.jobsById)[0] ].type === "Tenprint" ) {
        jobType = "Tenprint";
      }

      if ( state.jobs.jobType ) {
        jobType = state.jobs.jobType;
      }

      return { ProbeData: state.modal.modalProps, jobType }
    },
    // state => state.modal.modalProps,
    ProbeData => ProbeData
  );
  export const showMugshotDataSelector = createSelector (
    state => state.liveScan.mugshotShowdata,
    mugshotShowdata => mugshotShowdata
  );
  export const VerifyannotatedFingersSelector = createSelector (
    state => state.liveScan.annotatedFingers,
    annotatedFingers => annotatedFingers
  );
    export const ScanDataTypeSelector = createSelector (
    state => state.liveScan.scannedType,
    scannedType => scannedType
  );
  export const canonDataSelector = createSelector (
    state => state.liveScan.canonData,
    // (ImageData) => {
    //   console.log("selector for canonDataSelector select callllled.");
    //   return ImageData;
    // },
    canonData => canonData
  );


  export const palmScanSelector = createSelector (
    state => state.liveScan.palmScan,
    palmScan => palmScan
  );


  export const liveScanSelector = createSelector (
    state => state.liveScan.liveScanWorkflow,
    liveScanWorkflow => liveScanWorkflow
  );
  export const liveScanStartSelector = createSelector (
    state => state.liveScan.liveScanWorkflow.started,
    liveScanWorkflow => liveScanWorkflow
  );

  export const webcamImageSelector = createSelector (
    state => state.liveScan.liveScanWorkflow.webcamImage,
    webcamImage => webcamImage
  );