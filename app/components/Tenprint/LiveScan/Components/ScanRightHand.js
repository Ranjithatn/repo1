import React from "react";
import {
  Small,
  Ring,
  Middle,
  Index,
  Thumb,
  UpperPalm,
  LowerPalm
} from "./Fingers";

export const ScanRightHand = props => {

  const { annotatedFingers } = props.liveScan;
  const preview = props.preview;

  const getClassName = (finger, position, fingerIndex, fingerName="", annotatedName="") => {

    let reason = null;
    // console.log("ScanRightHand::props.step, position", props.step, position );

    if ( annotatedFingers ) {
      if ( annotatedFingers && Object.keys(annotatedFingers).length > 0 ) {
        const annotatedFinger = annotatedFingers[position] || {};
        reason = Number(annotatedFinger.reason);
        if ( annotatedFinger.status === true ) {
          // if ( reason === 1 || reason === 2 ) { return "warn-finger"; }
          if ( reason === 1 || reason === 2 ) {
            if ( props.step === "Right Four Control Fingers" && finger !== "Thumb" ) {
              return "warn-finger blinking-border";
            } else if ( props.step === "Both Thumbs" && finger === "Thumb" ) {
              return "warn-finger blinking-border";
            } else if ( props.step.indexOf(finger) !== -1 && props.step.indexOf("Right") !== -1 ) {
              return "warn-finger blinking-border";
            }
            return "warn-finger";
          }
          if ( reason > 2 ) { return "scanning-finger-annotated"; }
        }
      }
    }
    else if ( ! annotatedFingers ) {
      const { annotations } = props;
      const found = annotations[annotatedName];
      if ( found ) {
        const reason = found.reason;

        if ( reason === "OtherReason" || reason === "Handicapped" ) {
          if ( props.step === fingerName ) {
            return "warn-finger-div blinking-border";
          }
          return "warn-finger-div";
        }
        if ( reason === "UnableToAcquire" || reason === "PermanentMissing" ) { return "scanning-finger-annotated"; }
      }
    }



    const qualityIndicator = preview && preview.QualityIndicators && preview.QualityIndicators.QualityIndicator ? preview.QualityIndicators.QualityIndicator : [];
    // console.log("::qualityIndicator::", qualityIndicator);

    const returnClass = (number) => {
      if ( number === 0 ) { return "scanning-finger-empty"; }
      else if ( number === 4 || number === 6 ) { return "scanning-finger-empty"; }
      else if ( number === 1 ) { return "scanning-finger-success"; }
      else { return "scanning-finger-orange"; }
      return "scanning-finger-empty";
    }

    const scanningRes = () => {
      if ( props.liveScan.started && qualityIndicator.length === 0 && props.finger != "Palm" ) { return "normal-finger blinking-border"; }
      if ( qualityIndicator.length === 0 ) { return "scanning-finger-empty"; }
      if ( qualityIndicator.length === 4 && fingerName === "RightThumb" ) {
        if ( props.liveScan.started && qualityIndicator.every( data => { return data === 0; } ) ) {
          return "normal-finger blinking-border";
        }
        const qa = qualityIndicator.filter( item => item > 0 );
        if ( qa.length > 1 ) { return returnClass(qa[1]); }
        else if ( qa.length === 1 ) { return returnClass(qa[0]); }
        return returnClass(0);
      }
      if ( qualityIndicator.length > 1 ) {
        if ( props.liveScan.started && qualityIndicator.every( data => { return data === 0; } ) ) {
          return "normal-finger blinking-border";
        }
        return returnClass(qualityIndicator[fingerIndex] || 0);
      }
      else {
        if ( qualityIndicator.length === 1 && qualityIndicator[0] === 0 ) { return "normal-finger blinking-border"; }
        return returnClass(qualityIndicator[0]);
      }
    }

    if (finger != "Thumb" && finger != "Palm" && props.step === "Right Four Control Fingers") { return scanningRes(); }
    else if (finger === "Thumb" && props.step === "Both Thumbs") { return scanningRes(); }


    if ( props.step === "Right Little Finger" && position === 5 ) { return scanningRes(); }
    if ( props.step === "Right Ring Finger" && position === 4 ) { return scanningRes(); }
    if ( props.step === "Right Middle Finger" && position === 3 ) { return scanningRes(); }
    if ( props.step === "Right Index Finger" && position === 2 ) { return scanningRes(); }
    if ( props.step === "Right Control Thumb" && position === 1 ) { return scanningRes(); }
    if ( props.step === "Right Thumb" && position === 1 ) { return scanningRes(); }

    if ( props.step === "RightUpperPalm" && fingerName === "RightUpperPalm" ) { return scanningRes(); }
    if ( props.step === "RightWritersPalm" && fingerName === "RightWritersPalm" ) { return scanningRes(); }
    if ( props.step === "RightLowerPalm" && fingerName === "RightLowerPalm" ) { return scanningRes(); }

    return "normal-finger";
  };

  return (
    <div className="column is-paddingless">
      <div className="lefthand">
        <div className="svg-container">
          <Thumb id="RightThumb" className={getClassName("Thumb", 1, 0, "RightThumb")} />
          <Index id="RightIndex" className={getClassName("Index", 2, 1)} />
          <Middle id="RightMiddle" className={getClassName("Middle", 3, 2)} />
          <Ring id="RightRing" className={getClassName("Ring", 4, 3)} />
          <Small id="RightSmall" className={getClassName("Little", 5, 0)} />

          <UpperPalm
            id="RightUpperPalm"
            className={`rightupperpalm ${getClassName("Palm", 0, 4, "RightUpperPalm")}`}
            width="180"
            height="100"
          />
          <div className="component--palmContainer right">
            <div className="component--lowerPalm" className={`component--lowerPalm ${getClassName("Palm", 25, 4, "RightLowerPalm", "right-lower-palm")}`}></div>
            <div className="component--writersPalm" className={`component--writersPalm ${getClassName("Palm", 22, 4, "RightWritersPalm", "right-writer-palm")}`}></div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ScanRightHand;
// scanning-finger-orange blinking-border
