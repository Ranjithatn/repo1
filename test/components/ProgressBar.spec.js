import React from "react";
import toJson from "enzyme-to-json";
import ProgressBar from "../../app/components/ProgressBar/ProgressBar";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, render, mount } from "enzyme";

configure({ adapter: new Adapter() });


describe( '<ProgressBar />', () => {

	it("should render without crashing", () => {
		const component = mount(
			<ProgressBar />
		);
		const tree = toJson(component);
		expect(tree).toMatchSnapshot();
	});

	it( 'It should render with 0 value', () => {
		const wrapper = shallow( <ProgressBar /> );
		expect(wrapper.length).toBe(1);
	});


	it( 'component has class name `progess is-primary`', () => {
		const props = {
			max: 100,
			value: 40,
			type: 'is-primary',
		}
		const wrapper = mount( <ProgressBar {...props} /> );
		expect( wrapper.prop('value') ).toEqual(40);
	});


});

