import { call, put, select } from "redux-saga/effects";
import { cloneableGenerator } from "redux-saga/utils";

import {
  callInputFieldChanged,
  callPageChanged,
  callRequestTableRowClicked
} from "../../app/sagas/global";
import {
  requestInputFieldChanged,
  requestPageChanged,
  requestPageChangedFailed,
  receiveTableRowClicked,
  requestTableRowClickedFailed
} from "../../app/actions/global";
import { requestActiveJobs, requestActionHistory } from "../../app/actions/jobs";
import { jobsStateSelector, jobsPagingSelector } from "../../app/selectors/jobs";
import {
  REQUEST_INPUT_FIELD_CHANGED,
  RECEIVE_INPUT_FIELD_CHANGED,
  RECEIVE_INPUT_FIELD_CHANGED_FAILED,
  REQUEST_PAGE_CHANGED,
  REQUEST_TABLE_ROW_CLICKED
} from "../../app/actions/actionTypes";

xdescribe("global saga", () => {
  xdescribe("callInputFieldChanged with action payload with area newJob", () => {
    let output;
    let expected;
    const action = {
      type: REQUEST_INPUT_FIELD_CHANGED,
      payload: {
        field: "TransactionType",
        value: "Latent",
        area: "newJob"
      }
    };
    const gen = cloneableGenerator(callInputFieldChanged)(action);
    it("should dispatch RECEIVE_INPUT_FIELD_CHANGED to the store", () => {
      let clone = gen.clone();
      output = clone.next(action.payload).value;
      expected = put({
        type: RECEIVE_INPUT_FIELD_CHANGED,
        payload: action.payload
      });
      expect(output).toEqual(expected);
    });
    it("should dispatch RECEIVE_INPUT_FIELD_CHANGED_FAILED to the store", () => {
      let clone = gen.clone();
      clone.next();
      output = clone.throw("error").value;
      expected = put({ type: RECEIVE_INPUT_FIELD_CHANGED_FAILED });
      expect(output).toEqual(expected);
    });
  });

  describe("callPageChanged with action payload with area jobQueue", () => {
    let output;
    let expected;
    const action = {
      type: REQUEST_PAGE_CHANGED,
      payload: {
        page: 2,
        area: "jobQueue"
      }
    };
    let cloneable = cloneableGenerator(callPageChanged)(action);
    // let gen = callPageChanged(action);
    let gen = cloneable.clone();
    let cloned;
    it("should call select and destructure currentPage and pageSize from the store", () => {
      output = gen.next().value;
      expected = select(jobsPagingSelector);
      expect(output).toEqual(expected);
    });
    xit("then it will request active jobs with the page from action payload", () => {
      cloned = gen.clone();
      output = gen.next({ currentPage: 1, pageSize: 10 }).value;
      expected = put(requestActiveJobs({ pageNo: 2, pageSize: 10 }));
      expect(output).toEqual(expected);
    });
    xit("should fall in the catch block and requestPageChangedFailed", () => {
      output = cloned.throw("error").value;
      expected = put(requestPageChangedFailed());
      expect(output).toEqual(expected);
    })
  });

  describe("callPageChanged with action payload with area jobQueue and page Previous", () => {
    let output;
    let expected;
    const action = {
      type: REQUEST_PAGE_CHANGED,
      payload: {
        page: "Previous",
        area: "jobQueue"
      }
    };
    let cloneable = cloneableGenerator(callPageChanged)(action);
    // let gen = callPageChanged(action);
    let gen = cloneable.clone();
    let cloned;
    it("should call select and destructure currentPage and pageSize from the store", () => {
      output = gen.next().value;
      expected = select(jobsPagingSelector);
      expect(output).toEqual(expected);
    });
    xit("then it will request active jobs with the page from action payload", () => {
      cloned = gen.clone();
      output = gen.next({ currentPage: 2, pageSize: 10 }).value;
      expected = put(requestActiveJobs({ pageNo: 1, pageSize: 10 }));
      expect(output).toEqual(expected);
    });
  });

  describe("callPageChanged with action payload with area jobQueue and page Next Page should request the next page", () => {
    let output;
    let expected;
    const action = {
      type: REQUEST_PAGE_CHANGED,
      payload: {
        page: "Next Page",
        area: "jobQueue"
      }
    };
    let cloneable = cloneableGenerator(callPageChanged)(action);
    // let gen = callPageChanged(action);
    let gen = cloneable.clone();
    let cloned;
    it("should call select and destructure currentPage and pageSize from the store", () => {
      output = gen.next().value;
      expected = select(jobsPagingSelector);
      expect(output).toEqual(expected);
    });
    xit("then it will request active jobs with the page from action payload", () => {
      cloned = gen.clone();
      output = gen.next({ currentPage: 2, pageSize: 10 }).value;
      expected = put(requestActiveJobs({ pageNo: 3, pageSize: 10 }));
      expect(output).toEqual(expected);
    });
  });

  describe("callPageChanged with action payload with area jobQueue and page ... should request the next page", () => {
    let output;
    let expected;
    const action = {
      type: REQUEST_PAGE_CHANGED,
      payload: {
        page: "...",
        area: "jobQueue"
      }
    };
    let cloneable = cloneableGenerator(callPageChanged)(action);
    // let gen = callPageChanged(action);
    let gen = cloneable.clone();
    let cloned;
    xit("should call select and destructure currentPage and pageSize from the store", () => {
      output = gen.next().value;
      expected = select(jobsPagingSelector);
      output = gen.next();
      console.log('output', output);
      console.log("expected:expected", expected)
      expect(output).toEqual(expected);
    });
    xit("then it will request active jobs with the page from action payload", () => {
      cloned = gen.clone();
      output = gen.next({ currentPage: 2, pageSize: 10 }).value;
      expected = put(requestActiveJobs({ pageNo: 3, pageSize: 10 }));
      expect(output).toEqual(expected);
    });
  });

  describe("callRequestTableRowClicked with payload area of jobQueue", () => {
    const action = {
      type: REQUEST_TABLE_ROW_CLICKED,
      payload: {
        dataId: 2,
        area: "jobQueue"
      }
    };
    let output;
    let expected;
    let gen = callRequestTableRowClicked(action);
    it('should first dispatch receiveTableRowClicked with the action', () => {
      output = gen.next().value;
      expected = put(receiveTableRowClicked({dataId: 2, area: "jobQueue"}));
      expect(output).toEqual(expected);
    })
    it('should first dispatch requestActionHistory', () => {
      output = gen.next().value;
      expected = put(requestActionHistory(2));
      expect(output).toEqual(expected);
    })
    it('should then complete the generator', () => {
      output = gen.next().done;
      expect(output).toEqual(true);
    })
    it('should fall into the catch block and dispatch requestTableRowClickedFailed action', () => {
      const anotherAction = {
        type: REQUEST_TABLE_ROW_CLICKED,
        payload: {
          dataId: 2, area: "jobQueue"
        }
      }
      let anotherGen = callRequestTableRowClicked(anotherAction);
      anotherGen.next();
      output = anotherGen.throw("error").value;
      expected = put(requestTableRowClickedFailed());
      expect(output).toEqual(expected);
    })
  });
});
