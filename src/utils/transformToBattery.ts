import {
	Battery,
	type BatteryData,
	validateWithType,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import { type Device_3, Device_3_urn } from '@nordicsemiconductor/lwm2m-types'
import { fromSecondsToMilliseconds } from '../utils/fromSecondsToMilliseconds.js'
import { getTimestamp, type Metadata } from '../utils/getTimestamp.js'

/**
 * Transform Device LwM2M object (3) into the battery object expected by Asset Tracker web app
 *
 * @see https://github.com/NordicSemiconductor/asset-tracker-cloud-coiote-azure-converter-js/blob/saga/documents/battery.md
 */
export const transformToBattery = (
	device: Device_3,
	deviceTwinMetadata: Metadata,
): { error: Error } | { result: BatteryData } => {
	const value = device['7'] != null ? device['7'][0] : undefined

	const time =
		device['13'] != null
			? fromSecondsToMilliseconds(device['13'])
			: getTimestamp(Device_3_urn, 13, deviceTwinMetadata)

	const object = {
		v: value,
		ts: time,
	}

	const maybeValidBattery = validateWithType(Battery)(object)
	if ('errors' in maybeValidBattery)
		return { error: new Error(JSON.stringify(maybeValidBattery.errors)) }

	return { result: maybeValidBattery }
}
