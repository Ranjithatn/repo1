import {
  tenprintVerifyLeftFingersSelector,
  tenprintVerifyRightFingersSelector,
  tenprintVerifyMugshotSelector,
  tenprintVerifyPersonInfosSelector,
  tenprintVerifySelectedHandInfoSelector,
  tenprintVerifyLeftMatchInfoSelector,
  tenprintVerifyRightMatchInfoSelector,
  tenprintVerifyUserMatchInfoSelector,
  showAdjudicatorSelector,
  SelectedRowSelector,
  SelectedMatchSelector,
  adjudicatorPassImageDataSelector,
  adjudicatorImageDataSelector,
  tenprintPersonModalSelector,
  MatchedUserRowIDSelector,
  MatchedPersonInfoSelector,
  ModalDataInfoSelector,
  ActionNoteSelector,
  SelectedActionTypeSelector,
  // showSelectedTenprintTypeSelector,
  adjudicatorResultSelector,
  // modalCheckboxSelector,
  tenprintVerifyRaw,
  databaseSelector, 
} from "../../app/selectors/tenprint";

const state = {
  modal: {
    modalProps: {}
  },
  jobs: {
    SelectedActionType: "Search Latent"
  },
  tenprint: {
    ActionNote: "Note",
    tenprintverifydata: {
      leftfingers: {
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
        },
        4: {
          id: ""
        }
      },
      leftmatches: {
        0: {
          id: ""
        },
        1: {
          id: ""
        }
      },
      rightmatches: {
        0: {
          id: ""
        },
        1: {
          id: ""
        }
      },
      rightfingers: {
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
        },
        4: {
          id: ""
        }
      },
      ProbeMugshotInfo: "Base64Data",
      personinfos: {
        0: {
          name: "",
          id: "",
          mugshot: ""
        },
        1: {
          name: "",
          id: "",
          mugshot: ""
        }
      },
      database:"Criminal"
    },
    tenprintverifyMatchInfo: {
      Results: []
    },
    tenprintverifyHandData: {
      position: "Left"
    },
    ShowAdjudicator: false,
    SelectedRow: 0,
    AdjudicatorPassImageData: {
      Result: {
        matched: {
          image: "Base64Data"
        }
      }
    },
    showTenprintSelected: "Left",
    MatchedUserRowID: "",
    ModalCheckbox: {
      lashing: false,
      fine: false
    },
    adjudicatorResult: {},
    MatchedPersonInfo: {},
    adjudicatorMatch: [],
    ConfirmModalData: {},
    selectedSearchOption: undefined,
    tenprint:'',
  }
};

describe("tenprint selectors", () => {
  describe("tenprintVerifyLeftFingersSelector", () => {
    it("should get the Left fingers data", () => {
      const output = tenprintVerifyLeftFingersSelector(state);
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
        },
        4: {
          id: ""
        }
      };
      expect(output).toEqual(expected);
    });
  });
  describe("tenprintVerifyRightFingersSelector", () => {
    it("should get the right fingers data", () => {
      const output = tenprintVerifyRightFingersSelector(state);
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
        },
        4: {
          id: ""
        }
      };
      expect(output).toEqual(expected);
    });
  });

  describe("tenprintVerifyMugshotSelector", () => {
    it("should get the probe mugshot info", () => {
      const output = tenprintVerifyMugshotSelector(state);
      const expected = "Base64Data";
      expect(output).toEqual(expected);
    });
  });
  describe("tenprintVerifyPersonInfosSelector", () => {
    it("should get the matched persons info", () => {
      const output = tenprintVerifyPersonInfosSelector(state);
      const expected = {
        0: {
          name: "",
          id: "",
          mugshot: ""
        },
        1: {
          name: "",
          id: "",
          mugshot: ""
        }
      };
      expect(output).toEqual(expected);
    });
  });
  describe("tenprintVerifySelectedHandInfoSelector", () => {
    it("should get the matched Selected Hand", () => {
      const output = tenprintVerifySelectedHandInfoSelector(state);
      const expected = {
        position: "Left"
      };
      expect(output).toEqual(expected);
    });
  });

  describe("tenprintVerifyLeftMatchInfoSelector", () => {
    it("should get the Left fingers match data", () => {
      const output = tenprintVerifyLeftMatchInfoSelector(state);
      const expected = {
        0: {
          id: ""
        },
        1: {
          id: ""
        }
      };
      expect(output).toEqual(expected);
    });
  });

  describe("tenprintVerifyRightMatchInfoSelector", () => {
    it("should get the Right fingers match data", () => {
      const output = tenprintVerifyRightMatchInfoSelector(state);
      const expected = {
        0: {
          id: ""
        },
        1: {
          id: ""
        }
      };
      expect(output).toEqual(expected);
    });
  });
  describe("tenprintVerifyUserMatchInfoSelector", () => {
    it("should get the user  matched data", () => {
      const output = tenprintVerifyUserMatchInfoSelector(state);
      const expected = {
        Results: []
      };
      expect(output).toEqual(expected);
    });
  });
  describe("showAdjudicatorSelector", () => {
    it("should get the show adjuticator status", () => {
      const output = showAdjudicatorSelector(state);
      const expected = false;
      expect(output).toEqual(expected);
    });
  });
  describe("SelectedRowSelector", () => {
    it("should get the selected row of matched user", () => {
      const output = SelectedRowSelector(state);
      const expected = 0;
      expect(output).toEqual(expected);
    });
  });
  describe("SelectedMatchSelector", () => {
    it("should get the selected  matched user", () => {
      const output = SelectedMatchSelector(state);
      const expected = [];
      expect(output).toEqual(expected);
    });
  });
  describe("adjudicatorPassImageDataSelector ", () => {
    it("should get the image data to send adjuticator", () => {
      const output = adjudicatorPassImageDataSelector(state);
      const expected = {
        Result: {
          matched: {
            image: "Base64Data"
          }
        }
      };
      expect(output).toEqual(expected);
    });
  });
  describe("adjudicatorImageDataSelector", () => {
    it("should get the image data to send adjuticator", () => {
      const output = adjudicatorImageDataSelector(state);
      const expected = "Base64Data";
      expect(output).toEqual(expected);
    });
  });
  describe("MatchedUserRowIDSelector", () => {
    it("should get the matched user Row ID", () => {
      const output = MatchedUserRowIDSelector(state);
      const expected = "";
      expect(output).toEqual(expected);
    });
  });
  describe("MatchedPersonInfoSelector", () => {
    it("should get the matched user Information", () => {
      const output = MatchedPersonInfoSelector(state);
      const expected = {};
      expect(output).toEqual(expected);
    });
  });
  describe("ModalDataInfoSelector", () => {
    it("should get the Modal data Information", () => {
      const output = ModalDataInfoSelector(state);
      const expected = {};
      expect(output).toEqual(expected);
    });
  });
  describe("tenprintPersonModalSelector", () => {
    it("should get the Modal data Information", () => {
      const output = tenprintPersonModalSelector(state);
      const expected = {};
      expect(output).toEqual(expected);
    });
  });

  describe("ActionNoteSelector", () => {
    it("should get the Action type", () => {
      const output = SelectedActionTypeSelector(state);
      const expected = "Search Latent";
      expect(output).toEqual(expected);
    });
  });
  describe("ActionNoteSelector ", () => {
    it("should get the Action Note", () => {
      const output = ActionNoteSelector(state);
      const expected = "Note";
      expect(output).toEqual(expected);
    });
  });
  // describe("showSelectedTenprintTypeSelector  ", () => {
  //   it("should show tenprint selected", () => {
  //     const output = showSelectedTenprintTypeSelector(state);
  //     const expected = "Left";
  //     expect(output).toEqual(expected);
  //   });
  // });
  describe("adjudicatorResultSelector   ", () => {
    it("should show tenprint selected", () => {
      const output = adjudicatorResultSelector(state);
      const expected = {};
      expect(output).toEqual(expected);
    });
  });
  // describe("modalCheckboxSelector    ", () => {
  //   it("should show tenprint selected", () => {
  //     const output = modalCheckboxSelector(state);
  //     const expected = {
  //       lashing: false,
  //       fine: false
  //     };
  //     expect(output).toEqual(expected);
  //   });
  // });
  describe("tenprintVerifyRaw    ", () => {
    it("should show tenprint selected", () => {
      const output = tenprintVerifyRaw(state);
      const expected = {"selected": "Left", "tenprint": ""};
      expect(output).toEqual(expected);
    });
  });
  describe("databaseSelector", () => {
    it("should show selected database", () => {
      const output = databaseSelector(state);
      const expected = "Criminal";
      expect(output).toEqual(expected);
    });
  });
});
