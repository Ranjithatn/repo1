import React from "react";
import toJson from "enzyme-to-json";
import ScanArea from "../../../../../app/components/Tenprint/LiveScan/Components/ScanArea";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });

const props = {
    impressionName: { length: Number    },
    supportedDecisions: { length: Number },
    formatMessage: data => data.id
}

describe('<ScanArea />', () => {

    it("should render without crashing", () => {
        const component = mount(
            <ScanArea {...props} />
        );
        const tree = toJson(component);
        expect(tree).toMatchSnapshot();
    });

});
