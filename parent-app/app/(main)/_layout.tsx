import React from 'react';
import { Tabs } from 'expo-router';
import { LayoutDashboard, Smartphone, User } from 'lucide-react-native';
import { DeviceProvider } from '../../src/context/DeviceContext';
import { Colors } from '../../src/theme/colors';

export default function MainLayout() {
  return (
    <DeviceProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.card,
            borderTopColor: Colors.border,
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: Colors.primaryLight,
          tabBarInactiveTintColor: Colors.textSecondary,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Bảng Điều Khiển',
            tabBarIcon: ({ color, size }) => (
              <LayoutDashboard color={color} size={size || 22} />
            ),
          }}
        />
        <Tabs.Screen
          name="children/index"
          options={{
            title: 'Thiết Bị Bé',
            tabBarIcon: ({ color, size }) => (
              <Smartphone color={color} size={size || 22} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Tài Khoản',
            tabBarIcon: ({ color, size }) => (
              <User color={color} size={size || 22} />
            ),
          }}
        />
      </Tabs>
    </DeviceProvider>
  );
}
