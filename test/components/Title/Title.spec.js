import React from "react";
import toJson from "enzyme-to-json";
import Title from "../../../app/components/Title/Title";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

describe('<Title />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <Title  />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

});
