import { createSelector } from "reselect";

export const tenprintVerifyLeftFingersSelector = createSelector(
  state => state.tenprint.tenprintverifydata.leftfingers,
  LeftFingers => LeftFingers
);

export const tenprintVerifyRightFingersSelector = createSelector(
  state => state.tenprint.tenprintverifydata.rightfingers,
  RightFingers => RightFingers
);

export const tenprintVerifyMugshotSelector = createSelector(
  state => state.tenprint.tenprintverifydata.ProbeMugshotInfo,
  MugShot => MugShot
);

export const tenprintVerifyPersonInfosSelector = createSelector(
  state => state.tenprint.tenprintverifydata.personinfos,
  PersonInfos => PersonInfos
);

export const tenprintVerifySelectedHandInfoSelector = createSelector(
  state => state.tenprint.tenprintverifyHandData,
  SelectedHand => SelectedHand
);

export const tenprintVerifyLeftMatchInfoSelector = createSelector(
  state => state.tenprint.tenprintverifydata.leftmatches,
  LeftMatches => LeftMatches
);
export const databaseSelector = createSelector(
  state => state.tenprint.tenprintverifydata.database,
  LeftMatches => LeftMatches
);

export const tenprintVerifyRightMatchInfoSelector = createSelector(
  state => state.tenprint.tenprintverifydata.rightmatches,
  RightMatches => RightMatches
);

export const tenprintVerifyUserMatchInfoSelector = createSelector(
  state => state.tenprint.tenprintverifyMatchInfo,
  MatchesInfo => MatchesInfo
);
export const showAdjudicatorSelector = createSelector(
  state => state.tenprint.ShowAdjudicator,
  showAdjudicator => showAdjudicator
);

export const SelectedRowSelector = createSelector(
  state => state.tenprint.SelectedRow,
  SelectedRow => SelectedRow
);
export const SelectedMatchSelector = createSelector(
  state => state.tenprint.adjudicatorMatch,
  SelectedMatch => SelectedMatch
);
export const adjudicatorPassImageDataSelector = createSelector(
  state => state.tenprint.AdjudicatorPassImageData,
  AdjudicatorPassImageData => AdjudicatorPassImageData
);

export const adjudicatorImageDataSelector = createSelector(
  state => {

    return state.tenprint.AdjudicatorPassImageData.Result.matched
      ? state.tenprint.AdjudicatorPassImageData.Result.matched.image
      : null;
  },
  // state => state.tenprint.AdjudicatorPassImageData.Result.matched.image,
  AdjudicatorPassImageData => AdjudicatorPassImageData
);

export const tenprintPersonModalSelector = createSelector(
  state => state.modal.modalProps,
  PersonData => PersonData
);
export const MatchedUserRowIDSelector = createSelector(
  state => state.tenprint.MatchedUserRowID,
  MatchedUserRowID => MatchedUserRowID
);
export const MatchedPersonInfoSelector = createSelector(
  state => state.tenprint.MatchedPersonInfo,
  MatchedPersonInfo => MatchedPersonInfo
);

export const ModalDataInfoSelector = createSelector(
  state => state.tenprint.ConfirmModalData,
  ConfirmModalData => ConfirmModalData
);

export const SelectedActionTypeSelector = createSelector(
  state => state.jobs.SelectedActionType,
  SelectedActionType => SelectedActionType
);
export const ActionNoteSelector = createSelector(
  state => state.tenprint.ActionNote,
  ActionNote => ActionNote
);


//tenprint verify new
// export const showSelectedTenprintTypeSelector = createSelector(
//   state => state.tenprint.showTenprintSelected,
//   showTenprintSelected => showTenprintSelected
// );

export const tenprintVerifyRaw = createSelector(state => {
  return {
    tenprint: state.tenprint.tenprint,
    selected: state.tenprint.tenprintverifyHandData.position || ""
  };
}, tenprint => tenprint);

export const adjudicatorResultSelector = createSelector(
  state => state.tenprint.adjudicatorResult,
  adjudicatorResult => adjudicatorResult
);
// export const modalCheckboxSelector = createSelector(
//   state => state.tenprint.ModalCheckbox,
//   ModalCheckbox => ModalCheckbox
// );


export const tenprintVerifyLatentProbleDataSelector = createSelector(
  state => state.tenprint.tenprintverifydata.latentProbeData,
  latentProbeData => latentProbeData
);


export const panesSelector = createSelector(
  state => state.tenprint.panes,
  panes => panes
);
export const tenprintSelector = createSelector(
  state => state.tenprint.tenprint,
  panes => panes
);

// export const fingerprintIDSelector = createSelector(
//   state => state.tenprint.tenprintverifydata.matched.matchedFingerprintID,
//   matchedFingerprintID => matchedFingerprintID
// );

