import React from "react";
import toJson from "enzyme-to-json";
import ErrorHandler from "../../../app/components/ErrorHandler/index";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";

global.electron = () => true
global.fs = () => true

configure({ adapter: new Adapter() });


describe('<ErrorHandler />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <ErrorHandler />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
