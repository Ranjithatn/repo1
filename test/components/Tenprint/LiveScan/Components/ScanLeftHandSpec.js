import React from "react";
import toJson from "enzyme-to-json";
import ScanLeftHand from "../../../../../app/components/Tenprint/LiveScan/Components/ScanLeftHand";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

const props = {
  annotatedFingers: {
    finger: "",
    position: Number,
    fingerIndex: Number,
    fingerName: ""
  },
}

describe('<ScanLeftHand />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <ScanLeftHand {...props} />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
  
});
