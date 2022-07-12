import React from "react";
import toJson from "enzyme-to-json";
import Hands from "../../../app/components/Annotations/Hands";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";


configure({ adapter: new Adapter() });
let component, tree, instance;
let region,region1,region2,region3,region4,region5,region6,region7,region8,region9,region10,region11,region12,region13,region14,region15;
const props={
  // selectedRegion,
  // setAnnotationRegion:()=>{},
  annotations:[],
  setAnnotationRegion:jest.fn(),
  palm:false
}

beforeEach(() => {
  component = mount(
    <Hands {...props} />
  );
  region = component.find("Region#left-little");
  region1 = component.find("Region#left-ring");
  region2 = component.find("Region#left-middle");
  region3 = component.find("Region#left-index");
  region4 = component.find("Region#left-thumb");

  region5 = component.find("Region#right-little");
  region6 = component.find("Region#right-ring");
  region7 = component.find("Region#right-middle");
  region8 = component.find("Region#right-index");
  region9 = component.find("Region#right-thumb");
  region10 = component.find("Region#right-writer-palm");
  region11 = component.find("Region#right-upper-palm");
  region12 = component.find("Region#right-lower-palm");
  region13 = component.find("Region#left-writer-palm");
  region14 = component.find("Region#left-upper-palm");
  region15 = component.find("Region#left-lower-palm");

  // latentToggle = component.find("input#newjob-latent");
  // samisIdToggle = component.find("input#newjob-samisid");
  // // fileNumberToggle = component.find("input#newjob-filenumber");
  // saveJobBtn = component.find("button#save-job");
  // startJobBtn = component.find("button#start-job");
  tree = toJson(component);
  instance = component.instance();
});
describe('<Hands />', () => {

  it("should render without crashing", () => {
    const component = mount(
      <Hands {...props}/>
    );
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });


  it('should call setAnnotationRegion when save job btn is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    region.simulate('click', evt);
    expect(props.setAnnotationRegion).toHaveBeenCalled();
  })

  it('should call setAnnotationRegion when save job btn is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    region1.simulate('click', evt);
    expect(props.setAnnotationRegion).toHaveBeenCalled();
  })

  it('should call setAnnotationRegion when save job btn is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    region2.simulate('click',  evt.target.id,2);
    expect(props.setAnnotationRegion).toHaveBeenCalled();
  })




  it('should call setAnnotationRegion when save job btn is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    region3.simulate('click', evt);
    expect(props.setAnnotationRegion).toHaveBeenCalled();
  })


  it('should call setAnnotationRegion when save job btn is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    region4.simulate('click', evt);
    expect(props.setAnnotationRegion).toHaveBeenCalled();
  })


  it('should call setAnnotationRegion when save job btn is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    region5.simulate('click', evt);
    expect(props.setAnnotationRegion).toHaveBeenCalled();
  })
 

  it('should call setAnnotationRegion when save job btn is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    region6.simulate('click', evt);
    expect(props.setAnnotationRegion).toHaveBeenCalled();
  })


  it('should call setAnnotationRegion when save job btn is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    region7.simulate('click', evt);
    expect(props.setAnnotationRegion).toHaveBeenCalled();
  })


  it('should call setAnnotationRegion when save job region is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    region8.simulate('click', evt);

    expect(props.setAnnotationRegion).toHaveBeenCalled();
  })


  it('should call setAnnotationRegion when save job btn is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    region9.simulate('click', evt);
    expect(props.setAnnotationRegion).toHaveBeenCalled();
  })

  it('should call setAnnotationRegion when save job btn is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    region10.simulate('click', evt);
    expect(props.setAnnotationRegion).toHaveBeenCalled();
  })

  it('should call setAnnotationRegion when save job btn is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    region11.simulate('click', evt);
    expect(props.setAnnotationRegion).toHaveBeenCalled();
  })

  it('should call setAnnotationRegion when save job btn is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    region12.simulate('click', evt);
    expect(props.setAnnotationRegion).toHaveBeenCalled();
  })

  it('should call setAnnotationRegion when save job btn is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    region13.simulate('click', evt);
    expect(props.setAnnotationRegion).toHaveBeenCalled();
  })
  it('should call setAnnotationRegion when save job btn is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    region14.simulate('click', evt);
    expect(props.setAnnotationRegion).toHaveBeenCalled();
  })
  it('should call setAnnotationRegion when save job btn is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    region15.simulate('click', evt);
    expect(props.setAnnotationRegion).toHaveBeenCalled();
  })

  it('should call setAnnotationRegion when save job btn is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    props.palm="true"
    region12.simulate('click', evt);
    // expect(props.setAnnotationRegion).haven();
  })
  it('should call setAnnotationRegion when save job btn is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    props.palm="true"
    region11.simulate('click', evt);
    // expect(props.setAnnotationRegion).haven();
  })
  it('should call setAnnotationRegion when save job btn is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    props.palm="true"
    region10.simulate('click', evt);
    // expect(props.setAnnotationRegion).haven();
  })
  xit('should call setAnnotationRegion when save job btn is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    props.palm=true
    region9.simulate('click', evt);
    // expect(props.setAnnotationRegion).haven();
  })
  xit('should call setAnnotationRegion when save job btn is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    props.palm=true
    region8.simulate('click', evt);
    // expect(props.setAnnotationRegion).haven();
  })
  xit('should call setAnnotationRegion when save job btn is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    props.palm=true
    region7.simulate('click', evt);
    // expect(props.setAnnotationRegion).haven();
  })
  xit('should call setAnnotationRegion when save job btn is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    props.palm=true
    region3.simulate('click', evt);
    // expect(props.setAnnotationRegion).haven();
  })
  xit('should call setAnnotationRegion when save job btn is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    props.palm=true
    region4.simulate('click', evt);
    // expect(props.setAnnotationRegion).haven();
  })
  xit('should call setAnnotationRegion when save job btn is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    props.palm=true
    region5.simulate('click', evt);
    // expect(props.setAnnotationRegion).haven();
  })
  xit('should call setAnnotationRegion when save job btn is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    props.palm=true
    region6.simulate('click', evt);
    // expect(props.setAnnotationRegion).haven();
  })
  xit('should call setAnnotationRegion when save job btn is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    props.palm=true
    region2.simulate('click', evt);
    // expect(props.setAnnotationRegion).haven();
  })
  xit('should call setAnnotationRegion when save job btn is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    props.palm=true
    region1.simulate('click', evt.target.id,1);
    // expect(props.setAnnotationRegion).haven();
  })
  it('should call setAnnotationRegion when save job btn is clicked', () => {
    const evt = {
      target: { id: "clicked" }
    }
    props.palm="true"
    region.simulate('click', evt);
    // expect(props.setAnnotationRegion).haven();
  })
});