# LwM2M-Asset-Tracker-V2-to-Asset-Tracker-web-app

> FIXME: release to NPM TODO: Update test and release badges

```
[![Test and Release](https://github.com/NordicSemiconductor/asset-tracker-lwm2m-js/actions/workflows/test-and-release.yaml/badge.svg)](https://github.com/NordicSemiconductor/asset-tracker-lwm2m-js/actions/workflows/test-and-release.yaml)
```

[![Test and Release](https://github.com/MLopezJ/LwM2M-Asset-Tracker-V2-to-Asset-Tracker-web-app/actions/workflows/test-and-release.yaml/badge.svg)](https://github.com/MLopezJ/LwM2M-Asset-Tracker-V2-to-Asset-Tracker-web-app/actions/workflows/test-and-release.yaml)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier/)
[![ESLint: TypeScript](https://img.shields.io/badge/ESLint-TypeScript-blue.svg)](https://github.com/typescript-eslint/typescript-eslint)

> Converts a JSON document containing the `asset_tracker_v2` device and sensor
> data encoded as LwM2M to the JSON document required by nRF Asset Tracker.

## Installation

```
npm install
```

## Test

```
npm test
```

## End-to-end tests

```
npx tsx e2e-tests/index.ts
```

## Coverage

```
npm test -- --coverage
```

## Expected input

A JSON document containing the
[`asset_tracker_v2`](https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/applications/asset_tracker_v2/README.html)
device and sensor data encoded as LwM2M, following the schema in
[`lwm2m-types-js`](https://github.com/NordicSemiconductor/lwm2m-types-js).

```TypeScript
import {
  Device_3_urn,
  ConnectivityMonitoring_4_urn,
  Location_6_urn,
  Temperature_3303_urn,
  Humidity_3304_urn,
  Pressure_3323_urn,
} from "@nordicsemiconductor/lwm2m-types";
import { Config_50009_urn } from "schemas/Config_50009";

export const input = {
  [Device_3_urn]: {
    "0": "Nordic Semiconductor ASA",
    "1": "Thingy:91",
    "2": "351358815340515",
    "3": "22.8.1+0",
    '7':  2754,
    "11": [0],
    "13": 1675874731
    "16": "UQ",
    "19": "3.2.1",
  },

  [ConnectivityMonitoring_4_urn]: {
    "0": 6,
    "1": [6, 7],
    "2": -85,
    "3": 23,
    "4": ["10.160.120.155"],
    "8": 34237196,
    "9": 2,
    "10": 242,
    "12": 12,
  },

  [Location_6_urn]: {
    "0": -43.5723,
    "1": 153.2176,
    "2": 2,
    "5": 1665149633,
    "6": 5,
  },

  [Temperature_3303_urn]: [
    {
      "5601": 27.18,
      "5602": 27.71,
      "5700": 27.18,
      "5701": "Cel",
    },
  ],

  [Humidity_3304_urn]: [
    {
      "5601": 23.535,
      "5602": 24.161,
      "5700": 24.057,
      "5701": "%RH",
    },
  ],

  [Pressure_3323_urn]: [
    {
      "5601": 101697,
      "5602": 101705,
      "5700": 10,
      "5701": "Pa",
    },
  ],

  [Config_50009_urn]: {
    "0": true,
    "2": 120,
    "3": 600,
    "4": 7200,
    "1": 120,
    "5": 8.5,
    "8": 2.5,
    "9": 0.5,
  },
};
```

## Expected output

The output is an object with the structure described in the
[nRF Asset Tracker protocol documentation](https://github.com/NordicSemiconductor/asset-tracker-cloud-docs/blob/saga/docs/cloud-protocol/state.reported.azure.json)

```json
{
  "bat": {
    "v": 2754,
    "ts": 1563968747123
  },
  "env": {
    "v": {
      "temp": 23.6,
      "hum": 50.5,
      "atmp": 100.36
    },
    "ts": 1563968743666
  },
  "gnss": {
    "v": {
      "lng": 10.436642,
      "lat": 63.421133,
      "acc": 24.798573,
      "alt": 170.528305,
      "spd": 0.579327,
      "hdg": 0 // ***** origin missing *****
    },
    "ts": 1563968752991
  },
  "cfg": {
    "loct": 60,
    "act": false,
    "actwt": 60,
    "mvres": 60,
    "mvt": 3600,
    "accath": 10.5,
    "accith": 5.2,
    "accito": 1.7,
    "nod": []
  },
  "dev": {
    "v": {
      "imei": "352656106111232",
      "iccid": "0000000000000000000", // ***** origin missing *****
      "modV": "mfw_nrf9160_1.0.0",
      "brdV": "thingy91_nrf9160"
    },
    "ts": 1563968743666
  },
  "roam": {
    "v": {
      "band": 3, // ***** origin missing *****
      "nw": "NB-IoT",
      "rsrp": -97,
      "area": 12,
      "mccmnc": 24202,
      "cell": 33703719,
      "ip": "10.81.183.99",
      "eest": 5 // ***** origin missing *****
    },
    "ts": 1563968743666
  }
}
```

## Example

```TypeScript
import {
	converter,
	type LwM2MAssetTrackerV2,
	type Metadata,
} from './converter.js'

const lwM2MAssetTrackerV2 = {} as LwM2MAssetTrackerV2 // Object with Asset Tracker v2 objects...
const metadata = {} as Metadata // Metadata object from Azure Device Twin ...
const result = converter(lwM2MAssetTrackerV2, metadata)
console.log(result)
```

See [example.js](./src/example.ts) for more details.

## Data transition

| LwM2M                                                                                                                                             | Name                    | nRF Asset Tracker                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------- |
| [3](https://github.com/OpenMobileAlliance/lwm2m-registry/blob/prod/version_history/3-1_1.xml)                                                     | Device                  | [bat](documents/battery.md), [dev](documents/device.md) |
| [4](https://github.com/OpenMobileAlliance/lwm2m-registry/blob/prod/version_history/4-1_1.xml)                                                     | Connectivity Monitoring | [roam](documents/roaming.md)                            |
| [6](https://github.com/OpenMobileAlliance/lwm2m-registry/blob/prod/version_history/6-1_0.xml)                                                     | Location                | [gnss](documents/gnss.md)                               |
| [3303](https://github.com/OpenMobileAlliance/lwm2m-registry/blob/prod/version_history/3303-1_1.xml)                                               | Temperature             | [env](documents/environment.md)                         |
| [3304](https://github.com/OpenMobileAlliance/lwm2m-registry/blob/prod/version_history/3304-1_1.xml)                                               | Humidity                | [env](documents/environment.md)                         |
| [3323](https://github.com/OpenMobileAlliance/lwm2m-registry/blob/prod/version_history/3323-1_1.xml)                                               | Pressure                | [env](documents/environment.md)                         |
| [50009](https://github.com/NordicSemiconductor/asset-tracker-cloud-firmware-aws/blob/saga/src/cloud/lwm2m_integration/config_object_descript.xml) | Config                  | [cfg](documents/config.md)                              |

## Notes

### Missing values

There are some values from
[nRF Asset Tracker](https://github.com/NordicSemiconductor/asset-tracker-cloud-docs/blob/saga/docs/cloud-protocol/state.reported.azure.json)
whose origin is still missing.

- `hdg` from `gnss`. Until find the origin, default value is `0`
- `iccid` from `dev`. Until find the origin, default value is
  `'0000000000000000000'`
- `band` from `roam`. Until find the origin, default value is `3`
- `eest` from `roam`. Until find the origin, default value is `5`

more info:
[data transicion](https://github.com/MLopezJ/nRF-Asset-Tracker-through-Coiote-flow#data-transicion)

### Default LwM2M version

The default LwM2M version used by this converter is `1.1`.

[Timestamp Hierarchy](#timestamp-hierarchy) is implemented to catch error
related to missing timestamp resources in version `1.0`.
[More info](https://github.com/MLopezJ/LwM2M-Asset-Tracker/issues/4)
