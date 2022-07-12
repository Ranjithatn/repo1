import React from "react";
import toJson from "enzyme-to-json";
import JobQueue from "../../../app/components/JobQueue/JobQueue";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

// const props = {
//   requestShowModal: (data) => data.modalType,
//   requestActiveJobs: () => { },
//   requestInputFieldChanged: (data) => { return data },
//   requestShowJobFilteredData: (data) => { return data.key, data.value },
//   requestCloseFilter: () => { },
//   requestCloseActionFilter: () => { },
//   formatMessage: data => data.id,
//   jobFilter: ""
// }


describe('<JobQueue />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <JobQueue  />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
