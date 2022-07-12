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
  if (hand.length < 1) {
    return hand;
  }
  let output = [];

  if (matches.length < 1) {
    return output;
  }

  hand.map(finger => {
    const found = findMatchByPositionAndImpression(
      matches,
      finger.position,
      finger.impression,
      user
    );
    if (found) {
      output.push(found);
    }
  });

  return output;
};

export const findMatchByPositionAndImpression = (
  matches,
  fingerprintPosition,
  impression,
  user
) => {
  if (matches.length < 1) {
    return null;
  }
  let found = null;

  matches.map(data => {
    let currUser = data.matchInfos[user];
    if (
      currUser.fingerprintPosition === fingerprintPosition &&
      currUser.impression === impression
    ) {
      found = currUser;
    }
  });

  return found;
};

export const sortFingers = hand => {
  // console.log("sortFingers hand",hand);
  let output = [];

  if (hand && hand.fingers) {
    hand = hand.fingers;
  }

  hand.map((finger, index) => {
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
    }
  });

  hand = output;
  return hand;
};

export const sortFingerMatches = hand => {
  if (hand.length < 1) {
    return hand;
  }
  // console.log("sortFingerMatches hand",hand);
  if (hand && hand.fingers) {
    hand = hand.fingers;
  }

  let output = [];

  hand.map((finger, index) => {
    const currFinger = finger;
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
      // handling palms
      output.push(finger);
    }
  });

  hand = output;
  // console.log("hand",hand);
  return hand;
};

export const addMissingFinger = (matches, related) => {
  if (matches.length != related.length) {
    related.map((finger, index) => {
      if (finger.annotation != "NotAnnotated" && finger.annotation !== "") {
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
