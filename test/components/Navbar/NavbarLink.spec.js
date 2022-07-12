import React from "react";
import toJson from "enzyme-to-json";
import NavbarLink from "../../../app/components/Navbar/NavbarLink";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });


describe('<NavbarLink />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <NavbarLink />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
  
});
