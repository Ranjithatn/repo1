import React from "react";
import toJson from "enzyme-to-json";
import {
  Small,
  Ring,
  Middle,
  Index,
  Thumb
} from "../../../../../app/components/Tenprint/LiveScan/Components/Fingers";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

describe('<Fingers />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <Small />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
  it("should render without crashing", () => {
    const component = mount(
      <Ring />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
  it("should render without crashing", () => {
    const component = mount(
      <Middle />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
  it("should render without crashing", () => {
    const component = mount(
      <Index />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
  it("should render without crashing", () => {
    const component = mount(
      <Thumb />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

});
