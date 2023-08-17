/**
 * Convert date time to Unix Timestamp
 *
 * from -> '2023-08-03T12:11:03.0324459Z'
 * to -> 1691064663032
 */
export const fromStringToUnixTimestamp = (time: string): number => {
	const unixTimestamp = Date.parse(time)
	return unixTimestamp.valueOf()
}
