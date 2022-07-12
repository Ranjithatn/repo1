import React from "react";
import toJson from "enzyme-to-json";
import Input from "../../../app/components/Input/Input";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });


describe('<Input />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <Input />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
