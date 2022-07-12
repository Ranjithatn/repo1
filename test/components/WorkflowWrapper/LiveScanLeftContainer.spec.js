import React from "react";
import toJson from "enzyme-to-json";
import LiveScanLeftContainer from "../../../app/components/WorkflowWrapper/LiveScanLeftContainer";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });


describe('<LiveScanLeftContainer />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <LiveScanLeftContainer  />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

});
