import React from "react";
import toJson from "enzyme-to-json";
import { CustomSearchVerifyContent } from "../../../../../app/components/CustomSearch/CustomSearchVerify/CustomSearchVerifyContent/CustomSearchVerifyContent";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

const props = {
  formatMessage: (data) => { return data.id; },
  customSearchPersonData: {
  mugshot: "",
  person:"",
}


}
describe('<CustomSearchVerifyContent />', () => {

  xit("should render without crashing", () => {
    const component = mount(
      <CustomSearchVerifyContent {...props} />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
