/**
 * Launcher Helper Utilities
 */
import { Alert, Platform, NativeModules } from 'react-native';
import { RNLauncherKitHelper } from 'react-native-launcher-kit';

const { DeviceAdminModule } = NativeModules;

export const launcherHelper = {
  /**
   * Prompts the user to set this app as Default Launcher.
   */
  async setupDefaultLauncher(): Promise<void> {
    if (Platform.OS !== 'android') return;

    try {
      const defaultPkg = await RNLauncherKitHelper.getDefaultLauncherPackageName();
      if (!defaultPkg) {
        Alert.alert(
          'Thiết lập Màn hình chính',
          'Vui lòng đặt ứng dụng này làm Màn hình chính mặc định để bảo vệ an toàn cho bé.',
          [
            { text: 'Để sau', style: 'cancel' },
            {
              text: 'Đồng ý',
              onPress: () => RNLauncherKitHelper.requestDefaultLauncher(),
            },
          ]
        );
      }
    } catch (error) {
      console.warn('Lỗi kiểm tra default launcher:', error);
    }
  },

  /**
   * Kiểm tra quyền Quản trị viên thiết bị (Device Admin)
   */
  async isDeviceAdminActive(): Promise<boolean> {
    if (Platform.OS !== 'android' || !DeviceAdminModule) return false;
    try {
      return await DeviceAdminModule.isDeviceAdminActive();
    } catch (e) {
      console.warn('Lỗi kiểm tra Device Admin:', e);
      return false;
    }
  },

  /**
   * Yêu cầu mở màn hình kích hoạt Quản trị viên thiết bị
   */
  async requestDeviceAdmin(): Promise<boolean> {
    if (Platform.OS !== 'android' || !DeviceAdminModule) return false;
    try {
      return await DeviceAdminModule.requestDeviceAdmin();
    } catch (e) {
      console.warn('Lỗi yêu cầu Device Admin:', e);
      return false;
    }
  },

  /**
   * Cảnh báo và yêu cầu cấp quyền Quản trị viên thiết bị ngay khi mở app
   */
  async checkAndPromptDeviceAdmin(): Promise<void> {
    if (Platform.OS !== 'android') return;

    try {
      const isActive = await this.isDeviceAdminActive();
      if (!isActive) {
        Alert.alert(
          '🛡️ BẢO VỆ CHỐNG GỠ ỨNG DỤNG',
          'Để đảm bảo an toàn cho trẻ và tránh việc ứng dụng bị gỡ cài đặt trái phép, vui lòng kích hoạt quyền "Quản trị viên thiết bị (Device Admin)".\n\nKhi kích hoạt, nút "Gỡ cài đặt" của hệ thống sẽ bị khóa.',
          [
            {
              text: 'Để sau',
              style: 'cancel',
            },
            {
              text: 'Kích hoạt ngay',
              onPress: () => this.requestDeviceAdmin(),
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.warn('Lỗi khi cảnh báo Device Admin:', error);
    }
  },
};
