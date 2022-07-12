import React from "react";
import toJson from "enzyme-to-json";
import BiographicData from "../../../../app/components/Modal/CriminalComponents/BiographicData";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

describe('<BiographicData />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <BiographicData />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
