import DeviceInfo from "@amzn/react-native-device-info";
import { DeviceInfoProvider } from "@segment/analytics-react-native";

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
  let manufacturer = "";
  let deviceName = "";
  let deviceId = "";
  let osName = "";

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
      if (osNamePromise.status === "fulfilled") {
        osName = osNamePromise.value;
      }
      if (manufacturerResult.status === "fulfilled") {
        manufacturer = manufacturerResult.value;
      }
      if (deviceNameResult.status === "fulfilled") {
        deviceName = deviceNameResult.value;
      }
      if (deviceIdResult.status === "fulfilled" && deviceIdResult.value) {
        deviceId = deviceIdResult.value;
      }
    }
  );

  // Properties and their methods from the different dependency packages
  // Unless noted these should all come from the @amzn/react-native-device-info package
  //
  // appName(getApplicationName)
  // appVersion (getVersion)
  // buildNumber (getBuildNumber)
  // bundleId (getBundleId)
  // locale (use https://github.com/zoontek/react-native-localize ETA: May)
  // networkType (use https://github.com/react-native-netinfo/react-native-netinfo ETA: May)
  // osName (getSystemName)
  // osVersion (getSystemVersion)
  // screenHeight
  // screenWidth
  // timezone (use https://github.com/zoontek/react-native-localize ETA: May)
  // manufacturer (getManufacturer)
  // model (getModel)
  // deviceName (getDeviceName)
  // deviceId (getDeviceId)
  // deviceType (getDeviceType)

  // TODO: A lot of these are placeholder dummy calls to react-native-device-info, these should just work when Amazon provides the actual implementation in later releases

  return {
    appName: applicationName,
    appVersion: applicationVersion,
    buildNumber: buildNumber,
    bundleId: bundleId,
    locale: "", // TODO:  https://github.com/zoontek/react-native-localize
    networkType: "wifi", // TODO: https://github.com/react-native-netinfo/react-native-netinfo
    osName: osName,
    osVersion: osVersion,
    screenHeight: 0, // TODO
    screenWidth: 0, // TODO
    timezone: "", // TODO:  https://github.com/zoontek/react-native-localize
    manufacturer: manufacturer,
    model: model,
    deviceName: deviceName,
    deviceType: deviceType,
    deviceId: deviceId,
  };
};
