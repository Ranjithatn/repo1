import React from "react";
import toJson from "enzyme-to-json";
import LatentTest from "../../../../app/components/Latent/latenttest";
import Adapter from "enzyme-adapter-react-16";
import renderer from 'react-test-renderer';
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });


describe('<LatentTest />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <LatentTest />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});

// describe('<LatentTest>Counter component', () => {
//   it('should render snapshot', () => {
//       const component = renderer.create(
//           <LatentTest />
//           //<Home shell={shell} />
//       )
//       const tree = component.toJSON()
//       expect(tree).toMatchSnapshot()
//   })
// });