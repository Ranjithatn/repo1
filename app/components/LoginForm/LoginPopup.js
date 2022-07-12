import React from 'react';
import "./LoginPopup.scss";

import { connect } from "react-redux";

import Label from "../../components/Label/Label";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";

import { translate, translateRes } from '../../utils/intl';
import { requestLoginPopup } from "../../actions/auth";
import { store } from "../../index";
import { hideError } from '../Notification/PortalNotification';
import { requestInputFieldChanged } from '../../actions/global';


class LoginPopup extends React.Component {

  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
    };
    this.requestInputFieldChanged = this.requestInputFieldChanged.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  requestInputFieldChanged(field, value) {
    this.setState({ [field]: value });
  }

  handleSubmit() {
    store.dispatch( requestInputFieldChanged({ target: { id: "username", value: this.state.username }}, "auth") );
    store.dispatch( requestInputFieldChanged({ target: { id: "password", value: this.state.password }}, "auth") );
    store.dispatch( requestLoginPopup({ username: this.state.username, password: this.state.password }) );
    hideError();
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleSubmit();
    }
  }


  render() {


    return(
      <div style={{ width: "100%", margin: "0 auto" }}>

        <div className="popup-bg-blur"></div>

        <div className="component--login-popup">

        <div className="popup-content">

          { this.props.message &&
            <div className="error">{ this.props.message }</div>
          }

          <div>

            <InputField
              labelText={translate("username.label")}
              onChange={e => this.requestInputFieldChanged("username", e.target.value)}
              inputId="username"
              value={this.state.username}
              inputClassName="input"
              placeholder={translate("username.placeholder")}
              onKeyPress={ this.handleKeyPress }
            />
            <InputField
              labelText={translate("password.label")}
              inputId="password"
              value={this.state.password}
              inputClassName="input"
              inputType="password"
              helpClassName="is-warning"
              placeholder={translate("password.placeholder")}
              onChange={e => this.requestInputFieldChanged("password", e.target.value)}
              onKeyPress={ this.handleKeyPress }
            />

            <div style={{ textAlign: "left" }}>
              <Button
                rightIcon="sign-in"
                text={translate("login")}
                type="submit"
                disabled={ ! this.state.username || ! this.state.password }
                className="is-primary login-button"
                onClick={ this.handleSubmit }
              />
            </div>

          </div>

        </div>

        </div>

      </div>
    )

  }

}


export default LoginPopup;

