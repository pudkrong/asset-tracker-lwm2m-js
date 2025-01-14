import { describe, it } from 'node:test'
import assert from 'node:assert'
import { getBat } from './getBat.js'
import { type BatteryData } from '@nordicsemiconductor/asset-tracker-cloud-docs'
import { TypeError, Warning } from '../converter.js'

void describe('getBat', () => {
	void it(`should create the 'bat' object expected by nRF Asset Tracker`, () => {
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
		const bat = getBat(device) as { result: BatteryData }

		assert.equal(bat.result.v, 2754)
		assert.equal(bat.result.ts, 1675874731000)
	})

	void it(`should return warning if Device object is undefined`, () => {
		const result = getBat(undefined) as { warning: Warning }
		assert.equal(result.warning.message, 'Bat object can not be created')
		assert.equal(result.warning.description, 'Device (3) object is undefined')
	})

	void it(`should return error if required resource is missing in input object`, () => {
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
		const bat = getBat(device) as { error: TypeError }
		const message = bat.error.description[0]?.message
		const keyword = bat.error.description[0]?.keyword

		assert.equal(message, "must have required property 'v'")
		assert.equal(keyword, 'required')
	})
})
