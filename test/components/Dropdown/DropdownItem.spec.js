import React from "react";
import toJson from "enzyme-to-json";
import DropdownItem from "../../../app/components/Dropdown/DropdownItem";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";

configure({ adapter: new Adapter() });


describe('<DropdownItem />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <DropdownItem />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
