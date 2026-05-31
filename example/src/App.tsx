/**
 * LauncherKit Example App
 *
 * Demonstrates all features of the react-native-launcher-kit library:
 * - Installed apps listing with accent color extraction
 * - Real-time battery monitoring (event-driven)
 * - App launching with custom intent parameters
 * - System launcher management (request default, settings)
 * - System utilities (alarm, settings)
 */
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  InstalledApps,
  RNLauncherKitHelper,
  IntentAction,
} from 'react-native-launcher-kit';
import {AppState} from './interfaces';
import {LOCATIONS} from './static/locations';
import AppButton from './components/AppButton';
import AppGrid from './components/AppGrid';
import AppDetail from './components/AppDetail';
import BatteryInfo from './components/BatteryInfo';
import Loading from './components/Loading';

/** Main application component showcasing LauncherKit functionality. */
const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apps, setApps] = useState<AppState['apps']>([]);
  const [firstApp, setFirstApp] = useState<AppState['firstApp']>(undefined);
  const [selectedApp, setSelectedApp] = useState<AppState['firstApp']>(undefined);
  const [defaultLauncherPackageName, setDefaultLauncherPackageName] =
    useState<string>('Unknown');
  const [battery, setBattery] = useState<AppState['battery']>({
    isCharging: false,
    level: 0,
  });

  useEffect(() => {
    const initApp = async () => {
      setIsLoading(true);
      try {
        const [batteryStatus, installedApps, defaultLauncher] =
          await Promise.all([
            RNLauncherKitHelper.getBatteryStatus(),
            InstalledApps.getApps({
              includeVersion: true,
              includeAccentColor: true,
            }),
            RNLauncherKitHelper.getDefaultLauncherPackageName(),
          ]);

        setBattery(batteryStatus);
        setApps(installedApps);
        setFirstApp(installedApps[0]);
        setSelectedApp(installedApps[0]);
        setDefaultLauncherPackageName(defaultLauncher);
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initApp();

    RNLauncherKitHelper.startListeningForBatteryChanges((status) => {
      setBattery(status);
    });

    InstalledApps.startListeningForAppInstallations(
      (app: AppState['apps'][0]) => {
        setApps(prev => [app, ...prev]);
      },
    );

    InstalledApps.startListeningForAppRemovals((packageName: string) => {
      setApps(prev => prev.filter(item => item.packageName !== packageName));
    });

    return () => {
      RNLauncherKitHelper.stopListeningForBatteryChanges();
      InstalledApps.stopListeningForAppInstallations();
      InstalledApps.stopListeningForAppRemovals();
    };
  }, []);

  const handlers = {
    openApplication: (packageName: string) => {
      RNLauncherKitHelper.launchApplication(packageName);
    },
    openFirstApp: () => {
      if (!firstApp) return;
      RNLauncherKitHelper.launchApplication(firstApp.packageName);
    },
    openSettings: () => RNLauncherKitHelper.goToSettings(),
    openSetDefault: () => RNLauncherKitHelper.openSetDefaultLauncher(),
    requestDefault: () => RNLauncherKitHelper.requestDefaultLauncher(),
    openAlarm: () => RNLauncherKitHelper.openAlarmApp(),
    openMapLocation: () => {
      const {latitude, longitude, label} = LOCATIONS.TIMES_SQUARE;
      RNLauncherKitHelper.launchApplication('com.google.android.apps.maps', {
        action: IntentAction.VIEW,
        data: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent(label)})&z=16`,
      });
    },
    openMapNavigation: () => {
      const {latitude, longitude} = LOCATIONS.EIFFEL_TOWER;
      RNLauncherKitHelper.launchApplication('com.google.android.apps.maps', {
        action: IntentAction.VIEW,
        data: `google.navigation:q=${latitude},${longitude}&mode=driving`,
      });
    },
    openYouTube: () => {
      RNLauncherKitHelper.launchApplication('com.android.chrome', {
        action: IntentAction.VIEW,
        data: 'https://www.youtube.com',
      });
    },
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F8FC" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>LauncherKit</Text>
          <Text style={styles.headerSubtitle}>React Native Launcher Demo</Text>
        </View>

        {/* Battery Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Battery Status</Text>
          <BatteryInfo battery={battery} />
        </View>

        {/* System Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>System Info</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Default Launcher</Text>
            <Text style={styles.infoValue} numberOfLines={1}>{defaultLauncherPackageName}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Installed Apps</Text>
            <Text style={styles.infoValue}>{apps.length}</Text>
          </View>
        </View>

        {/* Accent Color Demo */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Accent Color</Text>
          <Text style={styles.description}>
            Each app's dominant icon color is extracted and available as{' '}
            <Text style={styles.code}>accentColor</Text>. Use it as a themed background for app detail cards, notifications, or launcher pages.
            Long-press any app icon below to preview its accent.
          </Text>
          {selectedApp && <AppDetail app={selectedApp} />}
        </View>

        {/* Installed Apps */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Installed Apps</Text>
          <Text style={styles.description}>
            Tap to launch. Long-press to see accent color preview above.
          </Text>
          <AppGrid
            apps={apps}
            onAppPress={handlers.openApplication}
            onAppLongPress={setSelectedApp}
          />
        </View>

        {/* Actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Actions</Text>

          <Text style={styles.groupLabel}>Launcher</Text>
          <AppButton onPress={handlers.requestDefault} title="Set as Default Launcher" />
          <AppButton onPress={handlers.openSetDefault} title="Launcher Settings" variant="secondary" />

          <Text style={styles.groupLabel}>System</Text>
          <AppButton onPress={handlers.openSettings} title="Open Settings" />
          <AppButton onPress={handlers.openAlarm} title="Open Alarm" />
          <AppButton onPress={handlers.openFirstApp} title={`Launch ${firstApp?.label || 'First App'}`} variant="secondary" />

          <Text style={styles.groupLabel}>Intent Demos</Text>
          <AppButton onPress={handlers.openMapLocation} title="Open Map: Times Square" />
          <AppButton onPress={handlers.openMapNavigation} title="Navigate: Eiffel Tower" />
          <AppButton onPress={handlers.openYouTube} title="Open YouTube in Chrome" variant="secondary" />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>react-native-launcher-kit v3.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8FC',
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#8E8E93',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  description: {
    fontSize: 13,
    color: '#636366',
    lineHeight: 18,
    marginBottom: 14,
  },
  code: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#6C3FBF',
    fontWeight: '600',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  infoLabel: {
    fontSize: 15,
    color: '#3C3C43',
  },
  infoValue: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '500',
    maxWidth: '60%',
  },
  groupLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#C7C7CC',
  },
});

export default App;
