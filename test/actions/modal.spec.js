import { requestShowModal, requestHideModal } from "../../app/actions/modal";
import { REQUEST_SHOW_MODAL, REQUEST_HIDE_MODAL } from "../../app/actions/actionTypes";

describe("modal actions", () => {
  let output;
  let expected;
  it("should create show modal action", () => {
    const payload = {
      modalType: "ADD_JOB",
      modalProps: {}
    };
    output = requestShowModal(payload);
    expected = {
      type: REQUEST_SHOW_MODAL,
      payload: {
        modalType: "ADD_JOB",
        modalProps: {}
      }
    };
    expect(output).toEqual(expected);
    expect(output).toMatchSnapshot();
  });

  it("should create hide modal action", () => {
    output = requestHideModal();
    expected = {
      type: REQUEST_HIDE_MODAL
    };
    expect(output).toEqual(expected);
    expect(output).toMatchSnapshot();
  });
});
