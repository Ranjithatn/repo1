import React from "react";
import toJson from "enzyme-to-json";
import Authenticated from "../../../app/containers/Authenticated/Authenticated";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";

configure({ adapter: new Adapter() });


describe('<Authenticated />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <Authenticated />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});