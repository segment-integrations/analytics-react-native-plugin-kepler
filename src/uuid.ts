import { UUIDProvider } from '@segment/analytics-react-native';
import uuid from 'react-native-uuid';

export const KeplerUUIDProvider: UUIDProvider = () => {
  return uuid.v4().toString();
};
