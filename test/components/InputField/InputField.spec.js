import React from "react";
import toJson from "enzyme-to-json";
import InputField from "../../../app/components/InputField/InputField";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });


describe('<InputField />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <InputField />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
