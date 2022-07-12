export const fourFourTwoName = "LeftToRight;442";
export const fourFourTwo = {
  Workflow: {
    Name: "LeftToRight;442",
    Step: [
      {
        UseAutoCapture: true,
        UseAutoContrast: true,
        Fingerprint: {
          Position: "LeftFourFingers",
          Impression: "LivescanPlain"
        }
      },
      {
        UseAutoCapture: true,
        UseAutoContrast: true,
        Fingerprint: {
          Position: "RightFourFingers",
          Impression: "LivescanPlain"
        }
      },
      {
        UseAutoCapture: true,
        UseAutoContrast: true,
        Fingerprint: {
          Position: "BothThumbs",
          Impression: "LivescanPlain"
        }
      }
    ]
  }
};

export const fourFourTwoFlatAndRollsName = "LeftToRight: Flat and Rolls";
export const fourFourTwoFlatAndRolls = {
  "Workflow": {
    "Name": "LeftToRight: Flat and Rolls",
    "Step": [
      {
        "UseAutoCapture": true,
        "UseAutoContrast": true,
        "FinalImageWidth": 1600,
        "FinalImageHeight": 1000,
        "Fingerprint": {
          "Position": "LeftFourFingers",
          "Impression": "LivescanPlain"
        }
      },
      {
        "UseAutoCapture": true,
        "UseAutoContrast": true,
        "FinalImageWidth": 500,
        "FinalImageHeight": 1000,
        "Fingerprint": {
          "Position": "LeftCtrlThumb",
          "Impression": "LivescanPlain"
        }
      },
      {
        "UseAutoCapture": true,
        "UseAutoContrast": false,
        "Fingerprint": {
          "Position": "LeftThumb",
          "Impression": "LivescanRolled"
        }
      },
      {
        "UseAutoCapture": true,
        "UseAutoContrast": false,
        "Fingerprint": {
          "Position": "LeftIndex",
          "Impression": "LivescanRolled"
        }
      },
      {
        "UseAutoCapture": true,
        "UseAutoContrast": false,
        "Fingerprint": {
          "Position": "LeftMiddle",
          "Impression": "LivescanRolled"
        }
      },
      {
        "UseAutoCapture": true,
        "UseAutoContrast": false,
        "Fingerprint": {
          "Position": "LeftRing",
          "Impression": "LivescanRolled"
        }
      },
      {
        "UseAutoCapture": true,
        "UseAutoContrast": false,
        "Fingerprint": {
          "Position": "LeftLittle",
          "Impression": "LivescanRolled"
        }
      },
      {
        "UseAutoCapture": true,
        "UseAutoContrast": true,
        "FinalImageWidth": 1600,
        "FinalImageHeight": 1000,
        "Fingerprint": {
          "Position": "RightFourFingers",
          "Impression": "LivescanPlain"
        }
      },
      {
        "UseAutoCapture": true,
        "UseAutoContrast": true,
        "FinalImageWidth": 500,
        "FinalImageHeight": 1000,
        "Fingerprint": {
          "Position": "RightCtrlThumb",
          "Impression": "LivescanPlain"
        }
      },
      {
        "UseAutoCapture": true,
        "UseAutoContrast": false,
        "Fingerprint": {
          "Position": "RightThumb",
          "Impression": "LivescanRolled"
        }
      },
      {
        "UseAutoCapture": true,
        "UseAutoContrast": false,
        "Fingerprint": {
          "Position": "RightIndex",
          "Impression": "LivescanRolled"
        }
      },
      {
        "UseAutoCapture": true,
        "UseAutoContrast": false,
        "Fingerprint": {
          "Position": "RightMiddle",
          "Impression": "LivescanRolled"
        }
      },
      {
        "UseAutoCapture": true,
        "UseAutoContrast": false,
        "Fingerprint": {
          "Position": "RightRing",
          "Impression": "LivescanRolled"
        }
      },
      {
        "UseAutoCapture": true,
        "UseAutoContrast": false,
        "Fingerprint": {
          "Position": "RightLittle",
          "Impression": "LivescanRolled"
        }
      }
    ]
  }
};


export const rtlPalmPrintsName = "Right To Left; Palm Prints (Upper/Lower/Writers)";
export const rtlPalmPrints = {
  "Workflow": {
    "Name": "Right To Left; Palm Prints (Upper/Lower/Writers)",
    "Step": [
      // {
      //   "UseAutoCapture": true,
      //   "UseAutoContrast": true,
      //   "Fingerprint": {
      //     "Position": "RightUpperPalm",
      //     "Impression": "LivescanPlain",
      //     "UseAsCtrlFinger": true
      //   }
      // },
      {
        "UseAutoCapture": true,
        "UseAutoContrast": true,
        "Fingerprint": {
          "Position": "RightLowerPalm",
          "Impression": "LivescanPlain",
          "UseAsCtrlFinger": true
        }
      },
      {
        "UseAutoCapture": true,
        "UseAutoContrast": true,
        "Fingerprint": {
          "Position": "RightWritersPalm",
          "Impression": "LivescanPlain",
          "UseAsCtrlFinger": true
        }
      },
      // {
      //   "UseAutoCapture": true,
      //   "UseAutoContrast": true,
      //   "Fingerprint": {
      //     "Position": "LeftUpperPalm",
      //     "Impression": "LivescanPlain",
      //     "UseAsCtrlFinger": true
      //   }
      // },
      {
        "UseAutoCapture": true,
        "UseAutoContrast": true,
        "Fingerprint": {
          "Position": "LeftLowerPalm",
          "Impression": "LivescanPlain",
          "UseAsCtrlFinger": true
        }
      },
      {
        "UseAutoCapture": true,
        "UseAutoContrast": true,
        "Fingerprint": {
          "Position": "LeftWritersPalm",
          "Impression": "LivescanPlain",
          "UseAsCtrlFinger": true
        }
      }
    ]
  }
};

export const positions = [
  "Unknown Finger",
  "Right Thumb",
  "Right Index Finger",
  "Right Middle Finger",
  "Right Ring Finger",
  "Right Little Finger",
  "Left Thumb",
  "Left Index Finger",
  "Left Middle Finger",
  "Left Ring Finger",
  "Left Little Finger",
  "Right Control Thumb",
  "Left Control Thumb",
  "Right Four Control Fingers",
  "Left Four Control Fingers",
  "Both Thumbs",
  "Reserved_1",
  "Reserved_2",
  "Reserved_3",
  "Reserved_4",
  "UnknownPalm",
  "RightFullPalm",
  "RightWritersPalm",
  "LeftFullPalm",
  "LeftWritersPalm",
  "RightLowerPalm",
  "RightUpperPalm",
  "LeftLowerPalm",
  "LeftUpperPalm",
  "RightOtherPalm",
  "LeftOtherPalm",
  "RightInterdigital",
  "RightThenar",
  "RightHypothenar",
  "LeftInterdigital",
  "LeftThenar",
  "LeftHypothenar",
  "Reserved_5",
  "Reserved_6",
  "Reserved_7",
  "RightIndexMiddle",
  "RightMiddleRing",
  "RightRingLittle",
  "LeftIndexMiddle",
  "LeftMiddleRing",
  "LeftRingLittle",
  "RightIndexLeftIndex",
  "RightIndexMiddleRing",
  "RightMiddleRingLittle",
  "LeftIndexMiddleRing",
  "LeftMiddleRingLittle"
];

export const impressions = [
  "Livescan Unknown Finger Capture",
  "Livescan Plain Finger Capture",
  "Livescan Rolled Finger Capture"
];
