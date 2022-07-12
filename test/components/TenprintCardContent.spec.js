import React from "react";
import toJson from "enzyme-to-json";
import TenprintCardScannedContent from "../../app/components/Tenprint/TenprintCard/TenprintCardScanned/TenprintCardScannedContent";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { spy } from "sinon";
configure({ adapter: new Adapter() });

let component, tree, instance, mounted;
let addEventListenerSpy;

const props = {
  saveBoxes: jest.fn(),
  scannedImage: "b64 image",
  resolution: 500,
  cardConfig: {
    Units: "Inches",
    ScanArea: {
      Width: 10, Height: 10
    }
  },
  cardScanWorkflow: jest.fn(),
}

beforeEach(() => {
  addEventListenerSpy = spy(window, "addEventListener");
  component = shallow(<TenprintCardScannedContent {...props} />);
  mounted = mount(<TenprintCardScannedContent {...props} />);
  tree = toJson(component);
  instance = component.instance();
});

afterEach(() => {
  window.addEventListener.restore();
});

describe("<TeprintCardContent />", () => {
  it("should render without crashing", () => {
    expect(tree).toMatchSnapshot();
  });

  it("should have an onMouseDown callback for when the resize, move, or rotate is initiated on boxes", () => {
    expect(typeof component.instance().onMouseDown).toBe("function");
  });

  it("should have an onMouseUp callback for when the resize, move, or rotate is ended on boxes", () => {
    expect(typeof component.instance().onMouseUp).toBe("function");
  });

  it("should have an onMouseMove callback for when the resize, move, or rotate is happening on boxes", () => {
    expect(typeof component.instance().onMouseMove).toBe("function");
  });

  xit("should have an addBox callback for when the user clicks on add box button", () => {
    expect(typeof component.instance().addBox).toBe("function");
  });

  xit("should have an removeBox callback for when the user clicks on remove box button", () => {
    expect(typeof component.instance().removeBox).toBe("function");
  });

  describe("componentDidMount", () => {
    it("should add event listener to window for resize event", () => {
      expect(addEventListenerSpy.args[0][0]).toEqual('resize');
    })
  })

  describe("onMouseDown", () => {
    it("should call handleMouseDownGrabbable", () => {
      let mockEvent = {
        target: {
          className: "grabbable"
        }
      };
      let spy = spyOn(instance, "handleMouseDownGrabbable");
      instance.onMouseDown(mockEvent);
      expect(spy).toHaveBeenCalled();
    });
    it("should call handleMouseDownHandle", () => {
      let mockEvent = {
        target: {
          className: "handle"
        }
      };
      let spy = spyOn(instance, "handleMouseDownHandle");
      instance.onMouseDown(mockEvent);
      expect(spy).toHaveBeenCalled();
    });
    it("should call handleMouseDownRotate", () => {
      let mockEvent = {
        target: {
          className: "rotate"
        }
      };
      let spy = spyOn(instance, "handleMouseDownRotate");
      instance.onMouseDown(mockEvent);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe("onMouseUp", () => {
    it("should clear respositioning, resizing, and rotating flags", () => {
      instance['image'] = {
        width: 1000,
        height: 1000
      }
      instance.setState(
        {
          currentBox: "grabbable1",
          boxesById: {
            grabbable1: {
              id: "grabbable1",
              style: {
                style: "here"
              },
              isRepositioning: true,
              isResizing: true,
              isRotating: true
            }
          }
        },
        () => {
          instance.onMouseUp();
          expect(instance.state.boxesById["grabbable1"].isRepositioning).toBe(
            false
          );
          expect(instance.state.boxesById["grabbable1"].isResizing).toBe(false);
          expect(instance.state.boxesById["grabbable1"].isRotating).toBe(false);
        }
      );
    });
  });

  describe("onMouseMove", () => {
    it("should call moveBox", () => {
      let mockEvent = {
        preventDefault: jest.fn()
      };
      let spy = spyOn(instance, "moveBox");
      instance.setState(
        {
          currentBox: "grabbable1",
          boxesById: {
            grabbable1: {
              id: "grabbable1",
              style: {
                style: "here"
              },
              isRepositioning: true,
              isResizing: false,
              isRotating: false
            }
          }
        },
        () => {
          instance.onMouseMove(mockEvent);
          expect(spy).toHaveBeenCalled();
        }
      );
    });
    it("should call resizeBox", () => {
      let mockEvent = {
        preventDefault: jest.fn()
      };
      let spy = spyOn(instance, "resizeBox");
      instance.setState(
        {
          currentBox: "grabbable1",
          boxesById: {
            grabbable1: {
              id: "grabbable1",
              style: {
                style: "here"
              },
              isRepositioning: false,
              isResizing: true,
              isRotating: false
            }
          }
        },
        () => {
          instance.onMouseMove(mockEvent);
          expect(spy).toHaveBeenCalled();
        }
      );
    });
    it("should call rotateBox", () => {
      let mockEvent = {
        preventDefault: jest.fn()
      };
      let spy = spyOn(instance, "rotateBox");
      instance.setState(
        {
          currentBox: "grabbable1",
          boxesById: {
            grabbable1: {
              id: "grabbable1",
              style: {
                style: "here"
              },
              isRepositioning: false,
              isResizing: false,
              isRotating: true
            }
          }
        },
        () => {
          instance.onMouseMove(mockEvent);
          expect(spy).toHaveBeenCalled();
        }
      );
    });
  });

  describe("handleMouseDownGrabbable", () => {
    it("should set positionOffset, isRepositioning flag, styles, and elem reference in setState", () => {
      // e.target.offsetLeft - e.clientX,
      // e.target.offsetTop - e.clientY
      let mockEvent = {
        target: {
          id: "grabbable1",
          offsetLeft: 50,
          offsetTop: 60
        },
        clientX: 10,
        clientY: 20
      };
      instance.setState(
        {
          currentBox: "",
          boxesById: {
            grabbable1: {
              id: "grabbable1",
              style: {
                style: "here"
              },
              positionOffset: [],
              isRepositioning: false,
              isResizing: false,
              isRotating: false
            }
          }
        },
        () => {
          instance.handleMouseDownGrabbable(mockEvent);
          let box = instance.state.boxesById["grabbable1"];
          expect(box.isRepositioning).toBe(true);
          expect(box.positionOffset).toEqual([40, 40]);
          expect(box.style.dragCursor).toEqual("-webkit-grabbing");
          expect(instance.state.currentBox).toBe("grabbable1");
        }
      );
    });
  });

  describe("handleMouseDownRotate", () => {
    it("should set rotateStartPoint(int array length 2), and isRotating flag to true", () => {
      let mockEvent = {
        target: {
          parentElement: {
            id: "grabbable1"
          }
        },
        clientX: 10,
        clientY: 20
      };
      instance.setState(
        {
          currentBox: "",
          boxesById: {
            grabbable1: {
              id: "grabbable1",
              style: {
                style: "here"
              },
              rotateStartPoint: [],
              isRepositioning: false,
              isResizing: false,
              isRotating: false
            }
          }
        },
        () => {
          instance.handleMouseDownRotate(mockEvent);
          let box = instance.state.boxesById["grabbable1"];
          expect(box.isRotating).toBe(true);
          expect(box.rotateStartPoint).toEqual([10, 20]);
          expect(instance.state.currentBox).toBe("grabbable1");
        }
      );
    });
  });

  describe("handleMouseDownHandle", () => {
    it("should set resizeStartHeight, resizeStartWidth, resizeStartPoint, and is isResizing flag to true", () => {
      // simulate ref
      instance["grabbable1"] = {
        offsetWidth: 50,
        offsetHeight: 50
      };
      let mockEvent = {
        target: {
          parentElement: {
            id: "grabbable1"
          }
        },
        clientX: 10,
        clientY: 20
      };
      instance.setState(
        {
          currentBox: "",
          boxesById: {
            grabbable1: {
              id: "grabbable1",
              style: {
                style: "here"
              },
              resizeStartPoint: [],
              isRepositioning: false,
              isResizing: false,
              isRotating: false
            }
          }
        },
        () => {
          instance.handleMouseDownHandle(mockEvent);
          let box = instance.state.boxesById["grabbable1"];
          let boxRef = instance["grabbable1"];
          expect(boxRef.offsetWidth).toBe(50);
          expect(boxRef.offsetHeight).toBe(50);
          expect(box.isResizing).toBe(true);
          expect(box.resizeStartPoint).toEqual([10, 20]);
          expect(instance.state.currentBox).toBe("grabbable1");
        }
      );
    });
  });

  describe("rotateBox", () => {
    it("should set degrees to rotate", () => {
      let mockEvent = {
        target: {
          parentElement: {
            id: "grabbable1"
          }
        },
        clientX: 10,
        clientY: 50
      };
      instance.setState(
        {
          currentBox: "",
          boxesById: {
            grabbable1: {
              id: "grabbable1",
              style: {
                style: "here",
                degrees: undefined
              },
              rotateStartPoint: [],
              isRepositioning: false,
              isResizing: false,
              isRotating: false
            }
          }
        },
        () => {
          // first simulate the mouseDownRotate
          instance.handleMouseDownRotate(mockEvent);
          let box = instance.state.boxesById["grabbable1"];
          expect(box.isRotating).toBe(true);
          expect(box.rotateStartPoint).toEqual([10, 50]);
          expect(instance.state.currentBox).toBe("grabbable1");

          // then test if box is rotated
          let mockRotateEvent = {
            target: {
              parentElement: {
                id: "grabbable1"
              }
            },
            clientX: 15,
            clientY: 40
          };
          instance.rotateBox(mockRotateEvent, box);
          expect(instance.state.boxesById["grabbable1"].style.degrees).toEqual(
            -5
          );
        }
      );
    });
  });

  describe("resizeBox", () => {
    it("should set new width and height on the box", () => {
      let mockEvent = {
        clientX: 20,
        clientY: 50
      };
      instance.setState(
        {
          currentBox: "grabbable1",
          boxesById: {
            grabbable1: {
              id: "grabbable1",
              style: {
                style: "here",
                degrees: undefined,
                width: 50,
                height: 50
              },
              resizeStartWidth: 50,
              resizeStartHeight: 50,
              resizeStartPoint: [10, 10],
              isRepositioning: false,
              isResizing: true,
              isRotating: false
            }
          }
        },
        () => {
          let box = instance.state.boxesById["grabbable1"];
          instance.resizeBox(mockEvent, box);
          box = instance.state.boxesById["grabbable1"];
          expect(box.isResizing).toBe(true);
          expect(box.style.width).toBe(60);
          expect(box.style.height).toBe(90);
          expect(instance.state.currentBox).toBe("grabbable1");
        }
      );
    });
  });

  // describe("moveBox", () => {
  //   it("should set new greater width and height on the box", () => {
  //     let mockEvent = {
  //       clientX: 60,
  //       clientY: 70
  //     };
  //     instance.setState(
  //       {
  //         currentBox: "grabbable1",
  //         boxesById: {
  //           grabbable1: {
  //             id: "grabbable1",
  //             style: {
  //               style: "here"
  //             },
  //             positionOffset: [10, 10],
  //             isRepositioning: true,
  //             isResizing: false,
  //             isRotating: false
  //           }
  //         }
  //       },
  //       () => {
  //         let box = instance.state.boxesById["grabbable1"];
  //         instance.moveBox(mockEvent, box);
  //         box = instance.state.boxesById["grabbable1"];
  //         expect(box.isRepositioning).toBe(true);
  //         expect(box.style.top).toBe(80);
  //         expect(box.style.left).toBe(70);
  //         expect(instance.state.currentBox).toBe("grabbable1");
  //       }
  //     );
  //   });

  //   it("should set new width and height to zero", () => {
  //     // out of bounds
  //     let mockEvent = {
  //       clientX: -30,
  //       clientY: -50
  //     };
  //     instance.setState(
  //       {
  //         currentBox: "grabbable1",
  //         boxesById: {
  //           grabbable1: {
  //             id: "grabbable1",
  //             style: {
  //               style: "here"
  //             },
  //             positionOffset: [10, 20],
  //             isRepositioning: true,
  //             isResizing: false,
  //             isRotating: false
  //           }
  //         }
  //       },
  //       () => {
  //         let box = instance.state.boxesById["grabbable1"];
  //         instance.moveBox(mockEvent, box);
  //         box = instance.state.boxesById["grabbable1"];
  //         expect(box.isRepositioning).toBe(true);
  //         expect(box.style.top).toBe(0);
  //         expect(box.style.left).toBe(0);
  //         expect(instance.state.currentBox).toBe("grabbable1");
  //       }
  //     );
  //   });
  // });

  describe("getBoxById", () => {
    it("should return the box given an id", () => {
      instance.setState(
        {
          currentBox: "grabbable1",
          boxesById: {
            grabbable1: {
              id: "grabbable1",
              style: {
                style: "here"
              },
              positionOffset: [10, 20],
              isRepositioning: true,
              isResizing: false,
              isRotating: false
            }
          }
        },
        () => {
          let box = instance.getBoxById("grabbable1");
          expect(box).toEqual({
            id: "grabbable1",
            style: {
              style: "here"
            },
            positionOffset: [10, 20],
            isRepositioning: true,
            isResizing: false,
            isRotating: false
          });
        }
      );
    });
  });

  describe("positionBox", () => {
    it("should return the box", () => {
      // window.getComputedStyle = jest.fn().mockReturnValueOnce({
      //   padding: 10
      // })
      instance["image"] = {
        offsetLeft: 25,
        offsetTop: 25,
        width: 100,
        height: 100
      }
      instance.setState(
        {
          currentBox: "R. ROLLED THUMB",
          boxesById: {
            "R. ROLLED THUMB": {
              id: "R. ROLLED THUMB",
              style: {
                top: 0,
                left: 0,
                width: 0,
                height: 0
              },
              positionOffset: [],
              isRepositioning: true,
              isResizing: false,
              isRotating: false
            }
          }
        },
        () => {
          let box = instance.getBoxById("R. ROLLED THUMB");
          expect(box).toEqual({
            id: "R. ROLLED THUMB",
            style: {
              top: 0,
              left: 0,
              width: 0,
              height: 0
            },
            positionOffset: [],
            isRepositioning: true,
            isResizing: false,
            isRotating: false
          });
          const boxConfig = {
            Width: 5, Height: 5, Left: 0, Top: 10
          }
          const output = instance.positionBox(box, boxConfig);
          const expected = {
            id: "R. ROLLED THUMB",
            style: {
              top: 100,
              left: 0,
              width: 50,
              height: 50
            },
            positionOffset: [],
            isRepositioning: true,
            isResizing: false,
            isRotating: false
          }
          expect(output).toEqual(expected);
        }
      );
    });
  });

  xdescribe("addBox", () => {
    it('should add a box into boxesById map on state', () => {
      instance.setState(
        {
          currentBox: "grabbable1",
          allIds: ["grabbable1"],
          boxesById: {
            grabbable1: {
              id: "grabbable1",
              positionOffset: [10, 20],
              isRepositioning: true,
              isResizing: false,
              isRotating: false,
              style: {
                width: 50,
                height: 50
              }
            }
          }
        },
        () => {
          let box = instance.getBoxById("grabbable1");
          instance.addBox();
          expect(instance.state.allIds).toEqual(["grabbable1", "grabbable2"]);
          expect(instance.state.boxesById["grabbable2"]).not.toBe(null);
          expect(instance.state.boxesById["grabbable2"]).not.toBe(undefined);
        }
      );
    })
  })

  describe('makeBox', () => {
    it('should return a new box', () => {
      let box = instance.makeBox("R. ROLLED THUMB");
      expect(box).toEqual({
        fpLabel: "R. ROLLED THUMB",
        id: "R. ROLLED THUMB",
        rotateStartPoint: [],
        resizeStartPoint: [],
        positionOffset: [],
        style: {
          width: 50,
          height: 50,
          degrees: 0,
          top: 50,
          left: 50,
          dragCursor: "-webkit-drag",
          resizeCursor: "nwse-resize !important",
          rotateCursor: "pointer"
        },
        isRepositioning: false,
        isResizing: false,
        isRotating: false
      })
      // expect(instance.state.id).toBe(1);
    })
  })

  describe('removeBox', () => {
    xit('should remove box from boxesById and allIds', () => {
      instance.addBox();
      instance.addBox();
      instance.setState({
        currentBox: "grabbable1"
      }, () => {
        instance.removeBox();
        let isBoxExists = instance.state.allIds.some(id => id === "grabbable1");
        expect(isBoxExists).toBe(false);
        expect(instance.state.boxesById["grabbable1"]).toBe(undefined);
      })
    })
  })

  it('should have an imageContainer', () => {
    expect(mounted.instance().imageContainer).not.toBe(null);
    expect(mounted.instance().imageContainer).not.toBe(undefined);
  })
  it('should have an image', () => {
    expect(mounted.instance().image).not.toBe(null);
    expect(mounted.instance().image).not.toBe(undefined);
  })
});
