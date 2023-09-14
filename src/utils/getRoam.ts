import {
	RoamingInfo,
	type RoamingInfoData,
	validateWithType,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import type {
	Device_3,
	ConnectivityMonitoring_4,
} from '@nordicsemiconductor/lwm2m-types'
import { TypeError, Warning } from '../converter.js'

/**
 * Check the required values and create roam object, which is required in nRF Asset Tracker
 *
 * @see https://github.com/MLopezJ/asset-tracker-cloud-coiote-azure-converter-js/blob/saga/documents/roam.md
 * @see {@link ../../documents/roam.md}
 *
 * // TODO: Take a decision here
 */
export const getRoam = ({
	connectivityMonitoring,
	device,
}: {
	connectivityMonitoring: ConnectivityMonitoring_4 | undefined
	device: Device_3 | undefined
}): { result: RoamingInfoData } | { error: Error } | { warning: Warning } => {
	if (connectivityMonitoring === undefined)
		return {
			warning: new Warning({
				name: 'warning',
				message: 'Roam object can not be created',
				description: 'Connectivity Monitoring (4) object is undefined',
			}),
		}

	const nw = String(connectivityMonitoring[0])
	const rsrp = connectivityMonitoring[2]
	const area = connectivityMonitoring[12]
	const smcc = connectivityMonitoring[10]
	const smnc = connectivityMonitoring[9]
	const cell = connectivityMonitoring[8]
	const ip =
		connectivityMonitoring[4] != null ? connectivityMonitoring[4][0] : undefined

	/**
	 * Connectivity Monitoring (4) object does not support timestamp
	 * @see {@link adr/010-roam-timestamp-not-supported-by-lwm2m.md}
	 */
	const time = device?.['13'] != null ? device['13'] * 1000 : undefined

	/**
	 * band and eest from Dev object are not provided.
	 * @see {@link adr/009-nrf-asset-tracker-values-not-provided.md}
	 */
	const object = {
		v: {
			nw,
			rsrp,
			area,
			mccmnc: Number(`${smcc}${smnc}`), // /4/0/10 & /4/0/9
			cell,
			ip,
			band: 3, // TODO: remove this
			eest: 5, // TODO: remove this
		},
		ts: time,
	}

	const maybeValidRoam = validateWithType(RoamingInfo)(object)
	if ('errors' in maybeValidRoam) {
		return {
			error: new TypeError({
				name: 'type error',
				message: 'error validating type',
				description: maybeValidRoam.errors,
			}),
		}
	}

	return { result: maybeValidRoam }
}
