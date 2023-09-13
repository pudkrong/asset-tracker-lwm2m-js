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
import {
	Config,
	Device,
	RoamingInfo,
	Battery,
	Environment,
	GNSS,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import { type Config_50009, Config_50009_urn } from './schemas/Config_50009.js'
import { getBat } from './utils/getBat.js'
import { getDev } from './utils/getDev.js'
import { getEnv } from './utils/getEnv.js'
import { getGnss } from './utils/getGnss.js'
import { getRoam } from './utils/getRoam.js'
import { getCfg } from './utils/getCfg.js'

import { Type, type Static } from '@sinclair/typebox'

/**
 * Expected input type
 *
 * @see {@link adr/006-result-generation.md}
 */
export type LwM2MAssetTrackerV2 = {
	[Device_3_urn]?: Device_3
	[ConnectivityMonitoring_4_urn]?: ConnectivityMonitoring_4
	[Location_6_urn]?: Location_6
	[Temperature_3303_urn]?: Temperature_3303
	[Humidity_3304_urn]?: Humidity_3304
	[Pressure_3323_urn]?: Pressure_3323
	[Config_50009_urn]?: Config_50009
}

/**
 * Expected output type
 *
 * @see {@link adr/006-result-generation.md}
 */
export const nRFAssetTrackerReported = Type.Object({
	cfg: Type.Optional(Config),
	dev: Type.Optional(Device),
	roam: Type.Optional(RoamingInfo),
	bat: Type.Optional(Battery),
	env: Type.Optional(Environment),
	gnss: Type.Optional(GNSS),
})

export type nRFAssetTrackerReportedType = Static<typeof nRFAssetTrackerReported>

type ErrorDescription = {
	instancePath: string
	schemaPath: string
	keyword: string
	params: Record<string, unknown>
	message?: string
}

export class TypeError extends Error {
	description: ErrorDescription[]

	constructor({
		name,
		message,
		description,
	}: {
		name: string
		message: string
		description: ErrorDescription[]
	}) {
		super()

		this.name = name
		this.message = message
		this.description = description
	}
}

export class Warning extends Error {
	description: string

	constructor({
		name,
		message,
		description,
	}: {
		name: string
		message: string
		description: string
	}) {
		super()

		this.name = name
		this.message = message
		this.description = description
	}
}

/**
 * convert LwM2M Asset Tracker v2 format into nRF Asset Tracker format
 */
export const converter = (
	input: LwM2MAssetTrackerV2,
	onWarning?: (warning: Error) => unknown,
	onError?: (error: Error) => unknown,
): typeof nRFAssetTrackerReported => {
	const result = {} as typeof nRFAssetTrackerReported
	const device = input[Device_3_urn]
	const temperature = input[Temperature_3303_urn]
	const humidity = input[Humidity_3304_urn]
	const pressure = input[Pressure_3323_urn]
	const location = input[Location_6_urn]
	const connectivityMonitoring = input[ConnectivityMonitoring_4_urn]
	const config = input[Config_50009_urn]

	const bat = getBat(device)
	if ('warning' in bat) {
		onWarning?.(bat.warning)
	} else {
		if ('error' in bat) {
			onError?.(bat.error)
		} else {
			result['bat'] = bat.result
		}
	}

	const dev = getDev(device)
	if ('warning' in dev) {
		onWarning?.(dev.warning)
	} else {
		if ('error' in dev) {
			onError?.(dev.error)
		} else {
			result['dev'] = dev.result
		}
	}

	const env = getEnv({
		temperature,
		humidity,
		pressure,
	})
	if ('warning' in env) {
		onWarning?.(env.warning)
	} else {
		if ('error' in env) {
			onError?.(env.error)
		} else {
			result['env'] = env.result
		}
	}

	const gnss = getGnss(location)
	if ('warning' in gnss) {
		onWarning?.(gnss.warning)
	} else {
		if ('error' in gnss) {
			onError?.(gnss.error)
		} else {
			result['gnss'] = gnss.result
		}
	}

	const roam = getRoam({
		connectivityMonitoring,
		device,
	})
	if ('warning' in roam) {
		onWarning?.(roam.warning)
	} else {
		if ('error' in roam) {
			onError?.(roam.error)
		} else {
			result['roam'] = roam.result
		}
	}

	const cfg = getCfg(config)
	if ('warning' in cfg) {
		onWarning?.(cfg.warning)
	} else {
		if ('error' in cfg) {
			onError?.(cfg.error)
		} else {
			result['cfg'] = cfg.result
		}
	}

	return result
}
