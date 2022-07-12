import React, { Component } from "react";
import { connect } from "react-redux";

import Button from "components/Button/Button";
import Title from "components/Title/Title";
import Label from "components/Label/Label";
import Select from "components/Select/Select";
import Subtitle from "components/Title/Subtitle";
import { requestStartCardScan, requestFetchScanSources } from "actions/scanner";
import type, { ScanSource } from "actions/scanner";
import { requestInputFieldChanged } from "actions/global";
import {
  cardTypeSelector,
  selectedScanSourceSelector,
  scanResolutionSelector,
  scanSourcesSelector
} from "selectors/jobs";
// import "./CardscanSettings.scss";
import { cardScanWorkflow } from "../../actions/cardScan";
import { settings } from "../../utils/electron";

const cardTypes = [
  // { displayName: "Demo Card", value: "demoCard" },
  { displayName: "Criminal Clearance Card", value: "FORM1" },
  { displayName: "Palm Printing Card", value: "FORM2" },
  { displayName: "Convicted Record", value: "FORM3" },
  { displayName: "Custom Scan [8.5 x 11.69]", value: "Custom" },
];

const latentCardTypes = [
  // { displayName: "Demo Card", value: "demoCard" },
  { displayName: "Custom Scan [8.5 x 11.69]", value: "Custom" },
];


const resolutions = [
  { displayName: "500dpi", value: 500 },
  // { displayName: "100dpi", value: 100 },
  // { displayName: "300dpi", value: 300 },
  // { displayName: "400dpi", value: 400 },
];

if ( process.env.NODE_ENV === "development" ) {
  resolutions.push({ displayName: "100dpi", value: 100 });
}

type Props = {
  scanSources: Array<ScanSource>,
  selectedScanSource: number,
  resolution: number,
  cardType: string,
  requestStartCardScan: () => void,
  requestInputFieldChanged: () => void,
  onCompleted: () => void
};

export class CardscanSettings extends Component<null, Props> {


  componentDidMount() {
    // loads the scan sources into scanSources prop of this component
    this.props.requestFetchScanSources();
  }
  render() {
    const {
      formatMessage,
      requestStartCardScan,
      requestInputFieldChanged,
      cardType: cType,
      resolution,
      selectedScanSource,
      scanSources,
      onCompleted,
      cardScanWorkflow,
    } = this.props;

    let cardType = "";
    if ( cType !== "demoCard" ) { cardType = cType; }

    // console.log("CardscanSettings::props", this.props);
    // console.log("resolution, cardType, selectedScanSource", resolution, cardType, selectedScanSource);
    const _settings = settings();

    return (
      <div className="config-contents">
        <div className="cardscan-config-fields">
          <Label
            text={formatMessage({ id: "label.configurationType" })}
            htmlFor="cardType"
          />
          <Select
            id="cardType"
            // value="demoCard"
            value={ cardType || "" }
            options={ this.props.type && this.props.type === "latent" ? latentCardTypes : cardTypes}
            onChange={e => requestInputFieldChanged(e, "cardScanConfig")}
            formatMessage={formatMessage}
          />
          <br />
          <Label
            text={formatMessage({ id: "label.scannerType" })}
            htmlFor="scannerType"
          />
          <Select
            id="selectedScanSource"
            value={ selectedScanSource ? parseInt(selectedScanSource, 10) : (_settings.defaultScanner || "") }
            options={scanSources}
            formatMessage={formatMessage}
            onChange={e => requestInputFieldChanged(e, "cardScanConfig")}
          />
          <br />
          {/*
          <Label
            text={formatMessage({ id: "label.scanResolution" })}
            htmlFor="resolution"
          />
          <Select
            id="scanResolution"
            options={resolutions}
            onChange={e => requestInputFieldChanged(e, "cardScanConfig")}
            formatMessage={formatMessage}
          />
          <br />
          */}
          <Subtitle is="5" text={formatMessage({ id: "msg.placeCard" })} />

          <div>
          <Button
            className="is-primary is-medium"
            // disabled={(selectedScanSource === undefined && cardType != "demoCard" )}
            disabled={ ! cardType || ! ( selectedScanSource || _settings.defaultScanner ) }
            text={formatMessage({ id: "btn.startScan" })}
            onClick={() => {
              cardScanWorkflow({
                type: "SET_CARD_SCAN_CONFIG",
                data: {
                  Resolution: parseInt(resolution, 10),
                  cardType,
                  selectedScanSource: parseInt(selectedScanSource, 10),
                  onCompleted: () => onCompleted(),
                }
              })
                return requestStartCardScan({
                  Resolution: process.env.NODE_ENV === "development" ? 100 : parseInt(resolution, 10),
                  cardType,
                  selectedScanSource: parseInt(selectedScanSource, 10),
                  onCompleted: () => onCompleted()
                })
              }
            }
            leftIcon="hand-paper-o"
          />


          { this.props.type === "latent" &&
            <Button
              style={{ marginLeft: 15,marginRight:20}}
              className="is-primary is-medium"
              // disabled={(selectedScanSource === undefined && cardType != "demoCard" )}
              disabled={ ! cardType || ! ( selectedScanSource || _settings.defaultScanner ) }
              text={formatMessage({ id: "btn.startScanWithPreview" })}
              onClick={() => {
                cardScanWorkflow({
                  type: "SET_CARD_SCAN_CONFIG",
                  data: {
                    Resolution: parseInt(resolution, 10),
                    cardType,
                    selectedScanSource: parseInt(selectedScanSource, 10),
                    onCompleted: () => onCompleted(),
                    cardScanWithPreview: true,
                  }
                })
                  return requestStartCardScan({
                    Resolution: process.env.NODE_ENV === "development" ? 100 : parseInt(resolution, 10),
                    cardType,
                    selectedScanSource: parseInt(selectedScanSource, 10),
                    onCompleted: () => onCompleted(),
                    cardScanWithPreview: true,
                  })
                }
              }
              leftIcon="hand-paper-o"
            />
          }

          </div>


        </div>
      </div>
    );
  }
}

const mapState = state => ({
  state: state,
  cardType: cardTypeSelector(state),
  resolution: scanResolutionSelector(state),
  selectedScanSource: selectedScanSourceSelector(state),
  scanSources: scanSourcesSelector(state)
});

export default connect(mapState, {
  requestInputFieldChanged,
  requestStartCardScan,
  requestFetchScanSources,
  cardScanWorkflow,
})(CardscanSettings);
