import React from 'react';
import {render} from '@testing-library/react-native';
import App from '../src/App';

jest.mock('react-native-launcher-kit', () => ({
  InstalledApps: {
    getApps: jest.fn().mockResolvedValue([
      {packageName: 'com.test.app', label: 'Test', icon: 'icon.png', accentColor: '#000'},
    ]),
    getSortedApps: jest.fn().mockResolvedValue([]),
    startListeningForAppInstallations: jest.fn(),
    stopListeningForAppInstallations: jest.fn(),
    startListeningForAppRemovals: jest.fn(),
    stopListeningForAppRemovals: jest.fn(),
  },
  RNLauncherKitHelper: {
    getBatteryStatus: jest.fn().mockResolvedValue({level: 80, isCharging: false}),
    getDefaultLauncherPackageName: jest.fn().mockResolvedValue('com.test.launcher'),
    startListeningForBatteryChanges: jest.fn(),
    stopListeningForBatteryChanges: jest.fn(),
    launchApplication: jest.fn(),
    goToSettings: jest.fn(),
    openAlarmApp: jest.fn(),
    openSetDefaultLauncher: jest.fn().mockResolvedValue(true),
    requestDefaultLauncher: jest.fn().mockResolvedValue(true),
  },
  IntentAction: {
    VIEW: 'android.intent.action.VIEW',
    MAIN: 'android.intent.action.MAIN',
    SEND: 'android.intent.action.SEND',
  },
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({children}: any) => children,
}));

describe('App', () => {
  it('renders without crashing', async () => {
    const {findByText} = render(<App />);
    expect(await findByText('LauncherKit')).toBeTruthy();
  });

  it('shows battery info after loading', async () => {
    const {findByText} = render(<App />);
    expect(await findByText('80%')).toBeTruthy();
  });

  it('shows default launcher', async () => {
    const {findByText} = render(<App />);
    expect(await findByText('com.test.launcher')).toBeTruthy();
  });
});
