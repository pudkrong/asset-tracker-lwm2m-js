import type { Temperature_3303 } from '@nordicsemiconductor/lwm2m-types'
import { getEnv } from './getEnv.js'

describe('getEnv', () => {
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

	it(`should create the env object expected by nRF Asset Tracker`, () => {
		const temperature = [
			{
				'5601': 27.18,
				'5602': 27.71,
				'5700': 27.18,
				'5701': 'Cel',
			},
		]
		const humidity = [
			{
				'5601': 23.535,
				'5602': 24.161,
				'5700': 24.057,
				'5701': '%RH',
			},
		]
		const pressure = [
			{
				'5601': 101697,
				'5602': 101705,
				'5700': 10,
				'5701': 'Pa',
			},
		]
		const env = getEnv(temperature, humidity, pressure, metadata) as {
			result: unknown
		}
		expect(env.result).toStrictEqual({
			v: {
				temp: 27.18,
				hum: 24.057,
				atmp: 10,
			},
			ts: 1688731863032,
		})
	})

	it(`should return error if required objects are undefined`, () => {
		const temperature = [
			{
				'5601': 27.18,
				'5602': 27.71,
				'5700': 27.18,
				'5701': 'Cel',
			},
		]
		const humidity = undefined
		const pressure = [
			{
				'5601': 101697,
				'5602': 101705,
				'5700': 10,
				'5701': 'Pa',
			},
		]
		const result = getEnv(temperature, humidity, pressure, metadata) as {
			error: Error
		}
		expect(result.error).not.toBe(undefined)
	})

	it(`should return error if required resources are missing`, () => {
		const temperature = [
			{
				'5601': 27.18,
				'5602': 27.71,
				//'5700': 27.18, // required resource is missing
				'5701': 'Cel',
			},
		] as unknown as Temperature_3303
		const humidity = [
			{
				'5601': 23.535,
				'5602': 24.161,
				'5700': 24.057,
				'5701': '%RH',
			},
		]
		const pressure = [
			{
				'5601': 101697,
				'5602': 101705,
				'5700': 10,
				'5701': 'Pa',
			},
		]
		const result = getEnv(temperature, humidity, pressure, metadata) as {
			error: Error
		}
		expect(result.error).not.toBe(undefined)
	})

	it('should follow Timestamp Hierarchy in case timestamp is not found from LwM2M objects', () => {
		const temperature = [{ '5700': 15 }]
		const humidity = [{ '5700': 30 }]
		const pressure = [
			{
				'5601': 101697,
				'5602': 101705,
				'5700': 101705,
				'5701': 'Pa',
				//'5518': 45612456 // Missing timestamp value
			},
		]

		const expected = {
			v: {
				temp: 15,
				hum: 30,
				atmp: 101705,
			},
			ts: 1688731863032,
		}

		const env = getEnv(
			temperature,
			humidity,
			pressure,
			metadata,
		) as { result: unknown }

		expect(env.result).toMatchObject(expected)
	})
})
