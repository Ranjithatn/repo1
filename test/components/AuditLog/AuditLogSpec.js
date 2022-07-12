import React from "react";
import toJson from "enzyme-to-json";
import AuditLog from "../../../app/components/AuditLog/AuditLog";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";

// electron issue
configure({ adapter: new Adapter() });


describe('<AuditLog />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <AuditLog  />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
