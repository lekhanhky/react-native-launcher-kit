import { NativeModules, DeviceEventEmitter } from 'react-native';
import LauncherKitHelper from '..';
import type { BatteryStatus } from '../../interfaces/battery';

// Define mock types
type MockLauncherKit = {
  launchApplication: jest.Mock;
  goToSettings: jest.Mock;
  isPackageInstalled: jest.Mock;
  getDefaultLauncherPackageName: jest.Mock;
  openAlarmApp: jest.Mock;
  getBatteryStatus: jest.Mock;
  openSetDefaultLauncher: jest.Mock;
  startListeningForBatteryChanges: jest.Mock;
  stopListeningForBatteryChanges: jest.Mock;
  requestDefaultLauncher: jest.Mock;
};

// Mock the NativeModules
jest.mock('react-native', () => ({
  NativeModules: {
    LauncherKit: {
      launchApplication: jest.fn(),
      goToSettings: jest.fn(),
      isPackageInstalled: jest.fn(),
      getDefaultLauncherPackageName: jest.fn(),
      openAlarmApp: jest.fn(),
      getBatteryStatus: jest.fn(),
      openSetDefaultLauncher: jest.fn(),
      startListeningForBatteryChanges: jest.fn(),
      stopListeningForBatteryChanges: jest.fn(),
      requestDefaultLauncher: jest.fn(),
    },
  },
  DeviceEventEmitter: {
    addListener: jest.fn(),
    removeAllListeners: jest.fn(),
  },
  Platform: {
    select: jest.fn((obj) => obj.default),
    OS: 'android',
  },
}));

describe('LauncherKitHelper', () => {
  let mockLauncherKit: MockLauncherKit;
  let originalLauncherKit: any;

  beforeEach(() => {
    originalLauncherKit = NativeModules.LauncherKit;
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockLauncherKit = NativeModules.LauncherKit as MockLauncherKit;
  });
  afterEach(() => {
    NativeModules.LauncherKit = originalLauncherKit;
    jest.restoreAllMocks();
  });
  describe('launchApplication', () => {
    it('should launch application successfully', () => {
      const bundleId = 'com.example.app';
      const params: Record<string, string> = { key: 'value' };

      const result = LauncherKitHelper.launchApplication(bundleId, params);

      expect(mockLauncherKit.launchApplication).toHaveBeenCalledWith(
        bundleId,
        params
      );
      expect(result).toBe(true);
    });

    it('should handle errors and return false', () => {
      const bundleId = 'com.example.app';
      mockLauncherKit.launchApplication.mockImplementation(() => {
        throw new Error('Failed to launch');
      });

      const result = LauncherKitHelper.launchApplication(bundleId);

      expect(result).toBe(false);
    });
  });

  describe('goToSettings', () => {
    it('should call native goToSettings method', () => {
      LauncherKitHelper.goToSettings();

      expect(mockLauncherKit.goToSettings).toHaveBeenCalled();
    });

    it('should handle errors gracefully', () => {
      mockLauncherKit.goToSettings.mockImplementation(() => {
        throw new Error('Failed to open settings');
      });

      expect(() => LauncherKitHelper.goToSettings()).not.toThrow();
    });
  });

  describe('checkIfPackageInstalled', () => {
    it('should resolve with true when package is installed', async () => {
      const bundleId = 'com.example.app';
      // Mock the promise resolution instead of using callback
      mockLauncherKit.isPackageInstalled.mockResolvedValue(true);

      const result = await LauncherKitHelper.checkIfPackageInstalled(bundleId);

      expect(mockLauncherKit.isPackageInstalled).toHaveBeenCalledWith(bundleId);
      expect(result).toBe(true);
    });

    it('should resolve with false when package is not installed', async () => {
      const bundleId = 'com.example.app';
      mockLauncherKit.isPackageInstalled.mockImplementation(
        (_id: string, callback: (installed: boolean) => void) => {
          callback(false);
        }
      );

      const result = await LauncherKitHelper.checkIfPackageInstalled(bundleId);

      expect(result).toBe(false);
    });
  });

  describe('getDefaultLauncherPackageName', () => {
    it('should resolve with package name when successful', async () => {
      const expectedPackageName = 'com.example.launcher';
      mockLauncherKit.getDefaultLauncherPackageName.mockResolvedValue(
        expectedPackageName
      );

      const result = await LauncherKitHelper.getDefaultLauncherPackageName();

      expect(result).toBe(expectedPackageName);
    });

    it('should resolve with empty string on error', async () => {
      mockLauncherKit.getDefaultLauncherPackageName.mockRejectedValue(
        new Error('Failed')
      );

      const result = await LauncherKitHelper.getDefaultLauncherPackageName();

      expect(result).toBe('');
    });
  });

  describe('openAlarmApp', () => {
    it('should return true when successful', () => {
      const result = LauncherKitHelper.openAlarmApp();

      expect(mockLauncherKit.openAlarmApp).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false on error', () => {
      mockLauncherKit.openAlarmApp.mockImplementation(() => {
        throw new Error('Failed to open alarm app');
      });

      const result = LauncherKitHelper.openAlarmApp();

      expect(result).toBe(false);
    });
  });

  describe('getBatteryStatus', () => {
    it('should resolve with battery status when successful', async () => {
      const expectedStatus: BatteryStatus = { level: 0, isCharging: false };
      mockLauncherKit.getBatteryStatus.mockImplementation(
        (callback: (level: number, isCharging: boolean) => void) => {
          callback(expectedStatus.level, expectedStatus.isCharging);
        }
      );

      const result = await LauncherKitHelper.getBatteryStatus();

      expect(result).toEqual(expectedStatus);
    });
  });

  describe('openSetDefaultLauncher', () => {
    it('should resolve with true when successful', async () => {
      mockLauncherKit.openSetDefaultLauncher.mockResolvedValue(true);

      const result = await LauncherKitHelper.openSetDefaultLauncher();

      expect(result).toBe(true);
    });

    it('should reject with error when operation fails', async () => {
      const error = new Error('Failed to open');
      mockLauncherKit.openSetDefaultLauncher.mockRejectedValue(error);

      await expect(LauncherKitHelper.openSetDefaultLauncher()).rejects.toBe(
        error
      );
    });
  });

  describe('startListeningForBatteryChanges', () => {
    it('should register an event listener and call native method', () => {
      const callback = jest.fn();

      LauncherKitHelper.startListeningForBatteryChanges(callback);

      expect(
        (DeviceEventEmitter.addListener as jest.Mock)
      ).toHaveBeenCalledWith('onBatteryStatusChanged', callback);
      expect(
        mockLauncherKit.startListeningForBatteryChanges
      ).toHaveBeenCalled();
    });
  });

  describe('stopListeningForBatteryChanges', () => {
    it('should remove all listeners and call native method', () => {
      LauncherKitHelper.stopListeningForBatteryChanges();

      expect(
        (DeviceEventEmitter.removeAllListeners as jest.Mock)
      ).toHaveBeenCalledWith('onBatteryStatusChanged');
      expect(
        mockLauncherKit.stopListeningForBatteryChanges
      ).toHaveBeenCalled();
    });
  });

  describe('requestDefaultLauncher', () => {
    it('should resolve with true when successful', async () => {
      mockLauncherKit.requestDefaultLauncher.mockResolvedValue(true);

      const result = await LauncherKitHelper.requestDefaultLauncher();

      expect(result).toBe(true);
    });

    it('should return false on error', async () => {
      mockLauncherKit.requestDefaultLauncher.mockRejectedValue(
        new Error('Failed')
      );

      const result = await LauncherKitHelper.requestDefaultLauncher();

      expect(result).toBe(false);
    });
  });
});
