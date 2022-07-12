import * as actions from "../../app/actions/spinner";
import { REQUEST_SPINNER_STOP, REQUEST_SPINNER_START } from '../../app/actions/actionTypes';

describe("actions", () => {
  it("should create startSpinner action", () => {
    const output = actions.startSpinner();
    const expected = { type: REQUEST_SPINNER_START };
    expect(output).toEqual(expected);
    expect(output).toMatchSnapshot();
  });
  it("should create stopSpinner action", () => {
    const output = actions.stopSpinner();
    const expected = { type: REQUEST_SPINNER_STOP };
    expect(output).toEqual(expected);
    expect(output).toMatchSnapshot();
  });
});
