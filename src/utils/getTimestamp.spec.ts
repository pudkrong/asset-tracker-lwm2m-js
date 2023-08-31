import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
	Device_3_urn,
	Humidity_3304_urn,
	Pressure_3323_urn,
	Temperature_3303_urn,
} from '@nordicsemiconductor/lwm2m-types'
import type { LwM2M_Metadata, Metadata } from './getTimestamp'
import { getTimestamp } from './getTimestamp.js'

void describe('getTimestamp', () => {
	void it(`should get timestamp from RESOURCE's value reported in device twin`, () => {
		const objectURN = Device_3_urn
		const resourceId = 7
		const metadata = {
			$lastUpdated: '2023-07-07T12:11:03.0324459Z',
			lwm2m: {
				'3': {
					'0': {
						'0': {
							$lastUpdated: '2023-07-07T12:11:03.0324459Z',
							value: {
								$lastUpdated: '2023-07-07T12:11:03.0324459Z',
							},
						},
						'3': {
							$lastUpdated: '2023-07-07T12:11:03.0324459Z',
							value: {
								$lastUpdated: '2023-07-07T12:11:03.0324459Z',
							},
						},
						'7': {
							$lastUpdated: '2023-08-03T12:11:03.0324459Z',
							value: {
								// selected value should be this one
								$lastUpdated: '2023-08-03T12:11:03.0324459Z',
							},
						},
						'13': {
							$lastUpdated: '2023-07-07T12:11:03.0324459Z',
							value: {
								$lastUpdated: '2023-07-07T12:11:03.0324459Z',
							},
						},
						$lastUpdated: '2023-07-07T12:11:03.0324459Z',
					},
					$lastUpdated: '2023-07-07T12:11:03.0324459Z',
				},
				$lastUpdated: '2023-07-07T12:11:03.0324459Z',
			},
		}
		assert.equal(getTimestamp(objectURN, resourceId, metadata), 1691064663032)
	})

	void it(`should get timestamp from INSTANCE's value reported in device twin`, () => {
		const objectURN = Device_3_urn
		const resourceId = 7
		const metadata = {
			$lastUpdated: '2023-07-07T12:11:03.0324459Z',
			lwm2m: {
				'3': {
					'0': {
						// The required resource (7) does not exist
						'10': {
							$lastUpdated: '2023-07-07T12:11:03.0324459Z',
							value: {
								$lastUpdated: '2023-07-07T12:11:03.0324459Z',
							},
						},
						$lastUpdated: '2023-08-02T22:25:50.0324459Z', // so the instance reported time should be selected
					},
					$lastUpdated: '2023-07-07T12:11:03.0324459Z',
				},
				$lastUpdated: '2023-07-07T12:11:03.0324459Z',
			},
		}
		assert.equal(getTimestamp(objectURN, resourceId, metadata), 1691015150032)
	})

	void it(`should get timestamp from OBJECT's value reported in device twin`, () => {
		const objectURN = Device_3_urn
		const resourceId = 7
		const metadata = {
			$lastUpdated: '2023-07-07T12:11:03.0324459Z',
			lwm2m: {
				'3': {
					// The instance 0 (instance selected by default) of required object (3) does not exist
					$lastUpdated: '2023-08-01T19:41:13.0324459Z', // so object reported time should be selected
				},
				$lastUpdated: '2023-07-07T12:11:03.0324459Z',
			},
		}
		assert.equal(getTimestamp(objectURN, resourceId, metadata), 1690918873032)
	})

	void it(`should get timestamp from LwM2M's value reported in device twin`, () => {
		const objectURN = Device_3_urn
		const resourceId = 7
		const metadata = {
			$lastUpdated: '2023-07-07T12:11:03.0324459Z',
			lwm2m: {
				// Required object (3) does not exist
				'5': {
					'0': {
						'0': {
							$lastUpdated: '2023-07-07T12:11:03.0324459Z',
							value: {
								$lastUpdated: '2023-07-07T12:11:03.0324459Z',
							},
						},
						$lastUpdated: '2023-07-07T12:11:03.0324459Z',
					},
					$lastUpdated: '2023-07-07T12:11:03.0324459Z',
				},
				$lastUpdated: '2023-08-04T18:01:53.0324459Z', // so the LwM2M reported time should be selected
			},
		}
		assert.equal(getTimestamp(objectURN, resourceId, metadata), 1691172113032)
	})

	void it(`should get timestamp from METADATA's value reported in device twin`, () => {
		const objectURN = Device_3_urn
		const resourceId = 7
		const metadata = {
			// LwM2M object does not exist
			lwm2m: {} as unknown as LwM2M_Metadata,
			$lastUpdated: '2023-08-05T15:15:43.0322359Z', // so the metadata reported time should be selected
		}
		assert.equal(getTimestamp(objectURN, resourceId, metadata), 1691248543032)
	})

	void it(`should return error when metadata objects is empty`, () => {
		const objectURN = Device_3_urn
		const resourceId = 7
		const metadata = {} as Metadata
		const result = getTimestamp(objectURN, resourceId, metadata) as {
			error: Error
		}
		assert.notEqual(result.error, undefined)
	})

	void it(`should get more recent timestamp from a set of objects in metadata`, () => {
		const objectsURNs = [
			Temperature_3303_urn,
			Humidity_3304_urn,
			Pressure_3323_urn,
		]
		const resourceId = 5518
		const metadata = {
			$lastUpdated: '2023-07-07T12:11:03.0324459Z',
			lwm2m: {
				'3303': {
					'0': {
						'5518': {
							$lastUpdated: '2023-07-07T12:11:03.0324459Z',
							value: {
								$lastUpdated: '2023-07-07T12:11:03.0324459Z',
							},
						},
						$lastUpdated: '2023-07-07T12:11:03.0324459Z',
					},
					$lastUpdated: '2023-07-07T12:11:03.0324459Z',
				},
				'3304': {
					'0': {
						'5518': {
							$lastUpdated: '2023-07-07T12:11:03.0324459Z',
							value: {
								// selected value should be this one
								$lastUpdated: '2023-08-08T12:11:03.0324459Z',
							},
						},
						$lastUpdated: '2023-07-07T12:11:03.0324459Z',
					},
					$lastUpdated: '2023-07-07T12:11:03.0324459Z',
				},
				'3323': {
					'0': {
						'5518': {
							$lastUpdated: '2023-07-07T12:11:03.0324459Z',
							value: {
								$lastUpdated: '2023-07-07T12:11:03.0324459Z',
							},
						},
						$lastUpdated: '2023-07-07T12:11:03.0324459Z',
					},
					$lastUpdated: '2023-07-07T12:11:03.0324459Z',
				},
				$lastUpdated: '2023-07-07T12:11:03.0324459Z',
			},
		}
		assert.equal(getTimestamp(objectsURNs, resourceId, metadata), 1691496663032)
	})
})
