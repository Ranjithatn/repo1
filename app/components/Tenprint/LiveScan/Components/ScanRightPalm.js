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

export const ScanRightPalm = props => {
  const getClassName = finger => {
    if (finger != "Thumb" && props.step === "Right Four Control Fingers") {
      return "scanning-finger";
    } else if (finger === "Thumb" && props.step === "Both Thumbs") {
      return "scanning-finger";
    }
    return "normal-finger";
  };

  return (
    <div className="column is-paddingless">
      <div className="lefthand">
        <div className="svg-container">
          <Thumb id="RightThumb" className={getClassName("Thumb")} />
          <Index id="RightIndex" className={getClassName("Index")} />
          <Middle id="RightMiddle" className={getClassName("Middle")} />
          <Ring id="RightRing" className={getClassName("Ring")} />
          <Small id="RightSmall" className={getClassName("Small")} />

          <UpperPalm
            id="RightUpperPalm"
            className="rightupperpalm"
            width="180"
            height="100"
          />
          <LowerPalm id="RightLowerPalm" className="rightlowerpalm" />
        </div>
      </div>
    </div>
  );
};

export default ScanRightPalm;
