import { describe, it } from 'node:test'
import assert from 'node:assert'
import { type Device_3 } from '@nordicsemiconductor/lwm2m-types'
import { getDev } from './getDev.js'

void describe('getDev', () => {
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
	void it(`should create the 'dev' object expected by the nRF Asset Tracker`, () => {
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
		const dev = getDev(device, metadata) as { result: unknown }
		const expected = {
			v: {
				imei: '351358815340515',
				iccid: '0000000000000000000',
				modV: '22.8.1+0',
				brdV: 'Nordic Semiconductor ASA',
			},
			ts: 1675874731000,
		}
		assert.deepEqual(dev.result, expected)
	})

	void it('should follow Timestamp Hierarchy in case timestamp resource is not found from Device object', () => {
		const input: Device_3 = {
			'0': 'Nordic Semiconductor ASA',
			'1': 'Thingy:91',
			'2': '351358815340515',
			'3': '22.8.1+0',
			'11': [0],
			// '13': 1675874731000, // timestamp resource from Device object
			'16': 'UQ',
			'19': '3.2.1',
		}

		const expected = {
			v: {
				imei: '351358815340515', // /3/0/2
				iccid: '0000000000000000000', // ***** origin missing *****
				modV: '22.8.1+0', // /3/0/3
				brdV: 'Nordic Semiconductor ASA', // /3/0/0
			},
			ts: 1688731863032,
		}

		const device = getDev(input, metadata) as {
			result: unknown
		}
		assert.deepEqual(device.result, expected)
	})

	void it(`should return error if Device object is undefined`, () => {
		const dev = getDev(undefined, metadata) as { error: Error }
		assert.notEqual(dev.error, undefined)
	})

	void it(`should return error in case a required resource is missing`, () => {
		const device = {
			'0': 'Nordic Semiconductor ASA',
			'1': 'Thingy:91',
			// '2': '351358815340515', // required resource is missing
			'3': '22.8.1+0',
			'7': [2754],
			'11': [0],
			'13': 1675874731,
			'16': 'UQ',
			'19': '3.2.1',
		}
		const dev = getDev(device, metadata) as { error: Error }
		assert.notEqual(dev.error, undefined)
	})
})
