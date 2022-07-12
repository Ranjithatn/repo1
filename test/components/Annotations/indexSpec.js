import React from "react";
import toJson from "enzyme-to-json";
import Annotations from "../../../app/components/Annotations/index";
import 'jest-localstorage-mock';
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

const props = {
  setSession: (session) => session
}


describe('<Annotations />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <Annotations {...props}/>
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

});