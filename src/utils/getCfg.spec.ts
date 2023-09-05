import { describe, it } from 'node:test'
import assert from 'node:assert'
import type { Config_50009 } from '../schemas/Config_50009.js'
import { getCfg } from './getCfg.js'

void describe('getCfg', () => {
	void it(`should create the 'cfg' object expected by nRF Asset Tracker`, () => {
		const object: Config_50009 = {
			'0': true,
			'1': 120,
			'2': 120,
			'3': 600,
			'4': 7200,
			'5': 8.5,
			'6': true,
			'7': false,
			'8': 2.5,
			'9': 0.5,
		}

		const expected = {
			loct: 120,
			act: true,
			actwt: 120,
			mvres: 600,
			mvt: 7200,
			accath: 8.5,
			accith: 2.5,
			accito: 0.5,
			nod: [],
		}

		const cfg = getCfg(object) as { result: unknown }
		assert.deepEqual(cfg.result, expected)
	})

	void it('should return error if config object is undefined', () => {
		const cfg = getCfg(undefined) as { error: Error }
		assert.notEqual(cfg.error, undefined)
		// TODO: check if tsmatchers could be used to check error
	})

	void it('should return error in case a required value is missing', () => {
		const object = {
			'0': true,
			'1': 120,
			'2': 120,
			'3': 600,
			'4': 7200,
			// '5': 8.5, // required value is missing
			'6': true,
			'7': false,
			'8': 2.5,
			'9': 0.5,
		} as Config_50009

		const config = getCfg(object) as { error: Error }
		assert.notEqual(config.error, undefined)
		// TODO: check if tsmatchers could be used to check error
	})
})
