import { call, put } from "redux-saga/effects";
import { spy } from "sinon";
import { delay } from "redux-saga";
import { push } from 'react-router-redux';
import { cloneableGenerator } from "redux-saga/utils";

import * as localStorage from "../../app/utils/localStorage";
import Api, { url } from "../../app/api";
import { callLogin, callLogout } from "../../app/sagas/auth";
import { requestLogoutSuccess, requestLoginFailed } from "../../app/actions/auth";
import {
  REQUEST_LOGIN,
  REQUEST_SPINNER_START,
  REQUEST_SPINNER_STOP,
  REQUEST_LOGIN_SUCCESS,
  REQUEST_LOGOUT
} from "../../app/actions/actionTypes";
import { startSpinner, stopSpinner } from "../../app/actions/spinner";
import { requestActiveJobs } from '../../app/actions/jobs';

describe("auth sagas", () => {

  describe("callLogin", () => {
    const loginRes = { jwt: "abc" };
    let output;
    let expected;
    const action = {
      type: REQUEST_LOGIN,
      payload: {
        username: "a",
        password: "b"
      },
      history: {
        push: spy()
      }
    };

    const callLoginCloneable = cloneableGenerator(callLogin)
    const generator = callLoginCloneable(action);
    const genWithAction = generator.clone();

    it("should start the spinner", () => {
      output = generator.next().value;
      expected = put(startSpinner());
      expect(output).toEqual(expected);
    });

    // it("should call login to api", () => {
    //   output = genWithAction.next().value;
    //   console.log("test output", output);
    //   expected = call(Api, {
    //     url: url.auth.login,
    //     method: "POST",
    //     data: action.payload
    //   });
    //   output = genWithAction.next().value;
    //   console.log("test output", output);
    //   expect(output).toEqual(expected);
    // });


    // it("should set jwt token", () => {
    //   output = generator.next(loginRes).value;
    //   expected = call(localStorage.set, "jwt", loginRes.jwt);
    //   expect(output).toEqual(expected);
    // });
    // it("should dispatch REQUEST_LOGIN_SUCCESS action", () => {
    //   output = generator.next(loginRes.jwt).value;
    //   expected = put({ type: REQUEST_LOGIN_SUCCESS, payload: loginRes.jwt });
    //   expect(output).toEqual(expected);
    // });
    // it("should call api to get active jobs", () => {
    //   output = generator.next({pageNo: 1, pageSize: 10}).value;
    //   expected = put(requestActiveJobs())
    //   expect(output).toEqual(expected);
    // });
    // it("should go to jobqueue view", () => {
    //   output = generator.next().value;
    //   expect(action.history.push.calledWith("/authenticated/jobqueue"));
    // });
    // it("should stop the spinner", () => {
    //   expect(output).toEqual(put(stopSpinner()));
    // });
    // it("should complete the generator", () => {
    //   output = generator.next().done;
    //   expected = "done";
    //   expect(output).toEqual(true);
    // });

  });

  describe("callLogout", () => {
    let output;
    let expected;
    const action = {
      type: url.auth.logout
    };
    const generator = callLogout(action);
    it("should start the spinner", () => {
      output = generator.next().value;
      const expected = put(startSpinner());
      expect(output).toEqual(expected);
    });
    it("should remove jwt", () => {
      output = generator.next().value;
      expected = call(localStorage.set, "jwt", "");
      expect(output).toEqual(expected);
    });
    it("should dispatch REQUEST_LOGOUT_SUCCESS", () => {
      output = generator.next().value;
      expected = put(requestLogoutSuccess());
      expect(output).toEqual(expected);
    });
    it("should go to root route", () => {
      output = generator.next().value;
      expected = put(push("/"));
      expect(output).toEqual(expected);
      // expect(action.history.push.calledWith("/"));
    });
    it("should stop the spinner", () => {
      output = generator.next().value;
      expect(output).toEqual(put(stopSpinner()));
    });
    it("should complete the generator", () => {
      output = generator.next().done;
      expected = "done";
      expect(output).toEqual(true);
    });
  });
});
