import React from "react";
import toJson from "enzyme-to-json";
import { Latent } from "../../../app/components/Latent/Latent";
import Button from "../../../app/components/Button/Button";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";

configure({ adapter: new Adapter() });
let component, tree, instance;
let region;
const props = {
  formatMessage: data => data.id,
  // requestReceivedImage: data => {
  //   return (data.file = number), (data.base64 = "");
  // },
  requestShowScannedImage: data => data,
  // requestImportImage: boolean => boolean,
  requestImportImage:jest.fn()
};

beforeEach(() => {
  component = mount(<Latent {...props} />);
  region = component.find("FileBrowser#importbtn");

  tree = toJson(component);
  instance = component.instance();
});
describe("Latent />", () => {
  it("should render without crashing", () => {
    const component = mount(<Latent {...props} />);

    console.log("component");

    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  describe("Testing <Button /> component", () => {
    it("Check if the component Renders", () => {
      let comp = shallow(<Button />);
      expect(comp.length).toBe(1);
    });
  });
  xit("should call setAnnotationRegion when save job btn is clicked", () => {
    const evt = {
      target: { files: ["clicked"] }
    };
    region.simulate("change", false);
    expect(props.requestImportImage).toHaveBeenCalled();
  });
});
