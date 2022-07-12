import React from 'react';
import Textarea from "../../app/components/Textarea/Textarea";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });



describe('Testing <Textarea /> component', () => {


    it('Check if the component Renders', () => {
        let comp = shallow( <Textarea /> );
        expect(comp.length).toBe(1);
    });


    
})




