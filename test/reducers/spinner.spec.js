import spinner from "../../app/reducers/spinner";
import {
  REQUEST_SPINNER_START,
  REQUEST_SPINNER_STOP
} from "../../app/actions/actionTypes";

describe("reducers", () => {
  describe("spinner", () => {
    it("should handle initial state", () => {
      expect(spinner(undefined, {})).toMatchSnapshot();
    });

    it("should handle REQUEST_SPINNER_START", () => {
      expect(spinner(0, { type: REQUEST_SPINNER_START })).toEqual(1);
      expect(spinner(0, { type: REQUEST_SPINNER_START })).toMatchSnapshot();
    });

    it("should handle REQUEST_SPINNER_STOP", () => {
      expect(spinner(1, { type: REQUEST_SPINNER_STOP })).toEqual(0);
      expect(spinner(0, { type: REQUEST_SPINNER_STOP })).toEqual(0);
      expect(spinner(-1, { type: REQUEST_SPINNER_STOP })).toEqual(0);
      expect(spinner(1, { type: REQUEST_SPINNER_STOP })).toMatchSnapshot();
    });

    it("should handle unknown action type", () => {
      expect(
        spinner(0, { type: "unknown" })
      ).toMatchSnapshot();
    });
  });
});
