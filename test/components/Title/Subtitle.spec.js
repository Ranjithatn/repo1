import React from "react";
import toJson from "enzyme-to-json";
import Subtitle from "../../../app/components/Title/Subtitle";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

describe('<Subtitle />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <Subtitle  />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

});
