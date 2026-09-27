import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ShieldAlert,
  QrCode,
  Smartphone,
  ChevronDown,
  Sparkles,
  KeyRound,
  Radio,
} from 'lucide-react-native';
import { useDevice } from '../../src/context/DeviceContext';
import { EmergencyLockButton } from '../../src/components/EmergencyLockButton';
import { DeviceStatusBadge } from '../../src/components/DeviceStatusBadge';
import { Colors } from '../../src/theme/colors';

export default function DashboardScreen() {
  const router = useRouter();
  const { devices, activeDevice, setActiveDevice, refreshDevices, toggleLock, isLoading } =
    useDevice();

  const [isSwitchingLock, setIsSwitchingLock] = useState(false);
  const [showChildPicker, setShowChildPicker] = useState(false);

  const handleToggleLock = async () => {
    if (!activeDevice) return;

    setIsSwitchingLock(true);
    try {
      const res = await toggleLock(activeDevice.deviceId);
      if (!res.success) {
        Alert.alert('Lỗi điều khiển từ xa', res.error || 'Không thể gửi tín hiệu Realtime.');
      }
    } catch (e: any) {
      Alert.alert('Lỗi', e.message || 'Lỗi mạng khi điều khiển từ xa.');
    } finally {
      setIsSwitchingLock(false);
    }
  };

  // Nếu chưa có thiết bị nào được ghép nối
  if (!isLoading && devices.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <Smartphone size={56} color={Colors.primary} />
        </View>
        <Text style={styles.emptyTitle}>Chưa Có Thiết Bị Của Bé</Text>
        <Text style={styles.emptyDesc}>
          Hãy mở ứng dụng Kids Launcher trên máy tính bảng của bé, dùng camera điện thoại quét mã QR kích hoạt để kết nối và bắt đầu điều khiển từ xa.
        </Text>

        <TouchableOpacity
          style={styles.emptyPairBtn}
          onPress={() => router.push('/pair-device')}
          activeOpacity={0.8}
        >
          <QrCode size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.emptyPairBtnText}>Quét Mã QR Kết Nối</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refreshDevices} tintColor={Colors.primary} />
      }
    >
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.liveBadge}>
            <Radio size={12} color={Colors.success} style={{ marginRight: 4 }} />
            <Text style={styles.liveText}>REALTIME WEBSOCKET</Text>
          </View>
          <Text style={styles.headerTitle}>Điều Khiển Khẩn Cấp</Text>
        </View>

        <TouchableOpacity
          style={styles.scanQuickBtn}
          onPress={() => router.push('/pair-device')}
          activeOpacity={0.7}
        >
          <QrCode size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.scanQuickText}>Thêm Bé</Text>
        </TouchableOpacity>
      </View>

      {/* Active Child Selector Bar */}
      {devices.length > 1 && (
        <View style={styles.pickerSection}>
          <TouchableOpacity
            style={styles.pickerToggle}
            onPress={() => setShowChildPicker((prev) => !prev)}
            activeOpacity={0.7}
          >
            <Text style={styles.pickerLabel}>Đang chọn điều khiển:</Text>
            <View style={styles.pickerCurrent}>
              <Text style={styles.pickerName}>
                {activeDevice?.childAvatar} {activeDevice?.childName}
              </Text>
              <ChevronDown size={16} color={Colors.textSecondary} style={{ marginLeft: 6 }} />
            </View>
          </TouchableOpacity>

          {showChildPicker && (
            <View style={styles.pickerDropdown}>
              {devices.map((dev) => (
                <TouchableOpacity
                  key={dev.deviceId}
                  style={[
                    styles.pickerOption,
                    activeDevice?.deviceId === dev.deviceId && styles.pickerOptionActive,
                  ]}
                  onPress={() => {
                    setActiveDevice(dev);
                    setShowChildPicker(false);
                  }}
                >
                  <Text style={styles.optionText}>
                    {dev.childAvatar} {dev.childName} ({dev.deviceModel || dev.deviceId})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Active Device Info Card */}
      {activeDevice && (
        <View style={styles.deviceBanner}>
          <View style={styles.deviceBannerLeft}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{activeDevice.childAvatar || '👦'}</Text>
            </View>
            <View>
              <Text style={styles.childNameText}>{activeDevice.childName}</Text>
              <Text style={styles.deviceModelText}>
                {activeDevice.deviceModel || 'Máy tính bảng Android'}
              </Text>
            </View>
          </View>
          <DeviceStatusBadge device={activeDevice} />
        </View>
      )}

      {/* Main Lock Button Section */}
      <View style={styles.controlCenter}>
        <EmergencyLockButton
          isLocked={Boolean(activeDevice?.isEmergencyLocked)}
          isLoading={isSwitchingLock}
          disabled={!activeDevice}
          onToggle={handleToggleLock}
        />
      </View>

      {/* Safety Notice & PIN Reminder */}
      {activeDevice && (
        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <KeyRound size={16} color={Colors.secondary} style={{ marginRight: 8 }} />
            <Text style={styles.infoText}>
              Mã PIN Phụ Huynh trên máy bé:{' '}
              <Text style={styles.infoHighlight}>{activeDevice.parentPin || '1234'}</Text>
            </Text>
          </View>
          <Text style={styles.subNote}>
            💡 Phụ huynh có thể nhập mã PIN trực tiếp trên máy bé để mở khóa cục bộ nếu điện thoại mất kết nối.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.success,
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
  },
  scanQuickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  scanQuickText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  pickerSection: {
    marginBottom: 16,
    zIndex: 10,
  },
  pickerToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pickerLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  pickerCurrent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  pickerDropdown: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 6,
    overflow: 'hidden',
  },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pickerOptionActive: {
    backgroundColor: 'rgba(79, 70, 229, 0.15)',
  },
  optionText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  deviceBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  deviceBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 22,
  },
  childNameText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  deviceModelText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  controlCenter: {
    marginVertical: 10,
    alignItems: 'center',
  },
  infoBox: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  infoHighlight: {
    color: Colors.text,
    fontWeight: '800',
    fontSize: 15,
  },
  subNote: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(79, 70, 229, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  emptyPairBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
  },
  emptyPairBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
