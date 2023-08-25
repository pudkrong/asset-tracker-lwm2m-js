/**
 * Given a set of objects, it is expected that all of them are not undefined.
 * In case one of them is undefined, it should fail.
 * In case of fail, it should return an error message specifying which object is undefined
 *
 * It is used in a context where is needed to build an object but the source from where the values are taken has some attributes as optional,
 * so it is used to check if the values required are there
 */
export const checkAllRequired = (
	objects: Record<string, unknown>,
): { value: true } | { error: string } => {
	const errors = []
	for (const [id, value] of Object.entries(objects))
		if (value === undefined) errors.push(id)

	if (errors.length > 0) return { error: createErrorMessage(errors) }

	return { value: true }
}

/**
 * Build error message
 */
const createErrorMessage = (ids: string[]) =>
	ids.reduce((previous, current, currentIndex) => {
		if (currentIndex === 0)
			return `following objects are required but value is undefined: ${current}`

		return `${previous}, ${current}`
	}, '')
