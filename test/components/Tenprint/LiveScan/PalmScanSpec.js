import React from "react";
import toJson from "enzyme-to-json";
import { PalmScan } from "../../../../app/components/Tenprint/LiveScan/PalmScan";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

describe('<PalmScan />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <PalmScan />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

});
