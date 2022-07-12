import { createSelector } from "reselect";

const getJobsState = state => state.jobs;
// const getActionHistoryState = state => state.jobs.actionHistory;
// const getJobsList = state => state.jobs.results;
// const getActionHistoryList = state => state.jobs.actionHistory.results;
// const getSelectedJob = state => state.jobs.selectedJob;
// const getSelectedAction = state => state.jobs.selectedAction;
// const getResults = state => state.results;
// const getPages = state => state.pages;
// const getMaxPages = state => state.maxPages;
// const getCurrentPage = state => state.currentPage;
// const getTotalPages = state => state.totalPages;

// Jobs
export const jobsStateSelector = createSelector(
  state => state.jobs,
  jobsList => jobsList
);
export const jobsByIdStateSelector = createSelector(
  state => state.jobs.jobsById,
  jobsList => jobsList
);
export const selectedJobStatusSelector = createSelector(
  state => state.jobs.selectedJobStatus,
  selectedJobStatus => selectedJobStatus
);

export const totalJobsSelector = createSelector(
  state => state.jobs.jobsPaging.totalCount,
  totaljobs => totaljobs
);

export const jobsListSelector = createSelector(
  state => state.jobs.jobsIdList,
  state => state.jobs.jobsById,
  (ids, jobs) => {
    if (ids.length === 0) return undefined;
    return ids.map(id => {
      return jobs[id];
    });
  }
);

export const ActionHistoryFilterSelector = createSelector(
  state => state.jobs.filter,
  filter => filter
  // (ids, jobs) => {
  //   if (ids.length === 0) return undefined;
  //   return ids.map(id => {
  //     console.log("----------selector");
  //     return jobs[id];
  //   });
  // }
);
export const jobfilterSelector = createSelector(
  state => state.jobs.jobFilter,
  jobFilter => jobFilter
);
export const FilterTitleSelector = createSelector(
  state =>
    (state.jobs && state.jobs.jobFilter && state.jobs.jobFilter.type) || null,
  FilterTitleSelector => FilterTitleSelector
);

export const jobsPagingSelector = createSelector(
  state => state.jobs.jobsPaging,
  jobsPaging => jobsPaging
);
export const jobsFilterTitleSelector = createSelector(
  state => state.jobs.filter.type,
  jobsFilterTitle => jobsFilterTitle
);

export const jobsPagesSelector = createSelector(
  state => state.jobs.jobsPaging.pages,
  pages => pages
);

export const jobsMaxPagesSelector = createSelector(
  state => state.jobs.jobsPaging.maxPages,
  maxPages => maxPages
);

export const jobsCurrentPageSelector = createSelector(
  state => state.jobs.jobsPaging.currentPage,
  currentPage => currentPage
);

export const jobsTotalPagesSelector = createSelector(
  state => state.jobs.jobsPaging.totalPages,
  totalPages => totalPages
);

export const jobsPageSizeSelector = createSelector(
  state => state.jobs.jobsPaging.pageSize,
  pageSize => pageSize
);

export const selectedJobSelector = createSelector(
  state => state.jobs.selectedJob,
  jobId => jobId
);

export const selectedTcnSelector = createSelector(
  state => state.jobs.selectedTcn,
  tcn => tcn
);

// New Job
export const newJobIdSelector = createSelector(
  state => state.jobs.newJob.id,
  id => id
);

// New Job CardScan
export const fullCardScanImageSelector = createSelector(
  state => state.jobs.newJob.cardScan.cardImage,
  img => img
);

export const cardTypeSelector = createSelector(
  state => state.jobs.newJob.cardScan.cardType,
  type => type
);

export const scanResolutionSelector = createSelector(
  state => state.jobs.newJob.cardScan.scanResolution,
  res => res
);

export const selectedScanSourceSelector = createSelector(
  state => state.jobs.newJob.cardScan.selectedScanSource,
  s => s
);

export const scanSourcesSelector = createSelector(
  state => state.jobs.newJob.cardScan.scanSources,
  s => s
);

export const cardConfigSelector = createSelector(
  state => state.jobs.newJob.cardScan.cardConfig,
  config => config
);

export const cardScanBoxesSelector = createSelector(
  state => state.jobs.newJob.cardScan.boxes,
  b => b
);

export const cardImageDimensionsSelector = createSelector(
  state => state.jobs.newJob.cardScan.imageDimensions,
  d => d
);

export const cardSegmentedPrintsSelector = createSelector(
  state => state.jobs.newJob.cardScan.segmentedPrints,
  s => s
);

export const cardScanResolutionSelector = createSelector(
  state => state.jobs.newJob.cardScan.scanResolution,
  r => r
);

export const cardScanAnnotationsSelector = createSelector(
  state => state.jobs.newJob.cardScan.annotations,
  a => a
);

// Action
export const actionHistoryStateSelector = createSelector(
  state => state.jobs.actionHistory,
  actionHistory => actionHistory
);

export const actionHistoryListSelector = createSelector(
  state => state.jobs.actionHistory.results,
  list => list
);

export const selectedActionSelector = createSelector(
  state => state.jobs.selectedAction,
  actionId => actionId
);

export const ActionSelector = createSelector(
  state => state.jobs.newAction,
  actionType => actionType
);
export const ActionStartSelector = createSelector(
  state => state.jobs.actionStart,
  actionType => actionType
);

export const ActionHeaderSelector = createSelector(
  state => state.jobs.actionHeader,
  actionType => actionType
);

export const BiometricsDetailsSelector = createSelector(
  state => state.jobs.BiometricsDetails,
  BiometricsDetails => BiometricsDetails
);
export const SelectedActionHistorySelector = createSelector(
  state => state.jobs.selectedAction,
  selectedAction => selectedAction
);
export const jobsTypeSelector = createSelector(
  state => state.jobs.jobType,
  JobType => JobType
);
export const SelectedActionStatusSelector = createSelector(
  state => state.jobs.selectedActionStatus,
  selectedActionStatus => selectedActionStatus
);
export const SelectedActionTypeSelector = createSelector(
  state => state.jobs.SelectedActionType,
  SelectedActionType => SelectedActionType
);
export const NewSearchActionSelector = createSelector(
  state => state.jobs.newSearchAction,
  newSearchAction => newSearchAction
);
export const pageSelector = createSelector(
  state => state.jobs.page,
  page => page
);
export const printSelector = createSelector(
  state => state.jobs.printStart,
  page => page
);
export const wildcardSearchTextSelector = createSelector(
  state => state.jobs.wildacardSearchText,
  page => page
);
export const wildacardActionSearchTextSelector = createSelector(
  state => state.jobs.wildacardActionSearchText,
  page => page
);


// export const currentPageSelector = createSelector(
//   getCurrentPage,
//   currentPage => currentPage
// );

// export const totalPagesSelector = createSelector(
//   getTotalPages,
//   totalPages => totalPages
// );

// export const resultsSelector = createSelector(getResults, results => results);
export const setJobTypeFilter = createSelector(
  getJobsState,
  job => job.JobTypeFilter
);

export const jobsForFilter = createSelector(
  state => state,
  jobsList => jobsList
);

export const palmScanAnnotationsSelector = createSelector(
  state => state.jobs.newJob.palmScanAnnotations,
  a => a
);

export const actionHistoryDataListSelector = createSelector(
  state => state.jobs.ahData,
  list => list
);
