import React from "react";
import toJson from "enzyme-to-json";
import NavbarDropdown from "../../../app/components/Navbar/NavbarDropdown";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });


describe('<NavbarDropdown />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <NavbarDropdown />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
  
});
