import React from "react";
import toJson from "enzyme-to-json";
import { AddedRecord } from "../../../../app/components/Modal/CriminalComponents/AddedRecord";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

const props = {
  formatMessage: data => data.id,
  presentObj: {
    CaseType: ""
  }
}

describe('<AddedRecord />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <AddedRecord {...props} />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
