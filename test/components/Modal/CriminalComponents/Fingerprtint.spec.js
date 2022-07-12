import React from "react";
import toJson from "enzyme-to-json";
import Fingerprtint from "../../../../app/components/Modal/CriminalComponents/Fingerprtint";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

const props = {
  formatMessage: data => data.id,
  LeftFingers: { fingers: [] },
  RightFingers: { fingers: [] }
}

describe('<Fingerprtint />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <Fingerprtint {...props} />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
