import { call, put, select } from "redux-saga/effects";
import { spy } from "sinon";
import { delay } from "redux-saga";
import { cloneableGenerator } from "redux-saga/utils";

import Api, { url } from "../../app/api";
import {
  callRequestActiveJobs,
  callRequestCreateJob,
  callRequestActionHistory,
  callRequestRemoveJob,
  callRequestNewAction
} from "../../app/sagas/jobs";
import {
  requestActiveJobs,
  requestActiveJobsSuccess,
  requestActiveJobsFailed,
  requestActionHistory,
  requestActionHistorySuccess,
  requestCreateJobSuccess,
  requestCreateJobFailed,
  requestActionHistoryFailed,
  requestRemoveJob,
  requestRemoveJobSuccess,
  requestRemoveJobFailed,
  requestNewActionSuccess
} from "../../app/actions/jobs";
import { requestHideModal } from '../../app/actions/modal';
import { requestShowNotification } from "../../app/actions/notifications";
import {
  REQUEST_ACTIVE_JOBS,
  REQUEST_ACTIVE_JOBS_SUCCESS,
  REQUEST_ACTIVE_JOBS_FAILED,
  REQUEST_CREATE_JOB,
  REQUEST_CREATE_JOB_SUCCESS,
  REQUEST_CREATE_JOB_FAILED,
  REQUEST_REMOVE_JOB,
  REQUEST_SPINNER_START,
  REQUEST_SPINNER_STOP,
  REQUEST_ACTION_HISTORY,
  REQUEST_NEW_ACTION,
  REQUEST_NEW_ACTION_SUCCESS
} from "../../app/actions/actionTypes";
import {
  jobsStateSelector,
  jobsPagingSelector,
  selectedJobSelector,
  jobsPageSizeSelector,
  jobsListSelector
} from "../../app/selectors/jobs";
import { startSpinner, stopSpinner } from "../../app/actions/spinner";

describe("job sagas", () => {
  describe("callRequestActiveJobs", () => {
    const response = {
      currentPage: 1,
      totalCount: 110,
      results: [{}, {}]
    };
    let withoutActionOutput;
    let withActionOutput;
    let genWithSelectedJobOutput;
    let expected;
    const action = {
      type: REQUEST_ACTIVE_JOBS,
      payload: {
        pageNo: 1,
        pageSize: 10
      }
    };
    const jobsPageSettings = {
      currentPage: 1,
      pageSize: 10,
      selectedJob: undefined
    };
    const getJobsSelectorMock = () => jobsPageSettings;
    let gen = cloneableGenerator(callRequestActiveJobs);
    let genWithAction = gen(action);
    let genWithoutAction = gen();
    genWithAction = genWithAction.clone();
    genWithoutAction = genWithoutAction.clone();

    describe("with pageSettings in action payload and no selectedJob", () => {
      it("should start the spinner", () => {
        withActionOutput = genWithAction.next().value;
        expected = put(startSpinner());
        expect(withActionOutput).toEqual(expected);
      });
      it("should call select with selectedJobSelector", () => {
        withActionOutput = genWithAction.next().value;
        const expected = select(selectedJobSelector);
        expect(withActionOutput).toEqual(expected);
      });
      it("should call select with jobsPagingSelector", () => {
        withActionOutput = genWithAction.next(null).value;
        const expected = select(jobsPagingSelector);
        expect(withActionOutput).toEqual(expected);
      });
      it("should call getActiveJobs api", () => {
        withActionOutput = genWithAction.next({ currentPage: 1, pageSize: 10 })
          .value;
        expected = call(Api, {
          url: url.job.getActive,
          method: "POST",
          isJwtRequired: true,
          data: { pageNo: 1, pageSize: 10 }
        });
        expect(withActionOutput).toEqual(expected);
      });
      it("should dispatch REQUEST_ACTIVE_JOBS_SUCCESS action type", () => {
        withActionOutput = genWithAction.next(response).value;
        expected = put(requestActiveJobsSuccess(response));
        expect(withActionOutput).toEqual(expected);
      });
      it("should stop the spinner", () => {
        withActionOutput = genWithAction.next().value;
        expect(withActionOutput).toEqual(put(stopSpinner()));
      });
      it("should complete the generator", () => {
        withActionOutput = genWithAction.next().done;
        expect(withActionOutput).toEqual(true);
      });
    });
    describe("without pageSettings in action payload and with selectedJob", () => {
      it("should start the spinner", () => {
        withoutActionOutput = genWithoutAction.next().value;
        expected = put(startSpinner());
        expect(withoutActionOutput).toEqual(expected);
      });
      xit("should call select with selectedJobSelector", () => {
        withoutActionOutput = genWithoutAction.next().value;
        const expected = select(selectedJobSelector);
        console.log("expected", expected);
        withoutActionOutput = genWithoutAction.next().value;
        console.log("withoutActionOutput", withoutActionOutput);
        expect(withoutActionOutput).toEqual(expected);
      });
      xit("should call select and yield pageSettings from the store", () => {
        withoutActionOutput = genWithoutAction.next(1).value;
        const expected = select(jobsPagingSelector);
        expect(withoutActionOutput).toEqual(expected);
      });
      xit("should call getActiveJobs api", () => {
        withoutActionOutput = genWithoutAction.next({
          currentPage: 2,
          pageSize: 10,
          selectedJob: 1
        }).value;
        expected = call(Api, {
          url: url.job.getActive,
          method: "POST",
          isJwtRequired: true,
          data: { pageNo: 2, pageSize: 10 }
        });
        expect(withoutActionOutput).toEqual(expected);
      });
      xit("should dispatch REQUEST_ACTIVE_JOBS_SUCCESS action type", () => {
        withoutActionOutput = genWithoutAction.next(response).value;
        expected = put(requestActiveJobsSuccess(response));
        expect(withoutActionOutput).toEqual(expected);
      });
      xit("should yield put requestActionHistory", () => {
        withoutActionOutput = genWithoutAction.next({}).value;
        expected = put(requestActionHistory(1));
        expect(withoutActionOutput).toEqual(expected);
      });
      xit("should stop the spinner", () => {
        withoutActionOutput = genWithoutAction.next().value;
        expect(withoutActionOutput).toEqual(put(stopSpinner()));
      });
      xit("should complete the generator", () => {
        withoutActionOutput = genWithoutAction.next().done;
        expect(withoutActionOutput).toEqual(true);
      });
    });
  });
  xdescribe("callRequestCreateJob", () => {
    let expected;
    let output;
    const action = {
      type: REQUEST_CREATE_JOB,
      payload: {
        number: new Date().getTime(),
        transactionType: "Tenprint",
        crimeType: "criminal"
      }
    };
    let gen = cloneableGenerator(callRequestCreateJob);
    let clonedGen = gen(action).clone();
    let clonedGen2;
    it("will first start the spinner", () => {
      output = clonedGen.next().value;
      expected = put(startSpinner());
      expect(output).toEqual(expected);
    });
    it("should then call the url.job.create api", () => {
      output = clonedGen.next().value;
      expected = call(Api, {
        url: url.job.create,
        method: "POST",
        isJwtRequired: true,
        data: { number: action.payload.number, type: "Tenprint" }
      });
      expect(output).toEqual(expected);
    });
    it("should then dispatch requestCreateJobSuccess action", () => {
      clonedGen2 = clonedGen.clone();
      output = clonedGen.next({ id: 123 }).value;
      expected = put(requestCreateJobSuccess(123));
      expect(output).toEqual(expected);
    });
    it("should then wait 500ms", () => {
      output = clonedGen.next().value;
      expected = call(delay, 500);
      expect(output).toEqual(expected);
    });
    it('and then it should show success notification', () => {
      output = clonedGen.next().value;
      expected = put(requestShowNotification({message: "Job created successfully", type: "is-success", id: 1}));
      expect(output).toEqual(expected);
    })
    it("should requestActiveJobs", () => {
      output = clonedGen.next().value;
      expected = put(requestActiveJobs());
      expect(output).toEqual(expected);
    });
    xit("should finally stop the spinner", () => {
      output = clonedGen.next().value;
      expected = put(stopSpinner());
      expect(output).toEqual(expected);
    });
    xit("should complete the generator", () => {
      output = clonedGen.next().done;
      expect(output).toEqual(true);
    });
    it("should catch any errors", () => {
      output = clonedGen2.throw("error").value;
      expected = put(requestCreateJobFailed());
      expect(output).toEqual(expected);
    });
  });

  describe("callRequestActionHistory", () => {
    let expected;
    let output;
    const action = {
      type: REQUEST_ACTION_HISTORY,
      payload: 1
    };
    const response = {
      currentPage: 2,
      totalCount: 50
    };
    let gen = cloneableGenerator(callRequestActionHistory);
    let clonedGen = gen(action).clone();
    let clonedGen2;
    it("will first start the spinner", () => {
      output = clonedGen.next().value;
      expected = put(startSpinner());
      expect(output).toEqual(expected);
    });
    it("should then call the url.job.create api", () => {
      output = clonedGen.next().value;
      expected = call(Api, {
        url: url.job.actionHistory,
        method: "POST",
        isJwtRequired: true,
        data: action.payload
      });
      expect(output).toEqual(expected);
    });
    it('should then select pageSize to calculate new paging info', () => {
      output = clonedGen.next(response).value;
      expected = select(jobsPageSizeSelector);
      expect(output).toEqual(expected);
    })
    it('should then dispatch requestActionHistorySuccess action', () => {
      clonedGen2 = clonedGen.clone()
      output = clonedGen.next(10).value;
      expected = put(requestActionHistorySuccess(response));
      expect(output).toEqual(expected);
    })
    xit('should then stop the spinner', () => {
      output = clonedGen.next().value;
      expected = put(stopSpinner());
      expect(output).toEqual(expected);
    })
    xit("should complete the generator", () => {
      output = clonedGen.next().done;
      expect(output).toEqual(true);
    });
    it('should catch errors', () => {
      output = clonedGen2.throw('error').value;
      expected = put(requestActionHistoryFailed());
      expect(output).toEqual(expected);
    })
  });

  describe("callRequestRemoveJob", () => {
    let expected;
    let output;
    const action = {
      type: REQUEST_REMOVE_JOB,
      payload: 1
    };
    const response = {
      result: "success"
    };
    const errorResponse = {
      error: "error"
    }
    let gen = cloneableGenerator(callRequestRemoveJob);
    let clonedGen = gen(action).clone();
    let clonedGen2;
    let clonedGen3;
    it("will first start the spinner", () => {
      output = clonedGen.next().value;
      expected = put(startSpinner());
      expect(output).toEqual(expected);
    });
    it("should then call the url.job.create api", () => {
      output = clonedGen.next().value;
      expected = call(Api, {
        url: url.job.remove + action.payload,
        method: "DELETE",
        isJwtRequired: true
      });
      expect(output).toEqual(expected);
    });
    it('should then dispatch requestRemoveJobSuccess', () => {
      clonedGen2 = clonedGen.clone(); // forked for error path
      clonedGen3 = clonedGen.clone(); // forked for catch patch
      output = clonedGen.next(response).value;
      expected = put(requestRemoveJobSuccess(1));
      expect(output).toEqual(expected);
    })
    it('should then hide the removejob modal action', () => {
      output = clonedGen.next().value;
      expected = put(requestHideModal());
      expect(output).toEqual(expected);
    })
    it('should then show a success notification', () => {
      output = clonedGen.next().value;
      expected = put(requestShowNotification({message: 'success', type: "is-success", id: 1})); // 2 because our test above calls it in the actual code once
      expect(output).toEqual(expected);
    })
    it('should then select the jobsList from store', () => {
      output = clonedGen.next().value;
      expected = select(jobsListSelector);
      expect(output).toEqual(expected);
    })
    it('should then select paging from jobs store', () => {
      output = clonedGen.next([1,2,3,4,5,6,7]).value;
      expected = select(jobsPagingSelector);
      expect(output).toEqual(expected);
    })
    it("should then put requestActiveJobs", () => {
      output = clonedGen.next({currentPage: 3, pageSize: 10}).value;
      expected = put(requestActiveJobs({pageNo: 3, pageSize: 10}));
      expect(output).toEqual(expected);
    });
    it('should then stop the spinner', () => {
      output = clonedGen.next().value;
      expected = put(stopSpinner());
      expect(output).toEqual(expected);
    })
    it('should then complete the generator', () => {
      output = clonedGen.next().done;
      expect(output).toEqual(true);
    })
    it('ERROR PATH--------should dispatch requestRemoveJobFailed action is res.error', () => {
      output = clonedGen2.next(errorResponse).value;
      expected = put(requestRemoveJobFailed());
      expect(output).toEqual(expected);
    })
    it('ERROR PATH--------and then it should show error notification', () => {
      output = clonedGen2.next().value;
      expected = put(requestShowNotification({ message: "error", type: "is-warning", id: 2 })); // 3 now because this is third time our tests call it (2 from previous tests)
      expect(output).toEqual(expected);
    })
    it('ERROR PATH--------it should stop the spinner', () => {
      output = clonedGen2.next().value;
      expected = put(stopSpinner());
      expect(output).toEqual(expected);
    })
    it('ERROR PATH--------generator should be completed', () => {
      output = clonedGen2.next().done;
      expect(output).toEqual(true);
    })

    it('CATCH PATH------------it should catch', () => {
      output = clonedGen3.throw('error').value;
      expected = put(requestRemoveJobFailed());
      expect(output).toEqual(expected);
    })
  });

  describe('callRequestNewAction', () => {
    let expected;
    let output;
    const action = {
      type: REQUEST_NEW_ACTION,
      payload: {
        job: 1,
        username: "username",
        newAction: "Search Criminal Database",
        tcn: 2
      }
    };
    const response = {
      id: 3
    };
    let gen = cloneableGenerator(callRequestNewAction);
    let clonedGen = gen(action).clone();
    let clonedGen2;
    let clonedGen3;
    it("will first start the spinner", () => {
      output = clonedGen.next().value;
      expected = put(startSpinner());
      expect(output).toEqual(expected);
    });
    xit("should then call the url.job.create api", () => {
      output = clonedGen.next().value;
      expected = call(Api, {
        url: url.action.create,
        method: "POST",
        isJwtRequired: true,
        data: {
          jobId: 1,
          by: "username",
          tcn: 2,
          actionType: "Search Criminal Database"
        }
      });
      expect(output).toEqual(expected);
    });
    xit('should then dispatch requestNewActionSuccess', () => {
      clonedGen2 = clonedGen.clone(); // forked for error path
      clonedGen3 = clonedGen.clone(); // forked for catch patch
      output = clonedGen.next(response).value;
      expected = put(requestNewActionSuccess(3));
      expect(output).toEqual(expected);
    })
    xit('should then dispatch requestHideModal', () => {
      output = clonedGen.next().value;
      expected = put(requestHideModal());
      expect(output).toEqual(expected);
    })
    xit('should then show a success notification', () => {
      output = clonedGen.next().value;
      expected = put(requestShowNotification({id: 3, message: "Successfully added an action", type: 'is-success'})); // id:4 because from earlier calls
      expect(output).toEqual(expected);
    })
    xit('should then request action history', () => {
      output = clonedGen.next().value;
      expected = put(requestActionHistory(1));
      expect(output).toEqual(expected);
    })
    xit('should then stop the spinner', () => {
      output = clonedGen.next().value;
      expected = put(stopSpinner());
      expect(output).toEqual(expected);
    })
    xit('should then complete the generator', () => {
      output = clonedGen.next().done;
      expect(output).toEqual(true);
    })
  })


  describe("makeCardJobPayload", () => {
    xit('should make payload for card', () => {
      const jobId = 1;
      const username = "admin";
      const segmentedPrints = [{name: "R. ROLLED THUMB", "b64Image": "data:image/png;base64,hijklmn"}];
      const b64CardImage = "data:image/png;base64,abcdefg";
      const output = makeCardJobPayload(jobId, segmentedPrints, b64CardImage, username);
      const expected = {
        jobId,
        biometrics: [
          {
            "type": "Finger",
            "impression": "Roll",
            "position": "Right Thumb",
            "encoding": "PNG",
            "image": "hijklmn",
            "hashValue": "",
            "isTemplate": false,
            "patterType": "",
            "referencePatterType": "",
            "quality": 0,
            "minutiaCount": 0,
            "annotation": "",
            "annotationNote": "",
            "createdBy": "admin"
          },
          // {
          //   "type": "Card",
          //   "impression": "Unknown Finger",
          //   "position": "Unknown Finger",
          //   "encoding": "PNG",
          //   "image": "abcdefg",
          //   "hashValue": "",
          //   "isTemplate": false,
          //   "patterType": "",
          //   "referencePatterType": "",
          //   "quality": 0,
          //   "minutiaCount": 0,
          //   "annotation": "",
          //   "annotationNote": "",
          //   "createdBy": "admin",
          // }
        ]
      }
      expect(output).toEqual(expected);
    })
  })




});
