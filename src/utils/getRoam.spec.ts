import type { ConnectivityMonitoring_4 } from '@nordicsemiconductor/lwm2m-types'
import { getRoam } from './getRoam.js'

describe('getRoam', () => {
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

	it(`get the 'roam' object which is required in Asset Tracker web app`, () => {
		const connectivityMonitoring = {
			'0': 6,
			'1': 7, //[6, 7], // TODO: solve this
			'2': -85,
			'3': 23,
			'4': '10.160.120.155', //['10.160.120.155'], // TODO: solve this
			'8': 34237196,
			'9': 20,
			'10': 242,
			'12': 12,
		}
		const roam = getRoam(connectivityMonitoring, metadata) as {
			result: unknown
		}
		expect(roam.result).toStrictEqual({
			v: {
				band: 1, // ***** origin missing *****
				nw: '6', //'NB-IoT',
				rsrp: -85,
				area: 12,
				mccmnc: 24220,
				cell: 34237196,
				ip: '10.160.120.155',
				eest: 5, // ***** origin missing *****
			},
			ts: 1688731863032,
		})
	})

	it(`should return error if Connectivity Monitoring (4) object is missing`, () => {
		const result = getRoam(undefined, metadata) as { error: Error }
		expect(result.error).not.toBe(undefined)
	})

	it(`should return error if conversion from Connectivity Monitoring (4) object to 'roam' went wrong`, () => {
		const connectivityMonitoring = {
			'0': 6,
			'1': 7, //[6, 7], // TODO: solve this
			'2': -85,
			'3': 23,
			// required value is missing '4': '10.160.120.155' , //['10.160.120.155'], // TODO: solve this
			'8': 34237196,
			'9': 20,
			'10': 242,
			'12': 12,
		} as ConnectivityMonitoring_4
		const result = getRoam(connectivityMonitoring, metadata) as { error: Error }
		expect(result.error).not.toBe(undefined)
	})
})
