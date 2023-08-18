import { getBat } from './getBat.js'

describe('bat', () => {
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

	it(`should create the 'bat' object expected by Asset Tracker Web app`, () => {
		const device = {
			'0': 'Nordic Semiconductor ASA',
			'1': 'Thingy:91',
			'2': '351358815340515',
			'3': '22.8.1+0',
			'7': 2754,
			'11': 0, // [0] TODO
			'13': 1675874731,
			'16': 'UQ',
			'19': '3.2.1',
		}
		const bat = getBat(device, metadata) as { result: unknown }
		expect(bat.result).toStrictEqual({
			v: 2754,
			ts: 1675874731000,
		})
	})

	it(`should return error if Device object is undefined`, () => {
		const result = getBat(undefined, metadata) as { error: Error }
		expect(result.error).not.toBe(undefined)
	})

	it(`should return error if conversion from Device object to 'bat' object went wrong`, () => {
		const device = {
			'0': 'Nordic Semiconductor ASA',
			'1': 'Thingy:91',
			'2': '351358815340515',
			'3': '22.8.1+0',
			// '7':  2754, required value missed
			'11': 0, // [0] TODO
			'13': 1675874731,
			'16': 'UQ',
			'19': '3.2.1',
		}
		const bat = getBat(device, metadata) as { error: Error }
		expect(bat.error).not.toBe(undefined)
	})
})
