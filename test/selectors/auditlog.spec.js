import {
  auditPagingSelector,
  auditPagingDataSelector,
  auditlogsPagesSelector,
  auditlogsMaxPagesSelector,
  auditlogsCurrentPageSelector,
  auditlogsTotalPagesSelector,
  auditlogssPageSizeSelector,
  stausObjectSelector,
  crimeTypeObjectSelector,
  jobAuditLogSelector,
  jobAuditLogDescriptionSelector
} from "../../app/selectors/auditlog";
let state = {
  modal: {
    modalProps: ""
  },
  auditlogs: {
    JobAuditLogDetails: [
      {
        id: "",
        action: ""
      },
      {
        id: "",
        action: ""
      },
      {
        id: "",
        action: ""
      },
      {
        id: "",
        action: ""
      }
    ],
    auditlogPaging: {
      maxPages: 11,
      pageSize: 10,
      currentPage: 1,
      totalPages: 3,
      totalCount: 30,
      pages: [1, 2, 3]
    },

    auditLogIdList: [],
    auditLogById: {
      0: {
        id: ""
      },
      1: {
        id: ""
      },
      2: {
        id: ""
      },
      3: {
        id: ""
      }
    },
    StausObject: {
      0: {
        displayName: "New",
        value: "New"
      },
      1: {
        displayName: "Ready",
        value: "Ready"
      }
    },

    crimeTypeObject: {
      0: {
        displayName: "criminal",
        value: "criminal"
      },
      1: {
        displayName: "Murder",
        value: "Murder"
      }
    }
  }
};
describe("auditLog selectors", () => {
  describe("auditPagingSelector", () => {
    it("should get the full auditlog paging", () => {
      const output = auditPagingSelector(state);
      const expected = {
        maxPages: 11,
        pageSize: 10,
        currentPage: 1,
        totalPages: 3,
        totalCount: 30,
        pages: [1, 2, 3]
      };
      expect(output).toEqual(expected);
    });
    it("should get the full auditlog List", () => {
      const output = auditPagingDataSelector(state);
      const expected = {
        0: {
          id: ""
        },
        1: {
          id: ""
        },
        2: {
          id: ""
        },
        3: {
          id: ""
        }
      };
      expect(output).toEqual(expected);
    });

    it("should get the full auditlog pages", () => {
      const output = auditlogsPagesSelector(state);
      const expected = [1, 2, 3];
      expect(output).toEqual(expected);
    });
    it("should get the full auditlog Maximum pages", () => {
      const output = auditlogsMaxPagesSelector(state);
      const expected = 11;
      expect(output).toEqual(expected);
    });
    it("should get the full auditlog Current page", () => {
      const output = auditlogsCurrentPageSelector(state);
      const expected = 1;
      expect(output).toEqual(expected);
    });
    it("should get the full auditlog total pages", () => {
      const output = auditlogsTotalPagesSelector(state);
      const expected = 3;
      expect(output).toEqual(expected);
    });
    it("should get the full auditlog  page size", () => {
      const output = auditlogssPageSizeSelector(state);
      const expected = 10;
      expect(output).toEqual(expected);
    });
    it("should get the full auditlog  Status object", () => {
      const output = stausObjectSelector(state);
      const expected = {
        0: {
          displayName: "New",
          value: "New"
        },
        1: {
          displayName: "Ready",
          value: "Ready"
        }
      };
      expect(output).toEqual(expected);
    });
    it("should get the full auditlog  Crimetype object", () => {
      const output = crimeTypeObjectSelector(state);
      const expected = {
        0: {
          displayName: "criminal",
          value: "criminal"
        },
        1: {
          displayName: "Murder",
          value: "Murder"
        }
      };
      expect(output).toEqual(expected);
    });

    it("should get the full auditlog  Job audit log object", () => {
      const output = jobAuditLogSelector(state);
      const expected = [
        {
          id: "",
          action: ""
        },
        {
          id: "",
          action: ""
        },
        {
          id: "",
          action: ""
        },
        {
          id: "",
          action: ""
        }
      ];
      expect(output).toEqual(expected);
    });
    it("should get the full auditlog  Job audit log Description", () => {
      const output = jobAuditLogDescriptionSelector(state);
      const expected = "";
      expect(output).toEqual(expected);
    });
  });
});
