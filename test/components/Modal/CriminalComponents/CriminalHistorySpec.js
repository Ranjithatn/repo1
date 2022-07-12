import React from "react";
import toJson from "enzyme-to-json";
import CriminalHistory from "../../../../app/components/Modal/CriminalComponents/CriminalHistory";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });


describe('<CriminalHistory />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <CriminalHistory />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
