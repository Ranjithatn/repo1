import React from "react";
import toJson from "enzyme-to-json";
import { RemoveJobModal } from "../../app/components/Modal/RemoveJobModal/RemoveJobModal";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });

let component, tree, instance;

let props = {
  requestHideModal: jest.fn(),
  requestRemoveJob: jest.fn(),
  formatMessage: jest.fn()
}

beforeEach(() => {
  component = mount(
    <RemoveJobModal {...props} />
  );
  tree = toJson(component);
  instance = component.instance();
});

describe("<RemoveJobModal />", () => {
  it("should render without crashing", () => {
    expect(tree).toMatchSnapshot();
  });
  it('should have a cancel button', () => {
    const output = component.find("button#removeJob-cancel-btn").length;
    expect(output).toEqual(1);
  })
  it('should have a button to confirm remove job', () => {
    const output = component.find("button#removeJob-btn").length;
    expect(output).toEqual(1);
  })
  it('should call requestRemoveJob when clicked', () => {
    const output = component.find("button#removeJob-btn").simulate('click');
    expect(props.requestRemoveJob).toHaveBeenCalled();
  })
  it('should call requestHideModal when clicked', () => {
    const output = component.find("button#removeJob-cancel-btn").simulate('click');
    expect(props.requestHideModal).toHaveBeenCalled();
  })
});
