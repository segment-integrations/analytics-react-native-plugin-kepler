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
    // Kepler 4 is New Architecture only — no legacy bridge. Redirect modules
    // that call NativeModules at load time to safe no-op shims.
    resolveRequest: (context, moduleName, platform) => {
      if (
        moduleName ===
        '@segment/analytics-react-native/src/native-module' ||
        moduleName.endsWith('/native-module')
      ) {
        return {
          filePath: path.resolve(__dirname, 'src/native-module-polyfill.js'),
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
      'node_modules/(?!(@amazon-devices|@amzn|react-native|@react-native|@react-native-async-storage)/)',
    ],
  },
};

module.exports = mergeConfig(defaultConfig, config);
