# ADR 008: Default LwM2M version

The next versions are expected to be used in the LwM2M objects:

| Object ID | Object Version | LwM2M Version |
| --------- | -------------- | ------------- |
| 3         | 1.2            | 1.1           |
| 4         | 1.3            | 1.1           |
| 6         | 1.0            | 1.0           |
| 3303      | 1.1            | 1.0           |
| 3304      | 1.1            | 1.0           |
| 3323      | 1.1            | 1.0           |

It is known that in the object version `1.0` of objects `3303`, `3304` and
`3323` there is missing the resource used to set timestamp value (`5518`) in the
Environment object of nRF Asset Tracker. This case is cover by the
implementation of [Timestamp Hierarchy](./007-timestamp-hierarchy.md), however
there could be other cases no caught and it is recommended to use the versions
listed above to avoid issues.
