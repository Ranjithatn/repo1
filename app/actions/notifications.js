import { REQUEST_SHOW_NOTIFICATION, REQUEST_REMOVE_NOTIFICATION } from './actionTypes';

// type Notification = {
//   id?: number,
//   message: string,
//   type: string,
//   timeOutInMillis?: number
// }

let id = 0;
export const requestShowNotification = (payload) => ({
  type: REQUEST_SHOW_NOTIFICATION,
  payload: makeNotification(payload)
})

export const requestRemoveNotification = id => ({
  type: REQUEST_REMOVE_NOTIFICATION,
  payload: id
})

const makeNotification = notification => ({
  ...notification,
  id: (notification.id ? notification.id : ++id), //99.9% of time we let it auto increment
  timeOutInMillis: 3000
})
