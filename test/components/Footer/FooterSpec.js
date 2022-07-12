import React from "react";
import toJson from "enzyme-to-json";
import Footer from "../../../app/components/Footer/Footer";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });


describe('<Footer />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <Footer />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
