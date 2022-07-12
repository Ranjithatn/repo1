import modal from "../../app/reducers/modal";
import {
  REQUEST_SHOW_MODAL,
  REQUEST_HIDE_MODAL
} from "../../app/actions/actionTypes";
import { ADD_JOB } from "../../app/components/modal/ModalRoot";

describe("modal reducers", () => {
  const initialState = {
    modalType: "",
    modalProps: {}
  };
  it("should handle initial state", () => {
    const output = modal(initialState, {});
    const expected = {
      modalType: "",
      modalProps: {}
    };
    expect(output).toEqual(expected);
    expect(modal(undefined, {})).toMatchSnapshot();
  });

  it("should handle REQUEST_SHOW_MODAL", () => {
    const output = modal(
      {},
      {
        type: REQUEST_SHOW_MODAL,
        payload: { modalType: ADD_JOB, modalProps: {} }
      }
    );
    const expected = {
      modalType: ADD_JOB,
      modalProps: {}
    };
    expect(output).toEqual(expected);
  });

  it("should handle REQUEST_HIDE_MODAL", () => {
    const output = modal(
      { modalType: ADD_JOB, modalProps: {} },
      { type: REQUEST_HIDE_MODAL }
    );
    const expected = { modalType: "", modalProps: {} };
    expect(output).toEqual(expected);
  });

  it("should handle unknown action type", () => {
    const output = modal(
      { modalType: ADD_JOB, modalProps: { name: "test" } },
      { type: "Unknown" }
    );
    const expected = {
      modalType: ADD_JOB,
      modalProps: {
        name: "test"
      }
    };
    expect(output).toEqual(expected);
  });
});
