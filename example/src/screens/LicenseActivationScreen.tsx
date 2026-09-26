import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
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
  ScrollView,
} from 'react-native';
import { licenseService } from '../services/licenseService';
import { SUPABASE_URL, SUPABASE_ANON_KEY, supabaseClient } from '../services/supabaseClient';
import { QRCodeView } from '../components/QRCodeView';

interface LicenseActivationScreenProps {
  onActivated: () => void;
}

export const LicenseActivationScreen: React.FC<LicenseActivationScreenProps> = ({
  onActivated,
}) => {
  const [deviceId, setDeviceId] = useState('');
  const [licenseKey, setLicenseKey] = useState('LCK-DEMO');
  const [loading, setLoading] = useState(false);
  const [isPaired, setIsPaired] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Đang đợi phụ huynh quét mã...');

  const hasActivatedRef = useRef(false);
  const createdAtRef = useRef(Date.now());
  const wsRef = useRef<WebSocket | null>(null);

  // 1. Lấy thông tin Hardware Device ID
  useEffect(() => {
    licenseService.getDeviceUniqueId().then(setDeviceId);
  }, []);

  // 2. Chuẩn bị QR Payload chuẩn JSON
  const qrPayload = useMemo(() => {
    if (!deviceId) return '';
    return JSON.stringify({
      action: 'KIDS_LAUNCHER_PAIR',
      v: 1,
      device_id: deviceId,
      device_name: 'Galaxy Tab của Bé',
      created_at: createdAtRef.current,
    });
  }, [deviceId]);

  // 3. Xử lý kích hoạt khi nhận tín hiệu ghép nối thành công
  const handlePairingSuccess = useCallback(async () => {
    if (hasActivatedRef.current) return;
    hasActivatedRef.current = true;
    setIsPaired(true);
    setStatusMessage('Ghép nối thành công! Đang vào launcher...');

    try {
      await licenseService.activateLicense('QR-ACT-' + deviceId);
    } catch (e) {
      console.warn('[LicenseActivation] Lỗi activateLicense QR:', e);
    }

    setTimeout(() => {
      onActivated();
    }, 500);
  }, [deviceId, onActivated]);

  // 4. Lắng nghe Supabase Realtime WebSocket và Polling dự phòng
  useEffect(() => {
    if (!deviceId) return;

    let heartbeatTimer: NodeJS.Timeout | null = null;
    let pollTimer: NodeJS.Timeout | null = null;

    // --- A. Supabase Realtime WebSocket ---
    if (typeof WebSocket !== 'undefined') {
      try {
        const wsUrl = `${SUPABASE_URL.replace(/^http/, 'ws')}/realtime/v1/websocket?apikey=${SUPABASE_ANON_KEY}&vsn=1.0.0`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          // Tham gia kênh device_pairing:<deviceId>
          const joinMsg = {
            topic: `realtime:device_pairing:${deviceId}`,
            event: 'phx_join',
            payload: {
              config: {
                broadcast: { self: true },
              },
            },
            ref: '1',
          };
          ws.send(JSON.stringify(joinMsg));

          // Gửi heartbeat duy trì kết nối
          heartbeatTimer = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(
                JSON.stringify({
                  topic: 'phoenix',
                  event: 'heartbeat',
                  payload: {},
                  ref: String(Date.now()),
                })
              );
            }
          }, 25000);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            const eventType = data.event || data.payload?.event;
            if (
              eventType === 'DEVICE_PAIRED_SUCCESS' ||
              (data.event === 'broadcast' && data.payload?.event === 'DEVICE_PAIRED_SUCCESS')
            ) {
              const targetDeviceId =
                data.payload?.payload?.device_id || data.payload?.device_id;
              if (!targetDeviceId || targetDeviceId === deviceId) {
                handlePairingSuccess();
              }
            }
          } catch (err) {
            console.warn('[LicenseActivation] Parse WS error:', err);
          }
        };

        ws.onerror = (e) => {
          console.warn('[LicenseActivation] WebSocket error:', e);
        };
      } catch (wsErr) {
        console.warn('[LicenseActivation] Không thể khởi tạo WebSocket:', wsErr);
      }
    }

    // --- B. Polling dự phòng qua REST API (ngay khi mở và định kỳ mỗi 3 giây) ---
    const checkPairingStatus = async () => {
      if (hasActivatedRef.current) return;
      try {
        // Kiểm tra bảng devices
        const deviceRes = await supabaseClient.from('devices', {
          filter: { device_id: deviceId },
          limit: 1,
        });

        if (deviceRes.data && deviceRes.data.length > 0) {
          const device = deviceRes.data[0];
          if (device.is_paired === true) {
            handlePairingSuccess();
            return;
          }
        }

        // Kiểm tra dự phòng bảng parental_policies
        const policyRes = await supabaseClient.from('parental_policies', {
          filter: { device_id: deviceId },
          limit: 1,
        });

        if (policyRes.data && policyRes.data.length > 0) {
          const policy = policyRes.data[0];
          if (policy.is_paired === true) {
            handlePairingSuccess();
          }
        }
      } catch (pollErr) {
        // Bỏ qua lỗi mạng trong polling
      }
    };

    // Kiểm tra ngay lập tức khi deviceId sẵn sàng
    checkPairingStatus();

    // Tiếp tục polling định kỳ mỗi 3 giây
    pollTimer = setInterval(checkPairingStatus, 3000);

    return () => {
      if (heartbeatTimer) clearInterval(heartbeatTimer);
      if (pollTimer) clearInterval(pollTimer);
      if (wsRef.current) {
        try {
          wsRef.current.close();
        } catch {}
        wsRef.current = null;
      }
    };
  }, [deviceId, handlePairingSuccess]);

  const handleCopyDeviceId = () => {
    Alert.alert(
      'Mã Thiết Bị (Device ID)',
      `Mã định danh của bạn là:\n\n${deviceId}\n\nHãy gửi mã này cho Quản trị viên hoặc quét mã QR ở trên để kích hoạt.`
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
        onActivated();
      } else {
        Alert.alert('Kích hoạt thất bại', result.message);
      }
    } catch (err) {
      setLoading(false);
      onActivated();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            {/* Header */}
            <Text style={styles.logo}>🛡️</Text>
            <Text style={styles.title}>KÍCH HOẠT BẢN QUYỀN LAUNCHER</Text>
            <Text style={styles.subtitle}>
              Dùng ứng dụng Phụ huynh quét mã QR bên dưới để liên kết và mở khóa Launcher cho bé.
            </Text>

            {/* QR Code Container */}
            <View style={styles.qrCard} testID="qr-code-card">
              {deviceId ? (
                <QRCodeView
                  value={qrPayload}
                  size={200}
                  testID="qr-code-view"
                />
              ) : (
                <View style={styles.qrLoadingBox}>
                  <ActivityIndicator size="large" color="#2563EB" />
                  <Text style={styles.qrLoadingText}>Đang tạo mã QR...</Text>
                </View>
              )}
            </View>

            {/* Device Info & Status */}
            <View style={styles.deviceInfoContainer}>
              <Text style={styles.deviceCodeText} testID="device-id-text">
                MÃ THIẾT BỊ: <Text style={styles.deviceCodeHighlight}>{deviceId || 'ĐANG TẢI...'}</Text>
              </Text>
              <TouchableOpacity
                style={styles.copyBtn}
                activeOpacity={0.7}
                onPress={handleCopyDeviceId}
              >
                <Text style={styles.copyBtnText}>📋 Sao chép mã máy</Text>
              </TouchableOpacity>
            </View>

            {/* Status indicator */}
            <View style={styles.statusBox}>
              {isPaired ? (
                <Text style={styles.statusSuccessText}>
                  ✅ {statusMessage}
                </Text>
              ) : (
                <View style={styles.waitingRow}>
                  <ActivityIndicator size="small" color="#2563EB" style={styles.statusSpinner} />
                  <Text style={styles.statusWaitingText}>
                    {statusMessage}
                  </Text>
                </View>
              )}
            </View>

            {/* Manual License Input Toggle */}
            <View style={styles.manualSection}>
              <TouchableOpacity
                style={styles.toggleManualBtn}
                onPress={() => setShowManualInput((prev) => !prev)}
                activeOpacity={0.7}
                testID="toggle-manual-btn"
              >
                <Text style={styles.toggleManualText}>
                  {showManualInput
                    ? '▲ Thu gọn nhập mã thủ công'
                    : '▼ Hoặc nhập mã bản quyền thủ công'}
                </Text>
              </TouchableOpacity>

              {showManualInput && (
                <View style={styles.manualInputWrapper} testID="manual-input-wrapper">
                  <Text style={styles.inputLabel}>Nhập mã bản quyền (License Key):</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="VD: LCK-8899-AABB"
                    placeholderTextColor="#94A3B8"
                    value={licenseKey}
                    onChangeText={setLicenseKey}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    testID="manual-license-input"
                  />
                  <TouchableOpacity
                    style={[styles.activateBtn, loading && styles.disabledBtn]}
                    activeOpacity={0.8}
                    onPress={handleActivate}
                    disabled={loading}
                    testID="manual-activate-btn"
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.activateText}>KÍCH HOẠT THỦ CÔNG</Text>
                    )}
                  </TouchableOpacity>
                  <Text style={styles.helpText}>
                    💡 Nhập mã <Text style={{ fontWeight: 'bold' }}>LCK-DEMO</Text> để dùng thử nhanh.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
    fontSize: 44,
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
    marginBottom: 16,
    lineHeight: 18,
  },
  qrCard: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 224,
    minWidth: 224,
  },
  qrLoadingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    width: 200,
  },
  qrLoadingText: {
    marginTop: 10,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  deviceInfoContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 14,
  },
  deviceCodeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  deviceCodeHighlight: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: 1,
  },
  copyBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  copyBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  statusBox: {
    width: '100%',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  waitingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusSpinner: {
    marginRight: 8,
  },
  statusWaitingText: {
    fontSize: 13,
    color: '#1D4ED8',
    fontWeight: '600',
  },
  statusSuccessText: {
    fontSize: 13,
    color: '#16A34A',
    fontWeight: '700',
  },
  manualSection: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  toggleManualBtn: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  toggleManualText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  manualInputWrapper: {
    width: '100%',
    marginTop: 12,
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
    marginBottom: 12,
  },
  activateBtn: {
    width: '100%',
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  disabledBtn: {
    backgroundColor: '#94A3B8',
  },
  activateText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  helpText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
});
