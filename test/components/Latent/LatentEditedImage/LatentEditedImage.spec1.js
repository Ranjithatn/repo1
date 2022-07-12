import React from "react";
import toJson from "enzyme-to-json";
import { LatentEditedImage } from "../../../../app/components/Latent/LatentEditedImage/LatentEditedImage";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

const props = {
  formatMessage: data => data.id
}
describe('<LatentEditedImage />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <LatentEditedImage {...props} />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
