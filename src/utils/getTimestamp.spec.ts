import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
	Device_3_urn,
	Humidity_3304_urn,
	Pressure_3323_urn,
	Temperature_3303_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { getTimestamp } from './getTimestamp.js'
import { Metadata } from '../converter.js'

void describe('getTimestamp', () => {
	void it(`should get timestamp from resource's value reported in metadata object`, () => {
		const objectURN = Device_3_urn
		const resourceId = 7
		const metadata = {
			[Device_3_urn]: {
				'0': new Date('2023-07-07T12:11:03.0324459Z'),
				'1': new Date('2023-07-07T12:11:03.0324459Z'),
				'2': new Date('2023-07-07T12:11:03.0324459Z'),
				'3': new Date('2023-07-07T12:11:03.0324459Z'),
				'7': [new Date('2023-08-03T12:11:03.0324459Z')], // selected value should be this one
				'11': [new Date('2023-07-07T12:11:03.0324459Z')],
				'13': new Date('2023-07-07T12:11:03.0324459Z'),
				'16': new Date('2023-07-07T12:11:03.0324459Z'),
				'19': new Date('2023-07-07T12:11:03.0324459Z'),
			},
		}
		assert.equal(getTimestamp(objectURN, resourceId, metadata), 1691064663032)
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
		] as (keyof Metadata)[]
		const resourceId = 5518
		const metadata = {
			[Temperature_3303_urn]: [
				{
					'5601': new Date('2023-07-07T12:11:03.0324459Z'),
					'5518': new Date('2023-07-07T12:11:03.0324459Z'),
					'5700': new Date('2023-07-07T12:11:03.0324459Z'),
					'5701': new Date('2023-07-07T12:11:03.0324459Z'),
				},
			],

			[Humidity_3304_urn]: [
				{
					'5601': new Date('2023-07-07T12:11:03.0324459Z'),
					'5518': new Date('2023-09-03T12:11:03.0324459Z'), // selected value should be this one
					'5700': new Date('2023-07-07T12:11:03.0324459Z'),
					'5701': new Date('2023-07-07T12:11:03.0324459Z'),
				},
			],

			[Pressure_3323_urn]: [
				{
					'5601': new Date('2023-07-07T12:11:03.0324459Z'),
					'5518': new Date('2023-07-07T12:11:03.0324459Z'),
					'5700': new Date('2023-07-07T12:11:03.0324459Z'),
					'5701': new Date('2023-07-07T12:11:03.0324459Z'),
				},
			],
		}
		assert.equal(getTimestamp(objectsURNs, resourceId, metadata), 1693743063032)
	})
})
