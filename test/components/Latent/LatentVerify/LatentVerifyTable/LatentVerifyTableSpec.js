import React from "react";
import toJson from "enzyme-to-json";
import LatentVerifyTable  from "../../../../../app/components/Latent/LatentVerify/LatentVerifyTable/LatentVerifyTable";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

describe('LatentVerifyTable />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <LatentVerifyTable />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
