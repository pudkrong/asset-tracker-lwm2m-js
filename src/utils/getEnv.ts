import {
	Environment,
	type EnvironmentData,
	validateWithType,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import {
	type Humidity_3304,
	type Pressure_3323,
	type Temperature_3303,
} from '@nordicsemiconductor/lwm2m-types'
import { typeError } from '../converter.js'

/**
 * Check and create the 'env' object, expected by nRF Asset Tracker
 *
 * @see https://github.com/MLopezJ/asset-tracker-cloud-coiote-azure-converter-js/blob/saga/documents/environment.md
 * @see {@link ../../documents/environment.md}
 * // TODO: Take a decision here
 */
export const getEnv = ({
	temperature,
	humidity,
	pressure,
}: {
	temperature: Temperature_3303 | undefined
	humidity: Humidity_3304 | undefined
	pressure: Pressure_3323 | undefined
}): { result: EnvironmentData } | { error: Error } => {
	if (temperature === undefined)
		return { error: new Error('Temperature (3303) object is undefined') }

	if (humidity === undefined)
		return { error: new Error('Humidity (3304) object is undefined') }

	if (pressure === undefined)
		return { error: new Error('Pressure (3323) object is undefined') }

	const temp = temperature?.[0]?.['5700']
	const hum = humidity?.[0]?.['5700']
	const atmp = pressure?.[0]?.['5700']

	let time =
		temperature?.[0]?.['5518'] ??
		humidity?.[0]?.['5518'] ??
		pressure?.[0]?.['5518']

	if (time !== undefined) time = time * 100
	
	const object = {
		v: {
			temp,
			hum,
			atmp,
		},
		ts: time,
	}

	const maybeValidEnvironment = validateWithType(Environment)(object)
	if ('errors' in maybeValidEnvironment) {
		return {
			error: new typeError({
				name: 'type error',
				message: 'error validating type',
				description: maybeValidEnvironment.errors,
			}),
		}
	}

	return { result: maybeValidEnvironment }
}
