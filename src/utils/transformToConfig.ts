import {
	Config,
	type ConfigData,
	validateWithType,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import type { Config_50009 } from '../../schemas/Config_50009.js'

/**
 * Transform Config object into the config object expected by nRF Asset Tracker
 *
 * @see https://github.com/MLopezJ/asset-tracker-cloud-coiote-azure-converter-js/blob/saga/documents/config.md
 */
export const transformToConfig = (
	config: Config_50009,
): { error: Error } | { result: ConfigData } => {
	const act = config[0]
	const loct = config[1]
	const actwt = config[2]
	const mvres = config[3]
	const mvt = config[4]
	const accath = config[5]
	const accith = config[8]
	const accito = config[9]

	const cfg = {
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

	const maybeValidCfg = validateWithType(Config)(cfg)

	if ('errors' in maybeValidCfg)
		return { error: new Error(JSON.stringify(maybeValidCfg.errors)) }

	return { result: maybeValidCfg }
}
