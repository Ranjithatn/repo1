import React from "react";
import toJson from "enzyme-to-json";
import { CustomSearchModal } from "../../../../app/components/Modal/CustomSearchModal/CustomSearchModal";
import Button from "../../../../app/components/Button/Button";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });

let component, tree, instance;
let tenprintToggle,searchCivilDBToggle,newActionButton;

let props = {
  requestHideModal: jest.fn(),
  requestInputFieldChanged: jest.fn(),
  formatMessage: jest.fn(),
  requestNewAction: jest.fn(),
  newAction:"Search Criminal",
  customSearchData:{
      SAMISID:"298"
    }
}

beforeEach(() => {
  component = mount(
    <CustomSearchModal {...props} />
  );
  tenprintToggle = component.find("input#searchCriminalDB");
  searchCivilDBToggle = component.find("input#searchCivilDB");
  newActionButton = component.find("button#newAction-btn");
  tree = toJson(component);
  instance = component.instance();

});

describe("<CustomSearchModal />", () => {
    xit("should render without crashing", () => {
      expect(tree).toMatchSnapshot();
    });
    xit("should call requestInputFieldChanged when tenprint is toggled", () => {
        let event: {
          id: "searchCriminalDB"
        };
        tenprintToggle.simulate("change", event);
        expect(props.requestInputFieldChanged).toHaveBeenCalled();
      });
    xit("should call requestInputFieldChanged when tenprint is toggled", () => {
        let event: {
          id: "searchCivilDB"
        };
        searchCivilDBToggle.simulate("change", event);
        expect(props.requestInputFieldChanged).toHaveBeenCalled();
      });

      xit('should call requestCreateJob when save job btn is clicked', () => {
        const evt = {
          target: { id: "clicked" }
        }
        newActionButton.simulate('click', evt);
        expect(props.requestNewAction).toHaveBeenCalled();
      })
})