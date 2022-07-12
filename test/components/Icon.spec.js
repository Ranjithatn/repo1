import React from "react";
import toJson from "enzyme-to-json";
import Icon from "../../app/components/Icon/Icon";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";

configure({ adapter: new Adapter() });


describe( '<Icon />', () => {

	it("should render without crashing", () => {
		const component = mount(
			<Icon />
		);
		const tree = toJson(component);
		expect(tree).toMatchSnapshot();
	});


	it("has correct title prop", () => {
		const props = { title: 'User Icon' }
		const component = shallow(
			<Icon {...props} />
		);
		expect( component.props().title ).toBe('User Icon');
	});


	it("renders the component with all the given props", () => {
		const props = {
			icon: 'user',
			title: 'User Icon',
			onClick: () => {
				console.log("CLICKED!!!");
			}
		}
		const component = shallow(
			<Icon {...props} />
		);

		expect( component.find('span').props().title ).toBe(props.title);
		expect( component.find('i').props().className ).toBe('fa fa-user');
	});


	it("onClick class the onClick method", () => {
		const props = {
			icon: 'user',
			title: 'User Icon',
			onClick: () => {
				return true;
			}
		}
		const component = shallow(
			<Icon {...props} />
		);

		const click = component.find('span').props().onClick();

		expect( click ).toBe(true);

	});

});

