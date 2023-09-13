import {
	ConnectivityMonitoring_4_urn,
	Device_3_urn,
	Humidity_3304_urn,
	Location_6_urn,
	Pressure_3323_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { Config_50009_urn } from '../src/schemas/Config_50009.js'

export const input = {
	[Device_3_urn]: {
		'0': 'Nordic Semiconductor ASA',
		'1': 'Thingy:91',
		'2': '351358815340515',
		'3': '22.8.1+0',
		'7': [2754],
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
		'9': 20,
		'10': 242,
		'12': 12,
	},

	[Location_6_urn]: {
		'0': -43.5723,
		'1': 153.2176,
		'2': 2,
		'3': 24.798573,
		'5': 1665149633,
		'6': 0.579327,
	},

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
		'1': 120,
		'2': 120,
		'3': 600,
		'4': 7200,
		'5': 8.5,
		'6': false,
		'7': true,
		'8': 2.5,
		'9': 0.5,
	},
}
