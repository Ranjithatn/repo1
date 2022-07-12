import React from "react";
import toJson from "enzyme-to-json";
import Pagination from "../../../app/components/Pagination/Pagination";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

const props = {
  pages: (data) => {
    return (
      data.pages = Number,
      data.i = Number
    )
  }
}
describe('<Pagination />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <Pagination {...props} />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

});
