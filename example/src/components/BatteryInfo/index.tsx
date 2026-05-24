/**
 * Real-time battery status display with a visual progress bar.
 * Color changes based on level: green (>50%), orange (>20%), red (<=20%).
 * Shows a "LIVE" badge indicating event-driven updates (no polling).
 */
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import type {BatteryStatus} from 'react-native-launcher-kit/lib/typescript/interfaces/battery';

interface BatteryInfoProps {
  /** Current battery status from the native listener. */
  battery: BatteryStatus;
}

const BatteryInfo: React.FC<BatteryInfoProps> = ({battery}) => {
  const levelColor = battery.level > 50 ? '#34C759' : battery.level > 20 ? '#FF9500' : '#FF3B30';

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.levelContainer}>
          <View style={[styles.levelBar, {width: `${battery.level}%`, backgroundColor: levelColor}]} />
        </View>
        <Text style={styles.levelText}>{battery.level}%</Text>
      </View>
      <View style={styles.statusRow}>
        <View style={[styles.dot, {backgroundColor: battery.isCharging ? '#34C759' : '#8E8E93'}]} />
        <Text style={styles.statusText}>
          {battery.isCharging ? 'Charging' : 'Not Charging'}
        </Text>
        <View style={styles.liveBadge}>
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  levelContainer: {
    flex: 1,
    height: 10,
    backgroundColor: '#E5E5EA',
    borderRadius: 5,
    overflow: 'hidden',
  },
  levelBar: {
    height: '100%',
    borderRadius: 5,
  },
  levelText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    width: 50,
    textAlign: 'right',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    color: '#636366',
  },
  liveBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 'auto',
  },
  liveText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default BatteryInfo;
