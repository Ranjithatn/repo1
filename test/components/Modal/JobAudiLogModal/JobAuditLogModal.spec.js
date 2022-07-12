import React from "react";
import toJson from "enzyme-to-json";
import { JobAuditLogModal } from "../../../../app/components/Modal/JobAudiLogModal/JobAuditLogModal";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";
import { databaseSelector } from "../../../../app/selectors/tenprint";


configure({ adapter: new Adapter() });

const props = {
  formatMessage: data => data.id
}

describe('<JobAuditLogModal />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <JobAuditLogModal {...props} />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
