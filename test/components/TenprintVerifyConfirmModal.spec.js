import React from "react";
import toJson from "enzyme-to-json";
import { TenprintVerifyConfirmModal } from "../../app/components/Modal/TenprintVerifyConfirmModal/TenprintVerifyConfirmModal";
import Button from "../../app/components/Button/Button";
import Switch from "../../app/components/Switch/Switch";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });
let btn
let component, tree, instance;
// let doneBtn, SwitchBtn, DoneButton, criminalDatabaseToggle, civilDatabaseToggle;

let props = {
  requestHideModal: jest.fn(),
  formatMessage: jest.fn(),
  selectedAction: "data",
  requestInputFieldChanged: jest.fn(),
  newAction: "Update Criminal Data",
  selectedJob: 1,
  username: "admin",
  history: jest.fn(),
  requestNewAction: jest.fn(),
  SelectedActionHistory: 1,
  MatchedUserRowID: 1,
  ModalDataInfo: [1,2],
  refActionID: 1,
  requestShowModal: jest.fn(),
  requestShowNotification: jest.fn()
};

beforeEach(() => {
  component = mount(
    <TenprintVerifyConfirmModal {...props} />
  );
  btn = component.find("Button#newAction-btn");
  tree = toJson(component);
  instance = component.instance();
});

describe("<TenprintVerifyConfirmModal />", () => {
  xit("should render without crashing", () => {
    expect(tree).toMatchSnapshot();
  });

  xit("should call requestInputFieldChanged when criminal db search is toggled", () => {
    let event:{ modalType: "UPDATE_CRIMINAL" }
    btn.simulate("click", { modalType: "UPDATE_CRIMINAL" });
    expect(props.requestShowModal).toHaveBeenCalled();
  });

  xit("should call requestInputFieldChanged when criminal db search is toggled", () => {
    let event:{
      newaction:"Register Criminal Biographicws",
      job: 1,
      username:"username",
      tcn: "",
      typeOfAction: "subsequentAction",
      refActionID: 1,
      verifyAction: true,
      Note: "Action Updated"
    };
    props.newAction=  "Register Criminal Biographicws"
    btn.simulate("click",event );
    expect(props.requestNewAction).toHaveBeenCalled();
  });


});
