import { describe, it } from 'node:test'
import assert from 'node:assert'
import { getBat } from './getBat.js'
import { type BatteryData } from '@nordicsemiconductor/asset-tracker-cloud-docs'
import { typeError } from '../converter.js'
import { Device_3_urn } from '@nordicsemiconductor/lwm2m-types'

void describe('getBat', () => {
	void it(`should create the 'bat' object expected by nRF Asset Tracker`, () => {
		const metadata = {}
		const device = {
			'0': 'Nordic Semiconductor ASA',
			'1': 'Thingy:91',
			'2': '351358815340515',
			'3': '22.8.1+0',
			'7': [2754],
			'11': [0],
			'13': 1675874731,
			'16': 'UQ',
			'19': '3.2.1',
		}
		const bat = getBat(device, metadata) as { result: BatteryData }

		assert.equal(bat.result.v, 2754)
		assert.equal(bat.result.ts, 1675874731000)
	})

	/**
	 * @see adr/007-timestamp-hierarchy.md
	 */
	void it('should follow Timestamp Hierarchy in case timestamp resource is not found from Device object', () => {
		const device = {
			'0': 'Nordic Semiconductor ASA',
			'1': 'Thingy:91',
			'2': '351358815340515',
			'3': '22.8.1+0',
			'11': [0],
			'7': [80],
			// '13': 1675874731, // timestamp from Device object
			'16': 'UQ',
			'19': '3.2.1',
		}

		const metadata = {
			[Device_3_urn]: {
				'0': new Date('2023-07-07T12:11:03.0324459Z'),
				'1': new Date('2023-07-07T12:11:03.0324459Z'),
				'2': new Date('2023-07-07T12:11:03.0324459Z'),
				'3': new Date('2023-07-07T12:11:03.0324459Z'),
				'7': [new Date('2023-07-07T12:11:03.0324459Z')],
				'11': [new Date('2023-07-07T12:11:03.0324459Z')],
				'13': new Date('2023-07-07T12:11:03.0324459Z'),
				'16': new Date('2023-07-07T12:11:03.0324459Z'),
				'19': new Date('2023-07-07T12:11:03.0324459Z'),
			},
		}

		const battery = getBat(device, metadata) as { result: BatteryData }
		assert.equal(battery.result.v, 80)
		assert.equal(battery.result.ts, 1688731863032)
	})

	void it(`should return error if Device object is undefined`, () => {
		const result = getBat(undefined, {}) as { error: Error }
		assert.equal(result.error.message, 'Device (3) object is undefined')
	})

	void it(`should return error if required resource is missing in input object`, () => {
		const metadata = {}
		const device = {
			'0': 'Nordic Semiconductor ASA',
			'1': 'Thingy:91',
			'2': '351358815340515',
			'3': '22.8.1+0',
			// '7':  [2754], required value missed
			'11': [0],
			'13': 1675874731,
			'16': 'UQ',
			'19': '3.2.1',
		}
		const bat = getBat(device, metadata) as { error: typeError }
		const message = bat.error.description[0]?.message
		const keyword = bat.error.description[0]?.keyword

		assert.equal(message, "must have required property 'v'")
		assert.equal(keyword, 'required')
	})
})
