import {
	RoamingInfo,
	type RoamingInfoData,
	validateWithType,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import {
	type ConnectivityMonitoring_4,
	ConnectivityMonitoring_4_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { type Metadata, typeError } from '../converter.js'
import { getTimestamp } from './getTimestamp.js'

/**
 * Check the required values and create roam object, which is required in nRF Asset Tracker
 *
 * @see https://github.com/MLopezJ/asset-tracker-cloud-coiote-azure-converter-js/blob/saga/documents/roam.md
 * @see {@link ../../documents/roam.md}
 * // TODO: Take a decision here
 */
export const getRoam = (
	connectivityMonitoring: ConnectivityMonitoring_4 | undefined,
	metadata: Metadata,
): { result: RoamingInfoData } | { error: Error } => {
	if (connectivityMonitoring === undefined)
		return {
			error: new Error('Connectivity Monitoring (4) object is undefined'),
		}

	const nw = String(connectivityMonitoring[0])
	const rsrp = connectivityMonitoring[2]
	const area = connectivityMonitoring[12]
	const smcc = connectivityMonitoring[10]
	const smnc = connectivityMonitoring[9]
	const cell = connectivityMonitoring[8]
	const ip =
		connectivityMonitoring[4] != null ? connectivityMonitoring[4][0] : undefined

	// get timestamp from metadata
	const time = getTimestamp(ConnectivityMonitoring_4_urn, 12, metadata)

	const object = {
		v: {
			nw,
			rsrp,
			area,
			mccmnc: Number(`${smcc}${smnc}`), // /4/0/10 & /4/0/9
			cell,
			ip,
		},
		ts: time,
	}

	const maybeValidRoam = validateWithType(RoamingInfo)(object)
	if ('errors' in maybeValidRoam) {
		return {
			error: new typeError({
				name: 'type error',
				message: 'error validating type',
				description: maybeValidRoam.errors,
			}),
		}
	}

	return { result: maybeValidRoam }
}
