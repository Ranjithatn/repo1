import React from 'react';
import TenprintCardScannedContent from '../../Tenprint/TenprintCard/TenprintCardScanned/TenprintCardScannedContent';


class Content extends React.Component {


  constructor() {
    super();
    this.state = {

    };
  }


  render() {

    const {
      cards,
      activeCard,
      formatMessage,
      addRegions,
      toggleAddRegions,
      cardScanWorkflow,
      cardScan,
      annotations,
    } = this.props;
    // console.log("cards, activeCard",cards, activeCard);
    // const image = cards[activeCard].image;

    const scannedImage = cards[activeCard] && cards[activeCard].image;
    const resolution = cards[activeCard] && cards[activeCard].resolution;
    const boxes = cards[activeCard] && cards[activeCard].config.CropRegions;
    const cardConfig = cards[activeCard] && cards[activeCard].config;
    const saveBoxes = this.props.saveBoxes;
    // console.log("::::::RESET:::::::boxes",boxes);

    // console.log("render callled::", cardConfig, boxes);

    return (
      <TenprintCardScannedContent
        key={`${activeCard}-${cardConfig && cardConfig.Page}`}
        // key={ activeCard + cardConfig.Page }
        formatMessage={formatMessage}
        scannedImage={scannedImage}
        resolution={resolution}
        boxes={boxes}
        saveBoxes={saveBoxes}
        cardConfig={cardConfig}
        addRegions={addRegions}
        toggleAddRegions={toggleAddRegions}
        cardScanWorkflow={cardScanWorkflow}
        cardScan={ cardScan }
        annotations={ annotations }
      />
    );

  }



}


export default Content;


/*
      <div className="content">
        <img
          src={image}
          ref={imgElem => (this.image = imgElem)}
          id="cardscan-img"
          className="cardscan-img"
          alt="scanned card"
        />

        <p>I am Content</p>

      </div>



*/
