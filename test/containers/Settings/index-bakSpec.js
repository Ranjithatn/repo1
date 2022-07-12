import React from "react";
import toJson from "enzyme-to-json";
import { Settings } from "../../../app/containers/Settings/index-bak";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });


describe('<Settings />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <Settings />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});