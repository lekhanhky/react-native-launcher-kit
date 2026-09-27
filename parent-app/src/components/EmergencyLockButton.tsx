import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Lock, Unlock, ShieldAlert, ShieldCheck } from 'lucide-react-native';
import { Colors } from '../theme/colors';

interface EmergencyLockButtonProps {
  isLocked: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onToggle: () => void;
}

export const EmergencyLockButton: React.FC<EmergencyLockButtonProps> = ({
  isLocked,
  isLoading = false,
  disabled = false,
  onToggle,
}) => {
  return (
    <View style={styles.wrapper}>
      {/* Outer Glow Ring */}
      <View
        style={[
          styles.glowRing,
          isLocked ? styles.glowRingLocked : styles.glowRingNormal,
        ]}
      >
        <TouchableOpacity
          style={[
            styles.button,
            isLocked ? styles.buttonLocked : styles.buttonNormal,
            disabled && styles.buttonDisabled,
          ]}
          onPress={onToggle}
          disabled={disabled || isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color="#FFFFFF" />
          ) : (
            <>
              <View
                style={[
                  styles.iconContainer,
                  isLocked ? styles.iconLocked : styles.iconNormal,
                ]}
              >
                {isLocked ? (
                  <Lock size={52} color="#FFFFFF" />
                ) : (
                  <ShieldCheck size={52} color={Colors.secondary} />
                )}
              </View>

              <Text style={styles.actionTitle}>
                {isLocked ? 'MÁY ĐANG BỊ KHÓA' : 'KHÓA MÁY KHẨN CẤP'}
              </Text>

              <Text style={styles.actionSubtitle}>
                {isLocked
                  ? 'Chạm vào đây để MỞ KHÓA tức thì'
                  : 'Gửi tín hiệu Realtime khóa ngay (< 1s)'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  glowRing: {
    padding: 12,
    borderRadius: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowRingNormal: {
    backgroundColor: 'rgba(13, 148, 136, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(13, 148, 136, 0.3)',
  },
  glowRingLocked: {
    backgroundColor: 'rgba(239, 68, 68, 0.18)',
    borderWidth: 2,
    borderColor: Colors.danger,
    shadowColor: Colors.danger,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  button: {
    width: 230,
    height: 230,
    borderRadius: 115,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    elevation: 8,
  },
  buttonNormal: {
    backgroundColor: Colors.surface,
    borderWidth: 3,
    borderColor: Colors.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  buttonLocked: {
    backgroundColor: Colors.danger,
    borderWidth: 3,
    borderColor: '#FECACA',
    shadowColor: Colors.danger,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 84,
    height: 84,
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconNormal: {
    backgroundColor: 'rgba(13, 148, 136, 0.15)',
  },
  iconLocked: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 8,
    lineHeight: 14,
  },
});
