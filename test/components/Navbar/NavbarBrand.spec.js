import React from "react";
import toJson from "enzyme-to-json";
import NavbarBrand from "../../../app/components/Navbar/NavbarBrand";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });


describe('<NavbarBrand />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <NavbarBrand />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
  
});
