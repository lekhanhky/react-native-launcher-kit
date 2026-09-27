import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShieldAlert, ShieldCheck, WifiOff } from 'lucide-react-native';
import { ChildDevice } from '../types';
import { Colors } from '../theme/colors';

export interface DeviceStatusInfo {
  state: 'locked' | 'active' | 'unpaired';
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export function getDeviceStatusInfo(device: ChildDevice): DeviceStatusInfo {
  if (device.isEmergencyLocked) {
    return {
      state: 'locked',
      label: 'Đang Bị Khóa',
      badgeBg: 'rgba(239, 68, 68, 0.15)',
      badgeText: Colors.danger,
      badgeBorder: Colors.danger,
    };
  }

  if (device.isPaired) {
    return {
      state: 'active',
      label: 'Đang Hoạt Động',
      badgeBg: 'rgba(16, 185, 129, 0.15)',
      badgeText: Colors.success,
      badgeBorder: Colors.success,
    };
  }

  return {
    state: 'unpaired',
    label: 'Chưa Kích Hoạt',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    badgeText: Colors.warning,
    badgeBorder: Colors.warning,
  };
}

export const DeviceStatusBadge: React.FC<{ device: ChildDevice }> = ({ device }) => {
  const info = getDeviceStatusInfo(device);

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: info.badgeBg, borderColor: info.badgeBorder },
      ]}
    >
      {info.state === 'locked' && (
        <ShieldAlert size={14} color={info.badgeText} style={styles.icon} />
      )}
      {info.state === 'active' && (
        <ShieldCheck size={14} color={info.badgeText} style={styles.icon} />
      )}
      {info.state === 'unpaired' && (
        <WifiOff size={14} color={info.badgeText} style={styles.icon} />
      )}
      <Text style={[styles.text, { color: info.badgeText }]}>{info.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 5,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});
