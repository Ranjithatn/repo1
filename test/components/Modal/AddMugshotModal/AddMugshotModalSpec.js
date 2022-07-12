import React from "react";
import toJson from "enzyme-to-json";
import { AddMugshotModal } from "../../../../app/components/Modal/AddMugshotModal/AddMugshotModal";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

describe('<AddMugshotModal />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <AddMugshotModal />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

});
