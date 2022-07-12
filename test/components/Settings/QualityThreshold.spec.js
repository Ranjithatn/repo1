import React from "react";
import toJson from "enzyme-to-json";
import QualityThreshold from "../../../app/components/Settings/QualityThreshold";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

const props = {
	formatMessage: data => data.id
  }

describe('<QualityThreshold />', () => {

	it("should render without crashing", () => {
		const component = mount(
			<QualityThreshold {...props}/>
		);
		const tree = toJson(component);
		expect(tree).toMatchSnapshot();
	});

});
