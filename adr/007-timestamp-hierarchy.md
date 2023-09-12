# ADR 007: Timestamp hierarchy
//NOTE: timestamp hierarchy belows to first step of transformation

The following object are expecting timestamp value as part of it

| nRF Asset Tracker object  | Data transition                            |
| ------------------------- | ------------------------------------------ |
| bat                       | [link](.../documents/documents/battery.md) |
| dev                       | [link](../documents/device.md)             |
| roam                      | [link](../documents/roaming.md)            |
| env                       | [link](../documents/environment.md)        |
| gnss                      | [link](../documents/gnss.md)               |

In case the expected resource is missing (see data transition link), first option will be to pick the reported timestamp of the object.



In order with the TypeScript type definition, the reported timestamp object could be undefined.If that's the case, the global cloud timestamp will be used instead.

```

{
    [Device_3_urn]: {
        object: {
            '0': 'Nordic Semiconductor ASA',
            '1': 'Thingy:91',
            '2': '351358815340515',
            '3': '22.8.1+0',
            '7': [2754],
            '11': [0],
            '13': 1675874731,
            '16': 'UQ',
            '19': '3.2.1',
            },
        timestamp: 1675874731
    },
    cloudTimestamp: 1675874731
}

```


In this way, there are a hierarchy about the element to be used for the reported timestamp value.

1. Resource from LwM2M object
2. Timestamp from the respective object
3. Cloud timestamp from input object

See test for more details.


Timestamps are expected as values in the objects of nRF Asset Tracker.

The primary source of those values are the resource rewarding time on each LwM2M
object. For example, for the Device object in nRF Asset Tracker, the `ts` value
will be the resource 13 from object 3 in LwM2M.

```TypeScript

dev: {
    v: {
        imei: '351358815340515',
        iccid: '0000000000000000000',
        modV: '22.8.1+0',
        brdV: 'Nordic Semiconductor ASA',
    },
    ts: 1675874731000, // /3/0/13
}
```

> See [nRF Asset Tracker data transition](../documents//nRFAssetTracker.md) for
> more information.

hypothetically, if the resource 13 of object 3 is missing, the timestamp value
will be taken from the metadata object following the next hierarchy level:

1. `$lastUpdated` value from the **resource** reported in device twin metadata
2. `$lastUpdated` value from the **instance** reported in device twin metadata
3. `$lastUpdated` value from the **object** reported in device twin metadata
4. `$lastUpdated` value from the **LwM2M** reported in device twin metadata
5. `$lastUpdated` value reported to the **metadata** object in device twin

here is one example about how the `metadata` object looks like:

```
"$metadata": {
                "$lastUpdated": "2023-08-18T14:39:11.9414162Z",
                "lwm2m": {
                    "3": {
                        "0": {
                            "0": {
                                "$lastUpdated": "2023-08-18T14:39:11.9414162Z"
                                "value": {
                                    "$lastUpdated": "2023-08-18T14:39:11.9414162Z"
                                }
                            }
                            "1": {
                                "$lastUpdated": "2023-08-18T14:39:11.9414162Z"
                                "value": {
                                    "$lastUpdated": "2023-08-18T14:39:11.9414162Z"
                                }
                            }
                            "2": {
                                "$lastUpdated": "2023-08-18T14:39:11.9414162Z"
                                "value": {
                                    "$lastUpdated": "2023-08-18T14:39:11.9414162Z"
                                }
                            }
                            "3": {
                                "$lastUpdated": "2023-08-18T14:39:11.9414162Z"
                                "value": {
                                    "$lastUpdated": "2023-08-18T14:39:11.9414162Z"
                                }
                            }
                            "9": {
                                "$lastUpdated": "2023-08-18T14:39:11.9414162Z"
                                "value": {
                                    "$lastUpdated": "2023-08-18T14:39:11.9414162Z"
                                }
                            }
                            "13": {
                                "$lastUpdated": "2023-08-18T14:39:11.9414162Z"
                                "value": {
                                    "$lastUpdated": "2023-08-18T14:39:11.9414162Z"
                                }
                            }
                            "16": {
                                "$lastUpdated": "2023-08-18T14:39:11.9414162Z"
                                "value": {
                                    "$lastUpdated": "2023-08-18T14:39:11.9414162Z"
                                }
                            }
                            "18": {
                                "$lastUpdated": "2023-08-18T14:39:11.9414162Z"
                                "value": {
                                    "$lastUpdated": "2023-08-18T14:39:11.9414162Z"
                                }
                            }
                            "19": {
                                "$lastUpdated": "2023-08-18T14:39:11.9414162Z"
                                "value": {
                                    "$lastUpdated": "2023-08-18T14:39:11.9414162Z"
                                }
                            }
                            "$lastUpdated": "2023-08-18T14:39:11.9414162Z"
                        }
                        "$lastUpdated": "2023-08-18T14:39:11.9414162Z"
                    },
					"$lastUpdated": "2023-08-18T14:39:11.9414162Z"
            }
		}
```

See [getTimestamps.spec.ts](../src//utils//getTimestamp.spec.ts) for more
examples.
