import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Smartphone, ShieldCheck, QrCode } from 'lucide-react-native';
import { useDevice } from '../../../src/context/DeviceContext';
import { ChildCard } from '../../../src/components/ChildCard';
import { Colors } from '../../../src/theme/colors';

export default function ChildrenListScreen() {
  const router = useRouter();
  const { devices, activeDevice, setActiveDevice, refreshDevices, toggleLock, isLoading } =
    useDevice();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshDevices}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Máy Tính Bảng Của Bé</Text>
            <Text style={styles.headerSubtitle}>
              {devices.length} thiết bị đã liên kết với tài khoản
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push('/pair-device')}
            activeOpacity={0.8}
          >
            <Plus size={20} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={styles.addBtnText}>Thêm</Text>
          </TouchableOpacity>
        </View>

        {/* List of Devices */}
        {devices.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Smartphone size={48} color={Colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>Chưa có thiết bị nào</Text>
            <Text style={styles.emptyDesc}>
              Bấm nút "Thêm Thiết Bị" để quét mã QR kết nối với máy tính bảng của bé.
            </Text>
            <TouchableOpacity
              style={styles.emptyPairBtn}
              onPress={() => router.push('/pair-device')}
              activeOpacity={0.8}
            >
              <QrCode size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.emptyPairBtnText}>Ghép Nối Máy Bé Ngay</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.list}>
            {devices.map((dev) => (
              <ChildCard
                key={dev.deviceId}
                device={dev}
                isActive={activeDevice?.deviceId === dev.deviceId}
                onSelect={() => setActiveDevice(dev)}
                onToggleLock={() => toggleLock(dev.deviceId)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  list: {
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(79, 70, 229, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
    maxWidth: 260,
  },
  emptyPairBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  emptyPairBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
