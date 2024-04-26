import DeviceInfo from '@amzn/react-native-device-info';
import { DeviceInfoProvider } from '@segment/analytics-react-native';

export const deviceInfoProvider: DeviceInfoProvider = async (config) => {
  config.collectDeviceId;
  const applicationName = DeviceInfo.getApplicationName();
  const applicationVersion = DeviceInfo.getVersion();
  const buildNumber = DeviceInfo.getBuildNumber();
  const bundleId = DeviceInfo.getBundleId();
  const osVersion = DeviceInfo.getSystemVersion();
  const model = DeviceInfo.getModel();
  const deviceType = DeviceInfo.getDeviceType();
  // Async calls
  let manufacturer = '';
  let deviceName = '';
  let deviceId = '';
  let osName = '';

  const osNamePromise = DeviceInfo.getBaseOs();
  const manufacturerPromise = DeviceInfo.getManufacturer();
  const deviceNamePromise = DeviceInfo.getDeviceName();
  const deviceIdPromise = config.collectDeviceId
    ? DeviceInfo.getUniqueId()
    : undefined;

  await Promise.allSettled([
    osNamePromise,
    manufacturerPromise,
    deviceNamePromise,
    deviceIdPromise,
  ]).then(
    ([osNamePromise, manufacturerResult, deviceNameResult, deviceIdResult]) => {
      if (osNamePromise.status === 'fulfilled') {
        osName = osNamePromise.value;
      }
      if (manufacturerResult.status === 'fulfilled') {
        manufacturer = manufacturerResult.value;
      }
      if (deviceNameResult.status === 'fulfilled') {
        deviceName = deviceNameResult.value;
      }
      if (deviceIdResult.status === 'fulfilled' && deviceIdResult.value) {
        deviceId = deviceIdResult.value;
      }
    }
  );

  return {
    appName: applicationName,
    appVersion: applicationVersion,
    buildNumber: buildNumber,
    bundleId: bundleId,
    locale: '', // TODO
    networkType: 'wifi', // TODO
    osName: osName,
    osVersion: osVersion,
    screenHeight: 0, // TODO
    screenWidth: 0, // TODO
    timezone: '', // TODO
    manufacturer: manufacturer,
    model: model,
    deviceName: deviceName,
    deviceType: deviceType,
    deviceId: deviceId,
  };
};
