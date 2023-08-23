import type { DeviceData } from '@nordicsemiconductor/asset-tracker-cloud-docs'
import type { Device_3 } from '@nordicsemiconductor/lwm2m-types'
import type { Metadata } from './getTimestamp.js'
import { transformToDevice } from './transformToDevice.js'

/**
 * Check required values and build the dev object, expected by Asset Tracker web app
 */
export const getDev = (
	device: Device_3 | undefined,
	metadata: Metadata,
): { error: Error } | { result: DeviceData } => {
	if (device === undefined)
		return { error: new Error('Device object (3) is missing') }

	const maybeValidDev = transformToDevice(device, metadata)
	if ('error' in maybeValidDev) return { error: maybeValidDev.error }

	return { result: maybeValidDev.result }
}
