import React from "react";

import {
  Small,
  Ring,
  Middle,
  Index,
  Thumb,
  UpperPalm,
  LowerPalm
} from "../Components/Fingers";

import Svg from "../../../Svg/Svg";
import Select from "../../../Select/Select";
import Button from "../../../Button/Button";
import Label from "../../../Label/Label";
import Textarea from "../../../Textarea/Textarea";
const LivescanAPI = require("../../../../hardwareSDK/biocoreSdk/livescan/livescan");

import "./style.scss";
import { translateRes,translate } from "../../../../utils/intl";


class SidebarAnnotations extends React.Component {

  constructor() {
    super();
    this.state = {
      selectedFinger: '',
      selectedFingerPosition: 0,
      reason: '',
      note: '',
      annotations: [],
    }
    this.isFingerSelected = this.isFingerSelected.bind(this);
    this.selectFinger = this.selectFinger.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setAnnotation = this.setAnnotation.bind(this);
    this.skipLivescan = this.skipLivescan.bind(this);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleMouseClickOutside = this.handleMouseClickOutside.bind(this);
  }

  componentDidUpdate() {
    // console.log("SidebarAnnotations::componentDidUpdate", this.state);
    if ( this.state.selectedFinger ) {
      window.addEventListener("mousedown", this.handleMouseClickOutside, false);
    } else {
      window.removeEventListener("mousedown", this.handleMouseClickOutside, false);
    }
  }

  componentWillUnmount() {

    window.removeEventListener("mousedown", this.handleMouseClickOutside, false);
    // if ( this.state.selectedFinger ) {
    //   window.removeEventListener("mousedown", this.handleMouseClickOutside, false);
    // }
  }



  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleMouseClickOutside(event) {

    if ( this.wrapperRef && ! this.wrapperRef.contains(event.target) ) {
      this.setState({ selectedFingerPosition: 0, selectedFinger: "", reason: "", });
    }
  }


  isFingerSelected(finger, position) {
    if ( finger === this.state.selectedFinger ) { return 'selected-finger'; }
    else if ( this.props.liveScan.annotatedFingers&&this.props.liveScan.annotatedFingers[position].reason == 0 ) { return 'normal-finger'; }
    else if ( this.props.liveScan.annotatedFingers&&this.props.liveScan.annotatedFingers[position].status === true ) { return 'selected-finger'; }
    return 'normal-finger';
  }

  selectFinger({ position, finger }) {
    // console.log("selectFinger", position, finger,this.state);
    let reason=this.state.annotations.filter(ant=>ant.Position===position).map(ant=>ant.Reason)
    if(reason.length>0){
      this.setState({reason:reason[0]})
    }else{
      this.setState({reason:""})
    }


    if( this.state.selectedFingerPosition === position && this.state.selectedFinger === finger ) {
      this.setState({ selectedFinger: '', selectedFingerPosition: 0, reason: "", note: "" });

    } else {
      this.setState({ selectedFinger: finger, selectedFingerPosition: position });

    }
  }

  handleChange(input, value) {
    this.setState({ [input]: value })
  }

  async setAnnotation() {
    // console.log("this.state", this.state);

    let annotatedFingers = Object.assign( {}, this.props.liveScan.annotatedFingers );

    // console.log("annotatedFingers",annotatedFingers);
    annotatedFingers[this.state.selectedFingerPosition].status = true;
    annotatedFingers[this.state.selectedFingerPosition].reason = this.state.reason;
    annotatedFingers[this.state.selectedFingerPosition].note = this.state.note;

    this.props.liveScanWorkflow({ type: 'SET_ANNOTATED_FINGERS', data: annotatedFingers });


    const annotation = {
      Reason: Number(this.state.reason),
      Info: this.state.note,
      Modality: 4,
      Position: Number(this.state.selectedFingerPosition)
    };


    // const annotation = {
    //   reason: Number(this.state.reason),
    //   note: this.state.note,
    //   status: true,
    // };

    if (!Number.isInteger(annotation.Position)) {
      alert("Select a finger to annotate");
      return;
    }

    const isDuplicate = this.state.annotations.some(
      a => a.Position === annotation.Position
    );

    // console.log("isDuplicate",isDuplicate);

    let annotations = [];

    if (isDuplicate) {
      // let existing = this.state.annotations.filter(
      //   a => a.Position !== annotation.Position
      // );
      let existing = this.state.annotations.filter( item => {
        // console.log("Annotations:::filter", item);
        return item.Position !== annotation.Position
      });
      // console.log("Annotations:::existing",existing);
      annotations = [...existing];
      annotations.push(annotation);
    } else {
      annotations = [...this.state.annotations];
      annotations.push(annotation);
    }
    // console.log("annotations::testing",annotations);

    this.setState({ annotations: annotations, selectedFinger: '', selectedFingerPosition: '', reason: '', note: '', });

    await LivescanAPI.setAnnotations({ Annotations: { Annotation: annotations } }); //call API
  }


  async skipLivescan() {
    const annotations = [
      { Reason: 4, Info: "PM", Modality: 4, Position: 1 },
      { Reason: 4, Info: "PM", Modality: 4, Position: 2 },
      { Reason: 4, Info: "PM", Modality: 4, Position: 3 },
      { Reason: 4, Info: "PM", Modality: 4, Position: 4 },
      { Reason: 4, Info: "PM", Modality: 4, Position: 5 },
      { Reason: 4, Info: "PM", Modality: 4, Position: 6 },
      { Reason: 4, Info: "PM", Modality: 4, Position: 7 },
      { Reason: 4, Info: "PM", Modality: 4, Position: 8 },
      { Reason: 4, Info: "PM", Modality: 4, Position: 9 },
      { Reason: 4, Info: "PM", Modality: 4, Position: 10 },
    ];
    await LivescanAPI.setAnnotations({ Annotations: { Annotation: annotations } });
    this.props.startScan();
  }


  render() {


    const {
      formatMessage,
    } = this.props;


    const selectedFingerName = "";


    return (
      <div className="annotation-inner" ref={ (node) => { this.setWrapperRef(node) } }>

        <span className="is-small is-pulled-left annote">
          {formatMessage({ id: "annotation" })}
        </span>

        <span className="is-small annote_text">
          {formatMessage({ id: "selectFingers" })}
        </span>


        {/* fingers container starts here */}
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>

        {/* left hand */}
        <div className="columns">
          <div className="column is-paddingless ">

            <div className="lefthand">
              <div className="svg-container">

                <Svg
                  id="LeftSmall"
                  onClick={ () => { this.selectFinger({ position: 10, finger: 'Left Small' }) } }
                  className={`one smallfinger ${ this.isFingerSelected('Left Small', 10) }`}
                  width="18"
                  height="95"
                  d="M 6.59634 -4.59251e-07C 10.2376 -4.59251e-07 13.1927 3.65055 13.1927 6.61323L 13.1927 51.3038C 13.1927 54.9544 10.2423 57.9171 6.59634 57.9171C 2.95512 57.9171 -8.5369e-07 54.2665 -8.5369e-07 51.3038L -8.5369e-07 6.61323C -8.5369e-07 2.96268 2.95034 -4.59251e-07 6.59634 -4.59251e-07Z"
                />
                <Svg
                  id="LeftRing"
                  onClick={ () => { this.selectFinger({ position: 9, finger: 'Left Ring' }) } }
                  className={`two ringfinger ${ this.isFingerSelected('Left Ring', 9) }`}
                  width="18"
                  height="95"
                  d="M 6.59634 0C 10.2376 0 13.1927 3.65055 13.1927 6.61323L 13.1927 72.0822C 13.1927 75.7327 10.2423 78.6954 6.59634 78.6954C 2.95512 78.6954 0 75.0449 0 72.0822L 0 6.61323C 0 2.96268 2.95034 0 6.59634 0Z"
                />
                <Svg
                  id="LeftMiddle"
                  onClick={ () => { this.selectFinger({ position: 8, finger: 'Left Middle' }) } }
                  className={`three middlefinger ${ this.isFingerSelected('Left Middle', 8) }`}
                  width="18"
                  height="95"
                  d="M 6.59634 0C 10.2376 0 13.1927 3.65055 13.1927 6.61323L 13.1927 80.7011C 13.1927 84.3516 10.2423 87.3143 6.59634 87.3143C 2.95512 87.3143 0 83.6638 0 80.7011L 0 6.61323C 0 2.96268 2.95034 0 6.59634 0Z"
                />
                <Svg
                  id="LeftIndex"
                  onClick={ () => { this.selectFinger({ position: 7, finger: 'Left Index' }) } }
                  className={`four indexfinger ${ this.isFingerSelected('Left Index', 7) }`}
                  width="18"
                  height="95"
                  d="M 6.59634 0C 10.2376 0 13.1927 3.65055 13.1927 6.61323L 13.1927 73.3134C 13.1927 76.964 10.2423 79.9267 6.59634 79.9267C 2.95512 79.9267 0 76.2761 0 73.3134L 0 6.61323C 0 2.96268 2.95034 0 6.59634 0Z"
                />
                <Svg
                  id="LeftThumb"
                  onClick={ () => { this.selectFinger({ position: 6, finger: 'Left Thumb' }) } }
                  className={`five thumb ${ this.isFingerSelected('Left Thumb', 6) }`}
                  width="18"
                  height="150"
                  d="M 6.84308 0C 10.4864 0 13.4375 3.6526 13.4375 6.61131L 13.1889 41.3018C 13.1889 44.9544 10.2376 47.9131 6.59443 47.9131C 2.95116 47.9131 0 44.2605 0 41.3018L 0.248659 6.61131C 0.248659 2.95872 3.19995 0 6.84308 0Z"
                />

                <div className="palm-bio">
                  <div className="left-writer-palm"></div>
                  <div className="left-lower-palm"></div>
                </div>

              </div>
            </div>

          </div>
        </div>


        {/* right hand */}
        <div className="columns">
          <div className="column is-paddingless ">

            <div className="righthand">
              <div className="svg-container">

                <Svg
                  id="RightThumb"
                  onClick={ () => { this.selectFinger({ position: 1, finger: 'Right Thumb' }) } }
                  className={`five thumb ${ this.isFingerSelected('Right Thumb', 1) }`}
                  width="18"
                  height="150"
                  d="M 6.84308 0C 10.4864 0 13.4375 3.6526 13.4375 6.61131L 13.1889 41.3018C 13.1889 44.9544 10.2376 47.9131 6.59443 47.9131C 2.95116 47.9131 0 44.2605 0 41.3018L 0.248659 6.61131C 0.248659 2.95872 3.19995 0 6.84308 0Z"
                />
                <Svg
                  id="RightIndex"
                  onClick={ () => { this.selectFinger({ position: 2, finger: 'Right Index' }) } }
                  className={`four indexfinger ${ this.isFingerSelected('Right Index', 2) }`}
                  width="18"
                  height="95"
                  d="M 6.59634 0C 10.2376 0 13.1927 3.65055 13.1927 6.61323L 13.1927 73.3134C 13.1927 76.964 10.2423 79.9267 6.59634 79.9267C 2.95512 79.9267 0 76.2761 0 73.3134L 0 6.61323C 0 2.96268 2.95034 0 6.59634 0Z"
                />
                <Svg
                  id="RightMiddle"
                  onClick={ () => { this.selectFinger({ position: 3, finger: 'Right Middle' }) } }
                  className={`three middlefinger ${ this.isFingerSelected('Right Middle', 3) }`}
                  width="18"
                  height="95"
                  d="M 6.59634 0C 10.2376 0 13.1927 3.65055 13.1927 6.61323L 13.1927 80.7011C 13.1927 84.3516 10.2423 87.3143 6.59634 87.3143C 2.95512 87.3143 0 83.6638 0 80.7011L 0 6.61323C 0 2.96268 2.95034 0 6.59634 0Z"
                />
                <Svg
                  id="RightRing"
                  onClick={ () => { this.selectFinger({ position: 4, finger: 'Right Ring' }) } }
                  className={`two ringfinger ${ this.isFingerSelected('Right Ring', 4) }`}
                  width="18"
                  height="95"
                  d="M 6.59634 0C 10.2376 0 13.1927 3.65055 13.1927 6.61323L 13.1927 72.0822C 13.1927 75.7327 10.2423 78.6954 6.59634 78.6954C 2.95512 78.6954 0 75.0449 0 72.0822L 0 6.61323C 0 2.96268 2.95034 0 6.59634 0Z"
                />
                <Svg
                  id="RightSmall"
                  onClick={ () => { this.selectFinger({ position: 5, finger: 'Right Small' }) } }
                  className={`one smallfinger ${ this.isFingerSelected('Right Small', 5) }`}
                  width="18"
                  height="95"
                  d="M 6.59634 -4.59251e-07C 10.2376 -4.59251e-07 13.1927 3.65055 13.1927 6.61323L 13.1927 51.3038C 13.1927 54.9544 10.2423 57.9171 6.59634 57.9171C 2.95512 57.9171 -8.5369e-07 54.2665 -8.5369e-07 51.3038L -8.5369e-07 6.61323C -8.5369e-07 2.96268 2.95034 -4.59251e-07 6.59634 -4.59251e-07Z"
                />

                <div className="palm-bio palm-bio-right">
                  <div className="right-lower-palm"></div>
                  <div className="right-writer-palm"></div>
                </div>

              </div>
            </div>

          </div>
        </div>

        </div>
        {/* fingers container ends here */}


        {/* selected finger data starts here */}
        <div className="columns">
          <div className="column is-paddingless">
            <Label text={ translate(this.state.selectedFinger) || formatMessage({id:"Select Finger"}) } />
          </div>

          <div className="column is-pulled-left is-paddingless">
            <Select
            disabled={ this.state.selectedFinger ? false : true }
              onChange={ (e) => { this.handleChange( 'reason', e.target.value ) } }
              className="is-small"
              formatMessage={formatMessage}
              id="annotation-reason"
              value={ this.state.reason }
              name="annotation"
              defaultValue={formatMessage({ id: "Select Reason" })}
              options={[
                { value: 0, displayName: formatMessage({ id: "notAnnotation" }) },
                { value: 1, displayName: formatMessage({ id: "otherReason" }) },
                { value: 2, displayName: formatMessage({ id: "handicapped" }) },
                { value: 3, displayName: formatMessage({ id: "unableToAcquire" }) },
                { value: 4, displayName: formatMessage({ id: "permanentMissing" }) }
              ]}
            />
          </div>

        </div>
        {/* selected finger data ends here */}


        <div>
          <Label text={formatMessage({ id: "notes" })} />
          <Textarea
            rows="2"
            onChange={ (e) => { this.handleChange( 'note', e.target.value ) } }
            value={ this.state.note }
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <Button
            disabled={ this.state.reason ? false : true }
            // disabled={ this.state.note && this.state.reason ? false : true }
            className="is-primary scancard-btn"
            text={formatMessage({ id: "done" })}
            onClick={ () => { this.setAnnotation() } }
          />
        </div>

        { process && process.env && process.env.NODE_ENV === "development" &&
        <div style={{ textAlign: 'center' }}>
          <Button
            className="is-primary scancard-btn"
            text="Skip Live Scan"
            onClick={ () => { this.skipLivescan() } }
          />
        </div>
        }



      </div>
    );



  }



}


export default SidebarAnnotations;
