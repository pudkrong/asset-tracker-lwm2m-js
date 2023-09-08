import {
	Battery,
	type BatteryData,
	validateWithType,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import { type Device_3, Device_3_urn } from '@nordicsemiconductor/lwm2m-types'
import { type Metadata, typeError } from '../converter.js'
import { getTimestamp } from './getTimestamp.js'

/**
 * Check the required values and create the object expected by nRF Asset Tracker related to battery transforming Device LwM2M object (3) into it
 *
 * @see https://github.com/MLopezJ/asset-tracker-cloud-coiote-azure-converter-js/blob/saga/documents/battery.md
 * @see {@link ../../documents/battery.md}
 * TODO: Take a decision here
 */
export const getBat = (
	device: Device_3 | undefined,
	metadata: Metadata,
): { result: BatteryData } | { error: Error } => {
	if (device === undefined)
		return { error: new Error('Device (3) object is undefined') }

	const value = device['7'] != null ? device['7'][0] : undefined

	const time =
		device['13'] != null
			? device['13'] * 1000
			: getTimestamp(Device_3_urn, 13, metadata)

	const object = {
		v: value,
		ts: time,
	}

	const maybeValidBat = validateWithType(Battery)(object)
	if ('errors' in maybeValidBat) {
		return {
			error: new typeError({
				name: 'type error',
				message: 'error validating type',
				description: maybeValidBat.errors,
			}),
		}
	}

	return { result: maybeValidBat }
}
