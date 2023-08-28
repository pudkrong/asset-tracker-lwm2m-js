import type { GNSSData } from '@nordicsemiconductor/asset-tracker-cloud-docs'
import type { Location_6 } from '@nordicsemiconductor/lwm2m-types'
import type { Metadata } from './getTimestamp.js'
import { transformToGnss } from './transformToGnss.js'

/**
 * Check the required values and create the GNSS object required in nRF Asset Tracker
 */
export const getGnss = (
	location: Location_6 | undefined,
	metadata: Metadata,
): { result: GNSSData } | { error: Error } => {
	if (location === undefined)
		return { error: new Error('Location (6) object is missing') }

	const gnss = transformToGnss(location, metadata)
	if ('error' in gnss) return { error: gnss.error }

	return { result: gnss.result }
}
