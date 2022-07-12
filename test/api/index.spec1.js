import API, { url, checkIfResponseNotOk, defaultHeaders } from "../../app/api";
// import { shallow, mount } from 'enzyme';

describe("Testing API file", () => {
  beforeEach(function() {
    // for testing api calls made using fetch
    global.fetch = jest.fn().mockImplementation(() => {
      return new Promise((resolve, reject) => {
        resolve({
          ok: true,
          Id: "123",
          json: function() {
            return { Id: "123" };
          }
        });
      });
    });
  });

  it("has the correct urls object", () => {
    let urlObj = Object.keys(url);
    expect(urlObj.length).toBe(3);
  });

  it("has all the urls we use", () => {
    const expected = {
      auth: {
        login: "/authenticate/login",
        logout: "/authenticate/logout"
      },
      job: {
        getActive: "/queue/getactivejobs",
        actionHistory: "/queue/getactionhistory",
        searchJobHistory: "/queue/searchjobhistory",
        create: "/job/create",
        remove: "/job/", // add job id during req
        serachActivJob: "/queue/searchjob",
        updateFingerprintData: "/job/updatebiometrics",
        updateSearchTexts: "/job/updatesearchtexts",
        auditLog: "/job/getjobhistories",
        getBiometrics: "/job/getbiometrics",
        getjobauditreport: "/job/getjobauditreport",
        updateSearchTexts: "/job/updatesearchtexts",
        getSearchTexts:"/job/getsearchtexts",
        verifybiometricsquality:"/job/verifybiometricsquality",
      },
      action: {
        actionResult: "/action/getactionresult",
        create: "/action/create",
        setActionStatus: "/action/setactionstatus",
        setMatchedPersonDecision: "/action/setmatchedpersondecision",
        getMatchSubsequenceActions: "/action/getmatchsubsequenceactions",
        getMatchedBiometricsImage: "/action/GetMatchedBiometricsImage"
      },
      systeminfo: {
        getsystemsettings: "/systeminfo/getsystemsettings",
      },
    };

    expect(url).toEqual(expected);
  });

  it("checkIfResponseNotOk returns response if its ok", () => {
    const res = { ok: true, body: {} };
    let output = checkIfResponseNotOk(res);
    expect(output).toEqual(res);
  });

  it("api call returns a promise", () => {
    const mock = {
      url: "127.0.0.1",
      data: "",
      method: "GET",
      isJwtRequired: false
    };

    const apiCall = API(mock);
    expect(apiCall).toBeInstanceOf(Promise);
  });

  it("defaultHeaders contains Content-Type", () => {
    expect(defaultHeaders["Content-Type"]).toBe("application/json");
  });
});
