import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
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
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {/* ICON & TIÊU ĐỀ */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Text style={styles.icon}>🛡️</Text>
            </View>
            <Text style={styles.title}>Khóa Chống Gỡ Ứng Dụng</Text>
            <Text style={styles.subtitle}>
              Ngăn trẻ hoặc người khác tự ý gỡ bỏ Launcher bảo vệ
            </Text>
          </View>

          {/* HƯỚNG DẪN 3 BƯỚC CỰC KỲ DỄ HIỂU */}
          <View style={styles.stepsContainer}>
            <View style={styles.stepRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepNum}>1</Text>
              </View>
              <Text style={styles.stepText}>
                Bấm nút <Text style={styles.bold}>"Mở cài đặt kích hoạt"</Text> bên dưới.
              </Text>
            </View>

            <View style={styles.stepRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepNum}>2</Text>
              </View>
              <Text style={styles.stepText}>
                Chọn ứng dụng <Text style={styles.bold}>"rnlauncherkit"</Text>.
              </Text>
            </View>

            <View style={styles.stepRow}>
              <View style={[styles.stepBadge, styles.stepBadgeHighlight]}>
                <Text style={styles.stepNumHighlight}>3</Text>
              </View>
              <View style={styles.stepHighlightBox}>
                <Text style={styles.stepHighlightTitle}>QUAN TRỌNG NHẤT:</Text>
                <Text style={styles.stepHighlightText}>
                  Nhìn xuống <Text style={styles.bold}>góc dưới cùng</Text> và nhấn nút:
                </Text>
                <View style={styles.fakeBtn}>
                  <Text style={styles.fakeBtnText}>
                    👉 "Kích hoạt ứng dụng quản trị viên này"
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* NÚT HÀNH ĐỘNG */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.confirmBtn}
              activeOpacity={0.85}
              onPress={onConfirm}
            >
              <Text style={styles.confirmText}>🚀 Mở Cài Đặt Kích Hoạt Ngay</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              activeOpacity={0.7}
              onPress={onClose}
            >
              <Text style={styles.cancelText}>Để tôi làm sau</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  stepsContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    gap: 14,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepBadgeHighlight: {
    backgroundColor: '#2563EB',
  },
  stepNum: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  stepNumHighlight: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepText: {
    flex: 1,
    fontSize: 13.5,
    color: '#334155',
    lineHeight: 20,
  },
  bold: {
    fontWeight: '700',
    color: '#0F172A',
  },
  stepHighlightBox: {
    flex: 1,
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  stepHighlightTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  stepHighlightText: {
    fontSize: 12.5,
    color: '#92400E',
    lineHeight: 18,
    marginBottom: 6,
  },
  fakeBtn: {
    backgroundColor: '#1E293B',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  fakeBtnText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '700',
  },
  actions: {
    gap: 10,
  },
  confirmBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
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
    fontSize: 15,
    fontWeight: '700',
  },
  cancelBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },
});
