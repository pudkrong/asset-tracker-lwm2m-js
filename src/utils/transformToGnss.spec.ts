import type { GNSSData } from '@nordicsemiconductor/asset-tracker-cloud-docs'
import type { Location_6 } from '@nordicsemiconductor/lwm2m-types'
import { transformToGnss } from './transformToGnss.js'

describe('transformToGnss', () => {
	const deviceTwinMetadata = {
		$lastUpdated: '2023-07-07T12:11:03.0324459Z',
		lwm2m: {
			'3': {
				'0': {
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

	it('should create gnss', () => {
		const input: Location_6 = {
			'0': -43.5723,
			'1': 153.2176,
			'2': 170.528305,
			'3': 24.798573,
			'5': 1665149633,
			'6': 0.579327,
		}
		const expected = {
			v: {
				lng: 153.2176,
				lat: -43.5723,
				acc: 24.798573,
				alt: 170.528305,
				spd: 0.579327,
			},
			ts: 1665149633000,
		}
		const gnss = transformToGnss(input, deviceTwinMetadata) as {
			result: GNSSData
		}
		expect(gnss.result).toMatchObject(expected)
	})

	it('should create gnss using server time', () => {
		const input: Location_6 = {
			'0': -43.5723,
			'1': 153.2176,
			'2': 170.528305,
			'3': 24.798573,
			// '5': 1665149633, // timestamp from Location object
			'6': 0.579327,
		} as unknown as Location_6

		const expected = {
			v: {
				lng: 153.2176,
				lat: -43.5723,
				acc: 24.798573,
				alt: 170.528305,
				spd: 0.579327,
			},
			ts: 1688731863032,
		}

		const gnss = transformToGnss(input, deviceTwinMetadata) as {
			result: GNSSData
		}
		expect(gnss.result).toMatchObject(expected)
	})
})
