import type { RoamingInfoData } from '@nordicsemiconductor/asset-tracker-cloud-docs'
import type { ConnectivityMonitoring_4 } from '@nordicsemiconductor/lwm2m-types'
import { transformToRoam } from './transformToRoam.js'

describe('transformToRoam', () => {
	const deviceTwinMetadata = {
		$lastUpdated: '2023-07-07T12:11:03.0324459Z',
		lwm2m: {
			'4': {
				'0': {
					'12': {
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

	it('should create roam object', () => {
		const connectMonitoring: ConnectivityMonitoring_4 = {
			'0': 6, // Network Bearer
			'1': [6],
			'2': -97, // Radio Signal Strength
			'3': 0,
			'4': ['10.160.225.39'], // IP Addresses
			'7': ['ibasis.iot'],
			'8': 33703719, // Cell ID
			'9': 2,
			'10': 2420,
			'11': 0,
			'12': 12, // LAC = Location Area Code
		}

		const expected = {
			v: {
				nw: '6', //'NB-IoT', // /4/0/0
				rsrp: -97, // 4/0/2
				area: 12, // /4/0/12
				mccmnc: 24202, // /4/0/10 & /4/0/9
				cell: 33703719, // /4/0/8
				ip: '10.160.225.39', // /4/0/4
			},
			ts: 1688731863032,
		}

		const roam = transformToRoam(connectMonitoring, deviceTwinMetadata) as {
			result: RoamingInfoData
		}

		expect(roam.result).toMatchObject(expected)
	})
})
