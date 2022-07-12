import React from "react";
import toJson from "enzyme-to-json";
import Figure from "../../../app/components/Figure/index";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });


describe('<Figure />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <Figure />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
