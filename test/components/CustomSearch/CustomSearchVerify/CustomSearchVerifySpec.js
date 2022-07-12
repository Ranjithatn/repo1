import React from "react";
import toJson from "enzyme-to-json";
import { CustomSerchVeify } from "../../../../app/components/CustomSearch/CustomSearchVerify/CustomSearchVerify";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

const props = {
  formatMessage: (data) => { return data },
  customSearchPersonData: {
    person: {
      samisid: Number,
      fileNumber: Number
    }
  },
  history: "",
  requestModalData: () => { },
  ActionStatus: "",
  database:[]
}

describe('<CustomSerchVeify />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <CustomSerchVeify {...props}/>
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
