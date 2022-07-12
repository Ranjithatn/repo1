import React from "react";
import toJson from "enzyme-to-json";
import { AddMugshotModal } from "../../app/components/Modal/AddMugshotModal/AddMugshotModal";
import Button from "../../app/components/Button/Button";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });

let component, tree, instance;
let cameraIcon, mugshotImg, doneBtn, captureBtn;

let props = {
  requestHideModal: jest.fn(),
  requestCapture: jest.fn(),
  showMugshot: jest.fn(),
  mugshotData:{clicked:true},
  formatMessage: jest.fn()
}

beforeEach(() => {
  component = mount(
    <AddMugshotModal {...props} />
  );
  cameraIcon = component.find("icon#cameraIcon")
  mugshotImg = component.find("image#mugshotImg")
  doneBtn = component.find("button#donebtn");
  captureBtn = component.find("button#capturebtn");
  tree = toJson(component);
  instance = component.instance();
});

describe("<AddMugshotModal />", () => {
  it("should render without crashing", () => {
    expect(tree).toMatchSnapshot();
  });
  it('should have a icon', () => {
    const output = component.find("Icon#cameraIcon").length;
    expect(output).toEqual(1);
  })
  it('initially image should be hidden', () => {
    const output = component.find("Image#mugshotImg").length;
    expect(output).toEqual(0);
  })
    it("should call requestCapture  if button clicked", () => {
     
      captureBtn.simulate("click");
    expect(props.requestCapture).toHaveBeenCalled();
  });
  
});
