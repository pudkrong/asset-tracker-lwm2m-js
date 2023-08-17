import type { EnvironmentData } from '@nordicsemiconductor/asset-tracker-cloud-docs'
import { transformToEnvironment } from './transformToEnvironment.js'

describe('transformToEnvironment', () => {
	const deviceTwinMetadata = {
		$lastUpdated: '2023-07-07T12:11:03.0324459Z',
		lwm2m: {
			'3': {
				'0': {
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

	it('should create Env with LwM2M objects', () => {
		const temperature = [{ '5700': 15 }]
		const humidity = [{ '5700': 30 }]
		const pressure = [
			{
				'5601': 101697,
				'5602': 101705,
				'5700': 101705,
				'5701': 'Pa',
				'5518': 4561245646,
			},
		]

		const result = {
			v: {
				temp: 15,
				hum: 30,
				atmp: 101705,
			},
			ts: 4561245646000,
		}

		const env = transformToEnvironment(
			temperature,
			humidity,
			pressure,
			deviceTwinMetadata,
		) as { result: EnvironmentData }

		expect(env.result).toMatchObject(result)
	})

	it('should return error if Environment values are not found in LwM2M objects', () => {
		const temperature = [{ '5700': 15 }]
		const humidity = [{}] // missing required value
		const pressure = [
			{
				'5601': 101697,
				'5602': 101705,
				'5700': 101705,
				'5701': 'Pa',
			},
		]

		const result = transformToEnvironment(
			temperature,
			humidity as any,
			pressure,
			deviceTwinMetadata,
		) as {
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

		const env = transformToEnvironment(
			temperature,
			humidity as any,
			pressure,
			deviceTwinMetadata,
		) as { result: EnvironmentData }

		expect(env.result).toMatchObject(expected)
	})
})
