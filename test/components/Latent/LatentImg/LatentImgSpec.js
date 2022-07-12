import React from "react";
import toJson from "enzyme-to-json";
import { LatentImg } from "../../../../app/components/Latent/LatentImg/LatentImg";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";
import WorkflowWrapper from "../../../../app/components/WorkflowWrapper/WorkflowWrapper";


configure({ adapter: new Adapter() });

const props = {
  formatMessage: (data) => { return data.id },
  // imgUrl.imgdata.file.path
  imgUrl: {
    imgdata: {
      file: { path: "" }
    }
  },
// history: {
//   goBack: jest.fn()
// }

}

describe('LatentImg />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <LatentImg {...props} />
    );
    console.log("component",component);
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  test('it should call history.goBack', () => {
    const wrapper = mount(<WorkflowWrapper />);
    const goBack = jest.fn();
    wrapper.setProps({ history: { goBack } });
  });
});
