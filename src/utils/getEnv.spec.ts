import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
	Humidity_3304_urn,
	Pressure_3323_urn,
	Temperature_3303,
	Temperature_3303_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { getEnv } from './getEnv.js'
import { typeError } from '../converter.js'

void describe('getEnv', () => {
	void it(`should create the 'env' object expected by nRF Asset Tracker`, () => {
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
		const metadata = {}
		const env = getEnv(temperature, humidity, pressure, metadata) as {
			result: unknown
		}
		const expected = {
			v: {
				temp: 27.18,
				hum: 24.057,
				atmp: 10,
			},
			ts: 1688731863032,
		}

		assert.deepEqual(env.result, expected)
	})

	/**
	 * @see adr/007-timestamp-hierarchy.md
	 */
	void it('should follow Timestamp Hierarchy in case timestamp resource is not found from LwM2M objects', () => {
		const temperature = [{ '5700': 15 }]
		const humidity = [{ '5700': 30 }]
		const pressure = [
			{
				'5601': 101697,
				'5602': 101705,
				'5700': 101705,
				'5701': 'Pa',
				//'5518': 45612456 // Missing timestamp resource
			},
		]
		const metadata = {
			[Temperature_3303_urn]: [
				{
					'5700': new Date('2023-07-07T12:11:03.0324459Z'),
				},
			],

			[Humidity_3304_urn]: [
				{
					'5700': new Date('2023-07-07T12:11:03.0324459Z'),
				},
			],

			[Pressure_3323_urn]: [
				{
					'5601': new Date('2023-07-07T12:11:03.0324459Z'),
					'5602': new Date('2023-07-07T12:11:03.0324459Z'),
					'5700': new Date('2023-08-03T12:11:03.0324459Z'),
					'5701': new Date('2023-07-07T12:11:03.0324459Z'),
				},
			],
		}

		const expected = {
			v: {
				temp: 15,
				hum: 30,
				atmp: 101705,
			},
			ts: 1688731863032,
		}

		const env = getEnv(temperature, humidity, pressure, metadata) as {
			result: unknown
		}

		assert.deepEqual(env.result, expected)
	})

	void it(`should return error if required objects are undefined`, () => {
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
		const metadata = {}
		const result = getEnv(temperature, humidity, pressure, metadata) as {
			error: Error
		}

		assert.equal(result.error.message, 'Humidity (3304) object is undefined')
	})

	void it(`should return error if required resources are missing`, () => {
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
		const metadata = {}
		const result = getEnv(temperature, humidity, pressure, metadata) as {
			error: typeError
		}
		const instancePathError = result.error.description[0]?.instancePath
		const message = result.error.description[0]?.message
		const keyword = result.error.description[0]?.keyword

		assert.equal(instancePathError, `/v`)
		assert.equal(message, "must have required property 'temp'")
		assert.equal(keyword, 'required')
	})
})
