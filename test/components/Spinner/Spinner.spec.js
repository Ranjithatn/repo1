import React from "react";
import toJson from "enzyme-to-json";
import Spinner from "../../../app/components/Spinner/Spinner";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

describe('<Spinner />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <Spinner  />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

});
