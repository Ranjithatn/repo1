import {
  customSearchDataSelector,
  customSearchSelectedPersonSelector,
  customSearchIdListSelector,
  matchedRowSelector,
  customSearchDatabaseSelector
} from "../../app/selectors/customSearch";

let state = {
  customSearch: {
    customSearch: {
      SAMISID: "111",
      fileNo: ""
    },
    customSearchPersonInfo: {
      id: "4",
      person: { id: "4", name: "xxx" },
      mugshot: { id: "4", thumbNail: "xxx" },
      score: 93
    },
    searchIdList: {
      0: { key: "SAMISID", value: "789" },
      1: { key: "File Number", value: "789" }
    },
    matchedRowId: 0,
    database:'Criminal'
  }
};

describe("custom Search Selectors", () => {
  describe("customSearchDataSelector", () => {
    it("should get the search data", () => {
      const output = customSearchDataSelector(state);
      const expected = {
        SAMISID: "111",
        fileNo: ""
      };
      expect(output).toEqual(expected);
    });
  });
  describe("customSearchIdListSelector", () => {
    it("should get the searched data", () => {
      const output = customSearchIdListSelector(state);
      const expected = {
        0: { key: "SAMISID", value: "789" },
        1: { key: "File Number", value: "789" }
      };
      expect(output).toEqual(expected);
    });
  });
  describe("customSearchSelectedPersonSelector", () => {
    it("should get the search person", () => {
      const output = customSearchSelectedPersonSelector(state);
      const expected = {
        id: "4",
        person: { id: "4", name: "xxx" },
        mugshot: { id: "4", thumbNail: "xxx" },
        score: 93
      };
      expect(output).toEqual(expected);
    });
  });
  describe("matchedRowSelector", () => {
    it("should get the match row id", () => {
      const output = matchedRowSelector(state);
      const expected = 0;
      expect(output).toEqual(expected);
    });
  });
  describe("customSearchDatabaseSelector", () => {
    it("should get the Database nmae", () => {
      const output = customSearchDatabaseSelector(state);
      const expected = "Criminal";
      expect(output).toEqual(expected);
    });
  });
});
