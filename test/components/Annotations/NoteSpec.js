import React from "react";
import toJson from "enzyme-to-json";
import Note from "../../../app/components/Annotations/Note";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

// const props={
//   setAnnotationRegion:()=>{},
//   annotations:[]
// }

describe('<Note />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <Note />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});