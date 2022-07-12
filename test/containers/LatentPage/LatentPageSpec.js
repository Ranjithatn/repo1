import React from "react";
import toJson from "enzyme-to-json";
import { LatentPage } from "../../../app/containers/LatentPage/LatentPage";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";

configure({ adapter: new Adapter() });


describe('<LatentPage />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <LatentPage />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});