import React from "react";
import toJson from "enzyme-to-json";
import ProgressBar from "../../../app/components/ProgressBar/ProgressBar";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

describe('<ProgressBar />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <ProgressBar  />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

});
