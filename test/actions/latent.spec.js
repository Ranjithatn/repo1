import {
  requestReceivedImage,
  requestSaveLatentEditedImage,
  requestSaveSUD,
  requestSaveSUDSuccess,
  requestShowScannedImage,
  requestImportImage
} from "../../app/actions/latent";
import {
  REQUEST_RECEIVED_IMAGE,
  REQUEST_IMPORT_IMAGE,
  REQUEST_SAVE_SUD,
  REQUEST_SAVE_LATENT_EDITED_IMAGE,
  REQUEST_SAVE_SUD_SUCCESS,
  REQUEST_SHOW_SCANNED_IMAGE
} from "../../app/actions/actionTypes";

describe("Latent Actions", () => {
    let output;
    let expected;
    it("should create requestReceivedImage actions", () => {
        const imgData={
            file: {},
            base64: "base64..."
        }
         output = requestReceivedImage(imgData);
         expected = {
          type: REQUEST_RECEIVED_IMAGE,
          payload: {
            file: {},
            base64: "base64..."
          }
        };
        expect(output).toEqual(expected);
      });
    it("should create requestSaveLatentEditedImage  actions", () => {
        const imgData="hsdjfsdfbsyhb.."
         output = requestSaveLatentEditedImage(imgData);
         expected = {
          type: REQUEST_SAVE_LATENT_EDITED_IMAGE,
          payload: "hsdjfsdfbsyhb.."
        };
        expect(output).toEqual(expected);
      });
    it("should create requestSaveSUD  actions", () => {
        const imgData="hsdjfsdfbsyhb.."
         output = requestSaveSUD(imgData);
         expected = {
          type: REQUEST_SAVE_SUD,
          payload: "hsdjfsdfbsyhb.."
        };
        expect(output).toEqual(expected);
      });
    it("should create requestSaveSUDSuccess  actions", () => {
        const imgData="hsdjfsdfbsyhb.."
         output = requestSaveSUDSuccess(imgData);
         expected = {
          type: REQUEST_SAVE_SUD_SUCCESS,
          payload: "hsdjfsdfbsyhb.."
        };
        expect(output).toEqual(expected);
      });
    it("should create requestShowScannedImage  actions", () => {
        const imgData="hsdjfsdfbsyhb.."
         output = requestShowScannedImage(imgData);
         expected = {
          type: REQUEST_SHOW_SCANNED_IMAGE,
          payload: "hsdjfsdfbsyhb.."
        };
        expect(output).toEqual(expected);
      });
    it("should create requestImportImage   actions", () => {
        const imgData="hsdjfsdfbsyhb.."
         output = requestImportImage(imgData);
         expected = {
          type: REQUEST_IMPORT_IMAGE,
          payload: "hsdjfsdfbsyhb.."
        };
        expect(output).toEqual(expected);
      });

})
