import type { ConfigData } from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import type { Config_50009 } from '../../schemas/Config_50009.js'
import { checkAllRequired } from './checkAllRequired.js'

/**
 * Transform Config object into the config object expected by Asset Tracker web app
 *
 * @see https://github.com/MLopezJ/asset-tracker-cloud-coiote-azure-converter-js/blob/saga/documents/config.md
 */
export const transformToConfig = (input: Config_50009): ConfigData => {
	const act = input[0]
	const loct = input[1]
	const actwt = input[2]
	const mvres = input[3]
	const mvt = input[4]
	const accath = input[5]
	const accith = input[8]
	const accito = input[9]

	const config = {
		loct,
		act,
		actwt,
		mvres,
		mvt,
		accath,
		accith,
		accito,
		nod: [],
	}
	const maybeValidRequiredValues = checkAllRequired(config)
	if ('error' in maybeValidRequiredValues)
		throw new Error(maybeValidRequiredValues.error) // TODO: return error

	return config
}
