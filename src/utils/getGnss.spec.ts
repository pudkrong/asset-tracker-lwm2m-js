import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
	type Location_6,
	Location_6_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { getGnss } from './getGnss.js'
import { typeError } from '../converter.js'

void describe('getGnss', () => {
	void it(`should create gnss`, () => {
		const location = {
			'0': -43.5723,
			'1': 153.2176,
			'2': 2,
			'3': 24.798573,
			'5': 1665149633,
			'6': 0.579327,
		}
		const metadata = {}
		const gnss = getGnss(location, metadata) as { result: unknown }
		const expected = {
			v: {
				lng: 153.2176,
				lat: -43.5723,
				acc: 24.798573,
				alt: 2,
				spd: 0.579327,
			},
			ts: 1665149633000,
		}
		assert.deepEqual(gnss.result, expected)
	})

	/**
	 * @see adr/007-timestamp-hierarchy.md
	 */
	void it('should create gnss using server time', () => {
		const metadata = {
			[Location_6_urn]: {
				'0': new Date('2023-08-03T12:11:03.0324459Z'),
				'1': new Date('2023-07-07T12:11:03.0324459Z'),
				'2': new Date('2023-07-07T12:11:03.0324459Z'),
				'3': new Date('2023-07-07T12:11:03.0324459Z'),
				'6': new Date('2023-07-07T12:11:03.0324459Z'),
			},
		}

		const input: Location_6 = {
			'0': -43.5723,
			'1': 153.2176,
			'2': 170.528305,
			'3': 24.798573,
			// '5': 1665149633, // timestamp from Location object
			'6': 0.579327,
		} as unknown as Location_6

		const expected = {
			v: {
				lng: 153.2176,
				lat: -43.5723,
				acc: 24.798573,
				alt: 170.528305,
				spd: 0.579327,
			},
			ts: 1688731863032,
		}

		const gnss = getGnss(input, metadata) as {
			result: unknown
		}
		assert.deepEqual(gnss.result, expected)
	})

	void it(`should return error in case Location object is undefined`, () => {
		const metadata = {}
		const result = getGnss(undefined, metadata) as { error: Error }
		assert.equal(result.error.message, 'Location (6) object is undefined')
	})

	void it(`should return error in case required resource is missing`, () => {
		const location = {
			// '0': -43.5723, // required resource is missing
			'1': 153.2176,
			'2': 2,
			'3': 24.798573,
			'5': 1665149633,
			'6': 0.579327,
		} as unknown as Location_6
		const metadata = {}
		const result = getGnss(location, metadata) as { error: typeError }
		const instancePathError = result.error.description[0]?.instancePath
		const message = result.error.description[0]?.message
		const keyword = result.error.description[0]?.keyword

		assert.equal(instancePathError, `/v`)
		assert.equal(message, "must have required property 'lat'")
		assert.equal(keyword, 'required')
	})
})
