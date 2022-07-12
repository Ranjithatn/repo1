import React from "react";
import toJson from "enzyme-to-json";
import Navbar from "../../../app/components/Navbar/Navbar";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });


describe('<Navbar />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <Navbar />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
  
});
