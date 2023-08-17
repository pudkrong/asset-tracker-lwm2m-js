import { fromStringToUnixTimestamp } from './fromStringToUnixTimestamp.js'

describe('fromStringToUnixTimestamp', () => {
	it.each([
		['2023-08-03T12:11:03.0324459Z', 1691064663032],
		['2023-05-31T08:51:47.0324459Z', 1685523107032],
	])(
		'should return equivalent unix timestamp value given the date in string format. %s -> %d',
		(time, unixTimestamp) => {
			expect(fromStringToUnixTimestamp(time)).toBe(unixTimestamp)
		},
	)
})
