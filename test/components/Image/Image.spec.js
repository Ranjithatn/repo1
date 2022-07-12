import React from "react";
import toJson from "enzyme-to-json";
import Image from "../../../app/components/Image/Image";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });


describe('<Image />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <Image />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
