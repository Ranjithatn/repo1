
import { nfiqQualityThresholdSelector, serverStatusSelector } from '../../app/selectors/app';

describe("app selectors", () => {

	it("should get serverStatus", () => {
		const state = {
			app: { serverStatus: 'connected' }
		}
		const output = serverStatusSelector(state);
		const expected = "connected"
		expect(output).toEqual(expected);
	})

	it("should get nfiqQualityThresholdSelector", () => {
		const state = {
			app: {
				serverStatus: 'connected',
				settings: {
					nfiqQualityThresholdSelector: 'loading...'
				}
			}
		}

		const output = nfiqQualityThresholdSelector(state);
		const expected = undefined
		expect(output).toEqual(expected);
	})
})