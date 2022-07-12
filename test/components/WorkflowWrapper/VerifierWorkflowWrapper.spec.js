import React from "react";
import toJson from "enzyme-to-json";
import VerifierWorkflowWrapper from "../../../app/components/WorkflowWrapper/VerifierWorkflowWrapper";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });


describe('<VerifierWorkflowWrapper />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <VerifierWorkflowWrapper  />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

});
