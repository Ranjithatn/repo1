import React from "react";
import toJson from "enzyme-to-json";
import { NewActionModal } from "../../../../app/components/Modal/NewActionModal/NewActionModal";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";
import { databaseSelector } from "../../../../app/selectors/tenprint";


configure({ adapter: new Adapter() });

const props = {
  formatMessage: data => data.id,
  newAction: { indexOf: Number }
}

describe('<NewActionModal />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <NewActionModal {...props} />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
