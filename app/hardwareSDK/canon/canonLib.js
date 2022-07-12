const edge = require("edge");

  var capture = edge.func({
    assemblyFile: 'UCW_Canon_Lib.dll',
    typeName: 'UCW_Canon_Lib.UcwCanonWrapper',
    methodName: 'Capture' // This must be Func<object,Task<object>>
  });

export function captureFromCamera() {
    return new Promise((resolve, reject) => {
        capture("capture", function (error, result) {
        if (error) reject(error);
        resolve(result);
      });
    });
  }

  export function startLiveView() {
    return new Promise((resolve, reject) => {
        capture("liveview", function (error, result) {
        if (error) reject(error);
        resolve(result);
      });
    });
  }

  export function stopLiveView() {
    return new Promise((resolve, reject) => {
        capture("stopliveview", function (error, result) {
        if (error) reject(error);
        resolve(result);
      });
    });
  }

  export function dispose() {
    return new Promise((resolve, reject) => {
        capture("dispose", function (error, result) {
        if (error) reject(error);
        resolve(result);
      });
    });
  }