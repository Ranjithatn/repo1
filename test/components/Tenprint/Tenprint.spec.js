import React from "react";
import toJson from "enzyme-to-json";
import { Tenprint } from "../../../app/components/Tenprint/Tenprint";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

const props = {
  formatMessage: data => data.id
}

describe('TenprintVerifyLeft', () => {

  xit("should render without crashing", () => {
    const component = mount(
      <Tenprint {...props} />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

});
