import React from "react";
import toJson from "enzyme-to-json";
import Textarea from "../../../app/components/Textarea/Textarea";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

describe('<Textarea />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <Textarea  />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

});
