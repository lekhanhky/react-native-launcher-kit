/**
 * @author Louay Sleman
 * @contact louayakram12@hotmail.com
 * @linkedin https://www.linkedin.com/in/louay-sleman
 * @version 2.1.0
 * @website https://louaysleman.com
 * @copyright Copyright (c) 2024 Louay Sleman. All rights reserved.
 */
import { DeviceEventEmitter } from 'react-native';
import type {
  AppDetail,
  AppEventCallback,
  GetAppsOptions,
  InstalledApps,
} from '../interfaces/InstalledApps';
import { AppConfig, AppEvents } from '../constants';
import {
  createEventListener,
  handleError,
  safeJsonParse,
} from '../utils/helper';
import { initializeModule } from '../utils/moduleInitializer';

// Initialize the LauncherKit LauncherKit
const LauncherKit = initializeModule();

/**
 * Object containing functions to retrieve information about installed apps,
 * including event-based listeners for installations and removals.
 */
const installedApps: InstalledApps = {
  /**
   * Retrieves all launchable apps installed on the device.
   * @param options - Controls whether version and accent color are included.
   * @returns An array of app details, or an empty array on failure.
   */
  async getApps(options?: GetAppsOptions): Promise<AppDetail[]> {
    try {
      const { includeVersion, includeAccentColor } = {
        ...AppConfig.DEFAULT_OPTIONS,
        ...options,
      };
      const apps = await LauncherKit.getApps(
        includeVersion,
        includeAccentColor
      );
      return safeJsonParse<AppDetail[]>(apps, []);
    } catch (error) {
      return handleError(error, '[]', []);
    }
  },

  /**
   * Retrieves all installed apps sorted alphabetically by label.
   * @param options - Controls whether version and accent color are included.
   */
  async getSortedApps(options?: GetAppsOptions): Promise<AppDetail[]> {
    try {
      const apps = await this.getApps(options);
      return apps.sort((a, b) =>
        (a.label?.toLowerCase() ?? '').localeCompare(
          b.label?.toLowerCase() ?? ''
        )
      );
    } catch (error) {
      return handleError(error, '[]', []);
    }
  },

  /**
   * Registers a listener that fires when a new app is installed.
   * @param callback - Receives the details of the newly installed app.
   */
  startListeningForAppInstallations(callback: AppEventCallback): void {
    const handler = (app: string) =>
      callback(safeJsonParse<AppDetail>(app, {} as AppDetail));
    createEventListener(AppEvents.APP_INSTALLED, handler);
    LauncherKit.startListeningForAppInstallations();
  },

  /** Stops listening for app installation events. */
  stopListeningForAppInstallations(): void {
    DeviceEventEmitter.removeAllListeners(AppEvents.APP_INSTALLED);
    LauncherKit.stopListeningForAppInstallations();
  },

  /**
   * Registers a listener that fires when an app is uninstalled.
   * @param callback - Receives the package name of the removed app.
   */
  startListeningForAppRemovals(callback: (packageName: string) => void): void {
    createEventListener(AppEvents.APP_REMOVED, callback);
    LauncherKit.startListeningForAppRemovals();
  },

  /** Stops listening for app removal events. */
  stopListeningForAppRemovals(): void {
    DeviceEventEmitter.removeAllListeners(AppEvents.APP_REMOVED);
    LauncherKit.stopListeningForAppRemovals();
  },
};

export default installedApps;
