'use strict';

// Kepler 4 has no AnalyticsReactNative native module. The Kepler plugin
// provides its own deviceInfoProvider, so returning default context here
// is safe — the plugin overwrites device/os/locale fields anyway.

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
