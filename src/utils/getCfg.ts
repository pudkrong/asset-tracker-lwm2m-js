import type { Config_50009 } from 'schemas/Config_50009'
import {
	Config,
	type ConfigData,
	validateWithType,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'

/**
 * Check required values and build config object, expected by nRF Asset Tracker
 * 
 * @see https://github.com/MLopezJ/asset-tracker-cloud-coiote-azure-converter-js/blob/saga/documents/config.md
 */
export const getCfg = (
	config?: Config_50009,
): { result: ConfigData } | { error: Error } => {
	if (config === undefined)
		return { error: new Error('Config (50009 object is missing') }

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
