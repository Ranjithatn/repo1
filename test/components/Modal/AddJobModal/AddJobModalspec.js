import React from "react";
import toJson from "enzyme-to-json";
import { AddJobModal } from "../../../../app/components/Modal/AddJobModal/AddJobModal";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

const props = {
  formatMessage: data => data.id
}

describe('AddJobModal', () => {

  it("should render without crashing", () => {
    const component = mount(
      <AddJobModal {...props}/>
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

});

