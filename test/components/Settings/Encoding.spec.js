import React from "react";
import toJson from "enzyme-to-json";
import Encoding from "../../../app/components/Settings/Encoding";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

const props = {
  formatMessage: data => data.id

}

describe('<Encoding />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <Encoding {...props}/>
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

});
