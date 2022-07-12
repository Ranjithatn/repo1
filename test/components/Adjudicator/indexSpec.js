import React from "react";
import toJson from "enzyme-to-json";
import Adjudicator from "../../../app/components/Adjudicator/index";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";

global.electron = () => true
global.fs = () => true

configure({ adapter: new Adapter() });

const props = {
  onAdjudicatorReady: () => { }
}


describe('<Adjudicator />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <Adjudicator {...props} />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});

