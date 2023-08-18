import {
	converter,
	type LwM2MAssetTrackerV2,
	type Metadata,
} from './converter.js'

const lwM2MAssetTrackerV2 = {} as LwM2MAssetTrackerV2 // Object with Asset Tracker v2 objects...
const metadata = {} as Metadata // Metadata object from Azure Device Twin ...
const result = converter(lwM2MAssetTrackerV2, metadata)
console.log(result)

/**
 {
			bat: {
				v: 2754,
				ts: 1675874731000,
			},
			env: {
				v: {
					temp: 27.18,
					hum: 24.057,
					atmp: 10,
				},
				ts: 1688731863032,
			},
			gnss: {
				v: {
					lng: 153.2176,
					lat: -43.5723,
					acc: 24.798573,
					alt: 2,
					spd: 0.579327,
					hdg: 0, // ***** origin missing *****
				},
				ts: 1665149633000,
			},
			cfg: {
				loct: 60,
				act: false,
				actwt: 60,
				mvres: 60,
				mvt: 3600,
				accath: 10.5,
				accith: 5.2,
				accito: 1.7,
				nod: [],
			},
			dev: {
				v: {
					imei: '351358815340515',
					iccid: '0000000000000000000', // ***** origin missing *****
					modV: '22.8.1+0',
					brdV: 'Nordic Semiconductor ASA',
				},
				ts: 1675874731000,
			},
			roam: {
				v: {
					band: 1, // ***** origin missing *****
					nw: '6',
					rsrp: -85,
					area: 12,
					mccmnc: 24220,
					cell: 34237196,
					ip: '10.160.120.155',
					eest: 5, // ***** origin missing *****
				},
				ts: 1688731863032,
			},
		}
 */
