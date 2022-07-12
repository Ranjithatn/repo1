import React from "react";
import toJson from "enzyme-to-json";
import Webcam from "../../../app/components/Webcam";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

const props = {
  navigator: {
    getUserMedia: data => {
      data.vedio = boolean,
        data.stream = (data) => { data}
    }
  }
}



describe('<Webcam />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <Webcam {...props} />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

});
