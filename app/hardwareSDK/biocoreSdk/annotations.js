export const Position = {
  CkbRT: 1,
  CkbRF: 2,
  CkbRM: 3,
  CkbRR: 4,
  CkbRS: 5,
  CkbLT: 6,
  CkbLF: 7,
  CkbLM: 8,
  CkbLR: 9,
  CkbLS: 10,
  CkbRLP: 25,
  CkbRUP: 26,
  CkbLLP: 27,
  CkbLUP: 28,
  properties: {
    1: { name: "CkbRT" },
    2: { name: "CkbRF" },
    3: { name: "CkbRM" },
    4: { name: "CkbRR" },
    5: { name: "CkbRS" },
    6: { name: "CkbLT" },
    7: { name: "CkbLF" },
    8: { name: "CkbLM" },
    9: { name: "CkbLR" },
    10: { name: "CkbLS" },
    25: { name: "CkbRLP" },
    26: { name: "CkbRUP" },
    27: { name: "CkbLLP" },
    28: { name: "CkbLUP" }
  }
};

export const AnnotationReasons = {
  NotAnnotated: 0,
  OtherReason: 1,
  Handicapped: 2,
  UnableToAcquire: 3,
  PermanentMissing: 4,
  properties: {
    0: { name: "NotAnnotated" },
    1: { name: "OtherReason" },
    2: { name: "Handicapped" },
    3: { name: "UnableToAcquire" },
    4: { name: "PermanentMissing" }
  }
};

export const modalities = {
  Fingerprint: 4,
  Face: 5,
  Iris: 6
};

export const annotationsStruc = {
  Annotations: {
    Annotation: [
      {
        Reason: 4,
        Info: "can't acqure",
        Modality: 4,
        Position: 6
      }
      // {
      //   Reason: 2,
      //   Info: "handicapped",
      //   Modality: 4,
      //   Position: 10
      // }
    ]
  }
};
