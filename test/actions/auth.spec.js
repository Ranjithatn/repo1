import { spy } from "sinon";
import * as actions from "../../app/actions/auth";
import {
  REQUEST_LOGIN,
  REQUEST_LOGOUT,
  REQUEST_LOGIN_SUCCESS,
  REQUEST_LOGOUT_SUCCESS,
  REQUEST_SET_NEW_UPDATE,
  REQUEST_SHOW_UPDATE_MESSAGE,
  REQUEST_SET_DOWNLOAD,
  REQUEST_CHECK_FOR_APP_UPDATE
} from "../../app/actions/actionTypes";

const history = {
  push: spy()
};

describe("actions", () => {
  let output;
  let expected;
  it("should create login action", () => {
    const payload = {
      username: "username",
      password: "password"
    };
    output = actions.requestLogin(payload, history);
    expected = {
      type: REQUEST_LOGIN,
      payload: {
        username: "username",
        password: "password"
      },
      history
    };
    expect(output).toEqual(expected);
    expect(output).toMatchSnapshot();
  });
  it("should create login success action", () => {
    const authData = {
      jwt: "sdfsdergdgdhddh",
      roles: "admin"
    };
    output = actions.requestLoginSuccess(authData);
    expected = {
      type: REQUEST_LOGIN_SUCCESS,
      payload: authData
    };
    expect(output).toEqual(expected);
    expect(output).toMatchSnapshot();
  });

  it("should create logout action", () => {
    output = actions.requestLogout();
    expected = {
      type: REQUEST_LOGOUT
    };
    expect(output).toEqual(expected);

    output = actions.requestLogout(history);
    expect(output).toMatchSnapshot();
  });
  it("should create logout success action", () => {
    output = actions.requestLogoutSuccess();
    expected = {
      type: REQUEST_LOGOUT_SUCCESS
    };
    expect(output).toEqual(expected);

    output = actions.requestLogoutSuccess();
    expect(output).toMatchSnapshot();
  });
  it("should create requestSetNewUpdate action", () => {
    output = actions.requestSetNewUpdate();
    expected = {
      type: REQUEST_SET_NEW_UPDATE
    };
    expect(output).toEqual(expected);

    output = actions.requestSetNewUpdate();
    expect(output).toMatchSnapshot();
  });
  it("should create requestSetDownload action", () => {
    output = actions.requestSetDownload("1.0.1");
    expected = {
      type: REQUEST_SET_DOWNLOAD,
      payload:"1.0.1"
    };
    expect(output).toEqual(expected);

    output = actions.requestSetDownload("1.0.1");
    expect(output).toMatchSnapshot();
  });
  it("should create requestShowUpdateMessage action", () => {
    output = actions.requestShowUpdateMessage("1.0.1");
    expected = {
      type: REQUEST_SHOW_UPDATE_MESSAGE,
      payload:"1.0.1"
    };
    expect(output).toEqual(expected);

    output = actions.requestShowUpdateMessage("1.0.1");
    expect(output).toMatchSnapshot();
  });
  it("should create REQUEST_CHECK_FOR_APP_UPDATE action", () => {
    output = actions.requestCheckForAppUpdate();
    expected = {
      type: REQUEST_CHECK_FOR_APP_UPDATE
    };
    expect(output).toEqual(expected);

    output = actions.requestShowUpdateMessage();
    expect(output).toMatchSnapshot();
  });
});
