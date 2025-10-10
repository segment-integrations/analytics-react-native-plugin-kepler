import DeviceInfo from '@amazon-devices/react-native-device-info';
import { 
  getApplicationName, 
  getVersion, 
  getBuildNumber, 
  getBundleId, 
  getSystemVersion, 
  getModel 
} from "@amazon-devices/react-native-device-info";
import { getCountry, getTimeZone } from '@amazon-devices/react-native-localize';
import { DeviceInfoProvider } from '@segment/analytics-react-native';

export const deviceInfoProvider: DeviceInfoProvider = async (config) => {
  config.collectDeviceId;
  const applicationName =  getApplicationName();
  const applicationVersion = getVersion();
  const buildNumber = getBuildNumber();
  const bundleId = getBundleId();
  const osVersion = getSystemVersion();
  const model = getModel();
  const country = getCountry(); 
  const timezone = getTimeZone();

  const osName = await DeviceInfo.getBaseOs();
  const manufacturer = await DeviceInfo.getManufacturer();
  const deviceName = await DeviceInfo.getDeviceName();
  const deviceId = config.collectDeviceId
    ? await DeviceInfo.getUniqueId()
    : undefined;

  const deviceType = await DeviceInfo.getDeviceType();

  return {
    appName: applicationName,
    appVersion: applicationVersion,
    buildNumber: buildNumber,
    bundleId: bundleId,
    locale: country, 
    networkType: 'wifi', // TODO
    osName: osName,
    osVersion: osVersion,
    screenHeight: 0, // TODO
    screenWidth: 0, // TODO
    timezone: timezone, 
    manufacturer: manufacturer,
    model: model,
    deviceName: deviceName,
    deviceType: deviceType,
    deviceId: deviceId,
  };
};