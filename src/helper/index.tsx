/**
 * LauncherKit Helper Module
 *
 * @author Louay Sleman
 * @contact louayakram12@hotmail.com
 * @linkedin https://www.linkedin.com/in/louay-sleman
 * @version 2.1.0
 * @website https://louaysleman.com
 * @copyright Copyright (c) 2024 Louay Sleman. All rights reserved.
 */

import { Defaults, ErrorMessages, AppEvents } from '../constants';
import type {
  BatteryStatusCallback,
  LauncherKitHelperProps,
  LaunchParams,
} from '../interfaces/helper';
import { initializeModule } from '../utils/moduleInitializer';
import { createEventListener, handleError } from '../utils/helper';
import type { BatteryStatus } from '../interfaces/battery';

// Initialize the LauncherKit module
const LauncherKit = initializeModule();

/**
 * A helper object with utility functions for launching apps and interacting
 * with the launcher on Android devices.
 */
const LauncherKitHelper: LauncherKitHelperProps = {
  /**
   * Launches an application with optional intent parameters.
   *
   * @param bundleId - The package name of the app to launch.
   * @param params - Optional intent parameters (action, data, type, extras).
   * @returns `true` if launched successfully, `false` otherwise.
   */
  launchApplication: (bundleId: string, params?: LaunchParams): boolean => {
    if (!bundleId) {
      return handleError(
        new Error(ErrorMessages.BUNDLE_ID_REQUIRED),
        ErrorMessages.BUNDLE_ID_REQUIRED,
        false
      );
    }

    try {
      LauncherKit.launchApplication(bundleId, params);
      return true;
    } catch (error) {
      return handleError(
        error,
        ErrorMessages.LAUNCH_APP_ERROR(bundleId),
        false,
        { params }
      );
    }
  },

  /** Opens the Android system settings screen. */
  goToSettings: (): void => {
    try {
      LauncherKit.goToSettings();
    } catch (error) {
      handleError(error, 'Failed to open settings', undefined);
    }
  },

  /**
   * Checks whether a package is installed on the device.
   * @param bundleId - The package name to check.
   * @returns `true` if installed, `false` otherwise.
   */
  checkIfPackageInstalled: async (bundleId: string): Promise<boolean> => {
    try {
      return await LauncherKit.isPackageInstalled(bundleId);
    } catch (error) {
      return handleError(
        error,
        `Failed to check if package is installed: ${bundleId}`,
        false
      );
    }
  },

  /** Returns the package name of the device's current default launcher. */
  getDefaultLauncherPackageName: async (): Promise<string> => {
    try {
      return await LauncherKit.getDefaultLauncherPackageName();
    } catch (error) {
      return handleError(
        error,
        ErrorMessages.DEFAULT_LAUNCHER_ERROR,
        Defaults.EMPTY_STRING
      );
    }
  },

  /** Opens the system alarm/clock app. Returns `true` on success, `false` on failure. */
  openAlarmApp: (): boolean => {
    try {
      LauncherKit.openAlarmApp();
      return true;
    } catch (error) {
      return handleError(error, 'Failed to open alarm app', false);
    }
  },

  /** Retrieves the current battery level and charging state. */
  getBatteryStatus: async (): Promise<BatteryStatus> => {
    try {
      return (await LauncherKit.getBatteryStatus()) as BatteryStatus;
    } catch (error) {
      return handleError(
        error,
        'Failed to get battery status',
        Defaults.BATTERY_STATUS
      );
    }
  },

  /**
   * Starts listening for battery status changes via DeviceEventEmitter.
   * @param callback - Invoked each time the battery status changes.
   */
  startListeningForBatteryChanges: (callback: BatteryStatusCallback): void => {
    createEventListener(AppEvents.BATTERY_STATUS_CHANGED, callback);
    LauncherKit.startListeningForBatteryChanges();
  },

  /** Stops listening for battery status changes and removes all associated listeners. */
  stopListeningForBatteryChanges: (): void => {
    const { DeviceEventEmitter } = require('react-native');
    DeviceEventEmitter.removeAllListeners(AppEvents.BATTERY_STATUS_CHANGED);
    LauncherKit.stopListeningForBatteryChanges();
  },

  /** Opens the system UI that allows the user to choose a default launcher. */
  openSetDefaultLauncher: async (): Promise<boolean> => {
    try {
      return await LauncherKit.openSetDefaultLauncher();
    } catch (error) {
      throw handleError(
        error,
        ErrorMessages.SET_DEFAULT_LAUNCHER_ERROR,
        error as Error
      );
    }
  },

  /** Requests the system to set this app as the default launcher via a system dialog. */
  requestDefaultLauncher: async (): Promise<boolean> => {
    try {
      return await LauncherKit.requestDefaultLauncher();
    } catch (error) {
      return handleError(error, 'Failed to request default launcher', false);
    }
  },
};

export default LauncherKitHelper;
