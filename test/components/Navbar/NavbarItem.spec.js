import React from "react";
import toJson from "enzyme-to-json";
import NavbarItem from "../../../app/components/Navbar/NavbarItem";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });


describe('<NavbarItem />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <NavbarItem />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
  
});
