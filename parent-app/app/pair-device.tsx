import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { X, QrCode, Keyboard, Smartphone, CheckCircle2 } from 'lucide-react-native';
import { useAuth } from '../src/context/AuthContext';
import { useDevice } from '../src/context/DeviceContext';
import { parseQrCode, pairDevice } from '../src/services/pairingService';
import { QrScannerView } from '../src/components/QrScannerView';
import { Colors } from '../src/theme/colors';

export default function PairDeviceModal() {
  const router = useRouter();
  const { user } = useAuth();
  const { refreshDevices } = useDevice();

  const [activeTab, setActiveTab] = useState<'qr' | 'manual'>('qr');
  const [childName, setChildName] = useState('Bé Yêu');
  const [manualCode, setManualCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePairingSuccess = async (deviceId: string, devName?: string) => {
    await refreshDevices();
    Alert.alert(
      'Ghép Nối Thành Công! 🎉',
      `Máy tính bảng (${devName || deviceId}) đã được liên kết với tài khoản phụ huynh. Máy của bé đã được mở khóa tự động!`,
      [
        {
          text: 'Về Dashboard',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handleQrScanned = async (data: string) => {
    if (isProcessing) return;

    const payload = parseQrCode(data);
    if (!payload) {
      Alert.alert(
        'Mã QR Không Hợp Lệ',
        'Mã QR này không thuộc hệ sinh thái Kids Launcher. Vui lòng hướng camera vào màn hình kích hoạt bản quyền của bé.'
      );
      return;
    }

    setIsProcessing(true);
    try {
      const res = await pairDevice(user?.id || 'parent_user', payload, childName.trim());
      if (res.success) {
        await handlePairingSuccess(payload.deviceId, payload.deviceName);
      } else {
        Alert.alert('Ghép nối thất bại', res.error || 'Vui lòng thử lại.');
      }
    } catch (e: any) {
      Alert.alert('Lỗi', e.message || 'Lỗi mạng khi kết nối máy chủ.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualPair = async () => {
    const trimmed = manualCode.trim();
    if (!trimmed) {
      Alert.alert('Thông báo', 'Vui lòng nhập Mã Thiết Bị (Device ID) hoặc mã kích hoạt.');
      return;
    }

    setIsProcessing(true);
    try {
      const payload = parseQrCode(trimmed) || {
        type: 'KIDS_LAUNCHER_PAIRING' as const,
        deviceId: trimmed,
        deviceName: 'Máy tính bảng của Bé',
        timestamp: Date.now(),
      };

      const res = await pairDevice(user?.id || 'parent_user', payload, childName.trim());
      if (res.success) {
        await handlePairingSuccess(payload.deviceId, payload.deviceName);
      } else {
        Alert.alert('Ghép nối thất bại', res.error || 'Vui lòng kiểm tra lại mã thiết bị.');
      }
    } catch (e: any) {
      Alert.alert('Lỗi', e.message || 'Lỗi mạng khi kết nối máy chủ.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Modal Top Bar */}
      <View style={styles.header}>
        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerTitle}>Ghép Nối Thiết Bị Bé</Text>
          <Text style={styles.headerSubtitle}>Liên kết máy tính bảng để bắt đầu giám sát</Text>
        </View>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <X size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Child Name input */}
      <View style={styles.childNameSection}>
        <Text style={styles.inputLabel}>Tên gợi nhớ cho bé:</Text>
        <TextInput
          style={styles.nameInput}
          value={childName}
          onChangeText={setChildName}
          placeholder="Ví dụ: Bé Gia Bảo, Bé Na..."
          placeholderTextColor={Colors.textSecondary}
        />
      </View>

      {/* Tabs Switcher: QR Code vs Nhập tay */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'qr' && styles.activeTabButton]}
          onPress={() => setActiveTab('qr')}
          activeOpacity={0.7}
        >
          <QrCode
            size={18}
            color={activeTab === 'qr' ? '#FFFFFF' : Colors.textSecondary}
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.tabText, activeTab === 'qr' && styles.activeTabText]}>
            Quét Mã QR
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'manual' && styles.activeTabButton]}
          onPress={() => setActiveTab('manual')}
          activeOpacity={0.7}
        >
          <Keyboard
            size={18}
            color={activeTab === 'manual' ? '#FFFFFF' : Colors.textSecondary}
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.tabText, activeTab === 'manual' && styles.activeTabText]}>
            Nhập Mã Thủ Công
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <View style={styles.contentArea}>
        {activeTab === 'qr' ? (
          <View style={styles.scannerWrapper}>
            <QrScannerView onScanned={handleQrScanned} isScanning={!isProcessing} />
            {isProcessing && (
              <View style={styles.processingOverlay}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.processingText}>Đang ghép nối và kích hoạt máy bé...</Text>
              </View>
            )}
          </View>
        ) : (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.manualContainer}
          >
            <ScrollView contentContainerStyle={styles.manualContent}>
              <View style={styles.manualIconCircle}>
                <Smartphone size={40} color={Colors.primary} />
              </View>
              <Text style={styles.manualTitle}>Nhập Mã Thiết Bị</Text>
              <Text style={styles.manualDesc}>
                Nhập chuỗi 6 ký tự hoặc Device ID hiển thị ngay dưới mã QR trên màn hình kích hoạt của bé.
              </Text>

              <TextInput
                style={styles.manualInput}
                placeholder="VD: dev_784920 hoặc 784920"
                placeholderTextColor={Colors.textSecondary}
                value={manualCode}
                onChangeText={setManualCode}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TouchableOpacity
                style={[styles.manualSubmitBtn, isProcessing && styles.manualSubmitBtnDisabled]}
                onPress={handleManualPair}
                disabled={isProcessing}
                activeOpacity={0.8}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <View style={styles.manualBtnContent}>
                    <CheckCircle2 size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.manualSubmitText}>Xác Nhận & Liên Kết</Text>
                  </View>
                )}
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitleGroup: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  childNameSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  nameInput: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: Colors.text,
    fontSize: 15,
  },
  tabsContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: Colors.background,
    gap: 10,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeTabButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  contentArea: {
    flex: 1,
  },
  scannerWrapper: {
    flex: 1,
    position: 'relative',
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  processingText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  manualContainer: {
    flex: 1,
  },
  manualContent: {
    padding: 24,
    alignItems: 'center',
  },
  manualIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(79, 70, 229, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 20,
  },
  manualTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  manualDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
    maxWidth: 280,
  },
  manualInput: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.text,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 20,
  },
  manualSubmitBtn: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  manualSubmitBtnDisabled: {
    opacity: 0.6,
  },
  manualBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  manualSubmitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
