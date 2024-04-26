import {
  Config,
  createClient as baseCreateClient,
} from '@segment/analytics-react-native';
import { KeplerUUIDProvider } from './uuid';
import { KeplerPersistor } from './storage';
import { deviceInfoProvider } from './device-info';

export const createClient: typeof baseCreateClient = (config: Config) => {
  return baseCreateClient({
    // Device Information will be the supplied through react-native-device-info (eventually)
    deviceInfoProvider: deviceInfoProvider,
    // We use react-native-uuid as the UUID Generator
    uuidProvider: KeplerUUIDProvider,
    // Persistance is done throuh Kepler's AsyncStorage fork
    storePersistor: KeplerPersistor,
    // Config can always override any of the basic settings we have for compatibility with Kepler
    ...config,
  });
};

export { KeplerUUIDProvider } from './uuid';
export { KeplerPersistor } from './storage';
