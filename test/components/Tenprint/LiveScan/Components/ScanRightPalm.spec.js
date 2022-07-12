import React from "react";
import toJson from "enzyme-to-json";
import ScanRightPalm from "../../../../../app/components/Tenprint/LiveScan/Components/ScanRightPalm";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

describe('<ScanLeftPalm />', () => {

    it("should render without crashing", () => {
        const component = mount(
            <ScanRightPalm  />
        );
        const tree = toJson(component);
        expect(tree).toMatchSnapshot();
    });
});
