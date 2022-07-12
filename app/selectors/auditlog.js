import { createSelector } from "reselect";

export const auditPagingSelector = createSelector(
    state => state.auditlogs.auditlogPaging,
    Paging => Paging
  );

export const auditPagingDataSelector = createSelector(
    state => state.auditlogs.auditLogById,
    Paging => Paging
  );

  export const auditlogsPagesSelector = createSelector(
    state => state.auditlogs.auditlogPaging.pages,
    pages => pages
  );
  
  export const auditlogsMaxPagesSelector = createSelector(
    state => state.auditlogs.auditlogPaging.maxPages,
    maxPages => maxPages
  );
  
  export const auditlogsCurrentPageSelector = createSelector(
    state => state.auditlogs.auditlogPaging.currentPage,
    currentPage => currentPage
  );
  
  export const auditlogsTotalPagesSelector = createSelector(
    state => state.auditlogs.auditlogPaging.totalPages,
    totalPages => totalPages
  );
  
  export const auditlogssPageSizeSelector = createSelector(
    state => state.auditlogs.auditlogPaging.pageSize,
    pageSize => pageSize
  );
  export const stausObjectSelector = createSelector(
    state => state.auditlogs.StausObject,
    StausObject => StausObject
  );
  export const crimeTypeObjectSelector = createSelector(
    state => state.auditlogs.crimeTypeObject,
    crimeTypeObject => crimeTypeObject
  );
  export const jobAuditLogSelector = createSelector(
    state => state.auditlogs.JobAuditLogDetails,
    JobAuditLogDetails => JobAuditLogDetails
  );
  export const jobAuditLogDescriptionSelector = createSelector(
    state => state.modal.modalProps,
    JobAuditLogDetails => JobAuditLogDetails
  );
  export const jobAuditLogFilterSelector = createSelector(
    state => state.auditlogs.filter,
    JobAuditLogFilter => JobAuditLogFilter
  );
  export const jobAuditLogSortSelector = createSelector(
    state => state.auditlogs.sort,
    JobAuditLogFilter => JobAuditLogFilter
  );