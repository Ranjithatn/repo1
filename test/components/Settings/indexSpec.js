import React from "react";
import toJson from "enzyme-to-json";
import { Settings } from "../../../app/components/Settings";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

const props = {
  formatMessage: data => data.id
}

describe('<Settings />', () => {

	it("should render without crashing", () => {
		const component = mount(
			<Settings {...props}/>
		);
		const tree = toJson(component);
		expect(tree).toMatchSnapshot();
	});

});
