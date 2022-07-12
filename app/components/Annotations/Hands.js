import React from "react";
import connect from "react-redux";

import Region from "components/Annotations/Region";

export default function Hands({
  selectedRegion,
  setAnnotationRegion,
  annotations,
  palm
}) {
  function isAnnotated(annotations, regionId) {
    // console.log("isAnnotated::annotations, regionId", annotations, regionId);
    // console.log("isAnnotated::annotations[regionId]",annotations[regionId]);
    // console.log("isAnnotated::selectedRegion",selectedRegion);
    if ( annotations[regionId] && annotations[regionId].reason == "NotAnnotated" && regionId !== selectedRegion ) {
      return false;
    }

    return annotations[regionId] && annotations[regionId]["isSaved"];

  }

  // console.log("Hands::annotations",annotations);

  return (
    <div className="hands" dir="ltr">
      <div id="Left-Hand">
        <div className="fingers-container">
          <Region
            id="left-little"
            isAnnotated={isAnnotated(annotations, "left-little")}
            selectedRegion={selectedRegion}
            onClick={ e => {
              if ( palm ) { return; }
              setAnnotationRegion(e.target.id, 0)
            }}
            // onClick={e => setAnnotationRegion(e.target.id, 0)}
          />
          <Region
            id="left-ring"
            selectedRegion={selectedRegion}
            isAnnotated={isAnnotated(annotations, "left-ring")}
            onClick={ e => {
              if ( palm ) { return; }
              setAnnotationRegion(e.target.id, 1)
            }}
            // onClick={e => setAnnotationRegion(e.target.id, 1)}
          />
          <Region
            id="left-middle"
            selectedRegion={selectedRegion}
            isAnnotated={isAnnotated(annotations, "left-middle")}
            onClick={ e => {
              if ( palm ) { return; }
              setAnnotationRegion(e.target.id, 2)
            }}
            // onClick={e => setAnnotationRegion(e.target.id, 2)}
          />
          <Region
            id="left-index"
            selectedRegion={selectedRegion}
            isAnnotated={isAnnotated(annotations, "left-index")}
            onClick={ e => {
              if ( palm ) { return; }
              setAnnotationRegion(e.target.id, 3)
            }}
            // onClick={e => setAnnotationRegion(e.target.id, 3)}
          />
        </div>
        <div className="writer-palm-container">
          <Region
            id="left-writer-palm"
            selectedRegion={selectedRegion}
            isAnnotated={isAnnotated(annotations, "left-writer-palm")}
            onClick={e => setAnnotationRegion(e.target.id, 24)}
          />
        </div>
        {/*
        <div className="upper-palm-container">
          <Region
            id="left-upper-palm"
            selectedRegion={selectedRegion}
            isAnnotated={isAnnotated(annotations, "left-upper-palm")}
            onClick={e => setAnnotationRegion(e.target.id, 28)}
          />
        </div>
        */}
        <div className="lower-palm-container">
          <Region
            id="left-lower-palm"
            selectedRegion={selectedRegion}
            isAnnotated={isAnnotated(annotations, "left-lower-palm")}
            onClick={e => setAnnotationRegion(e.target.id, 27)}
          />
        </div>
        <div className="thumb-container">
          <Region
            id="left-thumb"
            selectedRegion={selectedRegion}
            isAnnotated={isAnnotated(annotations, "left-thumb")}
            onClick={ e => {
              if ( palm ) { return; }
              setAnnotationRegion(e.target.id, 4)
            }}
            // onClick={e => setAnnotationRegion(e.target.id, 4)}
          />
        </div>
      </div>
      <div id="Right-Hand">
        <div className="thumb-container">
          <Region
            id="right-thumb"
            selectedRegion={selectedRegion}
            isAnnotated={isAnnotated(annotations, "right-thumb")}
            onClick={ e => {
              if ( palm ) { return; }
              setAnnotationRegion(e.target.id, 5)
            }}
            // onClick={e => setAnnotationRegion(e.target.id, 5)}
          />
        </div>
        <div className="fingers-container">
          <Region
            id="right-index"
            selectedRegion={selectedRegion}
            isAnnotated={isAnnotated(annotations, "right-index")}
            onClick={ e => {
              if ( palm ) { return; }
              setAnnotationRegion(e.target.id, 6)
            }}
            // onClick={e => setAnnotationRegion(e.target.id, 6)}
          />
          <Region
            id="right-middle"
            selectedRegion={selectedRegion}
            isAnnotated={isAnnotated(annotations, "right-middle")}
            onClick={ e => {
              if ( palm ) { return; }
              setAnnotationRegion(e.target.id, 7)
            }}
            // onClick={e => setAnnotationRegion(e.target.id, 7)}
          />
          <Region
            id="right-ring"
            selectedRegion={selectedRegion}
            isAnnotated={isAnnotated(annotations, "right-ring")}
            onClick={ e => {
              if ( palm ) { return; }
              setAnnotationRegion(e.target.id, 8)
            }}
            // onClick={e => setAnnotationRegion(e.target.id, 8)}
          />
          <Region
            id="right-little"
            selectedRegion={selectedRegion}
            isAnnotated={isAnnotated(annotations, "right-little")}
            onClick={ e => {
              if ( palm ) { return; }
              setAnnotationRegion(e.target.id, 9)
            }}
            // onClick={e => setAnnotationRegion(e.target.id, 9)}
          />
        </div>
        <div className="writer-palm-container">
          <Region
            id="right-writer-palm"
            selectedRegion={selectedRegion}
            isAnnotated={isAnnotated(annotations, "right-writer-palm")}
            onClick={e => setAnnotationRegion(e.target.id, 22)}
          />
        </div>
        {/*
        <div className="upper-palm-container">
          <Region
            id="right-upper-palm"
            isAnnotated={isAnnotated(annotations, "right-upper-palm")}
            selectedRegion={selectedRegion}
            onClick={e => setAnnotationRegion(e.target.id, 26)}
          />
        </div>
        */}
        <div className="lower-palm-container">
          <Region
            id="right-lower-palm"
            selectedRegion={selectedRegion}
            isAnnotated={isAnnotated(annotations, "right-lower-palm")}
            onClick={e => setAnnotationRegion(e.target.id, 25)}
          />
        </div>
      </div>
    </div>
  );
}
