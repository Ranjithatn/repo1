// @flow
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import { injectIntl } from "react-intl";
import CustomSearch from "../../components/CustomSearch/CustomSearch";
// import CustomSearchIdList from "../../components/CustomSearch/CustomSearchIdList";
import ShowCustomSearchId from "../../components/CustomSearch/ShowCustomSearchId/ShowCustomSearchId";
import CustomSearchVerify from "../../components/CustomSearch/CustomSearchVerify/CustomSearchVerify";
import "./CustomSearchPage.scss";

export const CustomSearchPage = ({ intl }) => {
  const { formatMessage } = intl;
  return (
    <Fragment>
      <div id="customsearch">
        <Route
          exact
          path="/authenticated/customsearch/search"
          render={() => <CustomSearch formatMessage={formatMessage} />}
        />
        <Route
          exact
          path="/authenticated/customsearch/searchverify"
          render={() => <CustomSearchVerify formatMessage={formatMessage} />}
        />
        <Route
          exact
          path="/authenticated/customsearch/ShowCustomSearchId"
          render={() => <ShowCustomSearchId formatMessage={formatMessage} />}
        />
      </div>
    </Fragment>
  );
};

export default injectIntl(CustomSearchPage);
