import React from "react";
import toJson from "enzyme-to-json";
import { SubmitPrintsModal } from "../../app/components/Modal/SubmitPrintsModal/SubmitPrintsModal";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });

let component, tree, instance;
let criminalDatabaseToggle, civilDatabaseToggle, latentDatabaseToggle;

let props = {
  requestHideModal: jest.fn(),
  requestInputFieldChanged: jest.fn(),
  selectedSearchOption: "Search Criminal Database",
  formatMessage: jest.fn(),
  requestSubmitPrints: jest.fn()
}

beforeEach(() => {
  component = mount(
    <SubmitPrintsModal {...props} />
  );
  criminalDatabaseToggle = component.find("input#submitPrints-crminalDatabase");
  civilDatabaseToggle = component.find("input#submitPrints-civilDatabase");
  latentDatabaseToggle = component.find("input#submitPrints-latentDatabase");
  tree = toJson(component);
  instance = component.instance();
});

describe("<SubmitPrintsModal />", () => {
  it("should render without crashing", () => {
    expect(tree).toMatchSnapshot();
  });
  it('should have a criminal database toggle option', () => {
    const output = component.find("Switch#submitPrints-crminalDatabase").length;
    expect(output).toEqual(1);
  })
  it('should have a civil database toggle option', () => {
    const output = component.find("Switch#submitPrints-civilDatabase").length;
    expect(output).toEqual(1);
  })
  it('should have a latent database toggle option', () => {
    const output = component.find("Switch#submitPrints-latentDatabase").length;
    expect(output).toEqual(1);
  })
  it("should call requestInputFieldChanged when criminal database is toggled", () => {
    let event = {
      id: "submitPrints-crminalDatabase"
    };
    criminalDatabaseToggle.simulate("change", event);
    expect(props.requestInputFieldChanged).toHaveBeenCalled();
  });
  it("should call requestInputFieldChanged when civil database is toggled", () => {
     let event = {
      id: "submitPrints-civilDatabase"
    };
    civilDatabaseToggle.simulate("change", event);
    expect(props.requestInputFieldChanged).toHaveBeenCalled();
  });
  it("should call requestInputFieldChanged when latent database is toggled", () => {
    let event = {
      id: "submitPrints-latentDatabase"
    };
    latentDatabaseToggle.simulate("change", event);
    expect(props.requestInputFieldChanged).toHaveBeenCalled();
  });
  it("should call requestSubmitPrints when submit button is clicked", () => {
    const submitBtn = component.find('button#submitPrints-btn').simulate('click', { target: { id: 'submitClicked'}});
    expect(props.requestSubmitPrints).toHaveBeenCalled();
  });
});
