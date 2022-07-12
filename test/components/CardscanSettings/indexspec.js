import React from "react";
import toJson from "enzyme-to-json";
import { CardscanSettings } from "../../../app/components/CardscanSettings/index";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";

configure({ adapter: new Adapter() });
let component, tree, instance;
let region

const props = {
  formatMessage: (data) => { return data.id; },
  requestInputFieldChanged: jest.fn(),
  cardType: "",
  requestStartCardScan: jest.fn(),
  requestFetchScanSources: jest.fn(),
  type:"latent",
}

beforeEach(() => {
  component = mount(
    <CardscanSettings {...props} />
  );
  region = component.find("Select#cardType");

  tree = toJson(component);
  instance = component.instance();
});

describe('<CardscanSettings />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <CardscanSettings {...props} />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  it('should call setAnnotationRegion when save job btn is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    region.simulate('change', evt);
    // expect(props.requestInputFieldChanged).toHaveBeenCalled();
  })
});
