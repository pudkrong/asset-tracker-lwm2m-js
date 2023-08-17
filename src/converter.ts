import {
	type ConnectivityMonitoring_4,
	ConnectivityMonitoring_4_urn,
	type Device_3,
	Device_3_urn,
	type Humidity_3304,
	Humidity_3304_urn,
	type Location_6,
	Location_6_urn,
	type Pressure_3323,
	Pressure_3323_urn,
	type Temperature_3303,
	Temperature_3303_urn,
} from '@nordicsemiconductor/lwm2m-types'
import type { AzureReportedData as AssetTrackerWebApp } from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import { type Config_50009, Config_50009_urn } from '../schemas/Config_50009.js'
import { transformToBattery } from './utils/transformToBattery.js'
import { transformToEnvironment } from './utils/transformToEnvironment.js'
import { transformToGnss } from './utils/transformToGnss.js'
import { transformToRoam } from './utils/transformToRoam.js'

export type LwM2MAssetTrackerV2 = {
	[ConnectivityMonitoring_4_urn]: ConnectivityMonitoring_4
	[Device_3_urn]: Device_3
	[Humidity_3304_urn]: Humidity_3304
	[Location_6_urn]: Location_6
	[Pressure_3323_urn]: Pressure_3323
	[Temperature_3303_urn]: Temperature_3303
	[Config_50009_urn]: Config_50009
}

export type Metadata = {
	$lastUpdated: string
	lwm2m: LwM2M_Metadata
}

export type LwM2M_Metadata = {
	[key: `${number}`]: Obj // object ID : object
	$lastUpdated: string
}

type Obj = {
	[key: `${number}`]: Instance // Instance id : instance
	$lastUpdated: string
}

type Instance = {
	[key: `${number}`]: Resource // Resource id : resource
	$lastUpdated: string
}

type Resource = {
	$lastUpdated: string
	value: {
		$lastUpdated: string
	}
}

/**
 * convert LwM2M Asset Tracker v2 format into Asset Tracker Web App format
 */
export const converter = (
	input: LwM2MAssetTrackerV2,
	metadata: Metadata,
): AssetTrackerWebApp => {
	const device = input[Device_3_urn]
	let battery = undefined
	if (device === undefined) {
		console.error('Device (3) object is missing')
	} else {
		const maybeValidBattery = transformToBattery(device, metadata)
		if ('error' in maybeValidBattery) {
			console.log(maybeValidBattery.error)
		} else {
			battery = maybeValidBattery.result
		}
	}

	const temperature = input[Temperature_3303_urn]
	const humidity = input[Humidity_3304_urn]
	const pressure = input[Pressure_3323_urn]
	let env = undefined

	if (temperature === undefined) {
		console.error('Temperature (3303) object is missing')
	}
	if (humidity === undefined) {
		console.error('Humidity (3304) object is missing')
	}
	if (pressure === undefined) {
		console.error('Pressure (3323) object is missing')
	}
	const maybeValidEnvironment = transformToEnvironment(
		temperature,
		humidity,
		pressure,
		metadata,
	)
	if ('error' in maybeValidEnvironment) {
		console.log(maybeValidEnvironment.error)
	} else {
		env = maybeValidEnvironment.result
	}

	const location = input[Location_6_urn]
	let gnss = undefined
	if (location === undefined) {
		console.error('Location (6) object is missing')
	} else {
		const maybeValidGnss = transformToGnss(location, metadata)
		if ('error' in maybeValidGnss) {
			console.log(maybeValidGnss.error)
		} else {
			gnss = maybeValidGnss.result
		}
	}

	const connectivityMonitoring = input[ConnectivityMonitoring_4_urn]
	let roam = undefined
	if (connectivityMonitoring === undefined) {
		console.error('Device (3) object is missing')
	} else {
		const maybeValidRoam = transformToRoam(connectivityMonitoring, metadata)
		if ('error' in maybeValidRoam) {
			console.log(maybeValidRoam.error)
		} else {
			roam = maybeValidRoam.result
		}
	}

	console.log(battery, env, gnss, roam)

	return {
		bat: {
			v: 2754,
			ts: 1563968747123,
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
}
