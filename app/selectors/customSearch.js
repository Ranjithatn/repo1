import { createSelector } from "reselect";

export const customSearchDataSelector = createSelector(
  state => state.customSearch.customSearch,
  customSearchData => customSearchData
);
export const customSearchSelectedPersonSelector = createSelector(
  state => state.customSearch.customSearchPersonInfo,
  customSearchPersonData => customSearchPersonData
);
export const customSearchIdListSelector = createSelector(
  state => state.customSearch.searchIdList,
  searchIdList => searchIdList
);
export const matchedRowSelector = createSelector(
  state => state.customSearch.matchedRowId,
  matchedRowId => matchedRowId
);
export const customSearchDatabaseSelector = createSelector(
  state => state.customSearch.database,
  database => database
);
export const customSearchResponseSelector = createSelector(
  state => state.customSearch.response,
  response => response
);
