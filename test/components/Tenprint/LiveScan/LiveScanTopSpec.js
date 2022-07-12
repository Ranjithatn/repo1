import React from "react";
import toJson from "enzyme-to-json";
import { LiveScanTop } from "../../../../app/components/Tenprint/LiveScan/LiveScanTop";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

describe('<LiveScanTop />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <LiveScanTop />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

});
