import locale from "../../app/reducers/locale";
import { REQUEST_SET_LOCALE_SUCCESS } from "../../app/actions/actionTypes";

describe("reducers", () => {
  describe("locale", () => {
    it("should have an initial state", () => {
      const output = locale();
      expect(output).toEqual({ lang: "en", dir: "ltr", displayName: "English" });
    });
    it("should handle initial state", () => {
      const initialState = {
        lang: "en",
        dir: "ltr",
        displayName: "English"
      };
      const output = locale(undefined, initialState);
      const expected = { lang: "en", dir: "ltr", displayName: "English" };
      expect(output).toEqual(expected);
    });

    it("should handle REQUEST_SET_LOCALE_SUCCESS", () => {
      const initialState = {};
      const action = {
        type: REQUEST_SET_LOCALE_SUCCESS,
        payload: {
          lang: "ar",
          dir: "rtl",
          displayName: "Arabic"
        }
      };
      const output = locale(initialState, action);
      const expected = { lang: "ar", dir: "rtl", displayName: "Arabic" };
      expect(output).toEqual(expected);
    });

    it("should handle unknown action type", () => {
      const initialState = { lang: "en", dir: "ltr", displayName: "English" };
      const action = {
        type: "unknown",
        payload: { test: "test" }
      };
      const output = locale(initialState, action);
      const expected = { lang: "en", dir: "ltr", displayName: "English" };
      expect(output).toEqual(expected);
    });
  });
});
