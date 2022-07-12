import React from "react";
import toJson from "enzyme-to-json";
import { ConfirmationModal } from "../../../../app/components/Modal/ConfirmationModal/ConfirmationModal";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

const props = {
  formatMessage: data => data.id
}

describe('<ConfirmationModal />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <ConfirmationModal {...props}/>
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
