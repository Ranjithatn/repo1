import React from "react";
import toJson from "enzyme-to-json";
import { InnovatricsEditor } from "../../../../app/components/Latent/LatentInnovatricsEditor/InnovatricsEditor";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

describe('InnovatricsEditor />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <InnovatricsEditor />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
