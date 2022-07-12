import { call, put, select, takeLatest } from "redux-saga/effects";
import { spy } from "sinon";
import { delay } from "redux-saga";
import { cloneableGenerator } from "redux-saga/utils";

import Api, { url } from "../../app/api";
import {
callRequestRecivedImage,
callRequestSaveLatentEditedImage,
callRequestSaveSUD,
watchRequestRecivedImage,
watchRequestSaveSUD,
watchRequestSaveLatentEditedImage
} from "../../app/sagas/latent";
import {
  requestReceivedImage,
  requestSaveLatentEditedImage,
  requestSaveSUD,
  requestSaveSUDSuccess
} from "../../app/actions/latent";
import {
  requestActiveJobs, requestCreateJobFailed
} from "../../app/actions/jobs";
import { requestHideModal,requestShowModal } from "../../app/actions/modal";
import { requestShowNotification } from "../../app/actions/notifications";
import {
  REQUEST_RECEIVED_IMAGE,
  REQUEST_SAVE_LATENT_EDITED_IMAGE,
  REQUEST_SAVE_SUD
} from "../../app/actions/actionTypes";
import {
NEW_ACTION
} from "../../app/components/Modal/ModalRoot";
import {
  jobsStateSelector,
  jobsPagingSelector,
  selectedJobSelector,
  jobsPageSizeSelector,
  jobsListSelector,
  jobsFilterTitleSelector,
  FilterTitleSelector,
  totalJobsSelector
} from "../../app/selectors/jobs";
import { startSpinner, stopSpinner } from "../../app/actions/spinner";

describe("latent sagas", () => {
    describe("callRequestRecivedImage", () => {
        let output;
        let expected;
        const action = {
            type: REQUEST_RECEIVED_IMAGE,
            payload: "imgdata",
            history: {
              push: spy()
            }
          };
        const gen = cloneableGenerator(callRequestRecivedImage)(action);
        let clone = gen.clone();
   
        it("should then start the spinner", () => {
            output = clone.next().value;
            expected = put(startSpinner());
            expect(output).toEqual(expected);
          });
          it("will first get the job number", () => {
            output = clone.next().value;
            expect(action.history.push.calledWith("/authenticated/latent/latentinnov"));
          });
          it("should then stop the spinner", () => {
            output = clone.next().value;
            expected = put(stopSpinner());
            expect(output).toEqual(expected);
          });
    
      });

      describe("watchRequestRecivedImage",()=>{
        let output;
        let expected;
        const gen = cloneableGenerator(watchRequestRecivedImage)();
        let clone = gen.clone();
        it("should then start the spinner", () => {
          output = clone.next().value;
   
          expected = takeLatest(REQUEST_RECEIVED_IMAGE, callRequestRecivedImage);
          expect(output).toEqual(expected);
        });
      })
      describe("watchRequestSaveLatentEditedImage",()=>{
        let output;
        let expected;
        const gen = cloneableGenerator(watchRequestSaveLatentEditedImage)();
        let clone = gen.clone();
        it("should then start the spinner", () => {
          output = clone.next().value;
   
          expected = takeLatest(REQUEST_SAVE_LATENT_EDITED_IMAGE,
            callRequestSaveLatentEditedImage
        );
          expect(output).toEqual(expected);
        });
      })
      describe("watchRequestSaveSUD",()=>{
        let output;
        let expected;
        const gen = cloneableGenerator(watchRequestSaveSUD)();
        let clone = gen.clone();
        it("should then start the spinner", () => {
          output = clone.next().value;
         
          expected = takeLatest(REQUEST_SAVE_SUD, callRequestSaveSUD);
          expect(output).toEqual(expected);
        });
      })
    describe("callRequestSaveSUD", () => {
        let output;
        let expected;
        const action = {
            type: REQUEST_SAVE_SUD,
            payload: {imageData:"test"},
            history: {
              push: spy()
            }
          };
        const gen = cloneableGenerator(callRequestSaveSUD)(action);
        let clone = gen.clone();
        const gen2 = cloneableGenerator(callRequestSaveSUD)();
        let clone2 = gen2.clone();
   
        // it("should then start the spinnerhaha", () => {
        //   output = clone2.throw("errorResponse").value;
        //   console.log("errorresponse===============================>",JSON.stringify(output,null))
        // });
        it("should then start the spinner", () => {
            output = clone.next().value;
            expected = put(requestSaveSUDSuccess("dGVzdA=="));
            expect(output).toEqual(expected);
          });
          it("will first get the job number", () => {
            output = clone.next().value;
            expect(action.history.push.calledWith("/authenticated/latent/LatentEditedImage"));
          });
         
    
      });
    describe("callRequestSaveLatentEditedImage", () => {
        let output;
        let expected;
        const action = {
            type: REQUEST_SAVE_LATENT_EDITED_IMAGE,
            payload: "EditedImgData",
            jobID: 1,
//            history: {
  //            push: spy()
    //        }
          };
        const action2 = {
            type: REQUEST_SAVE_LATENT_EDITED_IMAGE,
            payload: "EditedImgData",
          
//            history: {
  //            push: spy()
    //        }
          };
        const gen = cloneableGenerator(callRequestSaveLatentEditedImage)(action);
        const gen2 = cloneableGenerator(callRequestSaveLatentEditedImage)(action2);
        let clone = gen.clone();
        let clone2 = gen2.clone();
   
        it("should call select with selectedJobSelector", () => {
            let withActionOutput = clone.next(1).value;
            const expected = select(selectedJobSelector);
            expect(withActionOutput).toEqual(expected);
          });


        it("should then start the spinner", () => {
            output = clone.next(1).value;
            expected = put(startSpinner());
            expect(output).toEqual(expected);
          });

          xit("should call  api", () => {
           let withActionOutput = clone.next().value;

              let xyz = clone.next(withActionOutput);
              let abc = clone.next(xyz);


            expected = call(Api, {
              url: url.job.updateFingerprintData,
              method: "POST",
              isJwtRequired: true,
              data: { jobID: 1,
                biometrics: [
                  {
                    type: "Finger",
                    impression: "Flat",
                    position: "LeftRing",
                    encoding: "PNG",
                    image: "EditedImgData",
                    hashValue: "",
                    isTemplate: false,
                    patterType: "Radial Loops",
                    referencePatterType: "",
                    quality: 65,
                    minutiaCount: 17,
                    annotation: "",
                    annotationNote: "",
                    createdBy: "Operator 1"
                  }
                ] }
            });


            expect(withActionOutput).toEqual(expected);
          });
        //   it("will first get the job number", () => {
        //     output = clone.next().value;
        //     expect(action.history.push.calledWith("/authenticated/latent/latentinnov"));
        //   });
          xit("should then stop the spinner", () => {
            output = clone.next().value;
            expected = put(requestActiveJobs());
            expect(output).toEqual(expected);
          });
          xit("should then stop the spinner", () => {
            output = clone.next().value;
            expected = put(requestShowModal({ modalType: NEW_ACTION }));
            expect(output).toEqual(expected);
          });


          
        it("should call select with selectedJobSelector", () => {
          let withActionOutput = clone2.next().value;
          const expected = select(selectedJobSelector);
          expect(withActionOutput).toEqual(expected);
        });


      it("should then start the spinner", () => {
          output = clone2.next().value;
          expected = put(startSpinner());
          expect(output).toEqual(expected);
        });

      it("should then stop the spinner", () => {
          output = clone2.next(3).value;
          expected = put(stopSpinner());
          expect(output).toEqual(expected);
        });
      xit("should show Notification", () => {
          output = clone2.next(3).value;
          expected = put(  requestShowNotification({
            message: "Fingeprints Not updated ",
            type: "is-danger",
            id: 2
          }));
          expect(output).toEqual(expected);
        });

        
    
      });
    
  });

