import React from "react";
import toJson from "enzyme-to-json";
import { LiveScan } from "../../../../app/components/Tenprint/LiveScan/LiveScan";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

describe('<LiveScan />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <LiveScan  />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

});
