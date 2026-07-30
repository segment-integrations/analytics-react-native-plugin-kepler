'use strict';

// Kepler 4 / RN 0.83 is New Architecture only — no legacy bridge.
// @segment/sovran-react-native's index.tsx imports NativeModules from
// react-native which triggers Kepler's BatchedBridge/NativeModules.js to load,
// and that module throws "__fbBatchedBridgeConfig is not set" at load time
// before any try/catch in sovran can execute.
// This shim re-exports only the pure-JS parts of sovran (createStore,
// registerBridgeStore, persistor) with a no-op native bridge — safe because
// Kepler doesn't support native anonymousId or deepLink sync anyway.

const { createStore } = require('@segment/sovran-react-native/lib/commonjs/store');
const { registerBridgeStore } = require('@segment/sovran-react-native/lib/commonjs/bridge');
const persistor = require('@segment/sovran-react-native/lib/commonjs/persistor');

module.exports = {
  createStore,
  registerBridgeStore,
  ...persistor,
};
