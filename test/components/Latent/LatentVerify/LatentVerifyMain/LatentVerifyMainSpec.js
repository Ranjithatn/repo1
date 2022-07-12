import React from "react";
import toJson from "enzyme-to-json";
import { LatentVerifyMain } from "../../../../../app/components/Latent/LatentVerify/LatentVerifyMain/LatentVerifyMain";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });


describe('LatentVerifyMain />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <LatentVerifyMain />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
