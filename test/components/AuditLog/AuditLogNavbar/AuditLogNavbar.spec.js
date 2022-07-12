import React from "react";
import toJson from "enzyme-to-json";
import { AuditLogNavbar } from "../../../../app/components/AuditLog/AuditLogNavbar/AuditLogNavbar";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";

configure({ adapter: new Adapter() });
let component, tree, instance;
let region
const props = {
  formatMessage: jest.fn(),
  history:"history"
}

beforeEach(() => {
  component = mount(
    <AuditLogNavbar {...props} />
  );
  region = component.find("Button.is-primary");

  tree = toJson(component);
  instance = component.instance();
});
describe('<AuditLogNavbar />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <AuditLogNavbar {...props} />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  
  xit('should call setAnnotationRegion when save job btn is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    region.simulate('click', evt);
    // expect(props.setAnnotationRegion).toHaveBeenCalled();
  })
});
