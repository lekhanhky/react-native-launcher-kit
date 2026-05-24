/**
 * Displays installed apps in a grid layout.
 * Tap to launch an app, long-press to preview its accent color.
 */
import React from 'react';
import {View, Pressable, Image, Text, StyleSheet} from 'react-native';
import type {AppDetail} from 'react-native-launcher-kit/lib/typescript/interfaces/InstalledApps';

interface AppGridProps {
  /** Array of installed app details to display. */
  apps: AppDetail[];
  /** Called with the package name when an app icon is tapped. */
  onAppPress: (packageName: string) => void;
  /** Called with the full app object when an icon is long-pressed. */
  onAppLongPress?: (app: AppDetail) => void;
}

const AppGrid: React.FC<AppGridProps> = ({apps, onAppPress, onAppLongPress}) => (
  <View style={styles.container}>
    {apps.map(item => (
      <Pressable
        key={item.packageName}
        onPress={() => onAppPress(item.packageName)}
        onLongPress={() => onAppLongPress?.(item)}
        style={styles.appItem}>
        <View style={styles.iconContainer}>
          <Image style={styles.icon} source={{uri: item.icon}} />
        </View>
        <Text style={styles.label} numberOfLines={1}>
          {item.label}
        </Text>
      </Pressable>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  appItem: {
    alignItems: 'center',
    width: 76,
    marginBottom: 16,
    marginHorizontal: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    overflow: 'hidden',
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  label: {
    fontSize: 11,
    color: '#3C3C43',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default AppGrid;
