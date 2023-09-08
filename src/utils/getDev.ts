import {
	Device,
	type DeviceData,
	validateWithType,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import { type Device_3, Device_3_urn } from '@nordicsemiconductor/lwm2m-types'
import { type Metadata, typeError } from '../converter.js'
import { getTimestamp } from './getTimestamp.js'

/**
 * Check required values and build the dev object, expected by nRF Asset Tracker
 *
 * @see https://github.com/MLopezJ/asset-tracker-cloud-coiote-azure-converter-js/blob/saga/documents/device.md
 * @see {@link ../../documents/device.md}
 * // TODO: Take a decision here
 */
export const getDev = (
	device: Device_3 | undefined,
	metadata: Metadata,
): { error: Error } | { result: DeviceData } => {
	if (device === undefined)
		return { error: new Error('Device object (3) is undefined') }

	const imei = device['2']
	const modV = device['3']
	const brdV = device['0']
	const time =
		device['13'] != null
			? device['13'] * 1000
			: getTimestamp(Device_3_urn, 13, metadata)

	const object = {
		v: {
			imei,
			modV,
			brdV,
		},
		ts: time,
	}

	const maybeValidDeviceData = validateWithType(Device)(object)
	if ('errors' in maybeValidDeviceData) {
		return {
			error: new typeError({
				name: 'type error',
				message: 'error validating type',
				description: maybeValidDeviceData.errors,
			}),
		}
	}

	return { result: maybeValidDeviceData }
}
