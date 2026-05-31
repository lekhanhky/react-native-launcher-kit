# LauncherKit Example (React Native 0.85 - New Architecture)

This example app demonstrates all features of `react-native-launcher-kit` using React Native 0.85 with New Architecture enabled.

## Setup

From this directory:

```sh
npm install
```

This will automatically:
1. Run `build:dist` in the parent directory (builds the library to `dist/`)
2. Install `react-native-launcher-kit` from `../dist` (mimics the npm package exactly)

## Run

```sh
npm run android
```

## How it works

The example uses `"react-native-launcher-kit": "file:../dist"` which resolves the library from the built `dist/` folder. This is identical to what consumers get from npm — pre-compiled JS, type definitions, and native Android code.

The `preinstall` script ensures `dist/` is always up-to-date before installing. If you make changes to the library source, just run `npm install` again to rebuild.

## Rebuilding after library changes

```sh
# Option 1: Reinstall (triggers preinstall -> build:dist automatically)
npm install

# Option 2: Manual rebuild
cd .. && npm run build:dist
```

## Android permission

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.QUERY_ALL_PACKAGES" />
```

## What the Example Demonstrates

| Feature | API |
| --- | --- |
| List installed apps (with version & accent color) | `InstalledApps.getApps()` |
| Live app install / uninstall events | `InstalledApps.startListeningForAppInstallations()` / `startListeningForAppRemovals()` |
| Battery level & charging state | `RNLauncherKitHelper.getBatteryStatus()` |
| Default launcher package name | `RNLauncherKitHelper.getDefaultLauncherPackageName()` |
| Launch an app by package name | `RNLauncherKitHelper.launchApplication()` |
| Open system settings | `RNLauncherKitHelper.goToSettings()` |
| Open "Set default launcher" screen | `RNLauncherKitHelper.openSetDefaultLauncher()` |
| Open the alarm app | `RNLauncherKitHelper.openAlarmApp()` |
| Launch with intent params (Maps, browser) | `RNLauncherKitHelper.launchApplication()` + `IntentAction` |

## Project Structure

```
example/
├── src/
│   ├── App.tsx                 # Main demo screen
│   ├── interfaces/             # App state types
│   ├── static/locations.ts     # Coordinates for Maps demos
│   └── components/
│       ├── AppButton/          # Reusable action button
│       ├── AppDetail/          # Single app detail view
│       ├── AppGrid/            # Installed apps grid
│       ├── BatteryInfo/        # Battery status display
│       └── Loading/            # Initial loading state
├── android/                    # Android native project
└── metro.config.js             # Watches dist/ for changes
```

## Troubleshooting

- **Empty app list** — confirm `QUERY_ALL_PACKAGES` is in `AndroidManifest.xml` and you are testing on Android 11+.
- **Metro cannot resolve the library** — run `npm install` again (triggers rebuild of dist/).
- **Native changes not reflected** — run: `cd android && ./gradlew clean && cd .. && npm run android`.
