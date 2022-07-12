import React from "react";
import toJson from "enzyme-to-json";
import { AppNavbar } from "../../../../app/components/Navbar/AppNavbar/AppNavbar";
import Dropdown from "../../../../app/components/Dropdown/Dropdown";

import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

const props = {
  intl: { formatMessage: jest.fn() },
  userrole: "",
}

describe('<AppNavbar />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <AppNavbar {...props} />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  test('it should call history.push', () => {
    const wrapper = mount(<showSettingsPage />);
    const push = jest.fn();
    wrapper.setProps({ history: { push } });
  });

  describe('Testing <Dropdown /> component', () => {
    it('Check if the component Renders', () => {
      let comp = shallow(<Dropdown />);
      expect(comp.length).toBe(1);
    });
  })

});
