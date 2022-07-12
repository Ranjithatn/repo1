import * as actions from "../../app/actions/locale";

describe("actions", () => {
  it("should create requestSetLocale action", () => {
    const payload = {
      lang: "ar",
      dir: "rtl",
      displayName: "Arabic"
    };
    expect(actions.requestSetLocale(payload)).toMatchSnapshot();
  });
  it("should create requestSetLocaleSuccess action", () => {
    const payload = {
      lang: "ar",
      dir: "rtl",
      displayName: "Arabic"
    };
    expect(actions.requestSetLocaleSuccess(payload)).toMatchSnapshot();
  });
});
