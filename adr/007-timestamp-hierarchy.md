# ADR 007: Timestamp Hierarchy

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
