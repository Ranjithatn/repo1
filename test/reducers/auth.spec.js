import auth from "../../app/reducers/auth";
import { spy } from "sinon";
import {
  requestLogin,
  requestLoginSuccess,
  requestLogoutSuccess,
  requestLoginFailed,
  requestSetNewUpdate,
  requestSetStatus,
  requestSetDownload,
  requestShowUpdateMessage
} from "../../app/actions/auth";
import { receiveInputFieldChanged } from "../../app/actions/global";

describe("auth reducers", () => {
  const initialState = {
    username: "",
    password: "",
    apiUri: "",
    jwt: "",
    error: "",
    roles: "",
    newUpdate: undefined,
    updateMessage: "",
    newDownload: undefined,
    version: "",
    updateStatus: "",
    parsedRoles: undefined,
    lookups: [],
  };
  xit("should have initial state", () => {
    const output = auth();
    expect(output).toEqual({...initialState, parsedRoles: []});
  });
  it("should handle initial state", () => {
    expect(auth(undefined, {})).toMatchSnapshot();
  });

  it("should handle RECEIVE_INPUT_FIELD_CHANGED", () => {
    const action = receiveInputFieldChanged({
      field: "username",
      value: "user",
      area: "auth"
    });
    const output = auth(
      { username: "t", password: "t", jwt: "", error: "" },
      action
    );
    const expected = {
      username: "user",
      password: "t",
      jwt: "",
      error: ""
    };
    expect(output).toEqual(expected);
  });

  it("should handle RECEIVE_INPUT_FIELD_CHANGED by returning prev state", () => {
    const action = receiveInputFieldChanged({
      field: "username",
      value: "user",
      area: "anotherArea"
    });
    const output = auth(initialState, action);
    expect(output).toEqual(initialState);
  });
  it("should clear old error message when user tries to login", () => {
    const historyMock = {
      push: spy()
    };
    const action = requestLogin(
      { username: "abcd", password: "abcde" },
      historyMock
    );
    const output = auth(
      {
        username: "abc",
        password: "abcd",
        error: "Invalid username or password"
      },
      action
    );
    const expected = {
      username: "abc",
      password: "abcd",
      error: ""
    };
    expect(output).toEqual(expected);
  });

  xit("should handle login success", () => {
    const initialState = {
      username: "t",
      password: "abc",
      roles: "",
      error: "",
      jwt: "",
      parsedRoles: undefined,
    };
    const action = requestLoginSuccess("abc");
    const output = auth(initialState, action);
    const expected = {
      username: "t",
      jwt: "abc",
      password: "",
      roles: "",
      error: ""
    };
    expect(output).toEqual(expected);
  });

  xit("should handle login failed", () => {
    const initialState = {
      username: "t",
      password: "abc",
      error: "",
      jwt: "",
      apiUri: ""
    };
    const action = requestLoginFailed("Invalid username or password");
    const output = auth(initialState, action);
    const expected = {
      username: "",
      jwt: "",
      password: "",
      roles: "",
      apiUri: "",
      error: "Invalid username or password",
      newUpdate: undefined,
      updateMessage: "",
      newDownload: undefined,
      version: "",
      updateStatus: "",
      parsedRoles: [],
      lookups: [],
    };
    expect(output).toEqual(expected);
  });
  it("should handle login success", () => {
    const action = requestLoginSuccess({ jwt: "jwt", roles: "admin" });
    const output = auth(initialState, action);
    const expected = {
      ...initialState,
      jwt: "jwt",
      roles: "admin"
    };
    expect(output).toEqual(expected);
  });

  xit("should handle logout success", () => {
    const initialState = {
      error: "",
      username: "a",
      password: "",
      jwt: "abc"
    };
    const action = requestLogoutSuccess();
    const output = auth(...initialState, action);
    const expected = {
      ...initialState,
      apiUri: "",
      error: "",
      jwt: "jwt",
      newDownload: undefined,
      newUpdate: undefined,
      password: "",
      roles: "admin",
      updateMessage: "",
      updateStatus: "",
      username: "",
      version: "",
      parsedRoles: [],
    };
    expect(output).toEqual(expected);
  });

  it("should handle unknown action type", () => {
    const initialState = {
      username: "a",
      password: "",
      jwt: "abc",
      error: ""
    };
    const action = {
      type: "unknown"
    };
    const output = auth(initialState, action);
    const expected = { username: "a", password: "", jwt: "abc", error: "" };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_SET_NEW_UPDATE type", () => {
    const action = requestSetNewUpdate();
    const output = auth(initialState, action);
    const expected = { ...initialState, newUpdate: true };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_SET_STATUS type", () => {
    const action = requestSetStatus("data");
    const output = auth(initialState, action);
    const expected = { ...initialState, updateStatus: "data" };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_SET_DOWNLOAD type", () => {
    const action = requestSetDownload(1);
    const output = auth(initialState, action);
    const expected = { ...initialState, newDownload: true, version: 1 };
    expect(output).toEqual(expected);
  });
  it("should handle REQUEST_SHOW_UPDATE_MESSAGE type", () => {
    const action = requestShowUpdateMessage("data");
    const output = auth(initialState, action);
    const expected = { ...initialState,updateMessage:"data" };
    expect(output).toEqual(expected);
  });
});
