// const localStorageMock = {
//   setItem: jest.fn(),
//   getItem: jest.fn(),
//   removeItem: jest.fn()
// };
// var localStorage = localStorageMock;

import React from "react";
import toJson from "enzyme-to-json";
import SidebarLiveScan from "../../../../../app/components/Tenprint/LiveScan/helper/SidebarLiveScan";
import Svg from '../../../../../app/components/Svg';

import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";

configure({ adapter: new Adapter() });

const props = {
  formatMessage: data => data.id,

}

describe('<SidebarLiveScan />', () => {

  console.log("component");
  it("should render without crashing", () => {
    const component = mount(
      <SidebarLiveScan />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  describe('Testing <Svg /> component', () => {
    it('Check if the component Renders', () => {
      let comp = shallow(<Svg />);
      expect(comp.length).toBe(1);
    });
  });
});
