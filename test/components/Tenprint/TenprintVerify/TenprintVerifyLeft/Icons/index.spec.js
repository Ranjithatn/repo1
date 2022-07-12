import React from "react";
import toJson from "enzyme-to-json";
import {
	Mugshot,
	RightPalm,
	LeftPalm,
	RightHand,
	LeftHand
} from "../../../../../../app/components/Tenprint/TenprintVerify/TenprintVerifyLeft/Icons";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

describe('Tenprint verify left icons', () => {

	it("should render without crashing", () => {
		const component = mount(
			<LeftHand />
		);
		const tree = toJson(component);
		expect(tree).toMatchSnapshot();
	});
	it("should render without crashing", () => {
		const component = mount(
			<RightHand />
		);
		const tree = toJson(component);
		expect(tree).toMatchSnapshot();
	});
	it("should render without crashing", () => {
		const component = mount(
			<LeftPalm />
		);
		const tree = toJson(component);
		expect(tree).toMatchSnapshot();
	});
	it("should render without crashing", () => {
		const component = mount(
			<RightPalm />
		);
		const tree = toJson(component);
		expect(tree).toMatchSnapshot();
	});
	it("should render without crashing", () => {
		const component = mount(
			<Mugshot />
		);
		const tree = toJson(component);
		expect(tree).toMatchSnapshot();
	});
});
