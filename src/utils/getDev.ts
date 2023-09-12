import {
	Device,
	type DeviceData,
	validateWithType,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import { type Device_3 } from '@nordicsemiconductor/lwm2m-types'
import { typeError } from '../converter.js'

/**
 * Check required values and build the dev object, expected by nRF Asset Tracker
 *
 * @see https://github.com/MLopezJ/asset-tracker-cloud-coiote-azure-converter-js/blob/saga/documents/device.md
 * @see {@link ../../documents/device.md}
 * // TODO: Take a decision here
 */
export const getDev = (
	device?: Device_3,
): { error: Error } | { result: DeviceData } => {
	if (device === undefined)
		return { error: new Error('Device object (3) is undefined') }

	const imei = device['2']
	const modV = device['3']
	const brdV = device['0']
	const time = device['13'] != null ? device['13'] * 1000 : undefined

	/**
	 * iccid from Dev object is not provided.
	 * @see {@link adr/009-nrf-asset-tracker-values-not-provided.md}
	 */
	const object = {
		v: {
			imei,
			modV,
			brdV,
			iccid: '1234567890123456789',
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
