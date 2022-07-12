import React from "react";
import toJson from "enzyme-to-json";
import { CustomSearchPage } from "../../../app/containers/CustomSearchPage/CustomSearchPage";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";

configure({ adapter: new Adapter() });


describe('<CustomSearchPage />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <CustomSearchPage />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});