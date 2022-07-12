import React from "react";
// const electron=global.electron
global.electron = {
  app: "1.2.3",
  remote: { app:"123" }.getPath="sh"
}



import toJson from "enzyme-to-json";
import AuditLogTable from "../../../../app/components/AuditLog/AuditLogTable/AuditLogTable";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


// global.electron = () => {
//   return { app: "123" }
// }



configure({ adapter: new Adapter() });


describe('<AuditLogTable />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <AuditLogTable />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
