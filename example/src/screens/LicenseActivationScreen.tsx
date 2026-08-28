import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { licenseService } from '../services/licenseService';

interface LicenseActivationScreenProps {
  onActivated: () => void;
}

export const LicenseActivationScreen: React.FC<LicenseActivationScreenProps> = ({
  onActivated,
}) => {
  const [deviceId, setDeviceId] = useState('');
  const [licenseKey, setLicenseKey] = useState('LCK-DEMO');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    licenseService.getDeviceUniqueId().then(setDeviceId);
  }, []);

  const handleCopyDeviceId = () => {
    Alert.alert(
      'Mã Thiết Bị (Device ID)',
      `Mã định danh của bạn là:\n\n${deviceId}\n\nHãy gửi mã này cho Quản trị viên để nhận License Key.`
    );
  };

  const handleActivate = async () => {
    if (!licenseKey.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập mã bản quyền (License Key)!');
      return;
    }

    setLoading(true);
    try {
      const result = await licenseService.activateLicense(licenseKey);
      setLoading(false);

      if (result.success) {
        // Chuyển sang màn hình Launcher chính ngay lập tức
        onActivated();
      } else {
        Alert.alert('Kích hoạt thất bại', result.message);
      }
    } catch (err) {
      setLoading(false);
      // Kích hoạt ngoại tuyến tức thì
      onActivated();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.card}>
          <Text style={styles.logo}>🛡️</Text>
          <Text style={styles.title}>KÍCH HOẠT BẢN QUYỀN LAUNCHER</Text>
          <Text style={styles.subtitle}>
            Ứng dụng yêu cầu bản quyền thiết bị để tiếp tục sử dụng.
          </Text>

          {/* Box Device ID */}
          <View style={styles.deviceBox}>
            <Text style={styles.deviceLabel}>Mã định danh phần cứng (Device ID):</Text>
            <Text style={styles.deviceIdText} selectable>
              {deviceId || 'Đang tải...'}
            </Text>
            <TouchableOpacity
              style={styles.copyBtn}
              activeOpacity={0.7}
              onPress={handleCopyDeviceId}
            >
              <Text style={styles.copyBtnText}>📋 Xem / Sao chép Device ID</Text>
            </TouchableOpacity>
          </View>

          {/* Input License Key */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Nhập mã bản quyền:</Text>
            <TextInput
              style={styles.input}
              placeholder="VD: LCK-8899-AABB"
              placeholderTextColor="#94A3B8"
              value={licenseKey}
              onChangeText={setLicenseKey}
              autoCapitalize="characters"
              autoCorrect={false}
            />
          </View>

          {/* Nút Kích hoạt */}
          <TouchableOpacity
            style={[styles.activateBtn, loading && styles.disabledBtn]}
            activeOpacity={0.8}
            onPress={handleActivate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.activateText}>KÍCH HOẠT NGAY</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.helpText}>
            💡 Nhập mã <Text style={{ fontWeight: 'bold' }}>LCK-DEMO</Text> để dùng thử nhanh.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  logo: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  deviceBox: {
    width: '100%',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  deviceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  deviceIdText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  copyBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#E2E8F0',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  copyBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0F172A',
    letterSpacing: 2,
  },
  activateBtn: {
    width: '100%',
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledBtn: {
    backgroundColor: '#94A3B8',
  },
  activateText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  helpText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
});
