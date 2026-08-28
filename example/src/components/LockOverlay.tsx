import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

interface LockOverlayProps {
  reason: string;
  onUnlockPress: () => void;
}

export const LockOverlay: React.FC<LockOverlayProps> = ({ reason, onUnlockPress }) => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleEmergencyCall = () => {
    Alert.alert(
      'Cuộc gọi khẩn cấp',
      'Đang thực hiện cuộc gọi khẩn cấp đến số điện thoại của Bố/Mẹ...'
    );
  };

  return (
    <View style={styles.overlay}>
      <Text style={styles.icon}>🔒</Text>
      <Text style={styles.timeText}>{currentTime}</Text>

      <Text style={styles.title}>THIẾT BỊ ĐANG TẠM KHÓA</Text>
      <Text style={styles.subtitle}>{reason}</Text>

      <TouchableOpacity
        style={styles.unlockBtn}
        activeOpacity={0.8}
        onPress={onUnlockPress}
      >
        <Text style={styles.unlockText}>Mở khóa bằng mã PIN</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.emergencyBtn}
        activeOpacity={0.7}
        onPress={handleEmergencyCall}
      >
        <Text style={styles.emergencyText}>📞 Cuộc gọi khẩn cấp</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.98)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 999,
  },
  icon: {
    fontSize: 56,
    marginBottom: 8,
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 16,
    letterSpacing: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#EF4444',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  unlockBtn: {
    width: '100%',
    maxWidth: 280,
    paddingVertical: 14,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#2563EB',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  unlockText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  emergencyBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  emergencyText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
});
