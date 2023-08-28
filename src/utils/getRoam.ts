import type { RoamingInfoData } from '@nordicsemiconductor/asset-tracker-cloud-docs'
import type { ConnectivityMonitoring_4 } from '@nordicsemiconductor/lwm2m-types'
import type { Metadata } from './getTimestamp.js'
import { transformToRoam } from './transformToRoam.js'

/**
 * Check the required values and create roam object, which is required in nRF Asset Tracker
 */
export const getRoam = (
	connectivityMonitoring: ConnectivityMonitoring_4 | undefined,
	metadata: Metadata,
): { result: RoamingInfoData } | { error: Error } => {
	if (connectivityMonitoring === undefined)
		return { error: new Error('Connectivity Monitoring (4) object is missing') }

	const roam = transformToRoam(connectivityMonitoring, metadata)
	if ('error' in roam) return { error: roam.error }

	return { result: roam.result }
}
