import React from "react";
import toJson from "enzyme-to-json";
import LatentTop from "../../../app/components/Latent/LatentTop";
import Button from "../../../app/components/Button/Button";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

const props = {
  formatMessage: data => data.id,
  // history: goBack = () => { }
}

describe('<Latent />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <LatentTop {...props} />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  test('it should call history.goBack', () => {
    const wrapper = mount(<Button />);
    const goBack = jest.fn();
    wrapper.setProps({ history: { goBack } });
  });

  describe('Testing <Button /> component', () => {
    it('Check if the component Renders', () => {
      let comp = shallow(<Button />);
      expect(comp.length).toBe(1);
    });
  })
});
