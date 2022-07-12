import React from "react";
import toJson from "enzyme-to-json";
import ScanLeftPalm from "../../../../../app/components/Tenprint/LiveScan/Components/ScanLeftPalm";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

describe('<ScanLeftPalm />', () => {

    it("should render without crashing", () => {
        const component = mount(
            <ScanLeftPalm  />
        );
        const tree = toJson(component);
        expect(tree).toMatchSnapshot();
    });

});
