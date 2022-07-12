import { all, fork, spawn } from "redux-saga/effects";
import { watchRequestLogin, watchRequestLogout, watchCheckForappUpdate, watchRequestLoginPopup } from "./auth.js";
import {
  watchRequestActiveJobs,
  watchRequestCreateJob,
  watchRequestActionHistory,
  watchRequestRemoveJob,
  watchRequestNewAction,
  watchAscSort,
  watchRequestRemoveFilter,
  watchCallShowActionHistoryFilteredData,
  watchOpenJobs,
  watchCallRequestShowJobFilteredData,
  watchRequestHistorySort,
  watchRequestCloseFilter,
  watchRequestCloseActionFilter,
  watchRequestUpdateTenprintCardJob,
  watchRequestSetNewCrimeType,
  watchRequestStartScanType,
  // watchRequestWildcardSearch,
  watchSystemPermissionRequest,
  watchRequestShowModal
} from "./jobs";

import {
  watchRequestStartCardScan,
  watchRequestSegmentedCardScan,
  watchRequestFetchScanSources,
  watchCardScanReset,
} from "./scanner";

import {
  watchRequestTenprintVerify,
  watchRequestTenprintVerifyHand,
  watchRequestTenprintVerifyMatchData,
  watchRequestMatchedPersonChanged,
  watchRequestModalData,
  watchRequestShowAdjudicator,
  watchrequestUnMatch
} from "./tenprint";
import {
  watchRequestRecivedImage,
  watchRequestSaveLatentEditedImage,
  watchRequestSaveSUD
} from "./latent";
import {
  watchrequestSelectFinger,
  // watchRequestStartScan,
  // watchRequestStopScan,
  watchRequestStoreCompletedData,
  watchRequestSaveLivescanFingerprints,
  watchRequestGetCanonData,
  watchRequestSaveLivescanFingerprintsResumable,
  watchRequestSaveLivescanFingerprintsResumableSuccess,
} from "./liveScan";

import { watchRequestSetLocale } from "./locale";

import { watchRequestShowAuditLog, watchRequestJobAuditLogs,watchRequestAuditLogSort } from "./auditlog";
import {
  watchRequestInputFieldChanged,
  watchRequestPageChanged,
  watchRequestTableRowClicked
} from "./global";

import {
  watchRequestScannedImageModal,
  watchRequestBiometricMugshot,
  watchRequestUpdateJobBiometrics
} from "./scannedBiometrics";

import { watchUpdateSearchText,watchRequestSearchText } from "./customSearch";

import { watchRequestNFIQQualityThreshold } from './app';



export default function* rootSaga() {
  yield all([
    spawn(watchRequestLogin),
    spawn(watchRequestLoginPopup),
    spawn(watchRequestLogout),
    spawn(watchRequestSetLocale),
    spawn(watchRequestActiveJobs),
    spawn(watchRequestCreateJob),
    spawn(watchRequestRemoveJob),
    spawn(watchRequestNewAction),
    spawn(watchRequestInputFieldChanged),
    spawn(watchRequestPageChanged),
    spawn(watchRequestTableRowClicked),
    spawn(watchRequestActionHistory),
    spawn(watchRequestUpdateTenprintCardJob),
    spawn(watchRequestSegmentedCardScan),
    spawn(watchAscSort),
    spawn(watchRequestHistorySort),
    spawn(watchRequestRecivedImage),
    spawn(watchRequestRemoveFilter),
    spawn(watchOpenJobs),
    spawn(watchCallShowActionHistoryFilteredData),
    spawn(watchCallRequestShowJobFilteredData),
    spawn(watchRequestTenprintVerify),
    spawn(watchrequestSelectFinger),
    spawn(watchRequestStartCardScan),
    spawn(watchRequestTenprintVerifyHand),
    spawn(watchRequestTenprintVerifyMatchData),
    spawn(watchRequestSaveSUD),
    spawn(watchRequestFetchScanSources),
    spawn(watchRequestStoreCompletedData),
    spawn(watchRequestSaveLivescanFingerprints),
    spawn(watchRequestSaveLatentEditedImage),
    spawn(watchRequestCloseFilter),
    spawn(watchRequestCloseActionFilter),
    spawn(watchRequestJobAuditLogs),
    spawn(watchRequestMatchedPersonChanged),
    spawn(watchRequestModalData),
    spawn(watchRequestShowAdjudicator),
    spawn(watchRequestGetCanonData),
    spawn(watchRequestShowAuditLog),
    spawn(watchRequestScannedImageModal),
    spawn(watchRequestBiometricMugshot),
    spawn(watchRequestUpdateJobBiometrics),
    spawn(watchUpdateSearchText),
    spawn(watchRequestSearchText),
    spawn(watchRequestSetNewCrimeType),
    spawn(watchRequestNFIQQualityThreshold),
    spawn(watchRequestSaveLivescanFingerprintsResumable),
    spawn(watchRequestSaveLivescanFingerprintsResumableSuccess),
    spawn(watchCardScanReset),
    spawn(watchRequestStartScanType),
    spawn(watchCheckForappUpdate),
    spawn(watchRequestAuditLogSort),
    spawn(watchrequestUnMatch),
    spawn(watchSystemPermissionRequest),
    spawn(watchRequestShowModal),
  ]);
}
