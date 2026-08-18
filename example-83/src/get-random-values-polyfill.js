'use strict';

// react-native-get-random-values patches crypto.getRandomValues with a native
// TurboModule (RNGetRandomValues) that is not registered on Kepler 4.
// Install a pure-JS Math.random fallback instead so uuid v4 works without
// any native module.
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = {};
}
if (typeof globalThis.crypto.getRandomValues !== 'function') {
  globalThis.crypto.getRandomValues = function (array) {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  };
}
