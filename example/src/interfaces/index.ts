/** Type definitions for the example app's state. */
import type {AppDetail} from 'react-native-launcher-kit/lib/typescript/interfaces/InstalledApps';
import type {BatteryStatus} from 'react-native-launcher-kit/lib/typescript/interfaces/battery';

/** Root state shape used by the App component. */
export interface AppState {
  showWithAccent: boolean;
  apps: AppDetail[];
  firstApp?: AppDetail;
  defaultLauncherPackageName: string;
  battery: BatteryStatus;
  isLoading: boolean;
}
