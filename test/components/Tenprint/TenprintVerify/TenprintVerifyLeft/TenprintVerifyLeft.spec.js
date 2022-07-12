import React from "react";
import toJson from "enzyme-to-json";
import { TenprintVerifyLeft } from "../../../../../app/components/Tenprint/TenprintVerify/TenprintVerifyLeft/TenprintVerifyLeft";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

const props = {
  tenprint: {
    tenprint:{
      probe: {
        biometrics: ""
      }
    }
  },
  formatMessage: data => data.id
}

describe('TenprintVerifyLeft', () => {

  it("should render without crashing", () => {
    const component = mount(
      <TenprintVerifyLeft {...props}/>
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

});
