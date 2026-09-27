jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native', () => ({
  View: 'View',
  Text: 'Text',
  StyleSheet: { create: (styles) => styles },
  TouchableOpacity: 'TouchableOpacity',
  ActivityIndicator: 'ActivityIndicator',
  Alert: { alert: jest.fn() },
  Platform: { OS: 'android' },
}));

jest.mock('lucide-react-native', () => ({
  ShieldAlert: 'ShieldAlert',
  ShieldCheck: 'ShieldCheck',
  WifiOff: 'WifiOff',
  Tablet: 'Tablet',
  Lock: 'Lock',
  Unlock: 'Unlock',
  Mail: 'Mail',
  UserPlus: 'UserPlus',
  LogIn: 'LogIn',
  HeartHandshake: 'HeartHandshake',
  ArrowLeft: 'ArrowLeft',
}));
