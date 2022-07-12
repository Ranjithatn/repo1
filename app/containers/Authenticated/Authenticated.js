import React, { Fragment } from "react";
import { Route } from "react-router-dom";

import JobQueuePage from "../JobQueuePage/JobQueuePage";
import TenprintPage from "../TenprintPage/TenprintPage";
import LatentPage from "../LatentPage/LatentPage";
import AuditLogPage from "../AuditLogPage/AuditLogPage"
import ScannedBiometrics from "../ScannedBiometrics/ScannedBiometrics"
import CustomSearchPage from "../CustomSearchPage/CustomSearchPage"
import AppNavbar from "../../components/Navbar/AppNavbar/AppNavbar";
import Footer from "../../components/Footer/Footer";
import SettingsPage from "../../components/Settings";


import "./Authenticated.scss";

const Authenticated = props => {
  return (
    <div id="Authenticated">
      <AppNavbar {...props} />
      <div id="content">
        <Route exact path="/authenticated/jobqueue" component={JobQueuePage} />
        <Route path="/authenticated/tenprint" component={TenprintPage} />
        <Route path="/authenticated/latent" component={LatentPage} />
        <Route path="/authenticated/ScannedBiometrics" component={ScannedBiometrics} />
        <Route path="/authenticated/auditlog" component={AuditLogPage} />
        <Route path="/authenticated/customsearch" component={CustomSearchPage} />
        {/* <Route path="/authenticated/settings" component={SettingsPage} /> */}
      </div>
      <Footer {...props} />
    </div>
  );
};
export default Authenticated;
