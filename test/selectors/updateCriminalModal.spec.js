import {addNewCriminalSelector,newCrimeTypeSelector } from '../../app/selectors/updateCriminalModal';


describe("updateCriminalModal selectors", () => {

  it("should get addNewCriminalSelector data ", () => {
    const state = {
      updateCriminalModal: {
        addCrimeData: {
          CaseType: '',
          Description: ''
        },
        addedCrimeData: []
      }
    }
    const output = addNewCriminalSelector(state);
    const expected = state.updateCriminalModal.addedCrimeData
    expect(output).toEqual(expected);
  })

  it("should get newCrimeTypeSelector data ", () => {
    const state = {
      updateCriminalModal: {
        addCrimeData: {
          CaseType: '',
          Description: ''
        },
        addedCrimeData: []
      }
    }
    const output = newCrimeTypeSelector(state);
    const expected = state.updateCriminalModal.addCrimeData
    expect(output).toEqual(expected);
  });
  
});
