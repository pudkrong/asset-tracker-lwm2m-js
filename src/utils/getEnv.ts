import type { EnvironmentData } from '@nordicsemiconductor/asset-tracker-cloud-docs'
import type {
	Humidity_3304,
	Pressure_3323,
	Temperature_3303,
} from '@nordicsemiconductor/lwm2m-types'
import type { Metadata } from './getTimestamp.js'
import { transformToEnvironment } from './transformToEnvironment.js'

/**
 * Check and create the 'env' object, expected by Asset Tracker Web App
 */
export const getEnv = (
	temperature: Temperature_3303 | undefined,
	humidity: Humidity_3304 | undefined,
	pressure: Pressure_3323 | undefined,
	metadata: Metadata,
): { result: EnvironmentData } | { error: Error } => {
	if (temperature === undefined)
		return { error: new Error('Temperature (3303) object is missing') }

	if (humidity === undefined)
		return { error: new Error('Humidity (3304) object is missing') }

	if (pressure === undefined)
		return { error: new Error('Pressure (3323) object is missing') }

	const maybeValidEnv = transformToEnvironment(
		temperature,
		humidity,
		pressure,
		metadata,
	)

	if ('error' in maybeValidEnv) return { error: maybeValidEnv.error }

	return { result: maybeValidEnv.result }
}
