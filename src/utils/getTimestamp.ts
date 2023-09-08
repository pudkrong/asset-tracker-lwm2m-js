import {
	Humidity_3304_urn,
	Pressure_3323_urn,
	Temperature_3303_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { Metadata } from '../converter.js'

const parseTime = (time: string) => new Date(time).getTime()

/**
 *
 * Pick timestamp from metadata object following Timestamp Hierarchy
 *
 * @see https://github.com/MLopezJ/asset-tracker-cloud-coiote-azure-converter-js/blob/saga//adr/007-timestamp-hierarchy.md
 * @see {@link ../../adr/007-timestamp-hierarchy.md}
 * // TODO: Take a decision here
 */
const timestampHierarchy = (
	metadata: Metadata,
	objectID: keyof Metadata,
	resourceId: number,
):
	| { value: number }
	| {
			error: Error
	  } => {
	if (Object.keys(metadata).length === 0)
		return {
			error: new Error(
				`lwm2m object does not exist in metadata: ${JSON.stringify(metadata)}`,
			),
		}

	let timestamp = undefined
	/**
	 * By definition, those objects are array
	 */
	if (
		[Temperature_3303_urn, Humidity_3304_urn, Pressure_3323_urn].includes(
			objectID,
		)
	)
		timestamp = (metadata[objectID] as Record<string, Date>[])[0]![
			`${resourceId}`
		]
	else {
		const object = metadata[objectID] as Record<string, Date>
		const maybeArray = object[`${resourceId}`]
		const resource = Array.isArray(maybeArray) ? maybeArray[0] : maybeArray
		timestamp = resource
	}

	if (timestamp === undefined)
		return {
			error: new Error(
				`Not possible to select timestamp for resource '${resourceId}' in object '${objectID}' from: ${metadata}`,
			),
		}

	return { value: parseTime(timestamp) }
}

/**
 * Get the related timestamp in Device Twin metadata for resource
 */
export const getTimestamp = (
	objectURN: keyof Metadata | (keyof Metadata)[],
	resourceId: number,
	metadata: Metadata,
): number | { error: Error } => {
	const objectsURNs =
		Array.isArray(objectURN) === true ? objectURN : [objectURN]
	let timestamp = 0

	for (const urn of objectsURNs) {
		const maybeValidTimestamp = timestampHierarchy(
			metadata,
			urn as keyof Metadata,
			resourceId,
		)

		if ('error' in maybeValidTimestamp)
			return { error: maybeValidTimestamp.error }

		if (timestamp === undefined || maybeValidTimestamp.value > timestamp)
			timestamp = maybeValidTimestamp.value
	}

	return timestamp
}
