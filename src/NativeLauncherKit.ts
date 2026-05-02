/**
 * TurboModule specification for the LauncherKit native module.
 * Defines the bridge interface between JavaScript and native Android code.
 *
 * @module NativeLauncherKit
 */
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

/**
 * Native module specification for LauncherKit.
 * Each method maps to a native Android implementation.
 */
export interface Spec extends TurboModule {
  /** Retrieves installed applications as a JSON string. */
  getApps(includeVersion: boolean, includeAccentColor: boolean): Promise<string>;

  /** Launches an application by package name with optional intent parameters. */
  launchApplication(packageName: string, params?: Object): void;

  /** Checks whether a given package is installed on the device. */
  isPackageInstalled(packageName: string): Promise<boolean>;

  /** Returns the package name of the current default launcher. */
  getDefaultLauncherPackageName(): Promise<string>;

  /** Sets this app as the default launcher. */
  setAsDefaultLauncher(): void;

  /** Returns the current battery level and charging state. */
  getBatteryStatus(): Promise<Object>;

  /** Opens the device system settings. */
  goToSettings(): void;

  /** Opens the system alarm/clock application. */
  openAlarmApp(): void;

  /** Opens the system UI for choosing a default launcher. */
  openSetDefaultLauncher(): Promise<boolean>;

  /** Registers a native listener for app installation broadcasts. */
  startListeningForAppInstallations(): void;

  /** Unregisters the native listener for app installation broadcasts. */
  stopListeningForAppInstallations(): void;

  /** Registers a native listener for app removal broadcasts. */
  startListeningForAppRemovals(): void;

  /** Unregisters the native listener for app removal broadcasts. */
  stopListeningForAppRemovals(): void;

  /** Registers a native listener for battery status changes. */
  startListeningForBatteryChanges(): void;

  /** Unregisters the native listener for battery status changes. */
  stopListeningForBatteryChanges(): void;

  /** Requests the user to set this app as the default launcher via system dialog. */
  requestDefaultLauncher(): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('LauncherKit');
