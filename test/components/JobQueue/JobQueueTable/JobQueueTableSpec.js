import React from "react";
import toJson from "enzyme-to-json";
import { JobQueueTable } from "../../../../app/components/JobQueue/JobQueueTable/JobQueueTable";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });


describe('<JobQueueTable />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <JobQueueTable  />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
