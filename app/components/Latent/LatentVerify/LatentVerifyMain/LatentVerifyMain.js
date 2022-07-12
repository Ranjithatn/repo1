import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import cardImg from "../../../../images/white.png";
import Image from "../../../Image/Image";
import Button from "../../../Button/Button";
import Title from "../../../Title/Title";
import Adjudicator from "../../../Adjudicator";
import { addLocaleData } from "react-intl";
import {reg_space} from "../../../../utils/regEx"



const generateEmptyMatch = (data) => {
  // console.log("generateEmptyMatch::data",data);
  if ( data.fingers.length > 0 ) {
  return {
    ...data.fingers[0],
    thumbNail: "",
    na: true,
  };
  } else {
    return {};
  }
}



export function LatentVerifyMain({
  formatMessage,
  history,
  LeftFingers,
  RightFingers,
  SelectedHandInfo,
  MatchInfos,
  showAdjudicatorData,
  LeftMatches,
  RightMatches,
  SelectedRow,
  selectedMatch,
  ImageData,
  requestShowAdjudicator,
  PersonInfos,
  jobType,
  actionType,
  requestTogglePaneVisibility,
  panes,
  latentProbeData,
  // adjudicatorPassImageData
}) {

  console.log("LatentVerifyMain::LeftFingers",LeftFingers);
  console.log("LatentVerifyMain::RightFingers",RightFingers);

  console.log("LatentVerifyMain::LeftMatches",LeftMatches);
  console.log("LatentVerifyMain::RightMatches",RightMatches);
  console.log("XYZ:::::latentProbeData",latentProbeData);
  console.log("LatentVerifyMain::SelectedHandInfo",SelectedHandInfo);
  console.log("LatentVerifyMain::MatchInfos",MatchInfos);
  console.log("SelectedRow",SelectedRow);
  console.log("jobType",jobType);
  console.log("panes",panes);
  console.log("actionType", actionType);






// if ( SelectedRow === 0 ) {

//   if (SelectedHandInfo.position === "Left" && LeftMatches.fingers.length > 0 ) {
//     SelectedRow = {
//       MatchID: index,
//       position: SelectedHandInfo.position,
//       Results: LeftMatches.fingers,
//       SelectedRow: index
//     };
//   } else if (SelectedHandInfo.position === "Right" || RightMatches.fingers.length  > 0 ) {
//     SelectedRow = {
//       MatchID: index,
//       position: SelectedHandInfo.position,
//       Results: RightMatches.fingers,
//       SelectedRow: index
//     };
//   }

// }

// console.log("DHRUV SelectedRow", SelectedRow)




  if ( SelectedHandInfo.position === "Left" ) {
    if ( LeftMatches.fingers.length === 0 ) {
      const emptyMatch = generateEmptyMatch(LeftFingers);
      // console.log("emptyMatch",emptyMatch);
      LeftMatches.fingers.push(emptyMatch);
    }
  } else {
    if ( RightMatches.fingers.length === 0 ) {
      const emptyMatch = generateEmptyMatch(RightFingers);
      // console.log("emptyMatch",emptyMatch);
      RightMatches.fingers.push(emptyMatch);
    }
  }

  // console.log("--------------");

  // console.log("LatentVerifyMain::LeftMatches",LeftMatches);
  // console.log("LatentVerifyMain::RightMatches",RightMatches);
  // console.log("LatentVerifyMain::MatchInfos",MatchInfos);
  // console.log("LatentVerifyMain::SelectedHandInfo",SelectedHandInfo);
  // MatchInfos.Results



  return (
    <Fragment>
      <div className={showAdjudicatorData ? "hide" : "main-container "}>
        <div className="title-container">
          <Title is="5" text={formatMessage({ id: "probefinger" })} />
        </div>
        <div className="columns" id="segmented-section">
          {SelectedHandInfo.fingers === undefined
            ? LeftFingers.fingers && LeftFingers.fingers.length > 0 && LeftFingers.fingers && Array.isArray(LeftFingers.fingers) && LeftFingers.fingers.map((selecteddata, i) => {
                return (
                  <div className="column ">
                    <div className=" segmented-data-container">
                      <Image
                        src={"data:image/png;base64," + selecteddata.thumbNail}
                        // onClick={() => {

                        //   if (PersonInfos.length !== 0) {
                        //     requestTogglePaneVisibility({ pane: 'all', visible: false });
                        //     return requestShowAdjudicator({
                        //       position: selecteddata.position,
                        //       data: selecteddata.thumbNail,
                        //       match: LeftMatches.fingers[i],
                        //       imageId:selecteddata.id,
                        //       index: i,
                        //       status: true
                        //     });
                        //   }
                        // }}
                      />
                    </div>
                    <span className="impression-name">
                      {selecteddata.position === "LeftRing" &&
                      jobType === "Latent" ? (
                        <span>{formatMessage({ id: "Unknown" })}</span>
                      ) : (
                        formatMessage({ id: selecteddata.position })
                      )}
                      {/* {selecteddata.position
                        .match(reg_space)
                        .join(" ")} */}
                    </span>
                  </div>
                );
              })
            : SelectedHandInfo.fingers.fingers && Array.isArray(SelectedHandInfo.fingers.fingers) && SelectedHandInfo.fingers.fingers.map((selecteddata, i) => {
                return (
                  <div className="column">
                    <div className=" segmented-data-container">
                      <Image
                        src={"data:image/png;base64," + selecteddata.thumbNail}
                      />
                    </div>
                    <span className="impression-name">
                      {selecteddata.position === "LeftRing" &&
                      jobType === "Latent" ? (
                        <span>{formatMessage({ id: "Unknown" })}</span>
                      ) : (
                        selecteddata.position
                      )}
                      {/* {selecteddata.position
                        .match(reg_space)
                        .join(" ")} */}
                    </span>
                  </div>
                );
              })}


        { SelectedHandInfo.fingers === undefined && LeftFingers.fingers.length === 0 &&

            latentProbeData && Array.isArray(latentProbeData) && latentProbeData.map((selecteddata, i) => {
              return (
                <div className="column ">
                  <div className=" segmented-data-container">
                    <Image
                      src={"data:image/png;base64," + selecteddata.thumbNail}
                      // onClick={() => {

                      //   if (PersonInfos.length !== 0) {
                      //     requestTogglePaneVisibility({ pane: 'all', visible: false });
                      //     return requestShowAdjudicator({
                      //       position: selecteddata.position,
                      //       data: selecteddata.thumbNail,
                      //       match: LeftMatches.fingers[i],
                      //       imageId:selecteddata.id,
                      //       index: i,
                      //       status: true
                      //     });
                      //   }
                      // }}
                    />
                  </div>
                  <span className="impression-name">
                    {selecteddata.position === "LeftRing" &&
                    jobType === "Latent" ? (
                      <span>{formatMessage({ id: "Unknown" })}</span>
                    ) : (
                      formatMessage({ id: selecteddata.position })
                    )}
                    {/* {selecteddata.position
                      .match(reg_space)
                      .join(" ")} */}
                  </span>
                </div>
              );
            })
        }

        </div>





        {PersonInfos.length !== 0 ? (
          <div className="title-container">
            <Title is="5" text={formatMessage({ id: "matchfinger" })} />
          </div>
        ) : (
          ""
        )}
        <div className="columns" id="segmented-section">

          {MatchInfos !== undefined && MatchInfos.Results.length !== 0
            ? MatchInfos.Results && Array.isArray(MatchInfos.Results) && MatchInfos.Results.map((name, i) => {
                // console.log(name[0], "name[0]");
                // console.log("name[0]",name[0]);
                const matchedData = name[0];
                // console.log("matchedData 1",matchedData);
                if ( name && name[0] && matchedData ) {
                return (
                  <div className="column">
                    <div className="segmented-data-container">
                      <Image
                        style={{ cursor: "pointer" }}
                        src={"data:image/png;base64," + ( matchedData.thumbNail || matchedData.image )}
                        onClick={() => {
                          // console.log("clicked...");

                          if (PersonInfos.length !== 0) {
                            requestTogglePaneVisibility({
                              pane: "all",
                              visible: false
                            });
                            return requestShowAdjudicator({
                              position: LeftFingers.fingers[i].position,
                              data: LeftFingers.fingers[i].thumbNail,
                              match: LeftMatches.fingers &&  LeftMatches.fingers.length > 0 ?  LeftMatches.fingers[i] : RightMatches.fingers[i],
                              imageId: LeftFingers.fingers[i].id,
                              index: i,
                              status: true
                            });
                          }
                        }}
                      />
                    </div>
                    <span className="impression-name">
                      {matchedData.fingerprintPosition === "LeftRing" &&
                      jobType === "Latent" ? (
                        <span>{formatMessage({ id: "Unknown" })}</span>
                      ) : (
                        formatMessage({ id: matchedData.fingerprintPosition })
                      )}
                      {/* {name[0].fingerprintPosition.match(reg_space).join(" ")} */}
                    </span>
                  </div>
                );
              } else {

                    return (
                      <div className="column">
                        { console.log("NA 1") }
                        <div className="segmented-data-container" style={{ display: "flex", justifyContent: "center" }}>
                          <span className="not-allowed">NA</span>
                        </div>
                      </div>
                    )


              }
              })
            : SelectedHandInfo.position === "Left" && PersonInfos.length !== 0
              && Object.keys(LeftMatches.fingers[0]).length!==0?LeftMatches.fingers && Array.isArray(LeftMatches.fingers) && LeftMatches.fingers.map((name, i) => {

                console.log("LeftMatches.fingers.name", name, i);

                const matchedData = name[0];
                console.log("--- matchedData", matchedData);
                console.log("matchedData 2",name);

                console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXname, i",name, i, Object.keys(LeftMatches.fingers[0]));
                if ( matchedData && ( matchedData.thumbNail || matchedData.image ) ) {
                  return (
                    <div className="column">
                      <div className="segmented-data-container --lm" style={{cursor:"pointer"}}>
                        <Image
                          style={{ cursor: "pointer" }}
                          src={"data:image/png;base64," + (matchedData.thumbNail || matchedData.image) }
                           onClick={() => {
                            // console.log("clicked...");

                            if (PersonInfos.length !== 0) {
                              requestTogglePaneVisibility({
                                pane: "all",
                                visible: false
                              });
                              return requestShowAdjudicator({
                                position: LeftFingers.fingers[i].position,
                                data: LeftFingers.fingers[i].thumbNail,
                                match: LeftMatches.fingers[i],
                                imageId: LeftFingers.fingers[i].id,
                                index: i,
                                status: true
                              });
                            }
                          }}
                        />
                      </div>
                      <span className="impression-name">
                        {name[0].fingerprintPosition === "LeftRing" &&
                        jobType === "Latent" ? (
                          <span>{formatMessage({ id: "Unknown" })}</span>
                        ) : (
                          <span>
                            {formatMessage({ id: name[0].fingerprintPosition })}
                          </span>                          
                        )}
                        {/* {name[0].fingerprintPosition.match(reg_space).join(" ")} */}
                      </span>
                    </div>
                  )
                } else {

                    return (
                      <div className="column">
                        { console.log("NA 2") }
                        <div className="segmented-data-container" style={{ display: "flex", justifyContent: "center" }}>
                          <span className="not-allowed">NA</span>
                        </div>
                      </div>
                    )
                }

                // if ( ! name.thumbNail || ! name[0] && name[0].thumbNail ) {
                //     return (
                //       <div className="column">
                //         <div className="segmented-data-container" style={{ display: "flex", justifyContent: "center" }}>
                //           <span className="not-allowed">NA</span>
                //         </div>
                //       </div>
                //     )
                // }


                })
              : RightMatches && PersonInfos.length !== 0
                ? RightMatches.fingers.map((name, i) => {

                  const matchedData = name[0];
                  // console.log("matchedData 3",matchedData);

                  if ( matchedData && (matchedData.thumbNail || matchedData.image) ) {

                    return (
                      <div className="column">
                        <div className="segmented-data-container">
                          <Image
                            style={{ cursor: "pointer" }}
                            src={"data:image/png;base64," + (matchedData.thumbNail || matchedData.image) }
                            onClick={() => {

                              if (PersonInfos.length !== 0) {
                                requestTogglePaneVisibility({
                                  pane: "all",
                                  visible: false
                                });
                                return requestShowAdjudicator({
                                  position: RightFingers.fingers[i].position,
                                  data: RightFingers.fingers[i].thumbNail,
                                  match: RightMatches.fingers[i],
                                  imageId: RightFingers.fingers[i].id,
                                  index: i,
                                  status: true
                                });
                              }
                            }}
                          />
                        </div>
                        <span className="impression-name">
                          {name[0].fingerprintPosition === "LeftRing" &&
                          jobType === "Latent" ? (
                            <span>{formatMessage({ id: "Unknown" })}</span>
                          ) : (
                            name[0].fingerprintPosition
                          )}
                          {/* {name[0].fingerprintPosition.match(reg_space).join(" ")} */}
                        </span>
                      </div>
                    )
                  } else {

                    return (
                      <div className="column">
                        { console.log("NA 3") }
                        <div className="segmented-data-container" style={{ display: "flex", justifyContent: "center" }}>
                          <span className="not-allowed">NA</span>
                        </div>
                      </div>
                    )

                  }

                  // if ( matchedData && ( ! matchedData.thumbNail && ! matchedData.image ) ) {
                  //   return (
                  //     <div className="column">
                  //       <div className="segmented-data-container" style={{ display: "flex", justifyContent: "center" }}>
                  //         <span className="not-allowed">NA</span>
                  //       </div>
                  //     </div>
                  //   )
                  // }





                  })
                : ""}
        </div>
      </div>

      <div
        className={"adjudicatordiv " + (showAdjudicatorData ? "show" : "hide")}
      >

        {ImageData ? (
          <Adjudicator
            SelectedRow={SelectedRow}
            selectedMatch={
              selectedMatch
                ? selectedMatch[0]
                  ? selectedMatch[0].thumbNail
                  : ImageData
                : ImageData
            }
            ImageData={ImageData ? ImageData : ""}
          />
        ) : (
          ""
        )}
      </div>
      {PersonInfos.length !== 0 && panes.table ? (
        <div className="tenprint-hit-bar">
          &nbsp;&nbsp;&nbsp;
          <div className="tenprint-left">
            <Title is="5" text={formatMessage({ id: "matches" })} />
          </div>
          <div className="tenprint-right" />
        </div>
      ) : (
        ""
      )}
    </Fragment>
  );
}
export default withRouter(LatentVerifyMain);
