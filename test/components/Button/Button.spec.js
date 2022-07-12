import React from "react";
import toJson from "enzyme-to-json";
import Button from "../../../app/components/Button/Button";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";

configure({ adapter: new Adapter() });


describe('<Button />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <Button  />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
