import { latentImageSelector, latentSUDSelector, scannedImageSelector } from '../../app/selectors/latent';


describe("app selectors", () => {

  it("should get latentImage data ", () => {
    const state = {
      latent: {
        SUDData: {},
        latentScan: {
          isScan: false,
          base64Data: ""
        }
      }
    }
    const output = latentImageSelector(state);
    console.log('output: ', output);
    const expected = state.latent
    expect(output).toEqual(expected);
  })

  it("should get latentSUD data", () => {
    const state = {
      latent: {
        SUDData: {},
        latentScan: {
          isScan: false,
          base64Data: ""
        }
      }
    }
    const output = latentSUDSelector(state);
    const expected = {}
    expect(output).toEqual(expected);
  })
  it("should get latentSUD data", () => {
    const state = {
      latent: {
        SUDData: {},
        latentScan: {
          isScan: false,
          base64Data: ""
        }
      }
    }
    const output = scannedImageSelector(state);
    const expected = {
      isScan: false,
      base64Data: ""
    }
    expect(output).toEqual(expected);
  })
})
