/*
 * Copyright (c) 2022 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

// Capture Kepler's resolveRequest before merging — it remaps `react-native`
// to the @amzn/react-native-kepler system bundle. Must chain to it.
const keplerResolveRequest = defaultConfig.resolver?.resolveRequest;

const config = {
  resolver: {
    platforms: [...(defaultConfig.resolver?.platforms ?? []), 'kepler'],
    extraNodeModules: {
      // @amazon-devices/react-native-kepler still embeds @amzn/* source refs
      // internally; alias the old name so Metro resolves assets correctly.
      '@amzn/react-native-kepler': path.resolve(
        __dirname,
        'node_modules/@amazon-devices/react-native-kepler',
      ),
    },
    resolveRequest: (context, moduleName, platform) => {
      // react-native-get-random-values calls TurboModuleRegistry.getEnforcing
      // for RNGetRandomValues which is not registered on Kepler 4. Replace with
      // a pure-JS Math.random polyfill.
      if (moduleName === 'react-native-get-random-values') {
        return {
          filePath: path.resolve(__dirname, 'src/get-random-values-polyfill.js'),
          type: 'sourceFile',
        };
      }
      // @segment/sovran-react-native index.tsx accesses NativeModules which
      // triggers Kepler's legacy BatchedBridge and crashes before any try/catch.
      if (moduleName === '@segment/sovran-react-native' ||
          moduleName.endsWith('/sovran-react-native')) {
        return {
          filePath: path.resolve(__dirname, 'src/sovran-polyfill.js'),
          type: 'sourceFile',
        };
      }
      // context.ts calls getNativeModule('AnalyticsReactNative') which also
      // triggers NativeModules. Kepler plugin provides its own deviceInfoProvider
      // so returning defaultContext here is safe.
      // Match both absolute package path and relative imports (./context, ../context)
      // from within the analytics-react-native package.
      if (moduleName === '@segment/analytics-react-native/src/context' ||
          ((moduleName === './context' || moduleName.endsWith('/context')) &&
           context.originModulePath.includes('analytics-react-native'))) {
        return {
          filePath: path.resolve(__dirname, 'src/context-polyfill.js'),
          type: 'sourceFile',
        };
      }
      if (keplerResolveRequest) {
        return keplerResolveRequest(context, moduleName, platform);
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
  transformer: {
    transformIgnorePatterns: [
      'node_modules/(?!(@amazon-devices|@amzn|@segment|react-native|@react-native|@react-native-async-storage)/)',
    ],
  },
};

module.exports = mergeConfig(defaultConfig, config);
