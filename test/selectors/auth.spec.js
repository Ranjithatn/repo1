import {
    usernameSelector,
    updateMessageSelector,
    downloadSelector,
    updateMsgSelector
} from "../../app/selectors/auth";
let state = {
    auth: {
        username:"admin",
        updateMessage:"admin",
        newDownload:true,
        updateStatus:"yes"
    }
}

describe("auth selectors", () => {

    describe("usernameSelector", () => {
        it("should get the username", () => {
            const output = usernameSelector(state);
            const expected = "admin"
            expect(output).toEqual(expected);
        })
    })
    describe("updateMessageSelector ", () => {
        it("should get the username", () => {
            const output = updateMessageSelector(state);
            const expected = "admin"
            expect(output).toEqual(expected);
        })
    })
    describe("downloadSelector ", () => {
        it("should get the downloadSelector", () => {
            const output = downloadSelector(state);
            const expected = true
            expect(output).toEqual(expected);
        })
    })
    describe("updateMsgSelector ", () => {
        it("should get the updateMsgSelector", () => {
            const output = updateMsgSelector(state);
            const expected = "yes"
            expect(output).toEqual(expected);
        })
    })
})