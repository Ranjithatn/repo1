// @flow
import {
  REQUEST_SET_TENPRINT_VERIFY,
  REQUEST_SET_TENPRINT_VERIFY_STORE,
  REQUEST_SET_TENPRINT__VERIFY_MATCHED_DATA,
  REQUEST_REMOVE_TENPRINT__VERIFY_MATCHED_DATA,
  REQUEST_SHOW_ADJUDICATOR_SUCCESS,
  RECIVED_MATCHED_PERSON_CHANGED,
  RECIVED_MODAL_DATA,
  REQUEST_HIDE_ADJUDICATOR,
  RECIEVE_NOTE_STORE,
  //tenprint verify new
  REQUEST_SELECTED_TENPRINT_TYPE,
  REQUEST_SET_TENPRINT_VERIFY_RAW,
  MODAL_CHECKBOX,
  REQUEST_RESET_LINK_DATA,
  TOGGLE_PANE_VISIBILITY
} from "../actions/actionTypes";
const initialState = {
  tenprintverifydata: {},
  tenprintverifyMatchInfo: {
    Results: []
  },
  tenprintverifyHandData: {
    position: "Left"
  },
  ShowAdjudicator: false,
  SelectedRow: 0,
  AdjudicatorPassImageData: {
    Result: {
      matched: {
        image: ""
      }
    }
  },
  MatchedUserRowID: "",
  MatchedPersonInfo: {},
  adjudicatorMatch: [],
  ConfirmModalData: {},
  selectedSearchOption: undefined,
  //tenprint verify new
  showTenprintSelected: {
    selected: "fingerprint",
    title: "titlebio.fingerprint"
  },
  adjudicatorResult: {},

  //update and register modal lashing, fine initial state
  ModalCheckbox: {
    lashing: false,
    fine: false
  },

  panes: {
    sidebar: true,
    table: true
  }
};

export default function latent(state = initialState, action = {}) {
  switch (action.type) {
    case REQUEST_SET_TENPRINT_VERIFY_RAW:
      return {
        ...state,
        tenprint: action.payload
      };

    case REQUEST_SET_TENPRINT_VERIFY:
 
      return {
        ...initialState,
        tenprintverifydata: action.payload,
        adjudicatorMatch: action.payload.leftmatches.fingers
      };
    case REQUEST_SET_TENPRINT_VERIFY_STORE:
      return toggleHannds(state, action.payload);
    case REQUEST_SET_TENPRINT__VERIFY_MATCHED_DATA:
      return {
        ...state,
        tenprintverifyMatchInfo: action.payload,
        SelectedRow: action.payload.SelectedRow,
        ShowAdjudicator: false
        // adjudicatorMatch: action.payload.Results
      };
    case REQUEST_REMOVE_TENPRINT__VERIFY_MATCHED_DATA:
      return removeMatches(state);
    case REQUEST_SHOW_ADJUDICATOR_SUCCESS:
      return showAdjudicator(state, action.payload);
    case REQUEST_HIDE_ADJUDICATOR:
      return {
        ...state,
        ShowAdjudicator: action.payload
      };

    case RECIVED_MODAL_DATA:
      return { ...state, ConfirmModalData: action.payload };

    case RECIEVE_NOTE_STORE:
      return { ...state, ActionNote: action.payload };

    case RECIVED_MATCHED_PERSON_CHANGED:
      return {
        ...state,
        MatchedUserRowID: action.payload.Index,
        MatchedPersonInfo: action.payload.PersonInfo,
        MatchedPersonUserID: action.payload.userID,
      };
    case TOGGLE_PANE_VISIBILITY:
      let panes = { ...state.panes };
      if (action.payload.pane === "all") {
        panes.sidebar = action.payload.visible;
        panes.table = action.payload.visible;
      } else {
        panes[action.payload.pane] = action.payload.visible;
      }

      return { ...state, panes };
    default:
      return state;
    //tenprint verify new
    case REQUEST_SELECTED_TENPRINT_TYPE:
      return { ...state, showTenprintSelected: action.payload };
    case MODAL_CHECKBOX:
      const { type, status } = action.payload;
      let newState = Object.assign({}, state);
      newState.ModalCheckbox[type] = status;
      return newState;
  }
}
const removeMatches = state => {
  delete state.tenprintverifyMatchInfo;
  return {
    ...state
  };
};
const showAdjudicator = (state, payload) => {
  state.ShowAdjudicator = payload.status;
  state.AdjudicatorPassImageData = payload;
  state.adjudicatorMatch = payload.Result.matched;
  state.adjudicatorProbe = payload.Result.probe;
  state.adjudicatorResult = payload.Result;
  return { ...state };
};
const toggleHannds = (state, payload) => {
  state.tenprintverifyHandData = payload;
  state.ShowAdjudicator = false;
  state.AdjudicatorPassImageData.status = false;
  return { ...state };
};
