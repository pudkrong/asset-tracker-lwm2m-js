import type { Config_50009 } from 'schemas/Config_50009'
import type { ConfigData } from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import { transformToConfig } from './transformToConfig.js'

/**
 * Check required values and build config object, expected by nRF Asset Tracker
 */
export const getCfg = (
	config?: Config_50009,
): { result: ConfigData } | { error: Error } => {
	if (config === undefined)
		return { error: new Error('Config (50009 object is missing') }

	const maybeValidCfg = transformToConfig(config)
	if ('error' in maybeValidCfg) return { error: maybeValidCfg.error }

	return { result: maybeValidCfg.result }
}
