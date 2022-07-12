import React from "react";
import toJson from "enzyme-to-json";
import Select from "../../app/components/Select/Select";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";

configure({ adapter: new Adapter() });


describe( '<Select />', () => {

	it("should render without crashing", () => {
		const component = mount(
			<Select />
		);
		const tree = toJson(component);
		expect(tree).toMatchSnapshot();
	});


	it("has correct className prop", () => {
		const props = { className: 'hello-world-select' }
		const component = shallow(
			<Select {...props} />
		);
		expect( component.props().className ).toBe('select  hello-world-select');
	});


	it("renders the component with all the given props", () => {
		const props = {
			className: 'hello-world-select',
			id: '_user_select',
			name: 'select_user',
			value: 'John Doe',
			options: [
				{ value: 'Jane Smith', displayName: 'Jane Smith', },
				{ value: 'John Doe', displayName: 'John Doe', },
				{ value: 'Gintama', displayName: 'Gintama', },
			],
			formatMessage: (data) => data,
		}
		const component = shallow(
			<Select {...props} />
		);

		expect( component.find('select').length ).toBe(1);
		expect( component.find('select').props().value ).toBe(props.value);
		expect( component.find('option').length ).toBe(4); // 4 because 1 empty option is added by default
	});

});

