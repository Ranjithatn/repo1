import React from "react";
import toJson from "enzyme-to-json";
import { AddRecord } from "../../../../app/components/Modal/CriminalComponents/AddRecord";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

const props = {
  formatMessage: data => data.id,
  newCrimeType: { CaseType: "" }
}

describe('<AddRecord />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <AddRecord {...props}/>
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
