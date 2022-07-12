import React from "react";
import toJson from "enzyme-to-json";
import { TenprintVerifyTable } from "../../../../../app/components/Tenprint/TenprintVerify/TenprintVerifyTable/TenprintVerifyTable";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

describe('TenprintVerifyTable', () => {

  it("should render without crashing", () => {
    const component = mount(
      <TenprintVerifyTable />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

});
