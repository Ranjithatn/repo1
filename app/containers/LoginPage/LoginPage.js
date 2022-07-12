// @flow
import React, { Fragment } from "react";
import { connect } from "react-redux";

import LoginForm from "../../components/LoginForm/LoginForm";
import { requestLogin, requestCheckForAppUpdate } from "../../actions/auth";
import { requestInputFieldChanged } from '../../actions/global';

export const mapState = state => {
  return {
    username: state.auth.username,
    password: state.auth.password,
    apiUri: state.auth.apiUri,
    error: state.auth.error
  };
};

export default connect(mapState, {
  requestInputFieldChanged,
  requestLogin,
  requestCheckForAppUpdate
})(LoginForm);
