export default () => {
  return {
    Units: "Inches",
    Name: "Palm Printing Card",
    TotalPages: 2,
    Page: 1,
    ScanArea: {
      Page: "1",
      Top: "0.0",
      Left: "0.0",
      Height: "11.69",
      Width: "8.27"
    },
    CropRegions: [
      {
        Page: "1",
        Name: "L. PLAIN THUMB",
        Top: "9.6",
        Left: "0.7",
        Height: "1.4",
        Width: "2.6"
      },

      {
        Page: "1",
        Name: "R. PLAIN THUMB",
        Top: "9.6",
        Left: "5.3",
        Height: "1.4",
        Width: "2.3"
      },
    ]
  }
};
