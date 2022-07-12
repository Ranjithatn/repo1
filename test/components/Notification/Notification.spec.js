import React from "react";
import toJson from "enzyme-to-json";
import Notification from "../../../app/components/Notification/Notification";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });


describe('<Notification />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <Notification />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
  
});
