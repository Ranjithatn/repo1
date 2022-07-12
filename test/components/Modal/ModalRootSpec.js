import React from "react";
import toJson from "enzyme-to-json";
import { ModalRoot } from "../../../app/components/Modal/ModalRoot";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

describe('<ModalRoot />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <ModalRoot />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
