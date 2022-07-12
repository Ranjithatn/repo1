import React from "react";
import toJson from "enzyme-to-json";
import { NotificationRoot } from "../../../app/components/Notification/NotificationRoot";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });


describe('<NotificationRoot />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <NotificationRoot />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

});
