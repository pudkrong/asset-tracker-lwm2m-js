/**
 * Seconds has 10 digits
 * Milliseconds should have 13 digits
 */
export const fromSecondsToMilliseconds = (
	seconds: number,
): number | { error: Error } => {
	if (seconds < 999999999)
		return {
			error: new Error(
				`Input has not the expected length (10 digits): ${seconds}`,
			),
		}
	return seconds * 1000
}
