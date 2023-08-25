import { checkAllRequired } from './checkAllRequired.js'

describe('checkAllRequired', () => {
	it('should check that all the given values are not undefined', () => {
		const object = {
			lat: 1,
			alt: 2,
			spd: 3,
		}
		const result = checkAllRequired(object) as { value: true }
		expect(result.value).toBe(true)
	})

	it('should return error message when a required object is undefined', () => {
		const object = {
			lat: 1,
			alt: undefined,
			spd: 3,
		}
		const result = checkAllRequired(object) as { error: string }
		expect('error' in result).toBe(true)
		expect(result.error).toBe(
			'following objects are required but value is undefined: alt',
		)
	})
})
