import React from "react";
import toJson from "enzyme-to-json";
import LoginPage from "../../../app/containers/LoginPage/LoginPage";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });


describe('<LoginPage />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <LoginPage />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});