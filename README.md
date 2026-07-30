# @segment/analytics-react-native-plugin-kepler

This plugin contains support for Amazon Vega as a platform for React Native apps.

## Install

Install the dependencies for this package:

```sh
npm install react-native-uuid \
  @amazon-devices/react-native-device-info \
  @amazon-devices/react-native-localize \
  @segment/analytics-react-native
```

For React Native 0.83 (Vega SDK 0.24), also add the async-storage alias:

```sh
npm install @react-native-async-storage/async-storage@npm:@amazon-devices/react-native-async-storage__async-storage
```

Then install this package from npm registry:

`npm install @segment/analytics-react-native-plugin-kepler`

### Metro configuration (Kepler 4 / Vega SDK 0.24)

Kepler 4 runs React Native's New Architecture exclusively — there is no legacy bridge (`NativeModules` / `__fbBatchedBridgeConfig`). Several dependencies of `@segment/analytics-react-native` access native modules at module-load time and crash immediately on Kepler 4. The fix is a set of Metro resolver intercepts and pure-JS shim files that replace those modules before they are loaded.

#### 1. Create the shim files

Create the following three files in your app's `src/` directory.

**`src/get-random-values-polyfill.js`**

`react-native-get-random-values` patches `crypto.getRandomValues` using a native TurboModule (`RNGetRandomValues`) that is not registered on Kepler 4. This shim installs a pure-JS fallback instead.

```js
'use strict';

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
```

**`src/sovran-polyfill.js`**

`@segment/sovran-react-native` accesses `NativeModules` at load time, which triggers Kepler's legacy `BatchedBridge/NativeModules.js` and throws before any try/catch can execute. This shim re-exports only the pure-JS store and persistor from sovran's pre-built output, bypassing the native bridge entirely.

```js
'use strict';

const { createStore } = require('@segment/sovran-react-native/lib/commonjs/store');
const { registerBridgeStore } = require('@segment/sovran-react-native/lib/commonjs/bridge');
const persistor = require('@segment/sovran-react-native/lib/commonjs/persistor');

module.exports = { createStore, registerBridgeStore, ...persistor };
```

**`src/context-polyfill.js`**

`analytics-react-native`'s `context.ts` calls `getNativeModule('AnalyticsReactNative')` which also triggers the legacy `NativeModules` crash. The Kepler plugin already provides its own `deviceInfoProvider` that overwrites device/OS context, so returning empty defaults here is safe.

```js
'use strict';

const { libraryInfo } = require('@segment/analytics-react-native/lib/commonjs/info');
const { getUUID } = require('@segment/analytics-react-native/lib/commonjs/uuid');

const getContext = async (userTraits = {}) => {
  return {
    app: { build: '', name: '', namespace: '', version: '' },
    device: { id: '', manufacturer: '', model: '', name: '', type: '' },
    library: { name: 'analytics-react-native', version: libraryInfo.version },
    locale: '',
    network: { cellular: false, wifi: false },
    os: { name: '', version: '' },
    screen: { width: 0, height: 0, density: 0 },
    timezone: '',
    traits: userTraits,
    instanceId: getUUID(),
  };
};

module.exports = { getContext };
```

#### 2. Configure `metro.config.js`

Wire all three shims via Metro's `resolveRequest`. **Important:** Kepler's CLI platform injects its own `resolveRequest` into `getDefaultConfig` to remap `react-native` to the Kepler system bundle. You must capture and chain it — failing to do so bundles standard React Native instead of the Kepler runtime.

```js
const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Capture Kepler's resolveRequest before merging — must be chained.
const keplerResolveRequest = defaultConfig.resolver?.resolveRequest;

const config = {
  resolver: {
    platforms: [...(defaultConfig.resolver?.platforms ?? []), 'kepler'],
    extraNodeModules: {
      // @amazon-devices/react-native-kepler references @amzn/* internally.
      '@amzn/react-native-kepler': path.resolve(
        __dirname,
        'node_modules/@amazon-devices/react-native-kepler',
      ),
    },
    resolveRequest: (context, moduleName, platform) => {
      // Intercept react-native-get-random-values — replaces broken TurboModule
      // with a pure-JS Math.random implementation.
      if (moduleName === 'react-native-get-random-values') {
        return {
          filePath: path.resolve(__dirname, 'src/get-random-values-polyfill.js'),
          type: 'sourceFile',
        };
      }
      // Intercept @segment/sovran-react-native — prevents NativeModules
      // BatchedBridge crash at module-load time.
      if (moduleName === '@segment/sovran-react-native' ||
          moduleName.endsWith('/sovran-react-native')) {
        return {
          filePath: path.resolve(__dirname, 'src/sovran-polyfill.js'),
          type: 'sourceFile',
        };
      }
      // Intercept analytics-react-native's context.ts — prevents
      // AnalyticsReactNative native module lookup crash.
      if (moduleName === '@segment/analytics-react-native/src/context' ||
          ((moduleName === './context' || moduleName.endsWith('/context')) &&
           context.originModulePath.includes('analytics-react-native'))) {
        return {
          filePath: path.resolve(__dirname, 'src/context-polyfill.js'),
          type: 'sourceFile',
        };
      }
      // Chain to Kepler's resolver — required for the Kepler runtime bundle.
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
```

#### Why these shims are needed

Kepler 4's `react-native` bundle exposes `NativeModules` as a lazy getter that loads `BatchedBridge/NativeModules.js` on first access. That module unconditionally throws `__fbBatchedBridgeConfig is not set` because Kepler 4 has no legacy bridge. This throw propagates through Metro's internal module-loading machinery and cannot be caught by a try/catch in user code — it must be prevented at the resolver level before Metro ever loads the offending module.

Now create you client as follows:

```ts
// Import the createClient method from the plugin instead of the core package!
// This automatically sets up all the storage and providers specifically for Amazon Vega platform
import { createClient } from "@segment/analytics-react-native-plugin-kepler";

const segmentClient = createClient({
  writeKey: "WRITE_KEY",
});
```

You can then make use of the client just as the standard [@segment/analytics-react-native](https://github.com/segmentio/analytics-react-native/blob/ca8fb862663edf3480b42f8a1c77bd6297dd4f2e/README.md#L98) client.

See the [main readme](https://github.com/segmentio/analytics-react-native/blob/ca8fb862663edf3480b42f8a1c77bd6297dd4f2e/README.md#L98) for all options and methods

## Limitations

- `@amazon-devices/react-native-device-info` does not currently support accessing all the device information such as app name and version, screen dimensions, OS versions, locale, etc. Some information inside the context will be set to `unknown` or empty values. These will come online as Amazon starts adding this information in future package releases.
- `trackDeepLinks` option is not supported.
- `Native AnonymousId` is not supported

## Support

Please use Github issues, Pull Requests, or feel free to reach out to our [support team](https://segment.com/help/).

## Integrating with Segment

Interested in integrating your service with us? Check out our [Partners page](https://segment.com/partners/) for more details.

## License

```
MIT License

Copyright (c) 2024 Segment

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
