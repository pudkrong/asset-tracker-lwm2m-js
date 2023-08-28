# Missing objects in input

If an object required to build an output object is missing, that object will not
be present in the output.

For example, for the next input for the `converter` method

```TypeScript
const input = {
			[Device_3_urn]: {
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
            // ConnectivityMonitoring_4 is missing
            // Location_6 is missing
            // Temperature_3303 is missing
            // Humidity_3304 is missing
            // Pressure_3323 is missing
		}

const metadata = {}

converter(input, metadata)
```

The expected output will be

```JSON
{
    "bat": {
        "v": 2754,
        "ts": 1675874731000,
    },
    "dev": {
        "v": {
            "imei": "351358815340515",
            "iccid": "0000000000000000000",
            "modV": "22.8.1+0",
            "brdV": "Nordic Semiconductor ASA",
        },
        "ts": 1675874731000,
    },
    // Env object is not generated
    // Gnss object is not generated
    // Roam object is not generated
    // Cfg object is not generated
}
```

See
[create output even when some expected objects in the input are missing](./src/converter.spec.ts)
for an example,

See [Data Transition](#data-transition) to see the relationship between input
and output objects.
