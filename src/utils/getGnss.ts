import {
	GNSS,
	type GNSSData,
	validateWithType,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import { type Location_6 } from '@nordicsemiconductor/lwm2m-types'
import { TypeError, Warning } from '../converter.js'

/**
 * Check the required values and create the GNSS object required in nRF Asset Tracker
 *
 * @see https://github.com/MLopezJ/asset-tracker-cloud-coiote-azure-converter-js/blob/saga/documents/gnss.md
 * @see {@link ../../documents/gnss.md}
 *
 * // TODO: Take a decision here
 */
export const getGnss = (
	location?: Location_6,
): { result: GNSSData } | { error: Error } | { warning: Warning } => {
	if (location === undefined)
		return {
			warning: new Warning({
				name: 'warning',
				message: 'GNSS object can not be created',
				description: 'Location (6) object is undefined',
			}),
		}

	const lat = location['0']
	const alt = location['2']
	const spd = location['6']
	const lng = location['1']
	const acc = location['3']
	const time = location['5'] != null ? location['5'] * 1000 : undefined

	/**
	 * hdg from GNSS object is not provided.
	 * @see {@link adr/009-nrf-asset-tracker-values-not-provided.md}
	 */
	const object = {
		v: {
			lng,
			lat,
			acc,
			alt,
			spd,
			hdg: 51,
		},
		ts: time,
	}

	const maybeValidGnss = validateWithType(GNSS)(object)
	if ('errors' in maybeValidGnss) {
		return {
			error: new TypeError({
				name: 'type error',
				message: 'error validating type',
				description: maybeValidGnss.errors,
			}),
		}
	}

	return { result: maybeValidGnss }
}
