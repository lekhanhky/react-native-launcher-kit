import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { User, LogOut, ShieldCheck, Database, Radio, Info } from 'lucide-react-native';
import { useAuth } from '../../src/context/AuthContext';
import { Colors } from '../../src/theme/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Đăng Xuất',
      'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản phụ huynh trên thiết bị này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng Xuất',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hồ Sơ Phụ Huynh</Text>
        <Text style={styles.headerSubtitle}>Thông tin tài khoản & Kết nối hệ thống</Text>
      </View>

      {/* User Info Card */}
      <View style={styles.userCard}>
        <View style={styles.userAvatar}>
          <User size={36} color="#FFFFFF" />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userRole}>TÀI KHOẢN PHỤ HUYNH</Text>
          <Text style={styles.userEmail} numberOfLines={1}>
            {user?.email || 'phuhuynh@example.com'}
          </Text>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Phiên làm việc đang hoạt động</Text>
          </View>
        </View>
      </View>

      {/* System Status Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trạng Thái Hệ Thống</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoRowLeft}>
            <Database size={18} color={Colors.secondary} style={{ marginRight: 10 }} />
            <Text style={styles.infoLabel}>Máy chủ Backend:</Text>
          </View>
          <Text style={styles.infoValue}>Supabase Cloud</Text>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoRowLeft}>
            <Radio size={18} color={Colors.success} style={{ marginRight: 10 }} />
            <Text style={styles.infoLabel}>Realtime Khóa Máy:</Text>
          </View>
          <Text style={[styles.infoValue, { color: Colors.success }]}>WebSocket Hoạt Động</Text>
        </View>

        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <View style={styles.infoRowLeft}>
            <Info size={18} color={Colors.primaryLight} style={{ marginRight: 10 }} />
            <Text style={styles.infoLabel}>Phiên bản Ứng dụng:</Text>
          </View>
          <Text style={styles.infoValue}>1.0.0 (Expo SDK 52)</Text>
        </View>
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} activeOpacity={0.8}>
        <LogOut size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={styles.signOutBtnText}>Đăng Xuất Khỏi Tài Khoản</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userRole: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primaryLight,
    letterSpacing: 1,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.4)',
  },
  infoRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.danger,
    height: 52,
    borderRadius: 14,
    marginTop: 'auto',
    marginBottom: Platform.OS === 'ios' ? 20 : 10,
    shadowColor: Colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  signOutBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
