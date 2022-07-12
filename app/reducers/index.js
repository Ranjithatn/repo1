// @flow
import { combineReducers } from "redux";
import { routerReducer as router } from "react-router-redux";

import auth from "./auth";
import locale from "./locale";
import spinner from "./spinner";
import jobs from "./jobs";
import modal from "./modal";
import notifications from "./notifications";
import latent from "./latent";
import liveScan from "./liveScan";
import tenprint from "./tenprint";
import auditlogs from "./auditlog";
import scannedBiometrics from "./scannedBiometrics";
import customSearch from "./customSearch";
import updateCriminalModal from "./updateCriminalModal";
import app from "./app";
import cardScan from "./cardScan";

const appReducer = combineReducers({
  notifications,
  spinner,
  jobs,
  latent,
  locale,
  auth,
  modal,
  router,
  tenprint,
  liveScan,
  auditlogs,
  scannedBiometrics,
  customSearch,
  app,
  updateCriminalModal,
  cardScan
});

const rootReducer = (state, action) => {
  if (action.type === "RESET_ENTIRE_STORE") {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
