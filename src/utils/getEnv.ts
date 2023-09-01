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
import { getTimestamp, type Metadata } from './getTimestamp.js'

/**
 * Check and create the 'env' object, expected by nRF Asset Tracker
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
					metadata,
			  )
			: time * 1000

	const object = {
		v: {
			temp,
			hum,
			atmp,
		},
		ts: time,
	}

	const maybeValidEnvironment = validateWithType(Environment)(object)
	if ('errors' in maybeValidEnvironment)
		return { error: new Error(JSON.stringify(maybeValidEnvironment.errors)) }

	return { result: maybeValidEnvironment }
}
