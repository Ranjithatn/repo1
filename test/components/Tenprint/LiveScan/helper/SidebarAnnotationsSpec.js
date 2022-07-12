const localStorageMock = {
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn()
};
var localStorage = localStorageMock;

import React from "react";
import toJson from "enzyme-to-json";
import SidebarAnnotations from "../../../../../app/components/Tenprint/LiveScan/helper/SidebarAnnotations";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";

configure({ adapter: new Adapter() });

const props = {
  formatMessage: data => data.id,
  
}

describe('<SidebarAnnotations />', () => {

  console.log("component");
  it("should render without crashing", () => {
    const component = mount(
      <SidebarAnnotations {...props} />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

});
