import React from "react";
import toJson from "enzyme-to-json";
import { NoteShowModal } from "../../../../app/components/Modal/NoteShowModal/NoteShowModal";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";
import { databaseSelector } from "../../../../app/selectors/tenprint";


configure({ adapter: new Adapter() });

const props = {
  formatMessage: data => data.id,
}

describe('<NoteShowModal />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <NoteShowModal {...props}/>
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
