import { fromSecondsToMilliseconds } from './fromSecondsToMilliseconds.js'

describe('fromSecondsToMilliseconds', () => {
	it.each([
		[1675874731, 1675874731000],
		[1692024410, 1692024410000],
	])(
		'should transform seconds (%d) to milliseconds (%d)',
		(seconds, milliseconds) =>
			expect(fromSecondsToMilliseconds(seconds)).toBe(milliseconds),
	)

	it('should return error if input has not the expected length', () => {
		const result = fromSecondsToMilliseconds(10) as { error: Error }
		expect(result.error).not.toBe(undefined)
	})
})
