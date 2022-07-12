import React from "react";
import toJson from "enzyme-to-json";
import WorkflowWrapper from "../../../app/components/WorkflowWrapper/WorkflowWrapper";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });


describe('<VerifierWorkflowWrapper />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <WorkflowWrapper  />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

});
