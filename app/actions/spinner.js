import { REQUEST_SPINNER_START, REQUEST_SPINNER_STOP } from './actionTypes';

export const startSpinner = () => ({
  type: REQUEST_SPINNER_START
});

export const stopSpinner = () => ({
  type: REQUEST_SPINNER_STOP
})