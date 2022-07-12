// @flow
import { REQUEST_SPINNER_START, REQUEST_SPINNER_STOP } from '../actions/actionTypes';

type actionType = {
  +type: string
}

export default function spinner(state = 0, action: actionType) {
  switch(action.type) {
    case REQUEST_SPINNER_START:
      return (state += 1);
    case REQUEST_SPINNER_STOP:
      let nextSpinnerValue = (state <= 0 ? 0 : state - 1);;
      return nextSpinnerValue;
    default:
      return state;
  }
}