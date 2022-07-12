import React from "react";
import toJson from "enzyme-to-json";
import JobAuditLog from "../../../../app/components/AuditLog/JobAuditLog/JobAuditLog";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";

// electron issue
configure({ adapter: new Adapter() });


describe('<JobAuditLog />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <JobAuditLog  />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
