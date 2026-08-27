/**
 * Kids Launcher & Parental Control System
 * Powered by react-native-launcher-kit + Supabase + Local-First Storage
 */
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { licenseService } from './services/licenseService';
import { LicenseActivationScreen } from './screens/LicenseActivationScreen';
import { KidsLauncherScreen } from './screens/KidsLauncherScreen';

export const App: React.FC = () => {
  const [checkingLicense, setCheckingLicense] = useState<boolean>(true);
  const [isLicensed, setIsLicensed] = useState<boolean>(false);

  // 1. Kiểm tra trạng thái bản quyền khi khởi động
  const checkInitialLicense = () => {
    const licensed = licenseService.isLocallyLicensed();
    setIsLicensed(licensed);
    setCheckingLicense(false);
  };

  useEffect(() => {
    checkInitialLicense();
  }, []);

  // 2. Xử lý sau khi kích hoạt bản quyền thành công
  const handleActivationSuccess = () => {
    setIsLicensed(true);
  };

  // 3. Xử lý khi hủy bản quyền (đăng xuất)
  const handleResetLicense = () => {
    licenseService.resetLocalLicense();
    setIsLicensed(false);
  };

  // Màn hình loading khởi động nhanh (< 100ms)
  if (checkingLicense) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  // Luồng 1: Chưa kích hoạt bản quyền -> Màn hình nhập License Key
  if (!isLicensed) {
    return <LicenseActivationScreen onActivated={handleActivationSuccess} />;
  }

  // Luồng 2: Đã kích hoạt bản quyền -> Màn hình Launcher chính của bé
  return <KidsLauncherScreen onResetLicense={handleResetLicense} />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
