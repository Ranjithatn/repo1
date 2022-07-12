var edge = require('edge');
var capture = edge.func({
  assemblyFile: 'UCW_Canon_Lib.dll',
  typeName: 'UCW_Canon_Lib.UcwCanonWrapper',
  methodName: 'Capture' // This must be Func<object,Task<object>>
});

capture('liveview', function (err, result) {
  console.log(err);
  console.log(result);
  setTimeout(function () {
    capture('stopliveview', function (err, result) {
      console.log(err);
      console.log(result);
      setTimeout(function () {
        capture('capture', function (err, result) {
          console.log(err);
          console.log(result);
          setTimeout(function () {
            capture('dispose', function (err, result) {
              console.log(err);
              console.log(result);
            });
          }, 3000);
        });
      }, 3000);
    });
  }, 5000);
});


