/**
 * Type definitions for the LauncherKit Helper module.
 *
 * @author Louay Sleman
 * @contact louayakram12@hotmail.com
 * @linkedin https://www.linkedin.com/in/louay-sleman
 * @version 2.1.0
 * @website https://louaysleman.com
 * @copyright Copyright (c) 2024 Louay Sleman. All rights reserved.
 */
import type { BatteryStatus } from './battery';
import type { IntentAction, MimeType } from '../utils/enum';

/**
 * Parameters for launching an application with a specific intent.
 * All fields are optional and can use either enum values or custom strings.
 */
export interface LaunchParams {
  /** The Android intent action (e.g., VIEW, SEND). */
  action?: IntentAction | string;
  /** Data URI to pass to the intent. */
  data?: string;
  /** MIME type of the data. */
  type?: MimeType | string;
  /** Key-value extras to attach to the intent. */
  extras?: Record<string, string>;
}

/** Callback invoked when battery status changes. */
export type BatteryStatusCallback = (status: BatteryStatus) => void;

/**
 * Interface describing all helper methods available for launcher operations.
 */
export interface LauncherKitHelperProps {
  /** Launches an app by bundle ID with optional intent parameters. */
  launchApplication(bundleId: string, params?: LaunchParams): void;

  /** Opens the device system settings. */
  goToSettings(): void;

  /** Checks if a package is installed on the device. */
  checkIfPackageInstalled(bundleId: string): Promise<boolean>;

  /** Returns the package name of the current default launcher. */
  getDefaultLauncherPackageName(): Promise<string>;

  /** Opens the system alarm/clock application. */
  openAlarmApp(): void;

  /** Returns the current battery level and charging status. */
  getBatteryStatus(): Promise<BatteryStatus>;

  /** Starts listening for battery status changes and invokes the callback on each change. */
  startListeningForBatteryChanges(callback: BatteryStatusCallback): void;

  /** Stops listening for battery status changes and removes all listeners. */
  stopListeningForBatteryChanges(): void;

  /** Opens the system default launcher picker UI. */
  openSetDefaultLauncher(): Promise<boolean>;

  /** Requests the system to set this app as the default launcher. */
  requestDefaultLauncher(): Promise<boolean>;
}
