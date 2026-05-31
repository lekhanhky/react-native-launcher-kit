/**
 * Displays a single app's detail card using its accent color as the background.
 * Demonstrates how `accentColor` can be used to theme launcher UI elements.
 */
import React from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';
import type {AppDetail as AppDetailType} from 'react-native-launcher-kit/lib/typescript/interfaces/InstalledApps';

interface AppDetailProps {
  /** The app whose details and accent color to display. */
  app: AppDetailType;
}

const AppDetail: React.FC<AppDetailProps> = ({app}) => (
  <View style={[styles.card, {backgroundColor: app.accentColor || '#6C3FBF'}]}>
    <View style={styles.content}>
      <Image style={styles.icon} source={{uri: app.icon}} />
      <View style={styles.info}>
        <Text style={styles.name}>{app.label}</Text>
        <Text style={styles.packageName}>{app.packageName}</Text>
        {app.version ? <Text style={styles.version}>v{app.version}</Text> : null}
      </View>
    </View>
    <View style={styles.colorRow}>
      <View style={[styles.colorSwatch, {backgroundColor: app.accentColor || '#6C3FBF'}]} />
      <Text style={styles.colorLabel}>accentColor: {app.accentColor || 'N/A'}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  info: {
    marginLeft: 14,
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  packageName: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  version: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.3)',
  },
  colorSwatch: {
    width: 14,
    height: 14,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  colorLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: 8,
    fontFamily: 'monospace',
  },
});

export default AppDetail;
