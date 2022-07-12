import React from "react";
import toJson from "enzyme-to-json";
import { CriminalPrintModal } from "../../../../app/components/Modal/CriminalPrintModal/CriminalPrintModal";
import Button from "../../../../app/components/Button/Button";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });
let component, tree, instance;
let printButton;
let props = {
  requestHideModal: jest.fn(),
  requestShowModal: jest.fn(),
  formatMessage: jest.fn(),
  ActionHeader: "Custom Search",
  PersonData: {
    info: {
      person: {
        extendedData: [
          {
            key: "ID Type",
            value: ""
          },
          {
            key: "Case Type",
            value: ""
          },
          {
            key: "Police File Number",
            value: ""
          },
          {
            key: "ID Issue Date",
            value: ""
          }
        ]
      },
      mugshot: {
        thumbNail: "base64"
      }
    }
  }
};
beforeEach(() => {
  component = mount(<CriminalPrintModal {...props} />);
  tree = toJson(component);
  instance = component.instance();
  printButton = component.find("button#closebtn");
});

describe("<CriminalPrintModal />", () => {
  it("should render without crashing", () => {
    expect(tree).toMatchSnapshot();
  });

  xit("should call requestInputFieldChanged when tenprint is toggled", () => {
    const event = {
      target: { id: "clicked" }
    };
    printButton.simulate("click", event);
    expect(props.requestShowModal).toHaveBeenCalled();
  });
});
