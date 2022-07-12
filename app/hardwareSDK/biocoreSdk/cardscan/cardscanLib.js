// const { Library } = require('ffi');
// const ref = require('ref');
// const ArrayType = require('ref-array');
// const StructType = require('ref-struct');
// const { range } = require('lodash');

// const MinutiaeType = StructType({
//   angle: ref.types.uchar,
//   x: ref.types.ushort,
//   y: ref.types.ushort,
//   type: ref.types.uchar,
// });
// const maxErrorMessageLength = 255;
// const MinutiaeArray = ArrayType(MinutiaeType);
// const maxDetectedMinutiaeCount = 256;

// const lib = Library('./BioCoreInProc.dll', {
//   '?readUserData@@YAHPAE0PAH01PAUIENGINE_MINUTIAE@@1PAD113H@Z': [
//       ref.types.int,
//       [
//         ref.refType('uchar'),
//         ref.refType('uchar'),
//         ref.refType('int'),
//         ref.refType('uchar'),
//         ref.refType('int'),
//         ref.refType(MinutiaeType),
//         ref.refType('int'),
//         ref.refType('char'),
//         ref.refType('int'),
//         ref.refType('int'),
//         ref.refType('char'),
//         ref.types.int,
//       ],
//     ],
//     "getState": [
//       "return tpe goes here",
//       [
//         "arg types go in here"
//       ]
//     ]
// });

// const deserializeDataCpp = Promise.promisify(lib['?readUserData@@YAHPAE0PAH01PAUIENGINE_MINUTIAE@@1PAD113H@Z'].async);
// const getState = Promise.promisify(lib['getState'].async)

// module.exports = {
//   getState: getState
// }