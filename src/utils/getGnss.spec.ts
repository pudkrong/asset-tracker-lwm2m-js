import type { Location_6 } from '@nordicsemiconductor/lwm2m-types'
import { getGnss } from './getGnss.js'

describe('getGnss', () => {
	const metadata = {
		$lastUpdated: '2023-07-07T12:11:03.0324459Z',
		lwm2m: {
			'3': {
				'0': {
					'0': {
						$lastUpdated: '2023-07-07T12:11:03.0324459Z',
						value: {
							$lastUpdated: '2023-07-07T12:11:03.0324459Z',
						},
					},
					'3': {
						$lastUpdated: '2023-07-07T12:11:03.0324459Z',
						value: {
							$lastUpdated: '2023-07-07T12:11:03.0324459Z',
						},
					},
					'7': {
						$lastUpdated: '2023-08-03T12:11:03.0324459Z',
						value: {
							$lastUpdated: '2023-08-03T12:11:03.0324459Z',
						},
					},
					'13': {
						$lastUpdated: '2023-07-07T12:11:03.0324459Z',
						value: {
							$lastUpdated: '2023-07-07T12:11:03.0324459Z',
						},
					},
					$lastUpdated: '2023-07-07T12:11:03.0324459Z',
				},
				$lastUpdated: '2023-07-07T12:11:03.0324459Z',
			},
			$lastUpdated: '2023-07-07T12:11:03.0324459Z',
		},
	}

	it(`should get the gnss object which is required in nRF Asset Tracker`, () => {
		const location = {
			'0': -43.5723,
			'1': 153.2176,
			'2': 2,
			'3': 24.798573,
			'5': 1665149633,
			'6': 0.579327,
		}
		const gnss = getGnss(location, metadata) as { result: unknown }
		expect(gnss.result).toStrictEqual({
			v: {
				lng: 153.2176,
				lat: -43.5723,
				acc: 24.798573,
				alt: 2,
				spd: 0.579327,
				hdg: 0, // ***** origin missing *****
			},
			ts: 1665149633000,
		})
	})

	it(`should return error in case Location object is undefined`, () => {
		const result = getGnss(undefined, metadata) as { error: Error }
		expect(result.error).not.toBe(undefined)
	})

	it(`should return error in case something went wrong in conversion from Location object to GNSS`, () => {
		const location = {
			// '0': -43.5723, // required value is missing
			'1': 153.2176,
			'2': 2,
			'3': 24.798573,
			'5': 1665149633,
			'6': 0.579327,
		} as unknown as Location_6
		const result = getGnss(location, metadata) as { error: Error }
		expect(result.error).not.toBe(undefined)
	})
})
