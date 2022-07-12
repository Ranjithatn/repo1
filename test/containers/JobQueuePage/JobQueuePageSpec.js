  import React from "react";
  import toJson from "enzyme-to-json";
  import JobQueuePage from "../../../app/containers/JobQueuePage/JobQueuePage";
  import Adapter from "enzyme-adapter-react-16";
  import { configure, shallow, mount } from "enzyme";

  configure({ adapter: new Adapter() });


  describe('<JobQueuePage />', () => {

    it("should render without crashing", () => {
      const component = mount(
        <JobQueuePage />
      );
      const tree = toJson(component);
      expect(tree).toMatchSnapshot();
    });
  });