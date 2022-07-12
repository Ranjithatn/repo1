import React from "react";
import toJson from "enzyme-to-json";
import { CustomSearchVerifyTable } from "../../../../../app/components/CustomSearch/CustomSearchVerify/CustomSearchVerifyTable/CustomSearchVerifyTable";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

const props = {
  formatMessage: (data) => { return data },
  
}

describe('<CustomSearchVerifyTable />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <CustomSearchVerifyTable {...props}/>
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
