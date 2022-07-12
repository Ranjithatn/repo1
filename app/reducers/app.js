import {
  UPDATE_SERVER_STATUS,
  REQUEST_NFIQ_QUALITY_THRESHOLD_SUCCESS,
} from "../actions/actionTypes";

const initialState = {
  serverStatus: 'unknown',
  settings: {
  	nfiq_quality_threshold: 'loading...',
  },
};

export default function app(state = initialState, action = {}) {
	switch (action.type) {
		case UPDATE_SERVER_STATUS:
			return { ...state, serverStatus: action.payload }

		case REQUEST_NFIQ_QUALITY_THRESHOLD_SUCCESS:
	
			let settings = { ...state.settings }
			settings.nfiq_quality_threshold = action.payload;
			return { ...state, settings };

		default:
			return state;
	}
}

