import React from "react";
import toJson from "enzyme-to-json";
import Label from "../../../app/components/Label/Label";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });


describe('<Label />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <Label  />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
