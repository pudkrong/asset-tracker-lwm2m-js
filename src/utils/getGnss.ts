import {
	GNSS,
	type GNSSData,
	validateWithType,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import {
	type Location_6,
	Location_6_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { getTimestamp, type Metadata } from './getTimestamp.js'

/**
 * Check the required values and create the GNSS object required in nRF Asset Tracker
 */
export const getGnss = (
	location: Location_6 | undefined,
	metadata: Metadata,
): { result: GNSSData } | { error: Error } => {
	if (location === undefined)
		return { error: new Error('Location (6) object is missing') }

	const defaultHdg = 0
	const lat = location['0']
	const alt = location['2']
	const spd = location['6']
	const lng = location['1']
	const acc = location['3']

	const time =
		location['5'] != null
			? location['5'] * 1000
			: getTimestamp(Location_6_urn, 5, metadata)

	const object = {
		v: {
			lng,
			lat,
			acc,
			alt,
			spd,
			hdg: defaultHdg, // ***** origin missing *****
		},
		ts: time,
	}

	const maybeValidGnss = validateWithType(GNSS)(object)
	if ('errors' in maybeValidGnss)
		return { error: new Error(JSON.stringify(maybeValidGnss.errors)) }

	return { result: maybeValidGnss }
}
