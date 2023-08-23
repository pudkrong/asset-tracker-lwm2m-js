import type { Config_50009 } from 'schemas/Config_50009'
import { getCfg } from './getCfg.js'

describe('getCfg', () => {
	it('should return cfg object', () => {
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
		expect(cfg.result).toMatchObject(expected)
	})

	it('should return error if config object is undefined', () => {
		const cfg = getCfg(undefined) as { error: Error }
		expect(cfg.error).not.toBe(undefined)
	})
})
