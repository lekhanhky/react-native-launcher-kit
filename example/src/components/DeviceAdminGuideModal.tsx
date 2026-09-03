import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  SafeAreaView,
} from 'react-native';

interface DeviceAdminGuideModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeviceAdminGuideModal: React.FC<DeviceAdminGuideModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const { width, height } = useWindowDimensions();
  const isSmallScreen = height < 720;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.backdrop}>
        <View
          style={[
            styles.card,
            {
              maxHeight: Math.min(height * 0.9, 640),
              width: Math.min(width - 32, 400),
              padding: isSmallScreen ? 16 : 22,
            },
          ]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: isSmallScreen ? 8 : 12 },
            ]}
          >
            {/* ICON & TIÊU ĐỀ */}
            <View style={[styles.header, { marginBottom: isSmallScreen ? 12 : 18 }]}>
              <View
                style={[
                  styles.iconCircle,
                  {
                    width: isSmallScreen ? 52 : 64,
                    height: isSmallScreen ? 52 : 64,
                    borderRadius: isSmallScreen ? 26 : 32,
                    marginBottom: isSmallScreen ? 8 : 12,
                  },
                ]}
              >
                <Text style={[styles.icon, { fontSize: isSmallScreen ? 26 : 32 }]}>🛡️</Text>
              </View>
              <Text style={[styles.title, { fontSize: isSmallScreen ? 18 : 21 }]}>
                Khóa Chống Gỡ Ứng Dụng
              </Text>
              <Text style={[styles.subtitle, { fontSize: isSmallScreen ? 12 : 13.5 }]}>
                Ngăn trẻ hoặc người khác tự ý gỡ bỏ Launcher bảo vệ
              </Text>
            </View>

            {/* HƯỚNG DẪN 3 BƯỚC CỰC KỲ DỄ HIỂU */}
            <View
              style={[
                styles.stepsContainer,
                {
                  padding: isSmallScreen ? 12 : 16,
                  gap: isSmallScreen ? 10 : 14,
                  marginBottom: isSmallScreen ? 14 : 18,
                },
              ]}
            >
              <View style={styles.stepRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepNum}>1</Text>
                </View>
                <Text style={[styles.stepText, { fontSize: isSmallScreen ? 12.5 : 13.5 }]}>
                  Bấm nút <Text style={styles.bold}>"Mở cài đặt kích hoạt"</Text> bên dưới.
                </Text>
              </View>

              <View style={styles.stepRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepNum}>2</Text>
                </View>
                <Text style={[styles.stepText, { fontSize: isSmallScreen ? 12.5 : 13.5 }]}>
                  Chọn ứng dụng <Text style={styles.bold}>"rnlauncherkit"</Text>.
                </Text>
              </View>

              <View style={styles.stepRow}>
                <View style={[styles.stepBadge, styles.stepBadgeHighlight]}>
                  <Text style={styles.stepNumHighlight}>3</Text>
                </View>
                <View style={[styles.stepHighlightBox, { padding: isSmallScreen ? 10 : 12 }]}>
                  <Text style={styles.stepHighlightTitle}>QUAN TRỌNG NHẤT:</Text>
                  <Text style={[styles.stepHighlightText, { fontSize: isSmallScreen ? 11.5 : 12.5 }]}>
                    Nhìn xuống <Text style={styles.bold}>góc dưới cùng</Text> và nhấn nút:
                  </Text>
                  <View style={styles.fakeBtn}>
                    <Text style={[styles.fakeBtnText, { fontSize: isSmallScreen ? 10.5 : 11.5 }]}>
                      👉 "Kích hoạt ứng dụng quản trị viên này"
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* NÚT HÀNH ĐỘNG - Đặt NGOÀI ScrollView để tránh bị nuốt touch event */}
          <View style={[styles.actions, { gap: isSmallScreen ? 8 : 10, marginTop: isSmallScreen ? 8 : 12 }]}>
            <TouchableOpacity
              style={[styles.confirmBtn, { paddingVertical: isSmallScreen ? 12 : 14 }]}
              activeOpacity={0.85}
              onPress={onConfirm}
            >
              <Text style={[styles.confirmText, { fontSize: isSmallScreen ? 14 : 15 }]}>
                🚀 Mở Cài Đặt Kích Hoạt Ngay
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cancelBtn, { paddingVertical: isSmallScreen ? 8 : 10 }]}
              activeOpacity={0.7}
              onPress={onClose}
            >
              <Text style={[styles.cancelText, { fontSize: isSmallScreen ? 12.5 : 13.5 }]}>
                Để tôi làm sau
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  scrollContent: {
    flexGrow: 0,
  },
  header: {
    alignItems: 'center',
  },
  iconCircle: {
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {},
  title: {
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  stepsContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  stepBadgeHighlight: {
    backgroundColor: '#2563EB',
  },
  stepNum: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  stepNumHighlight: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepText: {
    flex: 1,
    color: '#334155',
    lineHeight: 18,
  },
  bold: {
    fontWeight: '700',
    color: '#0F172A',
  },
  stepHighlightBox: {
    flex: 1,
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  stepHighlightTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  stepHighlightText: {
    color: '#92400E',
    lineHeight: 17,
    marginBottom: 6,
  },
  fakeBtn: {
    backgroundColor: '#1E293B',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  fakeBtnText: {
    color: '#F8FAFC',
    fontWeight: '700',
  },
  actions: {},
  confirmBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  confirmText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  cancelBtn: {
    alignItems: 'center',
  },
  cancelText: {
    color: '#64748B',
    fontWeight: '600',
  },
});

export default DeviceAdminGuideModal;
