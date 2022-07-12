import { createSelector } from "reselect";


export const newCrimeTypeSelector = createSelector(
    state => state.updateCriminalModal.addCrimeData,
    addCrimeData => addCrimeData
  );

  export const addNewCriminalSelector = createSelector(
    state => state.updateCriminalModal.addedCrimeData,
    addCrimeData => addCrimeData
  );
  export const linkDatalSelector = createSelector(
    state => state.updateCriminalModal.linkData,
    addCrimeData => addCrimeData
  );