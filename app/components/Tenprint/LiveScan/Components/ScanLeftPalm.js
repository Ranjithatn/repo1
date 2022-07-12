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

export const ScanLeftPalm = props => {
  const getClassName = finger => {
    if (finger != "Thumb" && props.step === "Left Four Control Fingers") {
      return "scanning-finger";
    } else if (finger === "Thumb" && props.step === "Both Thumbs") {
      return "scanning-finger";
    }
    return "normal-finger";
  };

  return (
    <div className="column is-paddingless is-centered">
      <div className="lefthand">
        <div className="svg-container">
          <Small id="LeftSmall" className={getClassName("Small")} />
          <Ring id="LeftRing" className={getClassName("Ring")} />
          <Middle id="LeftMiddle" className={getClassName("Middle")} />
          <Index id="LeftIndex" className={getClassName("Index")} />
          <Thumb id="LeftThumb" className={getClassName("Thumb")} />

          <UpperPalm id="LeftUpperPalm" className="leftupperpalm" />
          <div className="leftpalmove">
            <LowerPalm id="LeftLowerPalm" className="leftlowerpalm" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanLeftPalm;
