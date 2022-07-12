import React from "react";
import toJson from "enzyme-to-json";
import { AddJobModal } from "../../app/components/Modal/AddJobModal/AddJobModal";
import Button from "../../app/components/Button/Button";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });

let component, tree, instance;
let tenprintToggle, latentToggle, samisIdToggle, fileNumberToggle, saveJobBtn, startJobBtn;

let props = {
  requestHideModal: jest.fn(),
  requestCreateJob: jest.fn(),
  requestInputFieldChanged: jest.fn(),
  transactionType: "Tenprint",
  formatMessage: jest.fn(),
  requestPageChanged: jest.fn(),
}

beforeEach(() => {
  component = mount(
    <AddJobModal {...props} />
  );
  tenprintToggle = component.find("input#newjob-tenprint");
  latentToggle = component.find("input#newjob-latent");
  samisIdToggle = component.find("input#newjob-samisid");
  // fileNumberToggle = component.find("input#newjob-filenumber");
  saveJobBtn = component.find("button#save-job");
  startJobBtn = component.find("button#start-job");
  tree = toJson(component);
  instance = component.instance();
});

describe("<AddJobModal />", () => {
  it("should render without crashing", () => {
    expect(tree).toMatchSnapshot();
  });
  it('should have a tenprint toggle option', () => {
    const output = component.find("Switch#newjob-tenprint").length;
    expect(output).toEqual(1);
  })
  it('should have a latent toggle option', () => {
    const output = component.find("Switch#newjob-latent").length;
    expect(output).toEqual(1);
  })
  it('should have a SAMIS ID toggle option', () => {
    const output = component.find("Switch#newjob-samisid").length;
    expect(output).toEqual(1);
  })
  // it('should have a file number toggle option', () => {
  //   const output = component.find("Switch#newjob-filenumber").length;
  //   expect(output).toEqual(1);
  // })
  it("should call requestInputFieldChanged when tenprint is toggled", () => {
    let event: {
      id: "newjob-tenprint"
    };
    tenprintToggle.simulate("change", event);
    expect(props.requestInputFieldChanged).toHaveBeenCalled();
  });
  it("should call requestInputFieldChanged when latent is toggled", () => {
    let event: {
      id: "newjob-latent"
    };
    latentToggle.simulate("change", event);
    expect(props.requestInputFieldChanged).toHaveBeenCalled();
  });
  it("should call requestInputFieldChanged when samis ID is toggled", () => {
    let event: {
      id: "newjob-samisid"
    };
    samisIdToggle.simulate("change", event);
    expect(props.requestInputFieldChanged).toHaveBeenCalled();
  });
  // it("should call requestInputFieldChanged when filenumber is toggled", () => {
  //   let event: {
  //     id: "newjob-filenumber"
  //   };
  //   fileNumberToggle.simulate("change", event);
  //   expect(props.requestInputFieldChanged).toHaveBeenCalled();
  // });

  it('should call requestCreateJob when save job btn is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    saveJobBtn.simulate('click', evt);
    expect(props.requestCreateJob).toHaveBeenCalled();
  })
  it('should call requestCreateJob when start job btn is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    startJobBtn.simulate('click', evt);
    expect(props.requestCreateJob).toHaveBeenCalled();
  })
});
