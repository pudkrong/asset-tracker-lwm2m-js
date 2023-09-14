import {
	Battery,
	type BatteryData,
	validateWithType,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import { type Device_3 } from '@nordicsemiconductor/lwm2m-types'
import { TypeError, Warning } from '../converter.js'

/**
 * Check the required values and create the object expected by nRF Asset Tracker related to battery transforming Device LwM2M object (3) into it
 *
 * @see https://github.com/MLopezJ/asset-tracker-cloud-coiote-azure-converter-js/blob/saga/documents/battery.md
 * @see {@link ../../documents/battery.md}
 *
 * TODO: Take a decision here
 */
export const getBat = (
	device?: Device_3,
): { result: BatteryData } | { error: Error } | { warning: Warning } => {
	if (device === undefined)
		return {
			warning: new Warning({
				name: 'warning',
				message: 'Bat object can not be created',
				description: 'Device (3) object is undefined',
			}),
		}

	const value = device['7'] != null ? device['7'][0] : undefined
	const time = device['13'] != null ? device['13'] * 1000 : undefined

	const object = {
		v: value,
		ts: time,
	}

	const maybeValidBat = validateWithType(Battery)(object)
	if ('errors' in maybeValidBat) {
		return {
			error: new TypeError({
				name: 'type error',
				message: 'error validating type',
				description: maybeValidBat.errors,
			}),
		}
	}

	return { result: maybeValidBat }
}
