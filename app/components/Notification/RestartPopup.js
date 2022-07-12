import React from "react";
import "../LoginForm/LoginPopup.scss";

import Label from "../../components/Label/Label";

import Button from "../../components/Button/Button";

import { translate } from "../../utils/intl";

class RestartPopup extends React.Component {
  constructor() {
    super();

    this.restartApp = this.restartApp.bind(this);
  }

  restartApp() {
    const remote = require("electron").remote;
    remote.app.relaunch();
    remote.app.exit(0);
  }

  render() {
    return (
      <div style={{ width: "100%", margin: "0 auto" }}>
        <div className="popup-bg-blur" />

        <div
          className="component--restart-popup"
          style={{ top: "0 !important;" }}
        >
          <div className="popup-content">
            {this.props.message && (
              <div className="error">{this.props.message}</div>
            )}

            <div>
              <Label
                text={translate(
                  "Settings Saved.Please Restart the Application"
                )}
              />
              <div style={{ textAlign: "center" }}>
                <Button
                  text={translate("restart")}
                  type="button"
                  className="is-primary login-button"
                  onClick={this.restartApp}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RestartPopup;
