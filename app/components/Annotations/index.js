import React, { Component } from "react";
import { connect } from "react-redux";

import Reason from "components/Annotations/Reason";
import Hands from "components/Annotations/Hands";
import Button from "components/Button/Button";

import { requestSaveAnnotations } from "actions/jobs";
import { cardScanAnnotationsSelector, palmScanAnnotationsSelector } from "selectors/jobs";
import { requestInputFieldChanged } from "actions/global";
import Subtitle from "components/Title/Subtitle";
import Title from "components/Title/Title";
import Textarea from "components/Textarea/Textarea";
import Label from "components/Label/Label";
import * as LivescanAPI from "hardwareSDK/biocoreSdk/livescan"
import "./Annotations.scss";
import { AnnotationReasons } from "hardwareSDK/biocoreSdk/annotations";

const reasons = [
  {
    value: "NotAnnotated",
    displayName: "notAnnotated"
  },
  {
    value: "OtherReason",
    displayName: "otherReason"
  },
  {
    value: "Handicapped",
    displayName: "handicapped"
  },
  {
    value: "UnableToAcquire",
    displayName: "unableToAcquire"
  },
  {
    value: "PermanentMissing",
    displayName: "permanentMissing"
  }
];

class Annotations extends Component {
  state = {
    selectedRegion: undefined,
    // selectedReason: "NotAnnotated",
    selectedReason: "",
    annotatedRegions: {}
  };

  constructor(props) {
    super(props);
    this.state.annotatedRegions = this.props.annotations || {};
    this.setAnnotationRegion = this.setAnnotationRegion.bind(this);
    this.setAnnotationValueForRegion = this.setAnnotationValueForRegion.bind(
      this
    );
    this.saveAnnotations = this.saveAnnotations.bind(this);
    this.sendAnnotationsToBiocore = this.sendAnnotationsToBiocore.bind(this);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleMouseClickOutside = this.handleMouseClickOutside.bind(this);
  }



  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleMouseClickOutside(event) {
    // console.log("handleMouseClickOutside", this.wrapperRef, event);
    if ( this.wrapperRef && ! this.wrapperRef.contains(event.target) && ! this.state.note ) {
      this.setState({ selectedRegion: undefined, selectedReason: "NotAnnotated" });
    }
  }


  componentDidUpdate(prevProps, prevState) {
    // console.log("CardScanAnnotation::SidebarAnnotations::componentDidUpdate state", this.state, prevState);
    // console.log("CardScanAnnotation::SidebarAnnotations::componentDidUpdate props", this.props, prevProps);
    // console.log("this.props.annotations",this.props.annotations);
    // console.log("prevState.annotatedRegions",prevState.annotatedRegions);
    // console.log("palmScanAnnotations", this.props.palmScanAnnotations);

    if ( this.props.palm && ( Object.keys(this.props.palmScanAnnotations).length !== Object.keys(prevProps.palmScanAnnotations).length ) ) {
      // console.log("Updating Annotation component for palmScanAnnotations");
      this.setState({ annotatedRegions: this.props.palmScanAnnotations });
    }


    // console.log("Object.keys(prevState.annotatedRegions)",Object.keys(prevState.annotatedRegions).length );
    // console.log("Object.keys(this.props.annotations)",Object.keys(this.props.annotations).length );


    // if ( Object.keys(this.props.annotations).length !== 0 && Object.keys(prevState.annotatedRegions).length !== Object.keys(this.props.annotations).length ) {
    //   console.log("updating Annotations component state");
    //   this.setState({ annotatedRegions: this.props.annotations });
    // }


    if ( this.state.selectedRegion ) {
      window.addEventListener("mousedown", this.handleMouseClickOutside, false);
    } else {
      window.removeEventListener("mousedown", this.handleMouseClickOutside, false);
    }


    // if ( Object.keys(prevState.annotatedRegions).length !== Object.keys(this.props.annotations).length ) {
    //   console.log("updating Annotations component state");
    //   this.setState({ annotatedRegions: this.props.annotations });
    // }


  }

  componentWillUnmount() {
    // console.log("CardScanAnnotation::SidebarAnnotations::componentWillUnmount");
    window.removeEventListener("mousedown", this.handleMouseClickOutside, false);
    // if ( this.state.selectedRegion ) {
    //   window.removeEventListener("mousedown", this.handleMouseClickOutside, false);
    // }
  }




  setAnnotationValueForRegion(region, field, value) {
    if (!region) return;
    let newState;
    if (field === "reason") {
      newState = {
        selectedReason: value,
        annotatedRegions: {
          ...this.state.annotatedRegions,
          [region]: {
            ...this.state.annotatedRegions[region],
            [field]: value
          }
        }
      };
    } else {
      newState = {
        annotatedRegions: {
          ...this.state.annotatedRegions,
          [region]: {
            ...this.state.annotatedRegions[region],
            [field]: value
          }
        }
      };
    }
    this.setState({
      ...newState
    });
  }

  async sendAnnotationsToBiocore(annotations) {
    const data = {
      Annotations: {
        Annotation: []
      }
    }
    Object.entries(annotations).forEach(a => {
      const obj = a[1];
      const temp = {
        Reason: AnnotationReasons[obj.reason],
        Info: obj.note,
        Modality: 4,
        Position: obj.position
      }
      data.Annotations.Annotation.push(temp);
    })
    try {
      await LivescanAPI.setAnnotations(data); //call API
      // console.log("-------- successfully saved");
    } catch(e) {
      console.error("----- failed to set annotations:", e);
    }
  }

  saveAnnotations() {
    const { useBiocore } = this.props;
    const { reducerArea } = this.props;
    let newState = { ...this.state.annotatedRegions };

    // console.log("saveAnnotations :: useBiocore, reducerArea, newState",useBiocore, reducerArea, newState);

    // console.log("saveAnnotations::this.state", this.state);
    // console.log("saveAnnotations::this.props", this.props);

    for (let key in newState) {
      if (!newState[key].isSaved && key !== this.state.selectedRegion) {
        delete newState[key];
      }
    }
    if (useBiocore) {
      this.sendAnnotationsToBiocore(newState);
    }

    let selectedReset = {};
    if ( this.state.selectedReason === "NotAnnotated" ) {
      selectedReset.selectedReason = undefined;
      selectedReset.selectedRegion = undefined;
    }


    this.setState(
      {
        annotatedRegions: {
          ...newState,
          [this.state.selectedRegion]: {
            ...newState[this.state.selectedRegion],
            isSaved: true
          }
        },
        ...selectedReset
      },
      () => {
        this.props.requestSaveAnnotations(
          this.state.annotatedRegions,
          this.props.reducerArea
        );
      }
    );


    this.setState({ selectedRegion: undefined, selectedReason: "NotAnnotated" });

  }

  setAnnotationRegion(regionName, regionId) {
    // console.log("setAnnotationRegion :: regionName, regionId",regionName, regionId);
    // if (!evt.target.id.length) return;
    let newState;
    let resetUnsavedAnnotatedRegions = this.resetUnsavedAnnotatedRegions(
      this.state.annotatedRegions
    );
    if (!this.state.annotatedRegions[regionName]) {
      //initialize reason and note if new region selected
      newState = {
        selectedReason: "0",
        selectedRegion:
          regionName === this.state.selectedRegion
            ? undefined
            : regionName,
        annotatedRegions: {
          ...resetUnsavedAnnotatedRegions,
          [regionName]: {
            reason: "0",
            note: "",
            isSaved: false,
            position: regionId
          }
        }
      };
    } else {
      newState = {
        selectedReason: "0",
        selectedRegion:
          regionName === this.state.selectedRegion //selecting same region will unselect
            ? undefined
            : regionName,
        annotatedRegions: resetUnsavedAnnotatedRegions
      };
    }
    this.setState({
      ...newState
    });
  }

  resetUnsavedAnnotatedRegions(annotatedRegions) {
    let regions = { ...this.state.annotatedRegions };
    for (let key in regions) {
      if (!regions[key].isSaved) {
        (regions[key].reason = "0"), (regions[key].note = "");
      }
    }
    return regions;
  }

  render() {
    // console.log("Annotation::this.state", this.state);

    const { formatMessage, palm } = this.props;
    const { selectedRegion, annotatedRegions, selectedReason } = this.state;
    const annotations =
      (selectedRegion && annotatedRegions[selectedRegion]) || "";
    const reason =
      (selectedRegion && annotatedRegions[selectedRegion]["reason"]) ||
      selectedReason ||
      "notAnnotated";
    const note =
      (selectedRegion && annotatedRegions[selectedRegion]["note"]) || "";

    return (
      <div id="Annotations" ref={ (node) => { this.setWrapperRef(node) } }>
        <Title is="6" text={formatMessage({ id: "annotation" })} />
        <Subtitle is="7" text={formatMessage({ id: "selectFingers" })} />
        <Hands
          selectedRegion={selectedRegion}
          annotations={annotatedRegions}
          setAnnotationRegion={this.setAnnotationRegion}
          palm={palm}
        />
        <Reason
          formatMessage={formatMessage}
          selectedRegion={selectedRegion}
          selectedReason={reason}
          reasons={reasons}
          onChange={e =>
            this.setAnnotationValueForRegion(
              selectedRegion,
              "reason",
              e.target.value
            )
          }
        />
        <div className="note">
          <Label text={formatMessage({ id: "notes" })} />
          <Textarea
            rows="3"
            value={note}
            onChange={e =>
              this.setAnnotationValueForRegion(
                selectedRegion,
                "note",
                e.target.value
              )
            }
          />
        </div>
        <Button
          className="is-primary "
          text={formatMessage({ id: "save" })}
          disabled={ ! selectedRegion || ! selectedReason }
          onClick={this.saveAnnotations}
        />
      </div>
    );
  }
}

const mapState = state => ({
  annotations: cardScanAnnotationsSelector(state),
  palmScanAnnotations: palmScanAnnotationsSelector(state),
});

export default connect(mapState, {
  requestSaveAnnotations
})(Annotations);
