/**
 * @jest-environment jsdom
 */
import { call, put } from "redux-saga/effects";
import { spy } from "sinon";
import { delay } from "redux-saga";

import * as localStorage from "../../app/utils/localStorage";
import { callSetLocale } from "../../app/sagas/locale";
import {
  requestSetLocale,
  requestSetLocaleSuccess
} from "../../app/actions/locale";
import { REQUEST_SET_LOCALE } from "../../app/actions/actionTypes";
import { startSpinner, stopSpinner } from "../../app/actions/spinner";

describe("locale saga", () => {
  describe("callSetLocale", () => {
    let output;
    let expected;
    const action = {
      type: REQUEST_SET_LOCALE,
      payload: {
        lang: "ar",
        dir: "rtl",
        displayName: "Arabic"
      }
    };
    const generator = callSetLocale(action);
    it("should start the spinner", () => {
      output = generator.next().value;
      expected = put(startSpinner());
      expect(output).toEqual(expected);
    });
    it("should delay for 200ms", () => {
      output = generator.next().value;
      expected = call(delay, 200);
      expect(output).toEqual(expected);
    });
    it("should set lang in local storage", () => {
      output = generator.next().value;
      expected = call(localStorage.set, "lang", action.payload.lang);
      expect(output).toEqual(expected);
    });
    it("should dispatch REQUEST_SET_LOCALE_SUCCESS action", () => {
      output = generator.next().value;
      expected = put(requestSetLocaleSuccess({lang: "ar", displayName: "Arabic", dir: "rtl"}));
      expect(output).toEqual(expected);
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
