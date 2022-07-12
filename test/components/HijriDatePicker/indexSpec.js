import React from "react";
import toJson from "enzyme-to-json";
import { HijriDatePicker } from "../../../app/components/HijriDatePicker/index";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";

jest.mock('./__mocks__/electron');

configure({ adapter: new Adapter() });


describe('<HijriDatePicker />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <HijriDatePicker />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
