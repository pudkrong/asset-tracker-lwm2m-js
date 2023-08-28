import type { BatteryData } from '@nordicsemiconductor/asset-tracker-cloud-docs'
import type { Device_3 } from '@nordicsemiconductor/lwm2m-types'
import type { Metadata } from './getTimestamp.js'
import { transformToBattery } from './transformToBattery.js'

/**
 * Check the required values and create the object expected by nRF Asset Tracker related to battery
 */
export const getBat = (
	device: Device_3 | undefined,
	metadata: Metadata,
): { result: BatteryData } | { error: Error } => {
	if (device === undefined)
		return { error: new Error('Device (3) object is missing') }

	const maybeValidBat = transformToBattery(device, metadata)
	if ('error' in maybeValidBat) return { error: maybeValidBat.error }

	return { result: maybeValidBat.result }
}
