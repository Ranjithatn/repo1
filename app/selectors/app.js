import { createSelector } from "reselect";

export const serverStatusSelector = createSelector(
	state => state.app.serverStatus,
	serverStatus => serverStatus
);


export const nfiqQualityThresholdSelector = createSelector(
	state => state.app.settings.nfiq_quality_threshold,
	nfiq_quality_threshold => nfiq_quality_threshold
);
