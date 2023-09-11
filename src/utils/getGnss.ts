import {
	GNSS,
	type GNSSData,
	validateWithType,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import {
	type Location_6,
	Location_6_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { type Metadata, typeError } from '../converter.js'
import { getTimestamp } from './getTimestamp.js'

/**
 * Check the required values and create the GNSS object required in nRF Asset Tracker
 *
 * @see https://github.com/MLopezJ/asset-tracker-cloud-coiote-azure-converter-js/blob/saga/documents/gnss.md
 * @see {@link ../../documents/gnss.md}
 * // TODO: Take a decision here
 */
export const getGnss = (
	location: Location_6 | undefined,
	metadata: Metadata,
): { result: GNSSData } | { error: Error | typeError } => {
	if (location === undefined)
		return { error: new Error('Location (6) object is undefined') }

	const lat = location['0']
	const alt = location['2']
	const spd = location['6']
	const lng = location['1']
	const acc = location['3']

	const time =
		location['0'] != null
			? location['0'] * 1000
			: getTimestamp(Location_6_urn, 5, metadata)

	const object = {
		v: {
			lng,
			lat,
			acc,
			alt,
			spd,
		},
		ts: time,
	}

	const maybeValidGnss = validateWithType(GNSS)(object)
	if ('errors' in maybeValidGnss) {
		return {
			error: new typeError({
				name: 'type error',
				message: 'error validating type',
				description: maybeValidGnss.errors,
			}),
		}
	}

	return { result: maybeValidGnss }
}
