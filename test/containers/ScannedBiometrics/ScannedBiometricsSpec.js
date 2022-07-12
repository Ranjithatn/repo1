import React from "react";
import toJson from "enzyme-to-json";
import {ScannedBiometrics} from "../../../app/containers/ScannedBiometrics/ScannedBiometrics";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });


describe('<ScannedBiometrics />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <ScannedBiometrics   />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});