/* eslint flowtype-errors/show-errors: 0 */
import React, { Fragment } from "react";
// import { Switch, Route } from 'react-router';
import { IntlProvider } from "react-intl";
import { connect } from 'react-redux';
import { withRouter, Switch, Route } from "react-router-dom";

import App from "./containers/App";
import LoginPage from "./containers/LoginPage/LoginPage";
import Authenticated from './containers/Authenticated/Authenticated';
import Spinner from './components/Spinner/Spinner';
import messages from './i18n';
import ModalRoot from './components/Modal/ModalRoot';
import NotificationRoot from './components/Notification/NotificationRoot';
import SettingsPage from './containers/Settings';

const AppContainer = ({ lang, showSpinner }) => (
  <IntlProvider locale={lang} messages={messages[lang]} textComponent={Fragment}>
    <App>
      { (showSpinner > 0) && <Spinner showSpinner={showSpinner} /> }
      <NotificationRoot />
      <ModalRoot />
      <Switch>
        <Route path="/authenticated" component={Authenticated} />
        <Route exact path="/settings" component={SettingsPage} />
        <Route path="/" component={LoginPage} />
      </Switch>
    </App>
  </IntlProvider>
);

const mapState = state => ({
  lang: state.locale.lang,
  showSpinner: state.spinner
})

export default withRouter(connect(mapState, null)(AppContainer))
