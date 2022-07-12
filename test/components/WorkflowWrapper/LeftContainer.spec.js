import React from 'react';
import LeftContainer from "../../../app/components/WorkflowWrapper/LeftContainer";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });



describe('Testing <LeftContainer /> component', () => {


    it('Check if the component Renders', () => {
        let comp = shallow( <LeftContainer /> );
        expect(comp.length).toBe(1);
        expect(comp).toMatchSnapshot();
    });


    it('Check if it shows the Heading?', () => {
        let comp = shallow( <LeftContainer heading="Hello World" /> );
        expect(comp.contains(<div className="header">Hello World</div>)).toBe(true);

        expect(shallow( <LeftContainer /> ).contains(<div className="header">Hello World</div>)).toBe(false);
    })

    
})




