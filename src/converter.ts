import {
	Device_3_urn,
	ConnectivityMonitoring_4_urn,
	Location_6_urn,
	Temperature_3303_urn,
	Humidity_3304_urn,
	Pressure_3323_urn,
} from '@nordicsemiconductor/lwm2m-types'
import type {
	Device_3,
	ConnectivityMonitoring_4,
	Location_6,
	Temperature_3303,
	Humidity_3304,
	Pressure_3323,
} from '@nordicsemiconductor/lwm2m-types'
import type { AzureReportedData as AssetTrackerWebApp } from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import { type Config_50009, Config_50009_urn } from '../schemas/Config_50009.js'
import { getBat } from './utils/getBat.js'
import { getDev } from './utils/getDev.js'
import { getEnv } from './utils/getEnv.js'
import { getGnss } from './utils/getGnss.js'
import { getRoam } from './utils/getRoam.js'
import { getCfg } from './utils/getCfg.js'

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

export type LwM2MAssetTrackerV2 = {
	[ConnectivityMonitoring_4_urn]?: ConnectivityMonitoring_4
	[Device_3_urn]?: Device_3
	[Humidity_3304_urn]?: Humidity_3304
	[Location_6_urn]?: Location_6
	[Pressure_3323_urn]?: Pressure_3323
	[Temperature_3303_urn]?: Temperature_3303
	[Config_50009_urn]?: Config_50009
}

/**
 * convert LwM2M Asset Tracker v2 format into nRF Asset Tracker format
 */
export const converter = (
	input: LwM2MAssetTrackerV2,
	metadata: Metadata,
): AssetTrackerWebApp => {
	const result = {} as AssetTrackerWebApp
	const device = input[Device_3_urn]
	const temperature = input[Temperature_3303_urn]
	const humidity = input[Humidity_3304_urn]
	const pressure = input[Pressure_3323_urn]
	const location = input[Location_6_urn]
	const connectivityMonitoring = input[ConnectivityMonitoring_4_urn]
	const config = input[Config_50009_urn]

	const bat = getBat(device, metadata)
	if ('error' in bat) {
		console.error(bat.error)
	} else {
		result['bat'] = bat.result
	}

	const dev = getDev(device, metadata)
	if ('error' in dev) {
		console.error(dev.error)
	} else {
		result['dev'] = dev.result
	}

	const env = getEnv(temperature, humidity, pressure, metadata)
	if ('error' in env) {
		console.error(env.error)
	} else {
		result['env'] = env.result
	}

	const gnss = getGnss(location, metadata)
	if ('error' in gnss) {
		console.error(gnss.error)
	} else {
		result['gnss'] = gnss.result
	}

	const roam = getRoam(connectivityMonitoring, metadata)
	if ('error' in roam) {
		console.error(roam.error)
	} else {
		result['roam'] = roam.result
	}

	const cfg = getCfg(config)
	if ('error' in cfg) {
		console.error(cfg.error)
	} else {
		result['cfg'] = cfg.result
	}

	return result
}
