import React from "react";
import toJson from "enzyme-to-json";
import { LatentScanSettings } from "../../../../app/components/Latent/LatentScanSettings";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

const props = {
  formatMessage: data => data.id
}

describe('LatentScanSettings />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <LatentScanSettings {...props} />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
