import React from "react";
import toJson from "enzyme-to-json";
import Switch from "../../../app/components/Switch/Switch";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

describe('<Switch />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <Switch  />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

});
