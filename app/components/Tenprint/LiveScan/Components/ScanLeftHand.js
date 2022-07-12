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

export const ScanLeftHand = props => {

  const { annotatedFingers } = props.liveScan;
  const preview = props.preview;

  const getClassName = (finger, position, fingerIndex, fingerName="", annotatedName="") => {

    let reason = null;
    // console.log("ScanLeftHand::props.step, position", props.step, position );

    if ( annotatedFingers ) {
      if ( annotatedFingers && Object.keys(annotatedFingers).length > 0 ) {
        const annotatedFinger = annotatedFingers[position] || {};
        reason = Number(annotatedFinger.reason);
        if ( annotatedFinger.status === true ) {
          if ( reason === 1 || reason === 2 ) {
            if ( props.step === "Left Four Control Fingers" && finger !== "Thumb" ) {
              return "warn-finger blinking-border";
            } else if ( props.step === "Both Thumbs" && finger === "Thumb" ) {
              return "warn-finger blinking-border";
            } else if ( props.step.indexOf(finger) !== -1 && props.step.indexOf("Left") !== -1 ) {
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

    // console.log("::qualityIndicator",qualityIndicator);
    // if ( props.liveScan.started && qualityIndicator.length === 0 ) { return "normal-finger blinking-border"; }

    const scanningRes = () => {
      // console.log("::qualityIndicator",qualityIndicator);
      if ( props.liveScan.started && qualityIndicator.length === 0 && props.finger != "Palm" ) { return "normal-finger blinking-border"; }
      if ( qualityIndicator.length === 0 ) { return "scanning-finger-empty"; }
      if ( qualityIndicator.length === 4 && fingerName === "LeftThumb" ) {
        if ( props.liveScan.started && qualityIndicator.every( data => { return data === 0; } ) ) {
          return "normal-finger blinking-border";
        }
        const qa = qualityIndicator.filter( item => item > 0 );
        if ( qa.length > 0 ) { return returnClass(qa[0]); }
        return returnClass(0);
      }
      if ( qualityIndicator.length > 1 ) {
        if ( props.liveScan.started && qualityIndicator.every( data => { return data === 0; } ) ) {
          return "normal-finger blinking-border";
        }
        return returnClass(qualityIndicator[fingerIndex] || 0);
      }
      if ( props.finger === "Palm" ) {
        return returnClass(qualityIndicator[0] || 0);
      }
      else {
        if ( qualityIndicator.length === 1 && qualityIndicator[0] === 0 ) { return "normal-finger blinking-border"; }
        return returnClass(qualityIndicator[0] || 0);
      }
    }

    if (finger != "Thumb" && finger != "Palm" && props.step === "Left Four Control Fingers") { return scanningRes(); }
    else if (finger === "Thumb" && props.step === "Both Thumbs") { return scanningRes(); }


    if ( props.step === "Left Little Finger" && position === 10 ) { return scanningRes(); }
    if ( props.step === "Left Ring Finger" && position === 9 ) { return scanningRes(); }
    if ( props.step === "Left Middle Finger" && position === 8 ) { return scanningRes(); }
    if ( props.step === "Left Index Finger" && position === 7 ) { return scanningRes(); }
    if ( props.step === "Left Control Thumb" && position === 6 ) { return scanningRes(); }
    if ( props.step === "Left Thumb" && position === 6 ) { return scanningRes(); }

    // if ( props.step === "LeftUpperPalm" && fingerName === "LeftUpperPalm" ) { return scanningRes(); }
    if ( props.step === "LeftWritersPalm" && fingerName === "LeftWritersPalm" ) { return scanningRes(); }
    if ( props.step === "LeftLowerPalm" && fingerName === "LeftLowerPalm" ) { return scanningRes(); }

    return "normal-finger"; // blinking-border
  };


  return (
    <div className="column is-paddingless is-centered">
      <div className="lefthand">
        <div className="svg-container">
          <Small id="LeftSmall" className={getClassName("Little", 10, 0)} />
          <Ring id="LeftRing" className={getClassName("Ring", 9, 1)} />
          <Middle id="LeftMiddle" className={getClassName("Middle", 8, 2)} />
          <Index id="LeftIndex" className={getClassName("Index", 7, 3)} />
          <Thumb id="LeftThumb" className={getClassName("Thumb", 6, 0, "LeftThumb")} />

          <UpperPalm id="LeftUpperPalm" className={`leftupperpalm ${getClassName("Palm", 0, 4, "LeftUpperPalm")}`} />
          <div className="component--palmContainer">
            <div className="component--writersPalm" className={`component--writersPalm ${getClassName("Palm", 24, 4, "LeftWritersPalm", "left-writer-palm")}`}></div>
            <div className="component--lowerPalm" className={`component--lowerPalm ${getClassName("Palm", 27, 4, "LeftLowerPalm", "left-lower-palm")}`}></div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ScanLeftHand;

// Small Little
