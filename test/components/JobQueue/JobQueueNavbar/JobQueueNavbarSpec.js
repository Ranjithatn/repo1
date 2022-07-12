import React from "react";
import toJson from "enzyme-to-json";
import JobQueueNavbar from "../../../../app/components/JobQueue/JobQueueNavbar/JobQueueNavbar";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

const props = {
  requestShowModal: (data) => data.modalType,
  requestActiveJobs: () => { },
  // requestShowNotification: any;
  requestInputFieldChanged: (data) => { return data },
  requestShowJobFilteredData: (data) => { return data.key, data.value },
  requestCloseFilter: () => { },
  requestCloseActionFilter: () => { },
  formatMessage: data => data.id,
  jobFilter: ""
}


describe('<JobQueueNavbar />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <JobQueueNavbar {...props}/>
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
