import { getBat } from './getBat.js'
import { describe, it } from 'node:test'
import assert from 'node:assert'
import { type BatteryData } from '@nordicsemiconductor/asset-tracker-cloud-docs'

void describe('getBat', () => {
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
		const bat = getBat(device, metadata) as { result: BatteryData }

		assert.equal(bat.result.v, 2754)
		assert.equal(bat.result.ts, 1675874731000)
	})

	/**
	 * @see adr/007-timestamp-hierarchy.md
	 */
	void it('should follow Timestamp Hierarchy in case timestamp is not found from Device object', () => {
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

		const battery = getBat(device, metadata) as { result: BatteryData }
		assert.equal(battery.result.v, 80)
		assert.equal(battery.result.ts, 1688731863032)
	})

	void it(`should return error if Device object is undefined`, () => {
		const result = getBat(undefined, metadata) as { error: Error }
		assert.notEqual(result.error, undefined)
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
		const bat = getBat(device, metadata) as { error: Error }
		assert.notEqual(bat.error, undefined)
	})
})
