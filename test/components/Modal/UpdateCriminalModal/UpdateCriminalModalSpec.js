import React from "react";
import toJson from "enzyme-to-json";
import { UpdateCriminalModal } from "../../../../app/components/Modal/UpdateCriminalModal/UpdateCriminalModal";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";
import { databaseSelector } from "../../../../app/selectors/tenprint";


configure({ adapter: new Adapter() });

describe('<UpdateCriminalModal />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <UpdateCriminalModal  />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
