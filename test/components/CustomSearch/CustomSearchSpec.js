import React from "react";
import toJson from "enzyme-to-json";
import { CustomSearch } from "../../../app/components/CustomSearch/CustomSearch";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

const props = {
  formatMessage: (data) => { return data.id },
  requestInputFieldChanged: jest.fn,
  requestShowModal: (data) => { return data.modalType },
  requestUpdateSearchText: () => {
    return (data) => { return data.modalType }
  },
  fileNo : Number,
  SAMISID: Number
}

describe('<CustomSearch />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <CustomSearch {...props} />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
