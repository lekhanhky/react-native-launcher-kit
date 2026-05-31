/**
 * Type definitions for the Installed Apps module.
 *
 * @author Louay Sleman
 * @contact louayakram12@hotmail.com
 * @linkedin https://www.linkedin.com/in/louay-sleman
 * @version 2.1.0
 * @website https://louaysleman.com
 * @copyright Copyright (c) 2024 Louay Sleman. All rights reserved.
 */

/** Describes a single installed application on the device. */
export interface AppDetail {
  /** User-visible display name of the app. */
  label: string;
  /** Unique Android package name (e.g., "com.example.app"). */
  packageName: string;
  /** Base64-encoded app icon. */
  icon: string;
  /** App version string, included only if requested. */
  version?: string;
  /** Dominant accent color extracted from the app icon. */
  accentColor?: string;
}

/** Options for controlling what data is included when fetching apps. */
export interface GetAppsOptions {
  /** Whether to include version info for each app. */
  includeVersion: boolean;
  /** Whether to compute and include the accent color from each app icon. */
  includeAccentColor: boolean;
}

/** Interface describing all methods for querying and observing installed apps. */
export interface InstalledApps {
  /** Returns a list of all installed launchable apps. */
  getApps(options?: GetAppsOptions): Promise<AppDetail[]>;
  /** Returns installed apps sorted alphabetically by label. */
  getSortedApps(options?: GetAppsOptions): Promise<AppDetail[]>;
  /** Starts listening for new app installations. */
  startListeningForAppInstallations(callback: (app: AppDetail) => void): void;
  /** Stops listening for app installations and removes all listeners. */
  stopListeningForAppInstallations(): void;
  /** Starts listening for app removals/uninstallations. */
  startListeningForAppRemovals(callback: (packageName: string) => void): void;
  /** Stops listening for app removals and removes all listeners. */
  stopListeningForAppRemovals(): void;
}

/** Callback type for app installation events. */
export type AppEventCallback = (app: AppDetail) => void;
