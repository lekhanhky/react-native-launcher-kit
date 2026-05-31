# react-native-launcher-kit

A React Native library for building custom Android home screen launchers. Get installed apps, launch apps with intents, monitor battery, request default launcher status, and listen for app installs/removals. Fully supports React Native New Architecture (TurboModules) and Legacy Bridge. Works with Expo (dev client) and bare React Native projects.

<p align="left">
  <a href="https://www.npmjs.com/package/react-native-launcher-kit"><img src="https://img.shields.io/badge/npm-v3.0.0-blue"></a>
 <a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg"></a>
</p>

## Use Cases

- Build a custom Android home screen launcher in React Native
- List all installed apps on the device with icons, versions, and accent colors
- Launch any app programmatically with Android intents (deep links, navigation, URLs)
- Monitor battery level and charging state in real time
- Detect when users install or uninstall apps
- Prompt users to set your app as the default launcher
- Create app drawers, app managers, or parental control apps

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

## Screenshots

<p>
   <img width="220" src="https://raw.githubusercontent.com/louaySleman/react-native-launcher-kit/main/screenshots/1.png" alt="Battery status, system info, and accent color extraction" />
   &nbsp;&nbsp;
   <img width="220" src="https://raw.githubusercontent.com/louaySleman/react-native-launcher-kit/main/screenshots/2.png" alt="Installed apps grid and set default launcher" />
   &nbsp;&nbsp;
   <img width="220" src="https://raw.githubusercontent.com/louaySleman/react-native-launcher-kit/main/screenshots/3.png" alt="Launcher actions, system settings, and intent demos" />
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

## What's New in 3.0.0

- **React Native New Architecture (TurboModules)** full support while keeping the legacy bridge working
- **Android native layer migrated to Kotlin** with dual module implementations (Legacy + Turbo)
- **Real-time battery monitoring** via `BatteryEventManager` with event-driven updates
- **Native default-launcher request flow** using Android `RoleManager` API
- **App installation/removal listeners** for real-time app change detection
- **App version and accent color** support in installed apps queries
- **Library toolchain upgraded to React Native 0.85**
- **GitHub Actions CI pipeline** added
- **Expanded test coverage** and refreshed example app

## Breaking Changes (3.0.0)

- **Node.js:** Minimum version is now **20.19.4** (required by `@react-native/babel-preset@0.85`)
- **Dev toolchain:** Library dev dependencies upgraded to React Native **0.85.3** -- consumers on older RN versions remain supported via the compatibility matrix
- **Source layout:** `src/` module folders renamed to lowercase (`helper/`, `installedApps/`, `interfaces/`, `utils/`) for cross-platform consistency. If you import from internal paths, update them accordingly.

## Using with Expo

This library contains native Android code and **cannot run in Expo Go**. However, it works with Expo projects using **development builds** (via `expo-dev-client`).

### Setup

1. Install the library and dev client:

```sh
npx expo install react-native-launcher-kit expo-dev-client
```

2. Add the required permission to your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "android": {
      "permissions": ["android.permission.QUERY_ALL_PACKAGES"]
    }
  }
}
```

3. If your app is a launcher, add the home intent filter via the `expo-build-properties` plugin or a config plugin in `app.json`:

```json
{
  "expo": {
    "android": {
      "intentFilters": [
        {
          "action": "MAIN",
          "category": ["HOME", "DEFAULT"]
        }
      ]
    }
  }
}
```

4. Build your development client:

```sh
npx expo prebuild
npx expo run:android
```

> **Note:** Since this is an Android-only library, iOS builds will not include any functionality from this package. All API calls are no-ops or will throw on iOS.

## Breaking History

### [3.0.0](https://github.com/louaySleman/react-native-launcher-kit/releases/tag/3.0.0)

- Full React Native New Architecture (TurboModules) support
- Android native layer rewritten in Kotlin
- Real-time battery monitoring with `startListeningForBatteryChanges`
- Native `requestDefaultLauncher()` using Android RoleManager API
- Node.js minimum version raised to 20.19.4
- Source folders renamed to lowercase for cross-platform CI compatibility

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

## FAQ

### Does this work with iOS?

No. This is an Android-only library. iOS does not allow custom launchers or querying installed apps.

### Does this work with Expo?

Yes, with [Expo development builds](https://docs.expo.dev/develop/development-builds/introduction/) (`expo-dev-client`). It does not work in Expo Go since it requires native code.

### How do I get a list of installed apps in React Native?

Use `InstalledApps.getApps()` or `InstalledApps.getSortedApps()` from this package. Both return app label, package name, icon path, and optionally version and accent color.

### How do I make my React Native app the default launcher?

Call `RNLauncherKitHelper.requestDefaultLauncher()` and declare the `CATEGORY_HOME` intent filter in your AndroidManifest.xml. See the [setup instructions](#launcher-activity-declaration).

### Does this support React Native New Architecture?

Yes. Version 3.0.0 has full TurboModule support. It also works on the Legacy Bridge for RN 0.60+.

## Support

If you find this project helpful, consider supporting its development:

<p align="left">
  <a href="https://www.patreon.com/louaysleman">
    <img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" alt="Become a Patron" />
  </a>
</p>

## License

MIT
