import React, { Fragment, Component } from "react";
import Button from "../../../../Button/Button";
// import cardImg from "images/card.jpg";
import "./TenprintCardScannedContent.scss";
const fs = require("fs");
const { parseString } = require("xml2js");

import Select from '../../../../Select/Select';


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
      width: 0,
    },
    selectedIDS: [],
    allOptions: [
      { value: "L. PLAIN LITTLE", displayName: "L. PLAIN LITTLE" },
      { value: "L. PLAIN RING", displayName: "L. PLAIN RING" },
      { value: "L. PLAIN MIDDLE", displayName: "L. PLAIN MIDDLE" },
      { value: "L. PLAIN INDEX", displayName: "L. PLAIN INDEX" },
      { value: "R. PLAIN LITTLE", displayName: "R. PLAIN LITTLE" },
      { value: "R. PLAIN RING", displayName: "R. PLAIN RING" },
      { value: "R. PLAIN MIDDLE", displayName: "R. PLAIN MIDDLE" },
      { value: "R. PLAIN INDEX", displayName: "R. PLAIN INDEX" },
      { value: "R. ROLLED THUMB", displayName: "R. ROLLED THUMB" },
      { value: "R. ROLLED INDEX", displayName: "R. ROLLED INDEX" },
      { value: "R. ROLLED MIDDLE", displayName: "R. ROLLED MIDDLE" },
      { value: "R. ROLLED RING", displayName: "R. ROLLED RING" },
      { value: "R. ROLLED LITTLE", displayName: "R. ROLLED LITTLE" },
      { value: "L. ROLLED THUMB", displayName: "L. ROLLED THUMB" },
      { value: "L. ROLLED INDEX", displayName: "L. ROLLED INDEX" },
      { value: "L. ROLLED MIDDLE", displayName: "L. ROLLED MIDDLE" },
      { value: "L. ROLLED RING", displayName: "L. ROLLED RING" },
      { value: "L. ROLLED LITTLE", displayName: "L. ROLLED LITTLE" },
      { value: "L. SLAP", displayName: "L. SLAP" },
      { value: "R. SLAP", displayName: "R. SLAP" },
      { value: "L. PLAIN THUMB", displayName: "L. PLAIN THUMB" },
      { value: "R. PLAIN THUMB", displayName: "R. PLAIN THUMB" },
    ],
  };

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
  }

  componentDidMount() {
    window.addEventListener("resize", this.debouncedResize);
    this.setState({ cardConfig: this.props.cardConfig });
  }

  componentDidUpdate() {
    console.log("this.props.addRegions",this.props.addRegions);
    if ( this.props.addRegions ) {
      window.addEventListener('mousemove', this.handleMouseMove, false);
      window.addEventListener('mouseup', this.handleMouseUp, false);
      window.addEventListener('mousedown', this.handleMouseDown, false);
    } else {
      window.removeEventListener('mousemove', this.handleMouseMove, false);
      window.removeEventListener('mouseup', this.handleMouseUp, false);
      window.removeEventListener('mousedown', this.handleMouseDown, false);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.debouncedResize);

    // for custom card regions
    if ( this.props.addRegions ) {
      window.removeEventListener('mousemove', this.handleMouseMove, false);
      window.removeEventListener('mouseup', this.handleMouseUp, false);
      window.removeEventListener('mousedown', this.handleMouseDown, false);
    }
  }

  handleMouseMove(e) {
    console.log("handleMouseMove");
    if ( this.state.dragging ) {
      let currentRegion = {...this.state.region};
      currentRegion.height = e.pageY - currentRegion.pageY;
      currentRegion.width = e.pageX - currentRegion.pageX;
      console.log("currentRegion", currentRegion);
      this.setState({ region: currentRegion });
      this.addNewRegion();
      this.onImageLoad();
    }
  }


  handleMouseUp(e) {
    console.log("handleMouseUp");
    this.setState({ dragging: false });
    this.props.toggleAddRegions();
    this.addNewRegion();
    this.onImageLoad();
    this.setState({ region: {} })
  }

  handleMouseDown(e) {
    console.log("handleMouseDown",e);
    let currentRegion = {...this.state.region};
    currentRegion.left = e.layerX;
    currentRegion.top = e.layerY;
    currentRegion.pageX = e.pageX;
    currentRegion.pageY = e.pageY;
    currentRegion.name = `RAND_${ Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5) }`;
    this.setState({ region: currentRegion, dragging: true });
  }

  addNewRegion() {
    const cardConfig = {...this.state.cardConfig};
    const data = {
      Page: "1",
      Name: this.state.region.name,
      Top: parseInt(this.state.region.top),
      Left: parseInt(this.state.region.left),
      Height: parseInt(this.state.region.height),
      Width: parseInt(this.state.region.width),
      custom: true,
    }
    console.log("data -----",data);
    console.log("cardConfig.CropRegions",cardConfig.CropRegions);
    if ( cardConfig.CropRegions.length === 0 ) {
      cardConfig.CropRegions.push(data);
    } else {
      let existingIndex = cardConfig.CropRegions.findIndex( item => item.Name === this.state.region.name );
      if ( existingIndex != -1 ) {
        cardConfig.CropRegions[existingIndex] = data;        
      } else {
        cardConfig.CropRegions.push(data);
      }
    }
    // this.setState({ cardConfig: cardConfig, allIds: [ ...this.state.allIds, ...this.state.selectedIDS ] });
    this.setState({ cardConfig: cardConfig, allIds: this.state.selectedIDS });
    // allIds: this.state.selectedIDS
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
    if ( width > 0 ) {
      box.style.width = width;
      box.style.left = left;
    } else {
      const newWidth = Math.abs(width);
      box.style.width = newWidth;
      box.style.left = parseFloat( left - newWidth );
    }

    if ( height > 0 ) {
      box.style.height = height;
      box.style.top = top;
    } else {
      const newHeight = Math.abs(height);
      box.style.height = newHeight;
      box.style.top = parseFloat( top - newHeight );
    }

    return box;
  }



  handleDropdownChange(id, e) {
    const value = e.target.value;
    console.log("id, value", id, value);
    let allIds = { ...this.state.boxesById };
    console.log("------------------allIds",allIds);
    allIds[id].fpLabel = value;

    let allOptions = [...this.state.allOptions];
    const optionIndex = allOptions.findIndex( item => {
      item.value === value
    });

    if ( optionIndex != -1 ) {
      allOptions.splice(optionIndex, 1);
    }

    this.setState({ selectedIDS: allOptions, allOptions: allOptions, boxesById: allIds });
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
        console.log("------------saving boxes");
        this.saveBoxes(this.state.boxesById);
      }
    );
  }

  onImageLoad = () => {
    console.log("onImageLoad");
    const boxesById = {};
    const allIds = [];
    this.state.cardConfig &&
      this.state.cardConfig.CropRegions.forEach((regionConfig, idx) => {
        console.log("regionConfig",regionConfig);
        const box = this.makeBox(regionConfig.Name);
        console.log("box", box);
        let boxWithPosition = {};

        if ( regionConfig && regionConfig.custom ) {
          boxWithPosition = this.positionBoxCustom(box, regionConfig);
        } else {
          boxWithPosition = this.positionBox(box, regionConfig);
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
        console.log("----- saving boxes");
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
      let newBoxState = {
        ...box,
        style: {
          ...box.style,
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

  onMouseMove(e) {
    e.preventDefault();
    if (this.state.currentBox) {
      const box = this.state.boxesById[this.state.currentBox];
      if (box.isRepositioning) {
        this.moveBox(e, box);
      } else if (box.isResizing) {
        this.resizeBox(e, box);
      } else if (box.isRotating) {
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
      }
    });
  }

  moveBox(e, box: Box) {
    console.log("e.clientX",e.clientX);
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
    this.setState({
      boxesById: {
        ...this.state.boxesById,
        [box.id]: newState
      }
    });
  }

  getBoxById(id: string) {
    return this.state.boxesById[id];
  }

  saveBoxes(boxes) {
    const data = {
      boxes: boxes || this.state.boxesById,
      imageDimensions: [this.image.width, this.image.height]
    };
    this.props.saveBoxes(data);
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
    console.log("RENDER BOX", boxIds);
    if (boxIds.length === 0) return;
    const { currentBox } = this.state;
    return boxIds.map(boxId => {
      console.log("---------renderboxes------boxId",boxId);
      const { id, style, fpLabel } = this.state.boxesById[boxId];
      return (
        <div
          key={id}
          id={id}
          ref={boxElem => (this[id] = boxElem)}
          className={"grabbable" + (currentBox === id ? " active" : "")}
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
          { this.state.cardConfig && this.state.cardConfig.name && this.state.cardConfig.name === "custom" ?
          
            (<div>
              { fpLabel.indexOf("RAND_") != -1 ?
              (
              <span className="fp-label">
                <Select
                  options={ this.state.allOptions }
                  id="select-region-name"
                  defaultValue="Select Region Name"
                  onChange={ (value) => { this.handleDropdownChange(id, value) } }
                  formatMessage={this.props.formatMessage}
                  style={{ width: "100%" }} />
              </span>) : (
                <span className="fp-label">{fpLabel}</span>
              )
            }

            </div>) :
            (<span className="fp-label">{fpLabel}</span>)
          }
          {/*
          <span className="fp-label">{fpLabel}</span>
          */}
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

    const heightRatio = cardHeight * scanDpi / imageHeight;
    const widthRatio = cardWidth * scanDpi / imageWidth;

    let newTop, newLeft, newWidth, newHeight;
    newTop = Math.floor(scanDpi * configTop / heightRatio);
    newLeft = Math.floor(scanDpi * configLeft / widthRatio);
    newWidth = Math.floor(configWidth * scanDpi / widthRatio);
    newHeight = Math.floor(configHeight * scanDpi / heightRatio);

    box.style.top = newTop;
    box.style.left = newLeft;
    box.style.width = newWidth;
    box.style.height = newHeight;
    return box;
  }

  render() {
    const { formatMessage, scannedImage, cardConfig } = this.props;

    console.log("TenprintCardContent :: STATE", this.state)

    if ( cardConfig && cardConfig.name ) {
      console.log("addRegions status",this.props.addRegions);

    }

    return (
      <div
        className="cardscan-rebox"
        ref={imgContainerElem => (this.imageContainer = imgContainerElem)}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseMove={this.onMouseMove}
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