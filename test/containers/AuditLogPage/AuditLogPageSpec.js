// window.require = () => { }
// const app = global.window

import React from "react";
import toJson from "enzyme-to-json";
import { AuditLogPage } from "../../../app/containers/AuditLogPage/AuditLogPage";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";

configure({ adapter: new Adapter() });

const props = {
  window: {
    require: (data) => data,
    remote: {
      app: {
        getVersion : () => { }
      }
    }

  }
}

describe('<AuditLogPage />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <AuditLogPage {...props} />
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});