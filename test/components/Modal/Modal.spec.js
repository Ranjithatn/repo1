import React from "react";
import toJson from "enzyme-to-json";
import { Modal } from "../../../app/components/Modal/Modal";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";

configure({ adapter: new Adapter() });


describe( '<Modal />', () => {

	const defaultProps = {
		title: "",
		content: "",
		buttons: "",
		requestHideModal: "",
		className: "",
	}


	xit("should render without crashing", () => {
		const component = mount(
			<Modal {...defaultProps} />
		);

		// console.log("COMP LEN", component );
		// const tree = toJson(component);
		// expect(tree).toMatchSnapshot();
	});





});

