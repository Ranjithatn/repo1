import React, { Fragment, Component } from "react";
import Button from "../../../../Button/Button";
// import cardImg from "images/card.jpg";
import "./TenprintCardScannedContent.scss";
const fs = require("fs");
const { parseString } = require("xml2js");

import Select from "../../../../Select/Select";
import { fingerprintPositions, fingerprintOptions } from "../../../../../utils/constants";

type Props = {
  cardConfig: ?any,
  boxes: ?any,
  scannedImage: ?string,
  formatMessage: ?any,
  saveBoxes: (boxes: any) => void
};

type Box = {
  fpLabel: string,
  id: string,
  rotateStartPoint: Array<number>, // keep track of the mouse position when user clicked to start rotating
  resizeStartPoint: Array<number>, // keep track of mouse position when user clicked to start resizing
  positionOffset: Array<number>,
  style: {
    width: number,
    height: number,
    degrees: number,
    top: number,
    left: number,
    dragCursor: string,
    resizeCursor: string,
    rotateCursor: string
  },
  isRepositioning: boolean,
  isResizing: boolean,
  isRotating: boolean
};

type State = {
  boxesById: any,
  allIds: Array<?string>,
  currentBox: ?string
};

class TenprintCardContent extends Component<Props, State> {
  imageContainer: ?HTMLDivElement;
  image: ?HTMLImageElement;

  state = {
    boxesById: {},
    allIds: [],
    currentBox: undefined,

    cardConfig: {},
    dragging: false,
    region: {
      top: 0,
      left: 0,
      height: 0,
      width: 0
    },
  };

  /*
    this is used for fetching all box detials.
    state.jobs.newJob.cardScan.boxes

  */

  constructor() {
    super();
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    // this.addBox = this.addBox.bind(this);
    // this.removeBox = this.removeBox.bind(this);
    this.onResize = this.onResize.bind(this);
    this.debounce = this.debounce.bind(this);
    this.debouncedResize = this.debounce(this.onResize).bind(this);

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.addNewRegion = this.addNewRegion.bind(this);

    this.positionBoxCustom = this.positionBoxCustom.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);

    this.deleteCustomRegion = this.deleteCustomRegion.bind(this);
    this.handleEscPress = this.handleEscPress.bind(this);
  }

  componentDidMount() {
    // console.log("TenprintCardContent::componentDidMount");
    window.addEventListener("resize", this.debouncedResize);
    this.setState({ cardConfig: this.props.cardConfig });
  }

  componentDidUpdate() {
    // console.log("TenprintCardContent::componentDidUpdate");
    // console.log("this.props.addRegions", this.props.addRegions);
    if (this.props.addRegions) {
      window.addEventListener("mousemove", this.handleMouseMove, false);
      window.addEventListener("mouseup", this.handleMouseUp, false);
      window.addEventListener("mousedown", this.handleMouseDown, false);
      window.addEventListener("keydown", this.handleEscPress, false);
    } else {
      window.removeEventListener("mousemove", this.handleMouseMove, false);
      window.removeEventListener("mouseup", this.handleMouseUp, false);
      window.removeEventListener("mousedown", this.handleMouseDown, false);
    }
  }

  // componentWillReceiveProps() {
  //   console.log("TenprintCardContent::componentWillReceiveProps", this.props, this.state);
  //   this.setState({ cardConfig: this.props.cardConfig, boxesById: {}, allIds: [] });
  // }


  componentWillUnmount() {
    window.removeEventListener("resize", this.debouncedResize);

    // for custom card regions
    if (this.props.addRegions) {
      window.removeEventListener("mousemove", this.handleMouseMove, false);
      window.removeEventListener("mouseup", this.handleMouseUp, false);
      window.removeEventListener("mousedown", this.handleMouseDown, false);
      window.removeEventListener("keydown", this.handleEscPress, false);
    }
  }

  handleEscPress(e) {
    if ( this.props.addRegions && e.keyCode === 27 ) {
      this.props.toggleAddRegions();
    }
  }


  handleMouseMove(e) {
    // console.log("handleMouseMove");
    if (this.state.dragging) {
      let currentRegion = { ...this.state.region };
      currentRegion.height = e.pageY - currentRegion.pageY;
      currentRegion.width = e.pageX - currentRegion.pageX;
      // console.log("currentRegion", currentRegion);
      this.setState({ region: currentRegion });
      this.addNewRegion();
      this.onImageLoad();
    }
  }

  handleMouseUp(e) {
    // console.log("handleMouseUp");
    this.setState({ dragging: false });
    this.props.toggleAddRegions();
    this.addNewRegion();
    this.onImageLoad();
    this.setState({ region: {} });
    // this.saveBoxes();
    this.saveBoxes(this.state.boxesById);
    // console.log("::this.state.boxesById", this.state.boxesById);
  }

  handleMouseDown(e) {
    // console.log("handleMouseDown");
    let currentRegion = { ...this.state.region };
    currentRegion.left = e.layerX;
    currentRegion.top = e.layerY;
    currentRegion.pageX = e.pageX;
    currentRegion.pageY = e.pageY;
    currentRegion.name = `RAND_${Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .substr(0, 5)}`;
    this.setState({ region: currentRegion, dragging: true });
    this.onImageLoad();
  }

  addNewRegion() {
    const cardConfig = { ...this.state.cardConfig };
    const data = {
      Page: "1",
      Name: this.state.region.name,
      Top: parseInt(this.state.region.top),
      Left: parseInt(this.state.region.left),
      Height: parseInt(this.state.region.height),
      Width: parseInt(this.state.region.width),
      custom: true
    };
    // console.log("data -----", data);
    // console.log("cardConfig.CropRegions", cardConfig.CropRegions);
    if (cardConfig.CropRegions && cardConfig.CropRegions.length === 0) {
      cardConfig.CropRegions.push(data);
    } else {
      let existingIndex = cardConfig.CropRegions.findIndex(
        item => item.Name === this.state.region.name
      );
      if (existingIndex != -1) {
        cardConfig.CropRegions[existingIndex] = { ...data };
      } else {
        cardConfig.CropRegions.push(data);
      }
    }
    // this.setState({ cardConfig: cardConfig, allIds: [ ...this.state.allIds, ...this.state.selectedIDS ] });
    this.setState({ cardConfig: cardConfig, allIds: this.props.cardScan.custom.selectedIDS });
    this.saveBoxes();
    // allIds: this.state.selectedIDS
  }

  deleteCustomRegion(id) {
    // console.log("deleteCustomRegion this.props", this.props);
    // console.log("deleteCustomRegion", id);
    let boxes = { ...this.state.boxesById };
    const label = boxes[id].fpLabel;

    // console.log("deleting boxes[id]",boxes[id]);
    delete boxes[id];

    let cardConfig = { ...this.state.cardConfig };
    // console.log("cardConfig", cardConfig);
    const ccIndex = cardConfig.CropRegions.findIndex(
      item => item && item.Name === id
    );
    if (ccIndex != -1) {
      cardConfig.CropRegions.splice(ccIndex, 1);
    }

    // let allIds = [...this.state.allIds];
    let allIds = [];
    this.props.cardScan.segmented.forEach( card => {
      const keys = Object.keys(card.data.boxes);
      allIds = [...allIds, ...keys];
      // allIds.concat(keys);
    });
    // console.log("allIds",allIds);


    const allIdIndex = allIds.findIndex(item => item === id);
    // console.log("allIdIndex", allIdIndex, allIds[allIdIndex]);
    if (allIdIndex != -1) {
      allIds.splice(allIdIndex, 1);
    }

    const selectedIDS = [...this.props.cardScan.custom.selectedIDS];
    // console.log("selectedIDS", selectedIDS);
    const selectedIdIndex = selectedIDS.findIndex(item => {
      // console.log("item", item);
      return item === id;
      // item && item.Name === id
    });
    if (selectedIdIndex != -1) {
      delete selectedIDS[selectedIdIndex];
    }

    // console.log("Before saving...allIds", allIds);

    let allOptions = [...this.props.cardScan.custom.allOptions];
    // console.log("allOptions",allOptions);


    let allFingerOptions = [ ...fingerprintOptions ];
    // console.log("allFingerOptions",allFingerOptions);
    allFingerOptions = allFingerOptions.filter( item => {
      return ! allIds.includes( item.value );
    });

    // console.log("allFingerOptions::filtered", allFingerOptions);


    if ( label.indexOf("RAND_") === -1 ) {
      // allOptions.push({ value: label, displayName: label });
      allOptions = [...allFingerOptions];
    }

    // console.log("TENPRINTCARDSCANNEDCONTENT::fingerprintPositions",fingerprintPositions);
    // console.log("fingerprintOptions",fingerprintOptions);
    // console.log("final allOptions", allOptions);

    this.setState({
      boxesById: boxes,
      cardConfig: cardConfig,
      allIds: allIds,
      // selectedIDS: selectedIDS,
      // allOptions: allOptions
    });

    this.props.cardScanWorkflow({
      type: "CARD_SCAN_UPDATE_CUSTOM",
      data: {
        allOptions,
        selectedIDS,
      }
    });


  }

  positionBoxCustom(box, config) {
    const left = parseInt(config.Left);
    const top = parseInt(config.Top);
    const height = parseInt(config.Height);
    const width = parseInt(config.Width);
    // box.style.top = top;
    // box.style.left = left;
    // box.style.width = width;
    // box.style.height = height;
    if (width > 0) {
      box.style.width = width;
      box.style.left = left;
    } else {
      const newWidth = Math.abs(width);
      box.style.width = newWidth;
      box.style.left = parseFloat(left - newWidth);
    }

    if (height > 0) {
      box.style.height = height;
      box.style.top = top;
    } else {
      const newHeight = Math.abs(height);
      box.style.height = newHeight;
      box.style.top = parseFloat(top - newHeight);
    }

    // console.log("positionBoxCustom::box",box);

    return box;
  }

  handleDropdownChange(id, e) {
    const CropRegions = this.state.cardConfig.CropRegions;
    const value = e.target.value;

    const optionIndex = CropRegions.findIndex(item => {
      return item.Name === id;
    });
    if (optionIndex != -1) {
      CropRegions[optionIndex].Name = value;
    }

    const cardConfig = { ...this.state.cardConfig, CropRegions: CropRegions };
    // console.log("---------->cardConfig<---------", cardConfig);

    let allIds = [...this.state.allIds];
    allIds.forEach((item, index) => {
      if (item === id) {
        allIds[index] = value;
      }
    });

    const boxIds = this.state.allIds;

    let boxesById = { ...this.state.boxesById };
    boxesById[value] = boxesById[id];
    delete boxesById[id]; // remove the item

    boxesById[value].fpLabel = value;
    boxesById[value].id = value;

    let allOptions = [...this.props.cardScan.custom.allOptions];
    const allOptIndex = allOptions.findIndex(
      item => item && item.value === value
    );
    // console.log("allOptIndex", allOptIndex);
    if (allOptIndex != -1) {
      allOptions.splice(allOptIndex, 1);
    }
    // console.log("alll options", allOptions);

    this.setState({
      cardConfig: cardConfig,
      allIds: allIds,
      boxesById: boxesById,
      allOptions: allOptions
    });

    this.props.cardScanWorkflow({
      type: "CARD_SCAN_UPDATE_CUSTOM",
      data: {
        allOptions,
      }
    });

    this.saveBoxes();
  }

  debounce(func: () => void) {
    var timer;
    return function debounce(event: Event) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(func, 100, event);
    };
  }

  onResize() {
    let boxesById = {};
    this.props.cardConfig &&
      this.props.cardConfig.CropRegions.forEach((regionConfig, idx) => {
        let box = this.state.boxesById[regionConfig.Name];
        const boxWithPosition = this.positionBox(box, regionConfig);
        boxesById[box.id] = boxWithPosition;
      });
    this.setState(
      {
        boxesById
      },
      () => {
        // console.log("------------saving boxes");
        this.saveBoxes(this.state.boxesById);
      }
    );
  }

  onImageLoad = () => {
    // console.log("onImageLoad");
    const boxesById = {};
    const allIds = [];
    this.state.cardConfig && this.state.cardConfig.CropRegions && this.state.cardConfig.CropRegions.length > 0 &&
      this.state.cardConfig.CropRegions.forEach((regionConfig, idx) => {
        // console.log("regionConfig", regionConfig);
        const box = this.makeBox(regionConfig.Name);
        // console.log("box", box);
        let boxWithPosition = {};

        if (regionConfig && regionConfig.custom) {
          boxWithPosition = this.positionBoxCustom(box, regionConfig);
          // console.log("boxWithPosition::this.positionBoxCustom",boxWithPosition);
        } else {
          boxWithPosition = this.positionBox(box, regionConfig);
          // console.log("boxWithPosition::this.positionBox",boxWithPosition);
        }



        boxesById[box.id] = boxWithPosition;
        allIds.push(box.id);
      });
    this.setState(
      {
        allIds: [...this.state.allIds, ...allIds],
        boxesById: boxesById
      },
      () => {
        // console.log("----- saving boxes");
        this.saveBoxes(this.state.boxesById);
      }
    );
  };

  onMouseDown(e) {
    const { className } = e.target;
    if (className.includes("grabbable")) {
      this.handleMouseDownGrabbable(e);
    } else if (className === "handle") {
      this.handleMouseDownHandle(e);
    } else if (className === "rotate") {
      this.handleMouseDownRotate(e);
    } else {
      return;
    }
  }

  onMouseUp() {
    const { currentBox } = this.state;
    if (currentBox) {
      const box = this.state.boxesById[currentBox];
      if (box) {
        const boxStyle = box.style || {};
        let newBoxState = {
          ...box,
          style: {
            ...boxStyle,
            dragCursor: "-webkit-grab"
          },
          isRepositioning: false,
          isResizing: false,
          isRotating: false
        };
        let newState = {
          ...this.state.boxesById,
          [box.id]: newBoxState
        };
        this.setState({
          boxesById: newState
          // currentBox: undefined
        });
        this.saveBoxes(this.state.boxesById);
      }
    }
  }

  onMouseMove(e) {
    e.preventDefault();
    if (this.state.currentBox) {
      const box = this.state.boxesById[this.state.currentBox];
      if (box && box.isRepositioning) {
        this.moveBox(e, box);
      } else if (box && box.isResizing) {
        this.resizeBox(e, box);
      } else if (box && box.isRotating) {
        this.rotateBox(e, box);
      } else {
        return;
      }
    }
  }

  handleMouseDownGrabbable(e) {
    let box = this.getBoxById(e.target.id);
    let newState = {
      ...box,
      positionOffset: [
        e.target.offsetLeft - e.clientX,
        e.target.offsetTop - e.clientY
      ],
      style: {
        ...box.style,
        dragCursor: "-webkit-grabbing"
      },
      isRepositioning: true
    };
    this.setState({
      boxesById: {
        ...this.state.boxesById,
        [box.id]: { ...newState }
      },
      currentBox: box.id
    });
  }

  handleMouseDownRotate(e) {
    let box = this.getBoxById(e.target.parentElement.id);
    const rotateStartPoint = [e.clientX, e.clientY];
    let newState = {
      ...box,
      rotateStartPoint,
      isRotating: true
    };
    this.setState({
      boxesById: {
        ...this.state.boxesById,
        [box.id]: newState
      },
      currentBox: box.id
    });
  }

  handleMouseDownHandle(e) {
    let boxId = e.target.parentElement.id; // ex: grabbable1
    let box = this.getBoxById(boxId);
    let boxRef = this[boxId];
    const resizeStartWidth = boxRef.offsetWidth;
    const resizeStartHeight = boxRef.offsetHeight;

    const resizeStartPoint = [e.clientX, e.clientY];

    let newState = {
      ...box,
      resizeStartPoint,
      isResizing: true,
      resizeStartWidth,
      resizeStartHeight
    };

    this.setState({
      boxesById: {
        ...this.state.boxesById,
        [box.id]: newState
      },
      currentBox: box.id
    });
  }

  rotateBox(e, box: Box) {
    let newY = e.clientY - box.rotateStartPoint[1];
    this.setState(
      {
        boxesById: {
          ...this.state.boxesById,
          [box.id]: {
            ...box,
            style: {
              ...box.style,
              degrees: newY / 2
            }
          }
        }
      },
      () => {
        // console.log("---------new box style:", this.state.boxesById[box.id].style);
      }
    );
  }

  resizeBox(e, box: Box) {
    /*
      resizes box by using x and y points where click happened and finding the difference between
      old mouse positions and new mouse positions then setting the box height to that value
    */
    let newBoxWidth;
    let newBoxHeight;
    const widthDiff = e.clientX - box.resizeStartPoint[0]; // compare mouse location x to where mousedown was initiated
    const heightDiff = e.clientY - box.resizeStartPoint[1]; // compare mouse location y to where mousedown was initiated
    const boxStartWidth = box.resizeStartWidth; // get the parents width
    const boxStartHeight = box.resizeStartHeight; // get parents height

    if (widthDiff <= 0) {
      newBoxWidth = boxStartWidth + widthDiff;
    } else {
      newBoxWidth = widthDiff + boxStartWidth;
    }

    if (heightDiff <= 0) {
      newBoxHeight = boxStartHeight + heightDiff;
    } else {
      newBoxHeight = heightDiff + boxStartHeight;
    }

    // update cropregions object and store updated position details.
    const cardConfig = { ...this.state.cardConfig };
    if (cardConfig.CropRegions && cardConfig.CropRegions.length > 0) {
      const foundIndex = cardConfig.CropRegions.findIndex(
        item => item.Name == box.id
      );
      if (foundIndex != -1) {
        let updatedData = cardConfig.CropRegions[foundIndex];
        updatedData["Width"] = newBoxWidth;
        updatedData["Height"] = newBoxHeight;
        cardConfig.CropRegions[foundIndex] = updatedData;
      }
    }
    // console.log("resizeBox::updated cardConfig", cardConfig);

    this.setState({
      boxesById: {
        ...this.state.boxesById,
        [box.id]: {
          ...box,
          style: {
            ...box.style,
            width: newBoxWidth,
            height: newBoxHeight
          }
        }
      },
      cardConfig
    });
  }

  moveBox(e, box: Box) {
    // console.log("e.clientX", e.clientX);
    let newLeft = e.clientX + box.positionOffset[0];
    let newTop = e.clientY + box.positionOffset[1];
    if (newLeft <= 0) {
      newLeft = 0;
    }
    if (newTop <= 0) {
      newTop = 0;
    }
    let newState = {
      ...box,
      style: {
        ...box.style,
        top: newTop,
        left: newLeft
      }
    };

    // update cropregions object and store updated position details.
    const cardConfig = { ...this.state.cardConfig };
    if (cardConfig.CropRegions && cardConfig.CropRegions.length > 0) {
      const foundIndex = cardConfig.CropRegions.findIndex(
        item => item.Name == box.id
      );
      if (foundIndex != -1) {
        let updatedData = cardConfig.CropRegions[foundIndex];
        updatedData["Top"] = newTop;
        updatedData["Left"] = newLeft;
        cardConfig.CropRegions[foundIndex] = updatedData;
      }
    }
    // console.log("moveBox::updated cardConfig", cardConfig);

    this.setState({
      boxesById: {
        ...this.state.boxesById,
        [box.id]: newState
      },
      cardConfig
    });
    this.saveBoxes();
  }

  getBoxById(id: string) {
    return this.state.boxesById[id];
  }

  saveBoxes(boxes) {
    const _boxes = boxes || this.state.boxesById;
    let customBoxes = {};
    if (_boxes && Object.keys(_boxes).length > 0) {
      Object.keys(_boxes).forEach(index => {
        const item = _boxes[index];
        // console.log("item", item);
        customBoxes[item.fpLabel] = item;
      });
    }

    // console.log("customBoxes", customBoxes);
    const data = {
      boxes: customBoxes,
      imageDimensions: [this.image.width, this.image.height]
    };

    // console.log("saveBoxes::data", data);
    this.props.saveBoxes(data);
    this.props.cardScanWorkflow({
      type: "SAVE_CARD_SCAN_BOXES",
      data: {
        image: this.props.scannedImage,
        data: data,
      }
    });
    // this.props.makeNewConfig(this.props.config, {boxes, imageDimensions: [this.image.width,]})
  }

  // addBox(e) {
  //   let box = this.makeBox();
  //   this.setState({
  //     allIds: [...this.state.allIds, box.id],
  //     boxesById: { ...this.state.boxesById, [box.id]: box }
  //   });
  // }

  // removeBox() {
  //   if (this.state.currentBox) {
  //     let newBoxes = {
  //       ...this.state.boxesById
  //     };
  //     delete newBoxes[this.state.currentBox];
  //     let newAllIds = this.state.allIds.filter(
  //       id => id !== this.state.currentBox
  //     );
  //     this.setState({
  //       boxesById: newBoxes,
  //       allIds: newAllIds,
  //       currentBox: undefined
  //     });
  //   }
  // }

  makeBox(fpLabel: string) {
    return {
      fpLabel: fpLabel,
      id: fpLabel, // adds this number to html id field. ex: draggable1
      rotateStartPoint: [], // keep track of the mouse position when user clicked to start rotating
      resizeStartPoint: [], // keep track of mouse position when user clicked to start resizing
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
    };
  }

  renderBoxes() {
    const boxIds = this.state.allIds;
    const annotations = this.props.annotations;

    // console.log("renderBoxes::annotations",annotations);

    const doneIds = [];

    if (boxIds.length === 0) return;
    const { currentBox } = this.state;
    // const filteredBoxIds = boxIds.filter( (key, val) => key.indexOf("RAND") === -1 );
    // console.log("filteredBoxIds",filteredBoxIds);

    return boxIds.map(boxId => {
      // console.log("::BOXID", this.state.boxesById[boxId]);

      if ( doneIds.indexOf(boxId) !== -1 ) {
        return;
      } else {
        doneIds.push(boxId);
      }


      if ( ! this.state.boxesById[boxId] ) { return; }
      const { id, style, fpLabel } = this.state.boxesById[boxId];
      // console.log("::BOXID", this.state.boxesById[boxId], id, style, fpLabel);


      let splittedData = fpLabel && fpLabel.split(" ");
      // console.log("splittedData",splittedData);

      if ( splittedData.length === 1 ) {
        splittedData = fpLabel && fpLabel.split("_");
      }

      let _hand = "";
      let _finger = "";

      if ( splittedData.length > 0 ) {
        _hand = splittedData[0];
        if ( splittedData.length === 3 && this.props.cardConfig.Name.indexOf("Palm") !== -1 && this.props.cardConfig.Page !== 1 ) {
          _finger = `${ splittedData[1] }-${ splittedData[2] }`;
        } else {
          _finger = splittedData[2] || splittedData[1];
        }
      }

      _hand = _hand.indexOf("L.") !== -1 ? "left" : "right";
      if ( ! _finger ) {
        _finger = _finger.toLowerCase();
      }

      // console.log("splittedData, _hand, _finger",splittedData, _hand, _finger);


      let finger_name = `${_hand}-${_finger}`;
      if (finger_name) {
        finger_name = finger_name.toLowerCase();
      }

      // console.log("finger_name",finger_name);
      const hasAnnotation = annotations[finger_name];
      // console.log("hasAnnotation", hasAnnotation);
      // console.log("annotations,finger_name",annotations,finger_name);


      const classNames = [ "grabbable" ];
      if ( currentBox === id ) { classNames.push("active"); }
      let hideFinger = false;

      if ( hasAnnotation && ( hasAnnotation.reason === "Handicapped" || hasAnnotation.reason === "OtherReason" ) ) { classNames.push("is-handicapped") }
      if ( hasAnnotation && ( hasAnnotation.reason === "UnableToAcquire" || hasAnnotation.reason === "PermanentMissing" ) ) { hideFinger = true; }

      if ( hideFinger ) { return null; }

      // console.log("renderBoxes::classNames",hasAnnotation, classNames);

      return (
        <div
          key={id}
          id={id}
          ref={boxElem => (this[id] = boxElem)}
          // className={"grabbable" + (currentBox === id ? " active" : "")}
          className={ classNames.join(' ') }
          style={{
            width: style.width + "px",
            height: style.height + "px",
            left: style.left,
            top: style.top,
            cursor: style.dragCursor,
            transform: "rotate(" + style.degrees + "deg)",
            zIndex: id === currentBox ? 2 : 1
          }}
        >
          {this.state.cardConfig &&
          this.state.cardConfig.Name &&
          this.state.cardConfig.Name === "Custom" ? (
            <div>
              {fpLabel.indexOf("RAND_") != -1 ? (
                <span className="fp-label">
                  <Select
                    options={this.props.cardScan.custom.allOptions}
                    id="select-region-name"
                    defaultValue="Select Region Name"
                    onChange={value => {
                      this.handleDropdownChange(id, value);
                    }}
                    formatMessage={this.props.formatMessage}
                    style={{ width: "100%" }}
                  />
                </span>
              ) : (
                <span className="fp-label">{fpLabel}</span>
              )}
            </div>
          ) : (
            <span className="fp-label">{fpLabel}</span>
          )}
          {/*
          <span className="fp-label">{fpLabel}</span>
          */}
          {this.state.cardConfig &&
            this.state.cardConfig.Name &&
            this.state.cardConfig.Name === "Custom" && (
              <div
                className="delete"
                onClick={() => {
                  this.deleteCustomRegion(id);
                }}
              />
            )}
          <div
            className="rotate"
            style={{
              cursor: style.rotateCursor
            }}
          />
          <div className="handle" style={{ cursor: style.resizeCursor }} />
        </div>
      );
    });
  }

  positionBox(box: Box, config: any) {
    const { resolution: scanDpi } = this.props;
    const {
      Width: cardWidth,
      Height: cardHeight
    } = this.props.cardConfig.ScanArea;
    const { width: imageWidth, height: imageHeight } = this.image;

    const { Height, Width, Top, Left } = config;
    const configHeight = parseFloat(Height);
    const configWidth = parseFloat(Width);
    const configTop = parseFloat(Top);
    const configLeft = parseFloat(Left);

    // console.log("STYLE:::configTop, configLeft", configTop, configLeft);
    // console.log("STYLE:::configHeight, configWidth", configHeight, configWidth);

    const heightRatio = cardHeight * scanDpi / imageHeight;
    const widthRatio = cardWidth * scanDpi / imageWidth;

    let newTop, newLeft, newWidth, newHeight;
    if ( configTop < 20 && configLeft < 20 ) {
      newTop = Math.floor(scanDpi * configTop / heightRatio);
      newLeft = Math.floor(scanDpi * configLeft / widthRatio);
      if ( configHeight > 20 &&  configWidth > 20 ) {
        newWidth = configWidth;
        newHeight = configHeight;
      }
      else {
        newWidth = Math.floor(configWidth * scanDpi / widthRatio);
        newHeight = Math.floor(configHeight * scanDpi / heightRatio);
      }
    } else if ( configHeight < 5 && configWidth < 5 ) {
      newTop = configTop;
      newLeft = configLeft;
      newWidth = Math.floor(configWidth * scanDpi / widthRatio);
      newHeight = Math.floor(configHeight * scanDpi / heightRatio);
    }
    else {
      newTop = configTop;
      newLeft = configLeft;
      newWidth = configWidth;
      newHeight = configHeight;
    }



    // console.log("STYLE:::newLeft, newTop", newLeft, newTop);
    // console.log("STYLE:::newWidth, newHeight", newWidth, newHeight);


    box.style.top = newTop;
    box.style.left = newLeft;
    box.style.width = newWidth;
    box.style.height = newHeight;

    // console.log("positionBox::box",box);

    return box;
  }

  render() {
    const { formatMessage, scannedImage, cardConfig } = this.props;

    // console.log(">>>this.props",this.props);

    // if (cardConfig && cardConfig.name) {
    // }

    let styles = {};
    if ( this.props.addRegions ) {
      styles["cursor"] = "crosshair";
    }

    return (
      <div
        className="cardscan-rebox"
        ref={imgContainerElem => (this.imageContainer = imgContainerElem)}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseMove={this.onMouseMove}
        style={ styles }
      >
        <div style={{ position: "relative" }}>
          {this.renderBoxes()}
          {/* <img
          onLoad={this.onImageLoad}
          ref={imgElem => (this.image = imgElem)}
          id="cardscan-img"
          className="cardscan-img"
          src={cardImg}
          alt="fingerprint"
        /> */}
          {scannedImage && (
            <img
              ref={imgElem => (this.image = imgElem)}
              onLoad={this.onImageLoad}
              src={scannedImage}
              ref={imgElem => (this.image = imgElem)}
              id="cardscan-img"
              className="cardscan-img"
              alt="scanned card"
            />
          )}
        </div>
      </div>
    );
  }
}

export default TenprintCardContent;
