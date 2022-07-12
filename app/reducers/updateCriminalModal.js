import {
  RECEIVE_INPUT_FIELD_CHANGED,
  REQUEST_SET_NEW_CRIME_TYPE_SUCCESS,
  REQUEST_DELETE_NEW_CRIME_DATA,
  REQUEST_RESET_CRIME_DATA,
  REQUEST_STORE_LINK_DATA,
  REQUEST_RESET_LINK_DATA
} from "../actions/actionTypes";
import { requestStoreLinkData } from "../actions/tenprint";

const initialState = {
  addCrimeData: {
    CaseType: "",
    Description: ""
  },

  addedCrimeData: [],
  linkData: {
    latentId: undefined,
    bioId: ""
  }
};

export default function updateCriminalModal(state = initialState, action = {}) {
  switch (action.type) {
    case RECEIVE_INPUT_FIELD_CHANGED:
      const { area, field, value } = action.payload;
      const reg_alphanumric = /^[a-zA-Z0-9_ ]*$/;
      if (action.payload.area === "addCrimeType") {
        return {
          ...state,
          addCrimeData: {
            ...state.addCrimeData,
            [field]: reg_alphanumric.test(value) ? value : addCrimeData[field]
          }
        };
      } else {
        return state;
      }

    case REQUEST_SET_NEW_CRIME_TYPE_SUCCESS:
      let data = [...state.addedCrimeData];
      data.push(action.payload);
      return {
        ...state,
        addedCrimeData: data,
        addCrimeData: {
          CaseType: "",
          Description: ""
        }
      };

    case REQUEST_RESET_CRIME_DATA:
      return {
        ...state,
        addedCrimeData: []
      };
    case REQUEST_RESET_LINK_DATA:
      return {
        ...state,
        linkData: {
          latentId: undefined,
          bioId: ""
        }
      };
    case REQUEST_STORE_LINK_DATA:
      return storeLinkData(state, action.payload);
    case REQUEST_DELETE_NEW_CRIME_DATA:
      let olddata = [...state.addedCrimeData];
      olddata.splice(0, 1);
      return { ...state, addedCrimeData: olddata };
    default:
      return state;
  }
}
const storeLinkData = (state, payload) => {
  let latentid;
  let bioid;

  latentid = payload.latentId;

  if (payload.bioId === "") {
    bioid = state.linkData.bioId;
  } else {
    bioid = payload.bioId;
  }
  return {
    ...state,
    linkData: { latentId: latentid, bioId: bioid }
  };
};
