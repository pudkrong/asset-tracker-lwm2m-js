import type { Config_50009 } from '../../schemas/Config_50009.js'
import { transformToConfig } from './transformToConfig.js'

describe('transformToConfig', () => {
	it('should create config', () => {
		const object = {
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
			loct: 120, // /5009/0/1
			act: true, // /5009/0/0
			actwt: 120, // /5009/0/2
			mvres: 600, // /5009/0/3
			mvt: 7200, // /5009/0/4
			accath: 8.5, // /5009/0/5
			accith: 2.5, // /5009/0/8
			accito: 0.5, // /5009/0/9
			nod: [],
		}

		const config = transformToConfig(object) as { result: unknown }
		expect(config.result).toMatchObject(expected)
	})

	it('should return error in case a required value is missing', () => {
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

		const config = transformToConfig(object) as { error: Error }
		expect(config.error).not.toBe(undefined)
	})
})
