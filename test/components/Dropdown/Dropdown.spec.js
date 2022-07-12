import React from "react";
import toJson from "enzyme-to-json";
import Dropdown from "../../../app/components/Dropdown/Dropdown";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";

configure({ adapter: new Adapter() });


describe('<Dropdown />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <Dropdown />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
