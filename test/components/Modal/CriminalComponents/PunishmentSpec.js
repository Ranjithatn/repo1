import React from "react";
import toJson from "enzyme-to-json";
import Punishment from "../../../../app/components/Modal/CriminalComponents/Punishment";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

describe('<Punishment />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <Punishment />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
