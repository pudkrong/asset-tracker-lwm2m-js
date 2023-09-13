# ADR 007: Warning and Error handling

## Warning

It is consider a warning when an object of the output type can not be created
because the object/s required to build it is/are not present in the input.

This situation is communicated through the `onWarning` callback to the user.

```typescript
const onWarningCallback = (warning) => console.log(warning);
const onErrorCallback = (error) => console.log(error);

const result = converter(
  lwM2MAssetTrackerV2,
  onWarningCallback, // here
  onErrorCallback,
);
```

## Error

It is consider an error when the conversion from LwM2M object to nRF Asset
Tracker object was not successful.

This situation is communicated through the `onError` callback to the user..

```typescript
const onWarningCallback = (warning) => console.log(warning);
const onErrorCallback = (error) => console.log(error);

const result = converter(
  lwM2MAssetTrackerV2,
  onWarningCallback,
  onErrorCallback, // here
);
```
