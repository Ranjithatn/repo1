import React from "react";
import toJson from "enzyme-to-json";
import TenprintVerifyMain  from "../../../../../app/components/Tenprint/TenprintVerify/TenprintVerifyMain/TenprintVerifyMain";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

describe('TenprintVerifyMain', () => {

  it("should render without crashing", () => {
    const component = mount(
      <TenprintVerifyMain />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

});
