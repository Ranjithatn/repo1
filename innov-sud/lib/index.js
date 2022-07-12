const ffi = require('ffi');
const ref = require('ref');
const pify = require('pify');

const templateFormat = {
  FORMAT_ICS: 1,
  FORMAT_ANSI: 2,
  FORMAT_ISO: 3,
  FORMAT_ANSI_PLUS: 4,
  FORMAT_ISO_PLUS: 5,
};

const imageFormat = {
  FORMAT_BMP: 0,
  FORMAT_PNG: 1,
  FORMAT_JPG: 2,
  FORMAT_GIF: 3,
  FORMAT_TIF: 4,
  FORMAT_WSQ: 5,
  FORMAT_JPEG2K: 6,
  FORMAT_LAST_DUMMY: 7,
};

const config = {
  CFG_BEST_CANDIDATES_COUNT: 0,
  CFG_SIMILARITY_THRESHOLD: 1,
  CFG_SCANNER_TYPE: 2,
  CFG_RESOLUTION_DPI: 3,
  CFG_MAX_ROTATION: 4,
  CFG_STORE_IMAGES: 5,
  CFG_IDENTIFICATION_SPEED: 6,
  CFG_NETWORK_COMPRESSION: 7,
  CFG_LOG_LEVEL: 8,
  CFG_MIN_MATCHING_FINGERPRINTS: 9,
  CFG_MAX_TEMPLATE_SIZE: 10,
  CFG_JPEG2K_COMPRESSION_RATIO: 11,
  CFG_WSQ_BITRATE: 12,
  CFG_DB_IMAGE_FORMAT: 13,
  CFG_LOAD_IMAGES: 14,
  CFG_MAX_ODBC_LOADING_THREADS: 15,
  CFG_ICS_TEMPLATE_VERSION: 16,
  CFG_EXTRACT_CRITICAL_POINTS: 17,
  CFG_EXTRACTOR_ALGORITHM: 18,
};

const fingerPosition = {
  UNKNOWN_FINGER: 0,
  RIGHT_THUMB: 1,
  RIGHT_INDEX: 2,
  RIGHT_MIDDLE: 3,
  RIGHT_RING: 4,
  RIGHT_LITTLE: 5,
  LEFT_THUMB: 6,
  LEFT_INDEX: 7,
  LEFT_MIDDLE: 8,
  LEFT_RING: 9,
  LEFT_LITTLE: 10,
  UNKNOWN_PRINT: 40,
};

function createLibrary() {
  const lib = ffi.Library('idkit.dll', {
    IEngine_InitModule: ['int', []],
    IEngine_TerminateModule: ['int', []],
    IEngine_GetErrorMsg: ['string', ['int']],
    IEngine_InitUser: ['void*', []],
    IEngine_DeserializeUser: ['int', ['void*', 'void*']],
    IEngine_SerializeUser: ['int', ['void*', 'bool', 'void*', 'int*']],
    IEngine_AddFingerprint: ['int', ['void*', 'int', 'void*', 'int']],
    IEngine_GetParameter: ['int', ['int', 'int*']],
    IEngine_SetParameter: ['int', ['int', 'int']],
    IEngine_ExportUserTemplate: ['int', ['void*', 'int', 'void*', 'int*']],
    IEngine_GetFingerprintImage: ['int', ['void*', 'int', 'int', 'void*', 'int*']],
  });

  return {
    sync: {
      IEngine_InitModule: lib.IEngine_InitModule,
      IEngine_TerminateModule: lib.IEngine_TerminateModule,
      IEngine_GetErrorMsg: lib.IEngine_GetErrorMsg,
    },
    IEngine_InitUser: pify(lib.IEngine_InitUser.async),
    IEngine_DeserializeUser: pify(lib.IEngine_DeserializeUser.async),
    IEngine_SerializeUser: pify(lib.IEngine_SerializeUser.async),
    IEngine_AddFingerprint: pify(lib.IEngine_AddFingerprint.async),
    IEngine_GetParameter: lib.IEngine_GetParameter,
    IEngine_SetParameter: lib.IEngine_SetParameter,
    IEngine_ExportUserTemplate: pify(lib.IEngine_ExportUserTemplate.async),
    IEngine_GetFingerprintImage: pify(lib.IEngine_GetFingerprintImage.async),
  };
};

const lib = createLibrary();

function getErrorMsg(code) {
  return lib.sync.IEngine_GetErrorMsg(code);
}

function isOkCheck(result) {
  if (result !== 0) {
    throw new Error(`${result} ${getErrorMsg(result)}`);
  }
}

function terminateModule() {
  isOkCheck(lib.sync.IEngine_TerminateModule());
}


async function getParameter(code) {
  const resultRef = ref.alloc('int', 0);
  isOkCheck(await lib.IEngine_GetParameter(code, resultRef));

  return resultRef.deref();
}

async function setParameter(code, value) {
  isOkCheck(await lib.IEngine_SetParameter(code, value));
}

class User {
  constructor(rawUser) {
    this.rawUser = rawUser;
  }
  async addFingerprint(image, position) {
    isOkCheck(await lib.IEngine_AddFingerprint(this.rawUser, position, image, image.length));
  }
  async serializeUser(serializeImages) {
    const sizeRef = ref.alloc('int', 0);
    isOkCheck(await lib.IEngine_SerializeUser(this.rawUser, serializeImages, ref.NULL, sizeRef));

    const buf = Buffer.alloc(sizeRef.deref());

    isOkCheck(await lib.IEngine_SerializeUser(this.rawUser, serializeImages, buf, sizeRef));

    return buf;
  }

  async exportUserTemplate(format) {
    const sizeRef = ref.alloc('int', 0);

    isOkCheck(await lib.IEngine_ExportUserTemplate(this.rawUser, format, ref.NULL, sizeRef));

    const template = Buffer.alloc(sizeRef.deref());

    isOkCheck(await lib.IEngine_ExportUserTemplate(this.rawUser, format, template, sizeRef));

    return template;
  }
  async getFingerprintImage(index, format) {
    const sizeRef = ref.alloc('int', 0);
    isOkCheck(await lib.IEngine_GetFingerprintImage(
      this.rawUser, index, format,
      ref.NULL, sizeRef,
    ));

    const image = Buffer.alloc(sizeRef.deref());

    isOkCheck(await lib.IEngine_GetFingerprintImage(
      this.rawUser, index, format,
      image, sizeRef,
    ));

    return image;
  }



}

async function rawInitUser() {
  const rawUser = await lib.IEngine_InitUser();
  if (ref.isNull(rawUser)) {
    throw new Error('initUser failed');
  }
  return rawUser;
}

async function initUser() {
  const rawUser = await rawInitUser();
  return new User(rawUser);
}

async function deserializeUser(buf) {
  const rawUser = await rawInitUser();
  isOkCheck(await lib.IEngine_DeserializeUser(rawUser, buf));
  return new User(rawUser);
}


const api = {
  config,
  imageFormat,
  templateFormat,
  fingerPosition,
  setParameter,
  getParameter,
  initUser,
  deserializeUser,
  sync: {
    terminateModule,
  },
};

function initModule() {
  isOkCheck(lib.sync.IEngine_InitModule());
  return api;
}

module.exports = {
  initModule,
};
