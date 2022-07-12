import {
    requestUpdateServerStatus,
    requestNFIQQualityThreshold,
    requestUpdateNFIQQualityThreshold,
} from "../../app/actions/app";
import {
    UPDATE_SERVER_STATUS,
    REQUEST_NFIQ_QUALITY_THRESHOLD,
    REQUEST_NFIQ_QUALITY_THRESHOLD_SUCCESS,
} from "../../app/actions/actionTypes";


describe("app Actions", () => {
    it("should create requestUpdateServerStatus actions", () => {
        const data = {
            serverStatus: 'unknown',
            settings: {
                nfiq_quality_threshold: 'loading...',
            },
        };
        const output = requestUpdateServerStatus(data);
        const expected = {
            type: UPDATE_SERVER_STATUS,
            payload: data
        };
        expect(output).toEqual(expected);
    });
    it("should create requestNFIQQualityThreshold actions", () => {
        const data = {
            serverStatus: 'abcd',
            settings: {
                nfiq_quality_threshold: 'abcd',
            },
        }
        const output = requestNFIQQualityThreshold(data);
        const expected = {
            type: REQUEST_NFIQ_QUALITY_THRESHOLD,
            payload: data
        };
        expect(output).toEqual(expected);
    });
    it("should create requestUpdateNFIQQualityThreshold actions", () => {
        const data = {
            serverStatus: 'connected',
            settings: {
                nfiq_quality_threshold: 'loading...',
            }
        }
        const output = requestUpdateNFIQQualityThreshold(data);
        const expected = {
            type: REQUEST_NFIQ_QUALITY_THRESHOLD_SUCCESS,
            payload: data
        };
        expect(output).toEqual(expected);
    });
});
