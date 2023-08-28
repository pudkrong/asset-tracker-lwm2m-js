import {
	Device,
	type DeviceData,
	validateWithType,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import { type Device_3, Device_3_urn } from '@nordicsemiconductor/lwm2m-types'
import { fromSecondsToMilliseconds } from '../utils/fromSecondsToMilliseconds.js'
import { getTimestamp, type Metadata } from '../utils/getTimestamp.js'

/**
 * Transform Device LwM2M object (3) into the device object expected by nRF Asset Tracker
 *
 * @see https://github.com/NordicSemiconductor/asset-tracker-cloud-coiote-azure-converter-js/blob/saga/documents/device.md
 */
export const transformToDevice = (
	device: Device_3,
	deviceTwinMetadata: Metadata,
): { error: Error } | { result: DeviceData } => {
	const defaultIccid = '0000000000000000000'
	const imei = device['2']
	const modV = device['3']
	const brdV = device['0']
	const time =
		device['13'] != null
			? fromSecondsToMilliseconds(device['13'])
			: getTimestamp(Device_3_urn, 13, deviceTwinMetadata)

	const object = {
		v: {
			imei,
			iccid: defaultIccid, // ***** origin missing *****
			modV,
			brdV,
		},
		ts: time,
	}

	const maybeValidDeviceData = validateWithType(Device)(object)
	if ('errors' in maybeValidDeviceData) {
		return { error: new Error(JSON.stringify(maybeValidDeviceData.errors)) }
	}

	return { result: maybeValidDeviceData }
}
