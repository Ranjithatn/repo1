import React from "react";
import toJson from "enzyme-to-json";
import Svg from "../../../app/components/Svg/Svg";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

describe('<Svg />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <Svg  />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

});
