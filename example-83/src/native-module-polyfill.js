'use strict';

// Kepler 4 / RN 0.83 is New Architecture only — no legacy bridge.
// @segment/analytics-react-native's native-module.ts calls NativeModules at
// load time and crashes with "__fbBatchedBridgeConfig is not set".
// All three exports are used with optional chaining (?.) by consumers,
// so returning undefined is safe — native anonymousId and deepLink events
// are not supported on Kepler anyway.

module.exports = {
  warnMissingNativeModule: function () {},
  getNativeModule: function () { return undefined; },
  AnalyticsReactNativeModule: undefined,
  AnalyticsReactNativeModuleEmitter: undefined,
  AnalyticsReactNativeModuleEvents: {
    SET_ANONYMOUS_ID: 'add-anonymous-id',
    SET_DEEPLINK: 'add-deepLink-data',
  },
};
