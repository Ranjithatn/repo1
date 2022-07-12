import { requestShowNotification, requestRemoveNotification } from '../../app/actions/notifications';
import { REQUEST_SHOW_NOTIFICATION, REQUEST_REMOVE_NOTIFICATION } from '../../app/actions/actionTypes';

describe("notifications actions", () => {
  it('should create requestShowNotification actions', () => {
    const output = requestShowNotification({message: "New job created successfully", type: "is-success"});
    const expected = {
      type: REQUEST_SHOW_NOTIFICATION,
      payload: {
        id: 1,
        message: "New job created successfully",
        type: "is-success",
        timeOutInMillis:3000
      }
    }
    expect(output).toEqual(expected);
   });
   it('should create requestShowNotification actions with a different id', () => {
    const output = requestShowNotification({message: "Second notification", type: "is-success"});
    const expected = {
      type: REQUEST_SHOW_NOTIFICATION,
      payload: {
        id: 2, // first test from about incremented to 1 already
        message: "Second notification",
        type: "is-success",
        timeOutInMillis:3000
      }
    }
    expect(output).toEqual(expected);
   });
   it('should create requestRemoveNotification actions', () => {
     const output = requestRemoveNotification(1);
     const expected = {
       type: REQUEST_REMOVE_NOTIFICATION,
       payload: 1
     }
     expect(output).toEqual(expected);
    });


})