# react-native-launcher-kit

A React Native package for Android that provides helper functions for building launchers and interacting with the system. Supports both New Architecture (TurboModules) and Legacy Architecture.

<p align="left">
  <a href="https://www.npmjs.com/package/react-native-launcher-kit"><img src="https://img.shields.io/badge/npm-v2.1.0-blue"></a>
 <a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg"></a>
</p>

## Compatibility

| React Native | Architecture | Supported |
|---|---|---|
| 0.82+ | New Architecture (always enabled) | Yes |
| 0.71 - 0.81 | New Architecture (`newArchEnabled=true`) | Yes |
| 0.71 - 0.81 | Legacy Architecture (`newArchEnabled=false`) | Yes |
| 0.60 - 0.70 | Legacy (auto-linking) | Yes |

## Installation

```sh
npm install react-native-launcher-kit
```
or
```sh
yarn add react-native-launcher-kit
```

React Native 0.60+ automatically links the package. For older versions, manual linking is required.

## Android Setup

### Required Permission

Starting with Android 11 (API level 30), add the following permission to your app's `AndroidManifest.xml` to query installed packages:

```xml
<uses-permission android:name="android.permission.QUERY_ALL_PACKAGES"/>
```

> **Google Play Note:** The `QUERY_ALL_PACKAGES` permission requires justification during app review. Your app must have a core feature that requires querying installed apps (e.g., a launcher, app manager, or device management tool).

This permission is required for:
- Getting the installed apps list
- Checking if a specific package is installed
- Listening for app installations and removals

### Launcher Activity Declaration

If your app is a launcher and you want to use `requestDefaultLauncher()`, you must declare your activity as a home app:

```xml
<activity android:name=".MainActivity" ...>
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.HOME" />
        <category android:name="android.intent.category.DEFAULT" />
    </intent-filter>
</activity>
```

> **Important:** Without this declaration, the system will not show your app as an option in the default launcher picker dialog.

## Features

1. Get all installed apps (sorted and unsorted)
2. Get the current default launcher
3. Get battery percentage and charging status (one-shot or event-driven)
4. Listen for real-time battery changes
5. Check if a package is installed
6. Open system settings
7. Request default launcher via system dialog
8. Open "Set as default launcher" settings page
9. Launch apps with custom intent parameters
10. Open the alarm app
11. Listen for app installations and removals
12. Get app version and accent color for each installed app

## Demo

<p>
   <img width="200" src="https://raw.githubusercontent.com/louaySleman/react-native-launcher-kit/main/screenshots/1.gif" />
</p>

## API Reference

### `InstalledApps.getApps(options): Promise<AppDetail[]>`

Returns all installed apps with optional version and accent color.

```typescript
import { InstalledApps } from 'react-native-launcher-kit';

const apps = await InstalledApps.getApps({
  includeVersion: true,
  includeAccentColor: true,
});
```

### `InstalledApps.getSortedApps(options): Promise<AppDetail[]>`

Same as `getApps` but sorted alphabetically by label.

```typescript
const apps = await InstalledApps.getSortedApps({
  includeVersion: true,
  includeAccentColor: true,
});
```

#### Types

```typescript
interface AppDetail {
  label: string;
  packageName: string;
  icon: string;        // File path to icon image
  version?: string;
  accentColor?: string; // Dominant color of the app icon
}

interface GetAppsOptions {
  includeVersion: boolean;
  includeAccentColor: boolean;
}
```

### `RNLauncherKitHelper.launchApplication(bundleId, params?)`

Launch an app by package name, optionally with intent parameters.

```typescript
import { RNLauncherKitHelper, IntentAction } from 'react-native-launcher-kit';

// Simple launch
RNLauncherKitHelper.launchApplication('com.example.app');

// Launch with parameters (e.g., open a map location)
RNLauncherKitHelper.launchApplication('com.google.android.apps.maps', {
  action: IntentAction.VIEW,
  data: 'geo:40.7580,-73.9855?q=40.7580,-73.9855(Times Square)&z=16',
});

// Open a URL in Chrome
RNLauncherKitHelper.launchApplication('com.android.chrome', {
  action: IntentAction.VIEW,
  data: 'https://www.youtube.com',
});

// Start navigation
RNLauncherKitHelper.launchApplication('com.google.android.apps.maps', {
  action: IntentAction.VIEW,
  data: 'google.navigation:q=48.8584,2.2945&mode=driving',
});
```

#### Launch Parameters

```typescript
interface LaunchParams {
  action?: IntentAction | string;
  data?: string;
  type?: MimeType | string;
  extras?: Record<string, string>;
}

enum IntentAction {
  MAIN = 'android.intent.action.MAIN',
  VIEW = 'android.intent.action.VIEW',
  SEND = 'android.intent.action.SEND',
}

enum MimeType {
  ALL = '*/*',
  PDF = 'application/pdf',
  TEXT = 'text/plain',
  HTML = 'text/html',
}
```

### `RNLauncherKitHelper.checkIfPackageInstalled(bundleId): Promise<boolean>`

```typescript
const isInstalled = await RNLauncherKitHelper.checkIfPackageInstalled('com.android.settings');
```

### `RNLauncherKitHelper.getDefaultLauncherPackageName(): Promise<string>`

```typescript
const launcher = await RNLauncherKitHelper.getDefaultLauncherPackageName();
```

### `RNLauncherKitHelper.requestDefaultLauncher(): Promise<boolean>`

Shows a system dialog for the user to pick the default launcher. This is the recommended way to request becoming the default launcher.

- **Android 10+:** Uses `RoleManager` to show the system picker modal
- **Android 9 and below:** Triggers the system home chooser dialog
- **Fallback:** Opens the Settings page if the dialog can't be shown

```typescript
await RNLauncherKitHelper.requestDefaultLauncher();
```

> **Important:** Your app must declare the `CATEGORY_HOME` intent filter in `AndroidManifest.xml` for the system to show it as an option. See [Launcher Activity Declaration](#launcher-activity-declaration).

### `RNLauncherKitHelper.openSetDefaultLauncher(): Promise<boolean>`

Opens the system "Set Default Launcher" settings page.

```typescript
await RNLauncherKitHelper.openSetDefaultLauncher();
```

### `RNLauncherKitHelper.getBatteryStatus(): Promise<BatteryStatus>`

One-shot battery status query.

```typescript
const battery = await RNLauncherKitHelper.getBatteryStatus();
// { level: 85, isCharging: false }
```

```typescript
interface BatteryStatus {
  level: number;
  isCharging: boolean;
}
```

### `RNLauncherKitHelper.startListeningForBatteryChanges(callback)`

Event-driven battery monitoring. The callback fires only when the battery level or charging state actually changes -- no polling needed.

```typescript
import { RNLauncherKitHelper } from 'react-native-launcher-kit';

// Start listening
RNLauncherKitHelper.startListeningForBatteryChanges((status) => {
  console.log(`Battery: ${status.level}%, Charging: ${status.isCharging}`);
});

// Stop listening (e.g., on component unmount)
RNLauncherKitHelper.stopListeningForBatteryChanges();
```

#### Full example with React hooks:

```typescript
import { useEffect, useState } from 'react';
import { RNLauncherKitHelper } from 'react-native-launcher-kit';
import type { BatteryStatus } from 'react-native-launcher-kit/lib/typescript/interfaces/battery';

const useBattery = () => {
  const [battery, setBattery] = useState<BatteryStatus>({ level: 0, isCharging: false });

  useEffect(() => {
    // Get initial status
    RNLauncherKitHelper.getBatteryStatus().then(setBattery);

    // Listen for changes
    RNLauncherKitHelper.startListeningForBatteryChanges(setBattery);

    return () => {
      RNLauncherKitHelper.stopListeningForBatteryChanges();
    };
  }, []);

  return battery;
};
```

### `RNLauncherKitHelper.openAlarmApp()`

Opens the default alarm/clock app. Supports standard Android, Xiaomi (MIUI), Samsung, and Google Clock.

```typescript
RNLauncherKitHelper.openAlarmApp();
```

### `RNLauncherKitHelper.goToSettings()`

Opens the device settings screen.

```typescript
RNLauncherKitHelper.goToSettings();
```

### App Installation Listener

```typescript
import { InstalledApps } from 'react-native-launcher-kit';

// Start listening
InstalledApps.startListeningForAppInstallations((app) => {
  console.log('New app installed:', app);
});

// Stop listening
InstalledApps.stopListeningForAppInstallations();
```

### App Removal Listener

```typescript
import { InstalledApps } from 'react-native-launcher-kit';

// Start listening
InstalledApps.startListeningForAppRemovals((packageName) => {
  console.log('App removed:', packageName);
});

// Stop listening
InstalledApps.stopListeningForAppRemovals();
```

## Example Apps

Two example apps are included for testing both architectures:

- **`example/`** - React Native 0.85 (New Architecture)
- **`example-0.80/`** - React Native 0.80 (Legacy Architecture)

Both examples install from the built `dist/` folder (same as what npm consumers get). Running `npm install` in either example automatically builds the library first via `preinstall` hook.

```sh
# Run the RN 0.85 example
cd example && npm install && npm run android

# Run the RN 0.80 example
cd example-0.80 && npm install && npm run android
```

> After making changes to the library source, just run `npm install` inside the example to rebuild `dist/` and pick up changes.

## Breaking History

### [2.1.0](https://github.com/louaySleman/react-native-launcher-kit/releases/tag/2.1.0)

- Added structured launch parameters with `IntentAction` and `MimeType` enums
- Enhanced type safety with `LaunchParams` interface

### [2.0.0](https://github.com/louaySleman/react-native-launcher-kit/releases/tag/2.0.0)

- Changed `getApps`/`getSortedApps` to return Promises (on-demand loading)
- Icon property returns file path instead of base64 string
- Added app version and accent color support
- Added app installation/removal listeners
- Moved `QUERY_ALL_PACKAGES` permission to user's `AndroidManifest.xml`

### [1.0.0](https://github.com/louaySleman/react-native-launcher-kit/releases/tag/1.0.4)

First release.

## Support

If you find this project helpful, consider supporting its development:

<p align="left">
  <a href="https://www.patreon.com/louaysleman">
    <img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" alt="Become a Patron" />
  </a>
</p>

## License

MIT
