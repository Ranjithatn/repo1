import React from "react";
import toJson from "enzyme-to-json";
import { LatentVerifyLeft } from "../../../../../app/components/Latent/LatentVerify/LatentVerifyLeft/LatentVerifyLeft";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

const props = {
  formatMessage: data => data.id,
  LeftFingers: {
    // fingers: (data) => { return (data.name, data.i) },
    fingers: { },
  }
}

describe('LatentVerifyLeft />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <LatentVerifyLeft {...props} />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
