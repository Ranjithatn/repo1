import React from "react";
import toJson from "enzyme-to-json";
import { ShowLivescanProbeModal } from "../../app/components/Modal/ShowLivescanProbeModal/ShowLivescanProbeModal";
import Button from "../../app/components/Button/Button";
import Image from "../../app/components/Image/Image";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });

let component, tree, instance;
let fingerImg, doneBtn;

let props = {
  requestHideModal: jest.fn(),
  modalData: { ProbeData: { position: "RightThumb", image: { Base64Data: "xyzz" } }, jobType: "" },
  formatMessage: jest.fn()
};

beforeEach(() => {
  component = mount(<ShowLivescanProbeModal {...props} />);
  fingerImg = component.find("img#fingerImg");
  doneBtn = component.find("button#cancelBtn");
  tree = toJson(component);
  instance = component.instance();
});

describe("<ShowLivescanProbeModal />", () => {
  it("should render without crashing", () => {
    expect(tree).toMatchSnapshot();
  });
//     it("should call requestInputFieldChanged when latent is toggled", () => {
//     let ProbeData: undefined;
//     latentToggle.simulate("change", event);
//     expect(props.requestInputFieldChanged).toHaveBeenCalled();
//   });
it('should have a image', () => {
    const output = component.find("img#fingerImg").length;
    expect(output).toEqual(1);
  })
it('should have a image', () => {
  const ProbeData= { position: "RightThumb", image: { Base64Data: "" } }; 
    const output = component.find("img#fingerImg").length;
    expect(output).toEqual(1);
  })
});
