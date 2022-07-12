import React from "react";
import toJson from "enzyme-to-json";
import PortalNotification from "../../../app/components/Notification/PortalNotification";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });


describe('<PortalNotification />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <PortalNotification />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

});
