import {
	Environment,
	type EnvironmentData,
	validateWithType,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import {
	type Humidity_3304,
	Humidity_3304_urn,
	type Pressure_3323,
	Pressure_3323_urn,
	type Temperature_3303,
	Temperature_3303_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { fromSecondsToMilliseconds } from '../utils/fromSecondsToMilliseconds.js'
import { getTimestamp, type Metadata } from '../utils/getTimestamp.js'

/**
 * Transform Temperature, Humidity and Pressure LwM2M objects into the environment object expected by Asset Tracker web app
 *
 * @see https://github.com/MLopezJ/asset-tracker-cloud-coiote-azure-converter-js/blob/saga/documents/environment.md
 */
export const transformToEnvironment = (
	temperature: Temperature_3303,
	humidity: Humidity_3304,
	pressure: Pressure_3323,
	deviceTwinMetadata: Metadata,
): { result: EnvironmentData } | { error: Error } => {
	const temp = temperature?.[0]?.['5700']
	const hum = humidity?.[0]?.['5700']
	const atmp = pressure?.[0]?.['5700']

	let time: number | undefined | { error: Error } =
		temperature?.[0]?.['5518'] ??
		humidity?.[0]?.['5518'] ??
		pressure?.[0]?.['5518']

	time =
		time === undefined
			? getTimestamp(
					[Temperature_3303_urn, Humidity_3304_urn, Pressure_3323_urn],
					5518,
					deviceTwinMetadata,
			  )
			: fromSecondsToMilliseconds(time)

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
		return { error: new Error(JSON.stringify(maybeValidEnvironment.errors)) }
	}

	return { result: maybeValidEnvironment }
}
