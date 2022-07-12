import React from "react";
import { withRouter } from "react-router-dom";
import Title from "../../../Title/Title";
import Image from "../../../Image/Image";
import Adjudicator from "../../../Adjudicator";
import {
  findAllFingers,
  findAllMatches,
  findThreeFingers,
  sortFingers,
  sortFingerMatches,
  addMissingFinger
} from "../Helper";
import "./TenprintVerifyMain.scss";
import {reg_space} from "../../../../utils/regEx"


// Local helper functions.
const getSelectedHandAndType = selected => {
  console.log("selected", selected);
  let hand = "";
  let type = "";

  if (selected === "Left" || selected === "LeftHandFlat") {
    hand = "Left";
    type = "Flat";
  } else if (selected === "Right" || selected === "RightHandFlat") {
    hand = "Right";
    type = "Flat";
  } else if (selected === "LeftHandRolled") {
    hand = "Left";
    type = "Roll";
  } else if (selected === "RightHandRolled") {
    hand = "Right";
    type = "Roll";
  } else if (selected === "LeftPalm") {
    hand = "Left";
    type = "Palm";
  } else if (selected === "RightPalm") {
    hand = "Right";
    type = "Palm";
  }

  return { hand, type };
};

const getCurrentFingers = (biometrics, selected) => {
  let data = findAllFingers(biometrics, selected.hand, selected.type);
  if (selected.type !== "Palm") {
    data = sortFingers(data);
  }
  return data;
};

const getCurrentMatches = (fingers, fingerprintMatches, index) => {
  let data = findAllMatches(fingers, fingerprintMatches, index);
  data = addMissingFinger(data, fingers);
  data = sortFingerMatches(data);
  return data;
};

const getCurrentPageTitle = selected => {
  if (selected.hand === "Left" && selected.type === "Flat") {
    return "Left Hand Flat Prints";
  }
  if (selected.hand === "Right" && selected.type === "Flat") {
    return "Right Hand Flat Prints";
  }
  if (selected.hand === "Left" && selected.type === "Roll") {
    return "Left Hand Rolled Prints";
  }
  if (selected.hand === "Right" && selected.type === "Roll") {
    return "Right Hand Rolled Prints";
  }
  if (selected.hand === "Left" && selected.type === "Palm") {
    return "Left Hand Palm Prints";
  }
  if (selected.hand === "Right" && selected.type === "Palm") {
    return "Right Hand Palm Prints";
  }
  return "";
};

class TenprintVerifyMain extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.showAdjudicator = this.showAdjudicator.bind(this);
    this.showMugshotModal = this.showMugshotModal.bind(this);
  }

  showAdjudicator(data) {
    if (data.match) {
      return this.props.requestShowAdjudicator(data);
    }
  }


  showMugshotModal() {
    const mugshotID = this.props.tenprint.tenprint.probe.mugshot.id;

    // this.props.requestBiometricMugshot({
    //   probeBiometricsId: mugshotID,
    //   matchedBiometricsId: ""
    // });

    this.props.requestScannedImageModal({
      probeBiometricsId: mugshotID,
      matchedBiometricsId: ""
    });
  }



  render() {
    const {
      formatMessage,
      tenprint,
      requestShowAdjudicator,
      showAdjudicatorData,
      matchedRowID,
      SelectedRow,
      selectedMatch,
      ImageData,
      adjudicator,
      requestTogglePaneVisibility
    } = this.props;

    const biometrics = tenprint.tenprint.probe.biometrics;
    let currentPersonIndex =
      matchedRowID && matchedRowID != -1 ? matchedRowID : 0;
    if (currentPersonIndex != SelectedRow) {
      currentPersonIndex = SelectedRow;
    }

    console.log("currentPersonIndex", currentPersonIndex);
    console.log("matchedRowID", matchedRowID);
    console.log("SelectedRow", SelectedRow);

    let Person = null;
    if (
      tenprint.tenprint.matchPersons &&
      tenprint.tenprint.matchPersons.length > 0
    ) {
      Person = tenprint.tenprint.matchPersons[currentPersonIndex].person;
    }

    const selectedHandType = getSelectedHandAndType(tenprint.selected);
    const Fingers = getCurrentFingers(biometrics, selectedHandType);
    const Matches = getCurrentMatches(
      Fingers,
      tenprint.tenprint.fingerprintMatches,
      currentPersonIndex
    );
    const ThreeFingers = findThreeFingers(biometrics);
    const pageTitle = getCurrentPageTitle(selectedHandType);
    const Mugshot = tenprint.tenprint.probe.mugshot;

    console.log("Fingers", Fingers);
    console.log("Matches", Matches);
    console.log("ThreeFingers", ThreeFingers);

    console.log("adjudicator adjudicator", adjudicator);
    return (
      <div className="main-container">
        {!showAdjudicatorData &&
          tenprint.selected != "Mugshot" && (
            <div>
              <div className="probe--title-container">
                <Title
                  is="5"
                  text={
                    formatMessage({ id: "Probe" }) +
                    " : " +
                    formatMessage({ id: pageTitle })
                  }
                />
              </div>

              <div className="columns" id="segmented-section">
                {Fingers.map((finger, index) => {
                  const name = finger.position.match(reg_space);
                  return (
                    <div className="column" key={index}>
                      <div className=" segmented-data-container">
                        {finger.thumbNail && (
                          <Image
                            src={"data:image/png;base64," + finger.thumbNail}
                            onClick={() => {
                              console.log("CLICKED!!!", finger);
                              // this.showAdjudicator({
                              //   position: finger.position,
                              //   data: finger.image,
                              //   match: Matches[currentPersonIndex],
                              //   persons: tenprint.tenprint.matchPersons,
                              //   index: currentPersonIndex,
                              //   imageId: finger.id,
                              //   status: true
                              // });
                            }}
                          />
                        )}
                        {!finger.thumbNail && (
                          <span title={finger.annotationNote}>
                            {finger.annotation}
                          </span>
                        )}
                      </div>

                      <span className="impression-name">
                        {formatMessage({ id: name[1] }) +
                          " " +
                          ` (${name[0].charAt(0)})`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        {Person &&
          Person.name &&
          Matches.length > 0 &&
          !showAdjudicatorData && (
            <div>
              {Person &&
                Person.name && (
                  <div className="probe--title-container">
                    <Title
                      is="5"
                      text={
                        formatMessage({ id: "match" }) +
                        " : " +
                        `${Person.name}`
                      }
                    />
                  </div>
                )}

              <div className="columns" id="segmented-section">
                {Matches.map((finger, index) => {
                  const name = finger.fingerprintPosition.match(reg_space);
                  return (
                    <div className="column" key={index}>
                      <div className=" segmented-data-container">
                        {finger.thumbNail && (
                          <Image
                            src={"data:image/png;base64," + finger.thumbNail}
                            onClick={() => {
                              requestTogglePaneVisibility({
                                pane: "all",
                                visible: false
                              });
                              this.showAdjudicator({
                                position: Fingers[index].position,
                                data: Fingers[index].image,
                                match: finger,
                                persons: tenprint.tenprint.matchPersons,
                                index: currentPersonIndex,
                                imageId: Fingers[index].id,
                                status: true
                              });
                              // console.log("CLICKED!!!");
                            }}
                          />
                        )}
                        {!finger.thumbNail && (
                          <span title={finger.annotationNote}>
                            {finger.annotation}
                          </span>
                        )}
                      </div>

                      <span className="impression-name">
                        {formatMessage({ id: name[1] }) +
                          " " +
                          `(${name[0].charAt(0)})`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        {tenprint.selected === "Mugshot" &&
          Mugshot &&
          !showAdjudicatorData && (
            <div>
              <div className="mugshot--container">
                <div className="probe">
                  <div className="title-container">
                    <Title
                      is="5"
                      text={`Probe: ${formatMessage({ id: "probeMugshot" })}`}
                    />
                  </div>
                  {Mugshot.thumbNail && (
                    <Image src={"data:image/png;base64," + Mugshot.thumbNail} onClick={ this.showMugshotModal } style={{ cursor: "pointer" }} />
                  )}
                </div>

                {Person &&
                  Person.name && (
                    <div className="match">
                      <div className="title-container">
                        <Title is="5" text={`Match: ${Person.name}`} />
                      </div>
                      {tenprint.tenprint.matchPersons[currentPersonIndex]
                        .mugshot &&
                        tenprint.tenprint.matchPersons[currentPersonIndex]
                          .mugshot.thumbNail && (
                          <Image
                            src={
                              "data:image/png;base64," +
                              tenprint.tenprint.matchPersons[currentPersonIndex]
                                .mugshot.thumbNail
                            }
                          />
                        )}
                    </div>
                  )}
              </div>
            </div>
          )}

        {showAdjudicatorData &&
          adjudicator.probe &&
          adjudicator.probe.image &&
          adjudicator.matched &&
          adjudicator.matched.image && (
            <div style={{ minHeight: 600 }}>
              <div className="probe-match-heading">
                <p>
                {formatMessage({ id:"Probe"})} ({adjudicator.matched.fingerprintPosition &&
                    adjudicator.matched.fingerprintPosition
                      .replace(/([A-Z])/g, " $1")
                      .trim()})
                </p>
                <p>
                {formatMessage({ id:"match"})}: ({adjudicator.matched.fingerprintPosition &&
                    adjudicator.matched.fingerprintPosition
                      .replace(/([A-Z])/g, " $1")
                      .trim()})
                </p>
              </div>
              <Adjudicator
                SelectedRow={SelectedRow}
                selectedMatch={adjudicator.matched.image}
                ImageData={adjudicator.probe.image}
              />
            </div>
          )}
      </div>
    );
  }
}

export default withRouter(TenprintVerifyMain);
