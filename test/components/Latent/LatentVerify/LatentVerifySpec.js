import React from "react";
import Button from "../../../../app/components/Button/Button";
import toJson from "enzyme-to-json";
import LatentVerify from "../../../../app/components/Latent/LatentVerify/LatentVerify";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";

const props = {
  formatMessage: (data) => { data.id },
}


configure({ adapter: new Adapter() });

describe('LatentVerifyTable />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <LatentVerify />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  test('it should call history.push', () => {
    const wrapper = mount(<WorkflowWrapper />);
    const push = jest.fn();
    wrapper.setProps({ history: { push } });
  });

  describe('Testing <Button /> component', () => {
    it('Check if the component Renders', () => {
      let comp = shallow(<Button />);
      expect(comp.length).toBe(1);
    });
  })

});
