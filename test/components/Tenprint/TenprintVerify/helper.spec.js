import React from "react";
import toJson from "enzyme-to-json";
import { findAllFingers } from "../../../../app/components/Tenprint/TenprintVerify/Helper"
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });

let component, tree, instance;


let props = {
    biometrics:{}, hand:{}, type:{}
};

// beforeEach(() => {
//   component = mount(<NewActionModal {...props} />);
//   criminalDatabaseToggle = component.find("input#searchCriminalDB");
//   civilDatabaseToggle = component.find("input#searchCivilDB");
//   latentDatabaseToggle = component.find("input#searchLatentDB");
//   // registerCriminalToggle = component.find("input#registerCriminal");
//   // editCriminalToggle = component.find("input#editCriminalData");
//   // updateCriminalToggle = component.find("input#updateCriminalFp");
//   // deleteCriminalToggle = component.find("input#deleteCriminalFp");
//   // visualVerifyToggle = component.find("input#visualVerify");
//   tree = toJson(component);
//   instance = component.instance();
// });

describe("<findAllFingers />", () => {
  it("should render without crashing", () => {
    expect(tree).toMatchSnapshot();
  });
 
});
