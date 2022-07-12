import React from 'react';
import Image from "../../app/components/Image/Image";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });



describe('Testing <Image /> component', () => {


    it('Check if the component Renders', () => {
        let comp = shallow( <Image /> );
        expect(comp.length).toBe(1);
    });


    
})




