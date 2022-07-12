import React from "react";
import toJson from "enzyme-to-json";
import Reason from "../../../app/components/Annotations/Reason";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });


xdescribe('<Reason />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <Reason />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});