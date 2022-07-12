import {
  jobsListSelector,
  jobsPagingSelector,
  jobsPagesSelector,
  jobsCurrentPageSelector,
  jobsTotalPagesSelector,
  jobsPageSizeSelector,
  jobsStateSelector,
  selectedJobSelector,
  actionHistoryStateSelector,
  actionHistoryListSelector,
  selectedActionSelector,
  cardTypeSelector,
  scanResolutionSelector,
  cardScanResolutionSelector,
  fullCardScanImageSelector,
  cardConfigSelector,
  jobsMaxPagesSelector,
  cardScanBoxesSelector,
  jobsByIdStateSelector,
  selectedJobStatusSelector,
  totalJobsSelector,
  ActionHistoryFilterSelector,
  jobfilterSelector,
  selectedTcnSelector,
  newJobIdSelector,
  ActionSelector,
  ActionHeaderSelector,
  SelectedActionHistorySelector,
  jobsTypeSelector,
  SelectedActionStatusSelector,
  SelectedActionTypeSelector,
  NewSearchActionSelector,
  BiometricsDetailsSelector,
  FilterTitleSelector,
  jobsFilterTitleSelector,
  setJobTypeFilter,
  jobsForFilter,
  selectedScanSourceSelector,
  scanSourcesSelector,
  cardImageDimensionsSelector,
  cardSegmentedPrintsSelector,
  cardScanAnnotationsSelector
} from "../../app/selectors/jobs";

let state = {
  jobs: {
    filter: {
      value: "",
      displayName: "",
      type: "USER ID"
    },
    jobFilter: {
      value: "",
      displayName: "",
      type: "USER ID"
    },
    selectedJobStatus: "New",
    selectedAction: 5,
    actionHistory: {
      results: [{ id: 4 }, { id: 5 }, { id: 6 }]
    },
    selectedJob: 2,
    jobsIdList: [1, 2, 3],
    jobsById: {
      1: {
        id: 1
      },
      2: {
        id: 2
      },
      3: {
        id: 3
      }
    },
    newJob: {
      cardScan: {
        cardImage: "abc",
        cardType: "UCW",
        segmentedData: [],
        scanResolution: 500,
        scannerType: 17,
        boxes: { "R. ROLLED THUMB": {}, "R. ROLLED INDEX": {} },
        cardConfig: { ScanArea: {}, Units: "Inches" },
        selectedScanSource:"",
        scanSources:"",
        imageDimensions:"",
        segmentedPrints:"",
        annotations:"",
      },
      id: 3
    },
    jobsPaging: {
      maxPages: 11,
      pageSize: 10,
      currentPage: 1,
      totalPages: 3,
      totalCount: 30,
      pages: [1, 2, 3]
    },
    selectedTcn: 1522651309996,
    newAction: "Search Criminal",
    actionHeader: "Search Criminal",
    jobType: "Tenprint",
    selectedActionStatus: "Response Received - Hit",
    SelectedActionType: "Search Criminal",
    newSearchAction: ["Search Civil", "Search Latent", "Search Criminal"],
    BiometricsDetails: {
      FingerImages: {
        Fingers: {
          LThumb: [
            {
              id: "37",
              type: "Finger",
              position: "LeftThumb",
              impression: "Flat",
              encoding: "PNG"
            }
          ],
          LIndex: []
        }
      },
      MugShotImage: [],
      FourFingersImages: {}
    },
    JobTypeFilter:"data",
  }
};

describe("jobs selectors", () => {
  describe("jobsStateSelector", () => {
    it("should get the full jobs state", () => {
      const jobInitState = { jobs: { a: { b: { c: { d: "e" } } } } };
      const output = jobsStateSelector(jobInitState);
      const expected = { a: { b: { c: { d: "e" } } } };
      expect(output).toEqual(expected);
    });
  });
  describe("jobsListSelector", () => {
    it("should get a list of job objects", () => {
      const output = jobsListSelector(state);
      const expected = [{ id: 1 }, { id: 2 }, { id: 3 }];
      expect(output).toEqual(expected);
    });
    it("should return undefined", () => {
      const initState = { jobs: { jobsIdList: [], jobsById: {} } };
      const output = jobsListSelector(initState);
      expect(output).toEqual(undefined);
    });
  });

  describe("jobsPagingSelector", () => {
    it("should get the jobsPaging from state", () => {
      const output = jobsPagingSelector(state);
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
  });
  describe("jobsPagesSelector", () => {
    it("should get the pages array", () => {
      const output = jobsPagesSelector(state);
      const expected = [1, 2, 3];
      expect(output).toEqual(expected);
    });
  });
  describe("jobsCurrentPageSelector", () => {
    it("should get the currentPage from jobsPaging", () => {
      const output = jobsCurrentPageSelector(state);
      const expected = 1;
      expect(output).toEqual(expected);
    });
  });
  describe("jobsTotalPagesSelector", () => {
    it("should get the totalPages from jobsPaging", () => {
      const output = jobsTotalPagesSelector(state);
      const expected = 3;
      expect(output).toEqual(expected);
    });
  });
  describe("jobsPageSizeSelector", () => {
    it("should get pageSize from jobsPaging", () => {
      const output = jobsPageSizeSelector(state);
      const expected = 10;
      expect(output).toEqual(expected);
    });
  });
  describe("selectedJobSelector", () => {
    it("should get the selectedJob from jobs store", () => {
      const output = selectedJobSelector(state);
      const expected = 2;
      expect(output).toEqual(expected);
    });
  });
  describe("actionHistoryStateSelector", () => {
    it("should return the actionHistoryObj", () => {
      const output = actionHistoryStateSelector(state);
      const expected = {
        results: [{ id: 4 }, { id: 5 }, { id: 6 }]
      };
      expect(output).toEqual(expected);
    });
  });
  describe("actionHistoryListSelector", () => {
    it("should return actionHistory results", () => {
      const output = actionHistoryListSelector(state);
      const expected = [{ id: 4 }, { id: 5 }, { id: 6 }];
      expect(output).toEqual(expected);
    });
  });
  describe("selectedActionSelector", () => {
    it("should return the selected action id", () => {
      const output = selectedActionSelector(state);
      const expected = 5;
      expect(output).toEqual(expected);
    });
  });

  describe("cardTypeSelector", () => {
    it("should return the selected card type", () => {
      const output = cardTypeSelector(state);
      const expected = "UCW";
      expect(output).toEqual(expected);
    });
  });

  describe("scanResolutionSelector", () => {
    it("should return the selected card type", () => {
      const output = scanResolutionSelector(state);
      const expected = 500;
      expect(output).toEqual(expected);
    });
  });

  describe("cardScanResolutionSelector", () => {
    it("should return the selected card resolution", () => {
      const output = cardScanResolutionSelector(state);
      const expected = 500;
      expect(output).toEqual(expected);
    });
  });

  describe("fullCardScanImageSelector", () => {
    it("should return the first image in imageData Arr", () => {
      const output = fullCardScanImageSelector(state);
      const expected = "abc";
      expect(output).toEqual(expected);
    });
  });

  describe("jobsMaxPagesSelector", () => {
    it("should return maxPages from jobs", () => {
      const output = jobsMaxPagesSelector(state);
      const expected = 11;
      expect(output).toEqual(expected);
    });
  });

  describe("cardConfigSelector", () => {
    it("should return the xml card configuration converted to javascript", () => {
      const output = cardConfigSelector(state);
      const expected = { ScanArea: {}, Units: "Inches" };
      expect(output).toEqual(expected);
    });
  });

  describe("cardScanBoxesSelector", () => {
    it("should return the boxes", () => {
      const output = cardScanBoxesSelector(state);
      const expected = { "R. ROLLED THUMB": {}, "R. ROLLED INDEX": {} };
      expect(output).toEqual(expected);
    });
  });
  describe("jobsByIdStateSelector ", () => {
    it("should return the boxes", () => {
      const output = jobsByIdStateSelector(state);
      const expected = {
        1: {
          id: 1
        },
        2: {
          id: 2
        },
        3: {
          id: 3
        }
      };
      expect(output).toEqual(expected);
    });
  });

  describe("selectedJobStatusSelector  ", () => {
    it("should return the boxes", () => {
      const output = selectedJobStatusSelector(state);
      const expected = "New";
      expect(output).toEqual(expected);
    });
  });
  describe("totalJobsSelector   ", () => {
    it("should return the boxes", () => {
      const output = totalJobsSelector(state);
      const expected = 30;
      expect(output).toEqual(expected);
    });
  });
  describe("ActionHistoryFilterSelector    ", () => {
    it("should return the boxes", () => {
      const output = ActionHistoryFilterSelector(state);
      const expected = {
        value: "",
        displayName: "",
        type: "USER ID"
      };
      expect(output).toEqual(expected);
    });
  });

  describe("jobfilterSelector     ", () => {
    it("should return the boxes", () => {
      const output = jobfilterSelector(state);
      const expected = {
        value: "",
        displayName: "",
        type: "USER ID"
      };
      expect(output).toEqual(expected);
    });
  });
  describe("selectedTcnSelector", () => {
    it("should get the TCN number", () => {
      const output = selectedTcnSelector(state);
      const expected = 1522651309996;
      expect(output).toEqual(expected);
    });
  });
  describe("newJobIdSelector", () => {
    it("should get the new job id", () => {
      const output = newJobIdSelector(state);
      const expected = 3;
      expect(output).toEqual(expected);
    });
  });

  describe("ActionSelector", () => {
    it("should get the selected action type", () => {
      const output = ActionSelector(state);
      const expected = "Search Criminal";
      expect(output).toEqual(expected);
    });
  });
  describe("ActionHeaderSelector", () => {
    it("should get the selected action type", () => {
      const output = ActionHeaderSelector(state);
      const expected = "Search Criminal";
      expect(output).toEqual(expected);
    });
  });
  describe("SelectedActionHistorySelector", () => {
    it("should get the selected action", () => {
      const output = SelectedActionHistorySelector(state);
      const expected = 5;
      expect(output).toEqual(expected);
    });
  });
  describe("jobsTypeSelector", () => {
    it("should get the selected job type", () => {
      const output = jobsTypeSelector(state);
      const expected = "Tenprint";
      expect(output).toEqual(expected);
    });
  });
  describe("SelectedActionStatusSelector", () => {
    it("should get the job action status", () => {
      const output = SelectedActionStatusSelector(state);
      const expected = "Response Received - Hit";
      expect(output).toEqual(expected);
    });
  });
  describe("SelectedActionTypeSelector", () => {
    it("should get the job action type", () => {
      const output = SelectedActionTypeSelector(state);
      const expected = "Search Criminal";
      expect(output).toEqual(expected);
    });
  });
  describe("NewSearchActionSelector", () => {
    it("should get the search action for job", () => {
      const output = NewSearchActionSelector(state);
      const expected = ["Search Civil", "Search Latent", "Search Criminal"];
      expect(output).toEqual(expected);
    });
  });

  describe("BiometricsDetailsSelector", () => {
    it("should get the Biometrics Details for job", () => {
      const output = BiometricsDetailsSelector(state);
      const expected = {
        FingerImages: {
          Fingers: {
            LThumb: [
              {
                id: "37",
                type: "Finger",
                position: "LeftThumb",
                impression: "Flat",
                encoding: "PNG"
              }
            ],
            LIndex: []
          }
        },
        MugShotImage: [],
        FourFingersImages: {}
      };
      expect(output).toEqual(expected);
    });
  });
  describe("FilterTitleSelector", () => {
    it("should get the filter title", () => {
      const output = FilterTitleSelector(state);
      const expected = "USER ID";
      expect(output).toEqual(expected);
    });
  });
  describe("jobsFilterTitleSelector", () => {
    it("should get the filter title", () => {
      const output = jobsFilterTitleSelector(state);
      const expected = "USER ID";
      expect(output).toEqual(expected);
    });
  });
  describe("setJobTypeFilter", () => {
    it("should get the filter title", () => {
      const output = setJobTypeFilter(state);
      const expected = "data";
      expect(output).toEqual(expected);
    });
  });
  describe("jobsForFilter", () => {
    it("should get the jobs for filter", () => {
      const output = jobsForFilter(state);
      const expected = state;
      expect(output).toEqual(expected);
    });
  });
  describe("selectedScanSourceSelector", () => {
    it("should get the seleted scan sources", () => {
      const output = selectedScanSourceSelector(state);
      const expected = "";
      expect(output).toEqual(expected);
    });
  });
  describe("scanSourcesSelector", () => {
    it("should get the scan sources", () => {
      const output = scanSourcesSelector(state);
      const expected = "";
      expect(output).toEqual(expected);
    });
  });
  describe("cardImageDimensionsSelector", () => {
    it("should get the card image dimensions", () => {
      const output = cardImageDimensionsSelector(state);
      const expected = "";
      expect(output).toEqual(expected);
    });
  });
  describe("cardSegmentedPrintsSelector", () => {
    it("should get the card annotations", () => {
      const output = cardSegmentedPrintsSelector(state);
      const expected = "";
      expect(output).toEqual(expected);
    });
  });
  describe("cardScanAnnotationsSelector", () => {
    it("should get the card annotations", () => {
      const output = cardScanAnnotationsSelector(state);
      const expected = "";
      expect(output).toEqual(expected);
    });
  });
});
