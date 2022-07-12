import { createSelector } from "reselect";

export const usernameSelector = createSelector(
  state => state.auth.username,
  u => u
);
export const updateMessageSelector = createSelector(
  state => state.auth.updateMessage,
  updateMsg => updateMsg
);
export const downloadSelector = createSelector(
  state => state.auth.newDownload,
  d => d
);
export const updateMsgSelector = createSelector(
  state => state.auth.updateStatus,
  updateStatus => updateStatus
);

export const lookupsSelector = createSelector(
  state => state.auth.lookups,
  lookups => lookups
);



export const userLocationSelector = createSelector(
  state => state.auth.lookups,
  (lookups) => {
    console.log("userLocationSelector::lookups", lookups);
    let result = [];

    if ( lookups.length > 0 ) {
      lookups.find( item => {
        if ( item.lookupName === "LocationIDs" ) {
          result = item.items;
          return true;
        }
      });
    }

    console.log("userLocationSelector::result",result);

    return result;
  }
);

export const lookupCrimeTypesSelector = createSelector(
  state => state.auth.lookupCrimeTypes,
  lookupCrimeTypes => lookupCrimeTypes
);

