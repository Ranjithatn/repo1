import React from "react";
import toJson from "enzyme-to-json";
import { LiveScanLeft } from "../../../../app/components/Tenprint/LiveScan/LiveScanLeft";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

describe('<LiveScanLeft />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <LiveScanLeft  />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

});
