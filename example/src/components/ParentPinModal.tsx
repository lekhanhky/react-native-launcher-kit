import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { storage, STORAGE_KEYS } from '../services/storage';

interface ParentPinModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
}

export const ParentPinModal: React.FC<ParentPinModalProps> = ({
  visible,
  onClose,
  onSuccess,
  title = 'Nhập mã PIN Phụ huynh',
}) => {
  const [pin, setPin] = useState('');

  const handleConfirm = () => {
    const savedPin = storage.getString(STORAGE_KEYS.PARENT_PIN) || '1234';

    if (pin.trim() === savedPin.trim()) {
      setPin('');
      onSuccess();
    } else {
      Alert.alert('Lỗi bảo mật', 'Mã PIN phụ huynh không chính xác! Vui lòng thử lại.');
      setPin('');
    }
  };

  const handleCancel = () => {
    setPin('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.icon}>🔐</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>Mặc định: 1234 (hoặc mã cha mẹ đã đặt)</Text>

          <TextInput
            style={styles.pinInput}
            keyboardType="numeric"
            secureTextEntry
            maxLength={6}
            value={pin}
            onChangeText={setPin}
            placeholder="••••"
            placeholderTextColor="#94A3B8"
            autoFocus
          />

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.cancelBtn]}
              activeOpacity={0.7}
              onPress={handleCancel}
            >
              <Text style={styles.cancelText}>Hủy bỏ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.confirmBtn]}
              activeOpacity={0.8}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmText}>Xác nhận</Text>
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
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 20,
    textAlign: 'center',
  },
  pinInput: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    paddingVertical: 10,
    letterSpacing: 10,
    color: '#0F172A',
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#E2E8F0',
  },
  cancelText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 14,
  },
  confirmBtn: {
    backgroundColor: '#2563EB',
  },
  confirmText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
