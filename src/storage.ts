const AsyncStorage = require('@amzn/react-native-kepler/Libraries/Storage/AsyncStorage');
import { Persistor } from '@segment/analytics-react-native';

export const KeplerPersistor: Persistor = {
  get: async <T>(key: string): Promise<T | undefined> => {
    try {
      const persistedStateJSON = await AsyncStorage?.getItem?.(key);
      if (persistedStateJSON !== null && persistedStateJSON !== undefined) {
        return JSON.parse(persistedStateJSON) as unknown as T;
      }
    } catch (e) {
      console.error(e);
    }

    return undefined;
  },

  set: async <T>(key: string, state: T): Promise<void> => {
    try {
      await AsyncStorage?.setItem?.(key, JSON.stringify(state));
    } catch (e) {
      console.error(e);
    }
  },
};
