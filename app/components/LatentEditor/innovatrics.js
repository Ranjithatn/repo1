const { Library } = require("ffi");
const ref = require("ref");
const ArrayType = require("ref-array");
const StructType = require("ref-struct");
const { range } = require("lodash");
const { Promise } = require("bluebird");

const MinutiaeType = StructType({
  angle: ref.types.uchar,
  x: ref.types.ushort,
  y: ref.types.ushort,
  type: ref.types.uchar
});
const maxErrorMessageLength = 255;
const MinutiaeArray = ArrayType(MinutiaeType);
const maxDetectedMinutiaeCount = 256;

const lib = Library("./innovatrics", {
  "?readUserData@@YAHPAE0PAH01PAUIENGINE_MINUTIAE@@1PAD113H@Z": [
    ref.types.int,
    [
      ref.refType("uchar"),
      ref.refType("uchar"),
      ref.refType("int"),
      ref.refType("uchar"),
      ref.refType("int"),
      ref.refType(MinutiaeType),
      ref.refType("int"),
      ref.refType("char"),
      ref.refType("int"),
      ref.refType("int"),
      ref.refType("char"),
      ref.types.int
    ]
  ]
});

const deserializeDataCpp = Promise.promisify(
  lib["?readUserData@@YAHPAE0PAH01PAUIENGINE_MINUTIAE@@1PAD113H@Z"].async
);

module.exports = {
  deserializeData: async data => {
    const pImageLength = ref.alloc("int");
    const pMaskLength = ref.alloc("int");
    const pMinutiaeCount = ref.alloc("int");
    const pNoteLength = ref.alloc("int");
    const pError = ref.alloc("int");
    const minutiaeData = Buffer.alloc(
      MinutiaeType.size * maxDetectedMinutiaeCount
    );
    const errorBuff = new Buffer(maxErrorMessageLength);
    let ret = await deserializeDataCpp(
      data,
      Buffer.alloc(0),
      pImageLength,
      Buffer.alloc(0),
      pMaskLength,
      minutiaeData,
      pMinutiaeCount,
      Buffer.alloc(0),
      pNoteLength,
      pError,
      errorBuff,
      maxErrorMessageLength
    );
    if (ret) {
      console.error(
        `IDKit error ${ret}: ${ref.deref(pError)} - ${errorBuff.toString()}`
      );
      return false;
    }

    const imageData = Buffer.alloc(ref.deref(pImageLength));
    const maskData = Buffer.alloc(ref.deref(pMaskLength));
    const noteBuffer = Buffer.alloc(ref.deref(pNoteLength));

    ret = await deserializeDataCpp(
      data,
      imageData,
      pImageLength,
      maskData,
      pMaskLength,
      minutiaeData,
      pMinutiaeCount,
      noteBuffer,
      pNoteLength,
      pError,
      errorBuff,
      maxErrorMessageLength
    );
    if (ret) {
      console.error(
        `IDKit error ${ret}: ${ref.deref(pError)} - ${errorBuff.toString()}`
      );
      return false;
    }
    return {
      imageData,
      maskData,
      minutiaeData: range(ref.deref(pMinutiaeCount)).map(i => {
        const minutia = ref.get(
          minutiaeData,
          i * MinutiaeType.size,
          MinutiaeType
        );
        return {
          angle: minutia.angle,
          x: minutia.x,
          y: minutia.y,
          type: minutia.type
        };
      }),
      note: noteBuffer.toString()
    };
  }
};
