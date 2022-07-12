import { CARD_SCAN_WORKFLOW } from "../actions/actionTypes";
import { fingerprintPositions, fingerprintOptions } from "../utils/constants";



const addOptionsAtTheirPositions = (cardIndex, cards) => {
  let updatedCards = [...cards];
  updatedCards.splice(cardIndex, 1);

  const removeIds = [];
  updatedCards.forEach( card => {
    card.config.CropRegions.forEach( item => {
      removeIds.push(item.Name);
    });
  });

  let allFingerOptions = [...fingerprintOptions]; // fingerprintOptions
  allFingerOptions = allFingerOptions.filter( item => {
    return ! removeIds.includes( item.value );
  });

  return [...allFingerOptions];
}



const initialState = {
  workflow: {
    status: "EMPTY",
    cards: [],
    activeCard: 0,
    previousCardData: {}
  },
  config: {},
  current_scan: {
    path: ""
  },
  segmented: [],
  custom: {
    allOptions: [
      { value: "L. PLAIN LITTLE", displayName: "L. PLAIN LITTLE" },
      { value: "L. PLAIN RING", displayName: "L. PLAIN RING" },
      { value: "L. PLAIN MIDDLE", displayName: "L. PLAIN MIDDLE" },
      { value: "L. PLAIN INDEX", displayName: "L. PLAIN INDEX" },
      { value: "L. PLAIN THUMB", displayName: "L. PLAIN THUMB" },

      { value: "R. PLAIN LITTLE", displayName: "R. PLAIN LITTLE" },
      { value: "R. PLAIN RING", displayName: "R. PLAIN RING" },
      { value: "R. PLAIN MIDDLE", displayName: "R. PLAIN MIDDLE" },
      { value: "R. PLAIN INDEX", displayName: "R. PLAIN INDEX" },
      { value: "R. PLAIN THUMB", displayName: "R. PLAIN THUMB" },

      { value: "R. ROLLED THUMB", displayName: "R. ROLLED THUMB" },
      { value: "R. ROLLED INDEX", displayName: "R. ROLLED INDEX" },
      { value: "R. ROLLED MIDDLE", displayName: "R. ROLLED MIDDLE" },
      { value: "R. ROLLED RING", displayName: "R. ROLLED RING" },
      { value: "R. ROLLED LITTLE", displayName: "R. ROLLED LITTLE" },
      { value: "L. ROLLED THUMB", displayName: "L. ROLLED THUMB" },
      { value: "L. ROLLED INDEX", displayName: "L. ROLLED INDEX" },
      { value: "L. ROLLED MIDDLE", displayName: "L. ROLLED MIDDLE" },
      { value: "L. ROLLED RING", displayName: "L. ROLLED RING" },
      { value: "L. ROLLED LITTLE", displayName: "L. ROLLED LITTLE" },

      { value: "L. SLAP", displayName: "L. SLAP" },
      { value: "R. SLAP", displayName: "R. SLAP" },

      { value: "L. LOWER PALM", displayName: "L. LOWER PALM" },
      { value: "L. WRITER PALM", displayName: "L. WRITER PALM" },
      { value: "R. LOWER PALM", displayName: "R. LOWER PALM" },
      { value: "R. WRITER PALM", displayName: "R. WRITER PALM" },
    ],
    selectedIDS: []
  },
  preview: {
    tab: "",
    data: {
      flat: [],
      rolled: [],
      palm: []
    }
  }
};

export default function cardScan(state = initialState, action = {}) {
  switch (action.type) {
    case CARD_SCAN_WORKFLOW:
      return handleCardScanWorkflow(state, action);

    default:
      return state;
  }
}

const handleCardScanWorkflow = (state, action) => {
  // console.log("handleLiveScanWorkflow", action);
  const type = action.payload.type;
  const data = action.payload.data;

  let workflow = Object.assign({}, state.workflow);

  if (type === "CARD_SCAN_IMAGE") {
    workflow.status = "CARD_SCAN_IMAGE";
    const mutatedData = { ...data };

    if (
      workflow.previousCardData &&
      workflow.previousCardData.config &&
      workflow.previousCardData.config.CropRegions
    ) {
      mutatedData.config["CropRegions"] = [
        ...workflow.previousCardData.config.CropRegions
      ];
      // workflow.previousCardData = {};
    }


    if ( data.type === "FORM2" && data.config.Page === 1 ) {
      workflow.cards.unshift(mutatedData);
    } else if ( data.type === "FORM2" && data.config.Page === 2 ) {
      workflow.cards.push(mutatedData);
    }
    else {
      workflow.cards.push(mutatedData);
    }


    // workflow.cards.push(data);
    return { ...state, workflow };
  }

  if (type === "SET_ACTIVE_CARD") {
    workflow.status = "SET_ACTIVE_CARD";
    workflow.activeCard = data;
    return { ...state, workflow };
  }

  if (type === "SET_CARD_SCAN_CONFIG") {
    workflow.status = "SET_CARD_SCAN_CONFIG";
    workflow.config = data;
    return { ...state, workflow };
  }

  if (type === "CARD_SCAN_INIT") {
    workflow.status = "CARD_SCAN_INIT";
    workflow.current_scan = { ...workflow.current_scan, ...data };
    return { ...state, workflow };
  }

  if (type === "CARD_SCAN_CHANGE_ACTIVE_CARD") {
    workflow.status = "CARD_SCAN_CHANGE_ACTIVE_CARD";
    workflow.activeCard = data;
    // workflow.activeCard = data || workflow.activeCard;
    return { ...state, workflow };
  }

  if (type === "SAVE_CARD_SCAN_BOXES") {
    workflow.status = "SAVE_CARD_SCAN_BOXES";

    const segmented = [...state.segmented];

    if (segmented.length > 0) {
      const itemIndex = segmented.findIndex(item => item.image === data.image);
      if (itemIndex != -1) {
        segmented[itemIndex] = {
          image: data.image,
          data: data.data
        };
      } else {
        segmented.push({
          image: data.image,
          data: data.data
        });
      }

    } else {
      segmented.push({
        image: data.image,
        data: data.data
      });
    }
    // workflow.activeCard = data || workflow.activeCard;
    return { ...state, segmented };
  }

  if (type === "CARD_SCAN_UPDATE_CUSTOM") {
    // console.log("CARD_SCAN_UPDATE_CUSTOM::data", data);
    const custom = Object.assign({}, state.custom, data);
    // allOptions
    // selectedIDS
    return { ...state, custom };
  }

  if (type === "CARD_SCAN_PREVIEW_SET_TAB") {
    let preview = Object.assign({}, state.preview);
    preview.tab = data;
    return { ...state, preview };
  }

  if (type === "CARD_SCAN_PREVIEW_UPDATE_DATA") {
    let preview = Object.assign({}, state.preview);
    preview.data = { ...preview.data, ...data };
    return { ...state, preview };
  }

  if (type === "CARD_SCAN_DELETE_CARD") {
    // console.log("CARD_SCAN_DELETE_CARD payload, state",action.payload, state);
    const cardIndex = action.payload.cardIndex;

    workflow.status = "CARD_SCAN_DELETE_CARD";

    const updatedWorkflow = { ...workflow };
    const updatedCards = updatedWorkflow.cards.filter(
      (item, index) => index !== cardIndex
    );

    updatedWorkflow.cards = updatedCards;
    // updatedWorkflow.previousCardData = { ...data, image: "" };
    updatedWorkflow.activeCard = updatedCards.length - 1;

    const segmented = [ ...state.segmented ];
    const updatedSegmented = segmented.filter( (item, index) => index !== cardIndex);

    // const optionsToAdd = action.payload.data.config.CropRegions.map( item => {
    //   return { value: item.Name, displayName: item.Name };
    // });
    // console.log("optionsToAdd",optionsToAdd);

    // const userOptions = [ ...state.custom.allOptions, ...optionsToAdd ];
    const userOptions = addOptionsAtTheirPositions(cardIndex, state.workflow.cards);
    // console.log("userOptions",userOptions);
    const custom = { ...state.custom, allOptions: userOptions };
    // console.log("custom",custom);

    return {...state, workflow: updatedWorkflow, segmented: updatedSegmented, custom: custom }
  }

  if (type === "RESET_DELETED_CARD_DATA") {
    workflow.status = "RESET_DELETED_CARD_DATA";
    workflow.previousCardData = {};
    return { ...state, workflow };
  }

  if (type === "RESET") {
    // console.log("RESETTING CARD SCAN STATE");
    const output = {
      workflow: {
        status: "RESET",
        cards: [],
        activeCard: 0,
        previousCardData: {}
      },
      config: {},
      current_scan: {
        path: ""
      },
      segmented: [],
      custom: {
        allOptions: [
          { value: "L. PLAIN LITTLE", displayName: "L. PLAIN LITTLE" },
          { value: "L. PLAIN RING", displayName: "L. PLAIN RING" },
          { value: "L. PLAIN MIDDLE", displayName: "L. PLAIN MIDDLE" },
          { value: "L. PLAIN INDEX", displayName: "L. PLAIN INDEX" },
          { value: "L. PLAIN THUMB", displayName: "L. PLAIN THUMB" },

          { value: "R. PLAIN LITTLE", displayName: "R. PLAIN LITTLE" },
          { value: "R. PLAIN RING", displayName: "R. PLAIN RING" },
          { value: "R. PLAIN MIDDLE", displayName: "R. PLAIN MIDDLE" },
          { value: "R. PLAIN INDEX", displayName: "R. PLAIN INDEX" },
          { value: "R. PLAIN THUMB", displayName: "R. PLAIN THUMB" },

          { value: "R. ROLLED THUMB", displayName: "R. ROLLED THUMB" },
          { value: "R. ROLLED INDEX", displayName: "R. ROLLED INDEX" },
          { value: "R. ROLLED MIDDLE", displayName: "R. ROLLED MIDDLE" },
          { value: "R. ROLLED RING", displayName: "R. ROLLED RING" },
          { value: "R. ROLLED LITTLE", displayName: "R. ROLLED LITTLE" },
          { value: "L. ROLLED THUMB", displayName: "L. ROLLED THUMB" },
          { value: "L. ROLLED INDEX", displayName: "L. ROLLED INDEX" },
          { value: "L. ROLLED MIDDLE", displayName: "L. ROLLED MIDDLE" },
          { value: "L. ROLLED RING", displayName: "L. ROLLED RING" },
          { value: "L. ROLLED LITTLE", displayName: "L. ROLLED LITTLE" },

          { value: "L. SLAP", displayName: "L. SLAP" },
          { value: "R. SLAP", displayName: "R. SLAP" },

          { value: "L. LOWER PALM", displayName: "L. LOWER PALM" },
          { value: "L. WRITER PALM", displayName: "L. WRITER PALM" },
          { value: "R. LOWER PALM", displayName: "R. LOWER PALM" },
          { value: "R. WRITER PALM", displayName: "R. WRITER PALM" },
        ],
        selectedIDS: []
      },
      preview: {
        tab: "",
        data: {
          flat: [],
          rolled: [],
          palm: []
        }
      }
    };

    return output;
  }

  return state;
};
