// this will filter all the biometrics which belongs to a specific hand and has a specific type
export const findAllFingers = (biometrics, hand, type) => {
  let output = [];

  biometrics &&
    biometrics.map(finger => {
      if (
        finger.position.indexOf(hand) != -1 &&
        (finger.impression === type || finger.type === type)
      ) {
        if (
          finger.position != "LeftFourFingers" &&
          finger.position != "RightFourFingers" &&
          finger.position != "BothThumbs"
        ) {
          output.push(finger);
        }
      }
    });

  return output;
};

// this will filter the three fingers of a given hand
export const findThreeFingers = biometrics => {
  let output = [];

  biometrics &&
    biometrics.map(finger => {
      if (
        finger.position === "LeftFourFingers" ||
        finger.position === "RightFourFingers" ||
        finger.position === "BothThumbs"
      ) {
        output.push(finger);
      }
    });

  return output;
};

export const findAllMatches = (hand, matches, user = 0) => {
  // console.log("findAllMatches::hand, matches, user",hand, matches, user);
  if (hand.length < 1) {
    return hand;
  }
  let matchFound = [];
  matchFound.length = 0;
  if (matches.length < 1) {
    return matchFound;
  }

  hand.forEach(finger => {
    let found = findMatchByPositionAndImpression(
      matches,
      finger.position,
      finger.impression,
      finger.id,
      user
    );

    if (found) {
      matchFound.push(found);
    }
    // else {
    //   if ( finger.annotation !== "NotAnnotated" ) {
    //     output.push({ ...finger, na: true, fingerprintPosition: finger.position });
    //   }
    // }
  });
  // console.log("myoutput",matchFound)
  return matchFound;
};

export const findMatchByPositionAndImpression = (
  matches,
  fingerprintPosition,
  impression,
  fingerId,
  user
) => {
  if (matches.length < 1) {
    return undefined;
  }
  let found;

  matches.forEach(data => {
    let currUser = data.matchInfos[user];

    if (
      currUser.fingerprintPosition === fingerprintPosition &&
      (currUser.impression === impression ||
        currUser.impression === "Unknown") &&
      data.probeBiometricsID === fingerId
    ) {
      found = currUser;
    }
  });

  return found;
};

export const sortFingers = (hand, type) => {
  let output = [];

  if (hand && hand.fingers) {
    hand = hand.fingers;
  }

  hand.map((finger, index) => {
    if (type !== "Palm") {
      if (finger.position.indexOf("Thumb") != -1) {
        output[0] = finger;
      } else if (finger.position.indexOf("Index") != -1) {
        output[1] = finger;
      } else if (finger.position.indexOf("Middle") != -1) {
        output[2] = finger;
      } else if (finger.position.indexOf("Ring") != -1) {
        output[3] = finger;
      } else if (finger.position.indexOf("Little") != -1) {
        output[4] = finger;
      } else if (finger.position.indexOf("Unknown Finger") != -1) {
        output.push(finger);
      } else if (finger.position.indexOf("Right Four Fingers") != -1) {
        output.push(finger);
      } else if (finger.position.indexOf("Left Four Fingers") != -1) {
        output.push(finger);
      }
    } else if (type === "Palm") {
      if (
        finger.position.indexOf("Lower") != -1 &&
        finger.position.indexOf("Palm") != -1
      ) {
        output[0] = finger;
      } else if (
        finger.position.indexOf("Writers") != -1 &&
        finger.position.indexOf("Palm") != -1
      ) {
        output[1] = finger;
      }
    }
  });

  hand = output;
  return hand;
};

export const sortFingerMatches = (hand, selected) => {
  if (hand && hand.fingers) {
    hand = hand.fingers;
  }

  let output = [];

  if (hand.length > 0) {
    hand.map((finger, index) => {
      const currFinger = finger;
      // console.log("currFinger, selected",currFinger, selected);

      if (selected.type !== "Palm") {
        if (currFinger.fingerprintPosition.indexOf("Thumb") != -1) {
          output[0] = finger;
        } else if (currFinger.fingerprintPosition.indexOf("Index") != -1) {
          output[1] = finger;
        } else if (currFinger.fingerprintPosition.indexOf("Middle") != -1) {
          output[2] = finger;
        } else if (currFinger.fingerprintPosition.indexOf("Ring") != -1) {
          output[3] = finger;
        } else if (currFinger.fingerprintPosition.indexOf("Little") != -1) {
          output[4] = finger;
        } else {
          output.push(finger);
        }
      } else if (selected.type === "Palm") {
        if (
          currFinger.fingerprintPosition.indexOf("Lower") !== -1 &&
          currFinger.fingerprintPosition.indexOf("Palm") !== -1
        ) {
          output[0] = finger;
        } else if (
          currFinger.fingerprintPosition.indexOf("Writers") !== -1 &&
          currFinger.fingerprintPosition.indexOf("Palm") !== -1
        ) {
          output[1] = finger;
        } else {
          output.push(finger);
        }
      } else {
        output.push(finger);
      }
    });
  }

  hand = output;

  const fingerprintPositions = ["Thumb", "Index", "Middle", "Ring", "Little"];
  const palmPrintPositions = ["Lower", "Writers"];

  const outputX = [...output];
  if (selected.type !== "Palm") {
    for (let i = 0; i <= 4; i++) {
      if (outputX[i] === "undefined" || !outputX[i]) {
        outputX[i] = {
          axis: "",
          dateCreated: "",
          encoding: "",
          fingerprintPosition: `${selected.hand} ${fingerprintPositions[i]}`,
          fingerprintType: "",
          image: "",
          // impression: finger.impression,
          matchPersonTag: "",
          matchedFingerprintID: "",
          score: "",
          thumbNail: "",
          // annotation: finger.annotation,
          annotationNote: "",
          na: true
        };
      }
    }
  }
  // in case of palm prints, do this.
  else {
    for (let i = 0; i <= 1; i++) {
      // console.log("outputX[i]", outputX[i]);
      if (outputX[i] === "undefined" || !outputX[i]) {
        outputX[i] = {
          axis: "",
          dateCreated: "",
          encoding: "",
          fingerprintPosition: `${selected.hand} ${palmPrintPositions[i]}`,
          fingerprintType: "",
          image: "",
          // impression: finger.impression,
          matchPersonTag: "",
          matchedFingerprintID: "",
          score: "",
          thumbNail: "",
          // annotation: finger.annotation,
          annotationNote: "",
          na: true
        };
      }
    }
  }

  return outputX;
};

/**
 *
 * @param {any[]} matches
 * @param {any[]} related
 */
export const addMissingFinger = (matches, related) => {
  if (matches.length !== related.length) {
    related.map((finger, index) => {
      if (
        finger.annotation !== "NotAnnotated" &&
        finger.annotation !== "" &&
        !finger.thumbNail
      ) {
        matches.push({
          axis: "",
          dateCreated: "",
          encoding: finger.encoding,
          fingerprintPosition: finger.position,
          fingerprintType: finger.type,
          image: "",
          // impression: finger.impression,
          matchPersonTag: "",
          matchedFingerprintID: "",
          score: "",
          thumbNail: "",
          // annotation: finger.annotation,
          annotationNote: finger.annotationNote
        });
      }
    });
  }
  return matches;
};

export const addMissingFingerActual = (data, selected) => {
  const output = [];

  const first = data.find(item => item.position.indexOf("Thumb") !== -1);
  const second = data.find(item => item.position.indexOf("Index") !== -1);
  const third = data.find(item => item.position.indexOf("Middle") !== -1);
  const fourth = data.find(item => item.position.indexOf("Ring") !== -1);
  const fifth = data.find(item => item.position.indexOf("Little") !== -1);

  const fingerProps = name => {
    return {
      type: "Finger",
      position: `${selected.hand} ${name}`,
      impression: selected.type
    };
  };

  if (!first) {
    output.push(fingerProps("Thumb"));
  } else {
    output.push(first);
  }
  if (!second) {
    output.push(fingerProps("Index"));
  } else {
    output.push(second);
  }
  if (!third) {
    output.push(fingerProps("Middle"));
  } else {
    output.push(third);
  }
  if (!fourth) {
    output.push(fingerProps("Ring"));
  } else {
    output.push(fourth);
  }
  if (!fifth) {
    output.push(fingerProps("Little"));
  } else {
    output.push(fifth);
  }

  return output;
};
