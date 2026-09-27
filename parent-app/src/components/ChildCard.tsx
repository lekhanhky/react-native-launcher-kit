import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Tablet, ChevronRight, Lock, Unlock } from 'lucide-react-native';
import { ChildDevice } from '../types';
import { Colors } from '../theme/colors';
import { DeviceStatusBadge } from './DeviceStatusBadge';

interface ChildCardProps {
  device: ChildDevice;
  isActive?: boolean;
  onSelect?: () => void;
  onToggleLock?: () => void;
}

export const ChildCard: React.FC<ChildCardProps> = ({
  device,
  isActive = false,
  onSelect,
  onToggleLock,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        isActive && styles.activeCard,
        device.isEmergencyLocked && styles.lockedCard,
      ]}
      onPress={onSelect}
      activeOpacity={0.8}
    >
      <View style={styles.topRow}>
        {/* Child Avatar & Name */}
        <View style={styles.childInfo}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{device.childAvatar || '👦'}</Text>
          </View>
          <View style={styles.nameBlock}>
            <Text style={styles.childName}>{device.childName}</Text>
            <View style={styles.modelRow}>
              <Tablet size={13} color={Colors.textSecondary} style={{ marginRight: 4 }} />
              <Text style={styles.deviceModel} numberOfLines={1}>
                {device.deviceModel || device.deviceId}
              </Text>
            </View>
          </View>
        </View>

        {/* Lock / Unlock Quick Button */}
        {onToggleLock && (
          <TouchableOpacity
            style={[
              styles.quickLockButton,
              device.isEmergencyLocked ? styles.btnUnlock : styles.btnLock,
            ]}
            onPress={(e) => {
              e.stopPropagation();
              onToggleLock();
            }}
            activeOpacity={0.7}
          >
            {device.isEmergencyLocked ? (
              <Unlock size={16} color="#FFFFFF" />
            ) : (
              <Lock size={16} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Bottom Status & Info */}
      <View style={styles.bottomRow}>
        <DeviceStatusBadge device={device} />
        {isActive && (
          <View style={styles.activeTag}>
            <Text style={styles.activeTagText}>Đang điều khiển</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  activeCard: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(79, 70, 229, 0.08)',
  },
  lockedCard: {
    borderColor: 'rgba(239, 68, 68, 0.4)',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  childInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatarText: {
    fontSize: 24,
  },
  nameBlock: {
    flex: 1,
  },
  childName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  modelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceModel: {
    fontSize: 12,
    color: Colors.textSecondary,
    maxWidth: 180,
  },
  quickLockButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnLock: {
    backgroundColor: Colors.surfaceLight,
  },
  btnUnlock: {
    backgroundColor: Colors.danger,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 65, 85, 0.4)',
    paddingTop: 10,
  },
  activeTag: {
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  activeTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
