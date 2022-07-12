import React from "react";
import toJson from "enzyme-to-json";
import { CustomSearch } from "../../../../app/components/CustomSearch/ShowCustomSearchId/ShowCustomSearchId";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

const props = {
  formatMessage: (data) => { return data.id },
  history: "",
  IdList: Number
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
