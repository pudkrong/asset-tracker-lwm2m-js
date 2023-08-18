import {
	Device_3_urn,
	ConnectivityMonitoring_4_urn,
	Location_6_urn,
	Temperature_3303_urn,
	Humidity_3304_urn,
	Pressure_3323_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { Config_50009_urn } from '../schemas/Config_50009.js'
import { converter, type LwM2MAssetTrackerV2 } from './converter.js'

describe('converter', () => {
	it('should convert LwM2M Asset Tracker v2 format into Asset Tracker Web App format', () => {
		const input = {
			[Device_3_urn]: {
				'0': 'Nordic Semiconductor ASA',
				'1': 'Thingy:91',
				'2': '351358815340515',
				'3': '22.8.1+0',
				'7': 2754,
				'11': [0],
				'13': 1675874731,
				'16': 'UQ',
				'19': '3.2.1',
			},

			[ConnectivityMonitoring_4_urn]: {
				'0': 6,
				'1': [6, 7],
				'2': -85,
				'3': 23,
				'4': ['10.160.120.155'],
				'8': 34237196,
				'9': 2,
				'10': 242,
				'12': 12,
			},

			[Location_6_urn]: {
				'0': -43.5723,
				'1': 153.2176,
				'2': 2,
				'5': 1665149633,
				'6': 5,
			},

			[Temperature_3303_urn]: [
				{
					'5601': 27.18,
					'5602': 27.71,
					'5700': 27.18,
					'5701': 'Cel',
				},
			],

			[Humidity_3304_urn]: [
				{
					'5601': 23.535,
					'5602': 24.161,
					'5700': 24.057,
					'5701': '%RH',
				},
			],

			[Pressure_3323_urn]: [
				{
					'5601': 101697,
					'5602': 101705,
					'5700': 10,
					'5701': 'Pa',
				},
			],

			[Config_50009_urn]: {
				'0': true,
				'2': 120,
				'3': 600,
				'4': 7200,
				'1': 120,
				'5': 8.5,
				'8': 2.5,
				'9': 0.5,
			},
		}
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

		const output = {
			bat: {
				v: 2754,
				ts: 1675874731000,
			},
			env: {
				v: {
					temp: 23.6,
					hum: 50.5,
					atmp: 100.36,
				},
				ts: 1563968743666,
			},
			gnss: {
				v: {
					lng: 10.436642,
					lat: 63.421133,
					acc: 24.798573,
					alt: 170.528305,
					spd: 0.579327,
					hdg: 0, // ***** origin missing *****
				},
				ts: 1563968752991,
			},
			cfg: {
				loct: 60,
				act: false,
				actwt: 60,
				mvres: 60,
				mvt: 3600,
				accath: 10.5,
				accith: 5.2,
				accito: 1.7,
				nod: [],
			},
			dev: {
				v: {
					imei: '352656106111232',
					iccid: '0000000000000000000', // ***** origin missing *****
					modV: 'mfw_nrf9160_1.0.0',
					brdV: 'thingy91_nrf9160',
				},
				ts: 1563968743666,
			},
			roam: {
				v: {
					band: 3, // ***** origin missing *****
					nw: 'NB-IoT',
					rsrp: -97,
					area: 12,
					mccmnc: 24202,
					cell: 33703719,
					ip: '10.81.183.99',
					eest: 5, // ***** origin missing *****
				},
				ts: 1563968743666,
			},
		}

		expect(
			converter(input as unknown as LwM2MAssetTrackerV2, metadata), // TODO: solve type error
		).toStrictEqual(output)
	})
})
