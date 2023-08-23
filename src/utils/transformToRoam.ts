import {
	RoamingInfo,
	type RoamingInfoData,
	validateWithType,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import {
	type ConnectivityMonitoring_4,
	ConnectivityMonitoring_4_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { getTimestamp, type Metadata } from '../utils/getTimestamp.js'

/**
 * Transform Connectivity Monitoring LwM2M object (4) into the roaming object expected by Asset Tracker web app
 *
 * @see https://github.com/MLopezJ/asset-tracker-cloud-coiote-azure-converter-js/blob/saga/documents/roaming.md
 */
export const transformToRoam = (
	connectivityMonitoring: ConnectivityMonitoring_4,
	deviceTwinMetadata: Metadata,
): { result: RoamingInfoData } | { error: Error } => {
	const defaultBand = 1
	const defaultEest = 5
	const nw = String(connectivityMonitoring[0])
	const rsrp = connectivityMonitoring[2]
	const area = connectivityMonitoring[12]
	const smcc = connectivityMonitoring[10]
	const smnc = connectivityMonitoring[9]
	const cell = connectivityMonitoring[8]
	const ip =
		connectivityMonitoring[4] != null ? connectivityMonitoring[4][0] : undefined

	// get timestamp from metadata
	const time = getTimestamp(
		ConnectivityMonitoring_4_urn,
		12,
		deviceTwinMetadata,
	)

	const object = {
		v: {
			band: defaultBand, // ***** origin missing *****
			nw,
			rsrp,
			area,
			mccmnc: Number(`${smcc}${smnc}`), // /4/0/10 & /4/0/9
			cell,
			ip,
			eest: defaultEest, // ***** origin missing *****
		},
		ts: time,
	}

	const maybeValidRoam = validateWithType(RoamingInfo)(object)
	if ('errors' in maybeValidRoam)
		return { error: new Error(JSON.stringify(maybeValidRoam.errors)) }

	return { result: maybeValidRoam }
}
