/**
 * Launcher Helper Utilities
 */
import { Alert, Platform } from 'react-native';
import { RNLauncherKitHelper } from 'react-native-launcher-kit';

export const launcherHelper = {
  /**
   * Prompts the user to set this app as Default Launcher.
   */
  async setupDefaultLauncher(): Promise<void> {
    if (Platform.OS !== 'android') return;

    try {
      const isDefault = await RNLauncherKitHelper.checkIfDefaultLauncher();
      if (!isDefault) {
        Alert.alert(
          'Thiết lập Màn hình chính',
          'Vui lòng đặt ứng dụng này làm Màn hình chính mặc định để bảo vệ an toàn cho bé.',
          [
            { text: 'Để sau', style: 'cancel' },
            {
              text: 'Đồng ý',
              onPress: () => RNLauncherKitHelper.requestSetDefaultLauncher(),
            },
          ]
        );
      }
    } catch (error) {
      console.warn('Lỗi kiểm tra default launcher:', error);
    }
  },
};
