import React from "react";
import toJson from "enzyme-to-json";
import { NewActionModal } from "../../app/components/Modal/NewActionModal/NewActionModal";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });

let component, tree, instance;
let criminalDatabaseToggle,
  latentDatabaseToggle,
  civilDatabaseToggle,
  registerCriminalToggle,
  editCriminalToggle,
  updateCriminalToggle,
  deleteCriminalToggle,
  visualVerifyToggle;

let props = {
  requestHideModal: jest.fn(),
  requestInputFieldChanged: jest.fn(),
  newAction: "Search Criminal Database",
  requestNewAction: jest.fn(),
  formatMessage: jest.fn()
};

beforeEach(() => {
  component = mount(<NewActionModal {...props} />);
  criminalDatabaseToggle = component.find("input#searchCriminalDB");
  civilDatabaseToggle = component.find("input#searchCivilDB");
  latentDatabaseToggle = component.find("input#searchLatentDB");
  // registerCriminalToggle = component.find("input#registerCriminal");
  // editCriminalToggle = component.find("input#editCriminalData");
  // updateCriminalToggle = component.find("input#updateCriminalFp");
  // deleteCriminalToggle = component.find("input#deleteCriminalFp");
  // visualVerifyToggle = component.find("input#visualVerify");
  tree = toJson(component);
  instance = component.instance();
});

describe("<NewActionModal />", () => {
  it("should render without crashing", () => {
    expect(tree).toMatchSnapshot();
  });
  it("should have a criminal db search toggle option", () => {
    const output = criminalDatabaseToggle.length;
    expect(output).toEqual(1);
  });
  it("should call requestInputFieldChanged when criminal db search is toggled", () => {
    let event: {
      target: {
        id: "searchCriminalDB"
      }
    };
    criminalDatabaseToggle.simulate("change", event);
    expect(props.requestInputFieldChanged).toHaveBeenCalled();
  });
  it("should have a latent db search toggle option", () => {
    const output = latentDatabaseToggle.length;
    expect(output).toEqual(1);
  });
  it("should call requestInputFieldChanged when latent db search is toggled", () => {
    let event: {
      target: {
        id: "searchLatentDB"
      }
    };
    latentDatabaseToggle.simulate("change", event);
    expect(props.requestInputFieldChanged).toHaveBeenCalled();
  });
  it("should have a civil db search toggle option", () => {
    const output = civilDatabaseToggle.length;
    expect(output).toEqual(1);
  });
  it("should call requestInputFieldChanged when civil db search is toggled", () => {
    let event: {
      target: {
        id: "searchCivilDB"
      }
    };
    civilDatabaseToggle.simulate("change", event);
    expect(props.requestInputFieldChanged).toHaveBeenCalled();
  });
  
  it('should call requestNewAction when button is clicked', () => {
    component.find('button#newAction-btn').simulate('click', {target: { id: "requestNewAction-btn"}});
    expect(props.requestNewAction).toHaveBeenCalled();
  })
});
