import React from "react";
import toJson from "enzyme-to-json";
import Table from "../../../app/components/Table/Table";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

describe('<Table />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <Table  />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

});
