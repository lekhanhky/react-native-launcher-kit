# HƯỚNG DẪN TRIỂN KHAI GIAI ĐOẠN 1: PARENTAL CONTROL LAUNCHER
> **Công nghệ áp dụng:** React Native (Expo Dev Client) + Supabase + react-native-launcher-kit  
> **Mục tiêu:** Xây dựng ứng dụng Launcher kiểm soát trẻ em & Quản lý bản quyền:
> 1. **Kích hoạt bản quyền** theo ID phần cứng duy nhất (`Device Unique ID`).
> 2. **Ẩn/Hiện ứng dụng** theo danh sách cấm/cho phép (`react-native-launcher-kit`).
> 3. **Đặt làm Launcher mặc định** (khóa nút Home).
> 4. **Lập lịch giờ học / giờ ngủ** (tự động khóa máy ngoài khung giờ).
> 5. **Mã PIN phụ huynh** để mở khóa và quản lý Cài đặt.

---

## 1. TỔNG QUAN KIẾN TRÚC & LUỒNG HOẠT ĐỘNG

```text
                               ┌───────────────────────────────────────────────────────────┐
                               │                    Supabase Backend                       │
                               │   • Bảng `devices`: License Key, Trạng thái kích hoạt     │
                               │   • Bảng `parental_policies`: Whitelist/Blacklist, PIN    │
                               │   • Bảng `time_schedules`: Khung giờ học / Giờ ngủ        │
                               └─────────────────────────────┬─────────────────────────────┘
                                                             │ (Xác thực & Đồng bộ Realtime)
                                                             ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                   MÁY CON: Expo React Native (Local-First Architecture)                  │
│                                                                                          │
│  [Mở App] ──> 1. Kiểm tra Bản quyền (License Guard):                                     │
│                  ├── Chưa kích hoạt / Hết hạn ──> Màn hình Nhập License Key & Device ID  │
│                  └── Đã kích hoạt ──────────────> Chuyển sang Màn hình Launcher          │
│                                                                                          │
│               2. Màn hình Launcher:                                                      │
│                  ├── Yêu cầu Default Launcher (Khóa nút Home)                            │
│                  ├── Lọc & Ẩn App cấm (react-native-launcher-kit)                        │
│                  ├── Kiểm tra Giờ học/ngủ ──> Hiển thị Lock Overlay nếu ngoài giờ        │
│                  └── Nút "Phụ huynh" ───────> Nhập PIN để vào Cài đặt / Mở khóa          │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. THIẾT LẬP CƠ SỞ DỮ LIỆU TRÊN SUPABASE

Chạy mã SQL sau trong **Supabase SQL Editor** để tạo toàn bộ bảng phục vụ Bản quyền và Quản lý trẻ em:

```sql
-- 1. Enum trạng thái bản quyền
create type license_status_enum as enum ('pending', 'active', 'expired', 'blocked');

-- 2. Bảng quản lý thiết bị & Bản quyền
create table public.devices (
  id uuid primary key default gen_random_uuid(),
  device_id text unique not null,              -- Android ID duy nhất của máy
  device_name text default 'Thiết bị của con',
  license_key text unique not null,            -- Khóa bản quyền (VD: LCK-8899-AABB)
  license_status license_status_enum default 'pending',
  activated_at timestamp with time zone,
  expired_at timestamp with time zone,         -- Ngày hết hạn (NULL = Vĩnh viễn)
  created_at timestamp with time zone default now(),
  last_sync_at timestamp with time zone default now()
);

-- 3. Bảng chính sách kiểm soát App & Mã PIN
create table public.parental_policies (
  id uuid primary key default gen_random_uuid(),
  device_id text references public.devices(device_id) on delete cascade unique,
  policy_mode text default 'blacklist' check (policy_mode in ('whitelist', 'blacklist')),
  package_list jsonb default '["com.android.settings", "com.google.android.youtube"]'::jsonb,
  parent_pin text default '1234',              -- Mã PIN phụ huynh
  is_emergency_locked boolean default false,  -- Khóa khẩn cấp tức thì
  updated_at timestamp with time zone default now()
);

-- 4. Bảng lập lịch khung giờ sử dụng
create table public.time_schedules (
  id uuid primary key default gen_random_uuid(),
  device_id text references public.devices(device_id) on delete cascade unique,
  is_enabled boolean default true,
  allowed_start_time time default '07:00:00',
  allowed_end_time time default '21:00:00',
  days_of_week int[] default '{1,2,3,4,5,6,7}', -- 1: T2 -> 7: CN
  lock_message text default 'Đã đến giờ nghỉ ngơi hoặc học tập!',
  updated_at timestamp with time zone default now()
);

-- 5. Kích hoạt Realtime
alter publication supabase_realtime add table public.devices;
alter publication supabase_realtime add table public.parental_policies;
alter publication supabase_realtime add table public.time_schedules;
```

---

## 3. CẤU HÌNH DỰ ÁN EXPO (EXPO DEV CLIENT)

### 3.1. Cài đặt các thư viện cần thiết

```bash
# Quản lý Launcher Native
npm install react-native-launcher-kit

# Định danh thiết bị (Lấy Unique ID phần cứng)
npm install react-native-device-info

# Bộ nhớ đệm tốc độ cao (Local Cache)
npx expo install react-native-mmkv

# Kết nối Supabase & Clipboard
npm install @supabase/supabase-js @react-native-async-storage/async-storage expo-clipboard
```

### 3.2. Cấu hình `app.json`

Thêm cấu hình Category Home & Default vào `app.json` để Android nhận diện app là Launcher:

```json
{
  "expo": {
    "name": "Kids Launcher",
    "slug": "kids-launcher",
    "version": "1.0.0",
    "android": {
      "package": "com.kidslauncher.app",
      "intentFilters": [
        {
          "action": "MAIN",
          "category": [
            "HOME",
            "DEFAULT"
          ]
        }
      ]
    },
    "plugins": [
      "react-native-mmkv"
    ]
  }
}
```

---

## 4. TRIỂN KHAI MÃ NGUỒN (SOURCE CODE)

### 4.1. Cấu hình Storage & Supabase Client (`src/services/storage.ts`)

```typescript
import { MMKV } from 'react-native-mmkv';
import { createClient } from '@supabase/supabase-js';

export const storage = new MMKV();

const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const STORAGE_KEYS = {
  DEVICE_ID: 'DEVICE_ID',
  IS_LICENSED: 'IS_LICENSED',
  LICENSE_KEY: 'LICENSE_KEY',
  EXPIRED_AT: 'EXPIRED_AT',
  PARENT_PIN: 'PARENT_PIN',
  POLICY_MODE: 'POLICY_MODE',
  PACKAGE_LIST: 'PACKAGE_LIST',
  SCHEDULE: 'SCHEDULE',
};
```

---

### 4.2. Dịch vụ Bản quyền theo Device ID (`src/services/licenseService.ts`)

```typescript
import DeviceInfo from 'react-native-device-info';
import { supabase, storage, STORAGE_KEYS } from './storage';

export const licenseService = {
  // 1. Lấy Device Unique ID của máy
  async getDeviceUniqueId(): Promise<string> {
    let id = storage.getString(STORAGE_KEYS.DEVICE_ID);
    if (!id) {
      id = await DeviceInfo.getUniqueId();
      storage.set(STORAGE_KEYS.DEVICE_ID, id);
    }
    return id;
  },

  // 2. Kiểm tra bản quyền Local (để mở app tức thì khi offline)
  isLocallyLicensed(): boolean {
    const isLicensed = storage.getBoolean(STORAGE_KEYS.IS_LICENSED) ?? false;
    const expiredAt = storage.getString(STORAGE_KEYS.EXPIRED_AT);

    if (!isLicensed) return false;
    if (expiredAt && new Date(expiredAt) < new Date()) {
      storage.set(STORAGE_KEYS.IS_LICENSED, false);
      return false;
    }
    return true;
  },

  // 3. Kích hoạt License Key lên Supabase
  async activateLicense(licenseKey: string): Promise<{ success: boolean; message: string }> {
    try {
      const deviceId = await this.getDeviceUniqueId();

      // Kiểm tra License Key trên Supabase
      const { data: record, error } = await supabase
        .from('devices')
        .select('*')
        .eq('license_key', licenseKey.trim().toUpperCase())
        .single();

      if (error || !record) {
        return { success: false, message: 'Mã bản quyền không tồn tại!' };
      }

      // Kiểm tra xem Key đã bị gán cho thiết bị khác chưa
      if (record.device_id && record.device_id !== deviceId) {
        return { success: false, message: 'Mã bản quyền này đã được kích hoạt trên thiết bị khác!' };
      }

      // Kiểm tra trạng thái và hạn dùng
      if (record.license_status === 'blocked') {
        return { success: false, message: 'Mã bản quyền này đã bị khóa!' };
      }
      if (record.expired_at && new Date(record.expired_at) < new Date()) {
        return { success: false, message: 'Mã bản quyền này đã hết hạn!' };
      }

      // Cập nhật gán device_id và kích hoạt
      const { error: updateError } = await supabase
        .from('devices')
        .update({
          device_id: deviceId,
          license_status: 'active',
          activated_at: new Date().toISOString(),
          last_sync_at: new Date().toISOString(),
        })
        .eq('id', record.id);

      if (updateError) {
        return { success: false, message: 'Lỗi kích hoạt: ' + updateError.message };
      }

      // Lưu trạng thái thành công vào Local Storage (MMKV)
      storage.set(STORAGE_KEYS.IS_LICENSED, true);
      storage.set(STORAGE_KEYS.LICENSE_KEY, licenseKey);
      if (record.expired_at) {
        storage.set(STORAGE_KEYS.EXPIRED_AT, record.expired_at);
      }

      return { success: true, message: 'Kích hoạt bản quyền thành công!' };
    } catch (err: any) {
      return { success: false, message: 'Lỗi kết nối máy chủ: ' + err.message };
    }
  },
};
```

---

### 4.3. Màn hình Kích hoạt Bản quyền (`src/screens/LicenseActivationScreen.tsx`)

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { licenseService } from '../services/licenseService';

export const LicenseActivationScreen = ({ onActivated }: { onActivated: () => void }) => {
  const [deviceId, setDeviceId] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    licenseService.getDeviceUniqueId().then(setDeviceId);
  }, []);

  const handleCopyDeviceId = async () => {
    await Clipboard.setStringAsync(deviceId);
    Alert.alert('Đã sao chép', 'Đã sao chép Device ID. Hãy gửi mã này cho Quản trị viên để nhận Key.');
  };

  const handleActivate = async () => {
    if (!licenseKey.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập mã bản quyền (License Key)');
      return;
    }

    setLoading(true);
    const result = await licenseService.activateLicense(licenseKey);
    setLoading(false);

    if (result.success) {
      Alert.alert('Thành công', result.message, [{ text: 'Bắt đầu dùng', onPress: onActivated }]);
    } else {
      Alert.alert('Kích hoạt thất bại', result.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🛡️</Text>
      <Text style={styles.title}>Kích hoạt Bản quyền Launcher</Text>
      <Text style={styles.subtitle}>Ứng dụng yêu cầu bản quyền để tiếp tục sử dụng</Text>

      {/* Box hiển thị Device ID */}
      <View style={styles.deviceBox}>
        <Text style={styles.deviceLabel}>Mã định danh thiết bị (Device ID):</Text>
        <Text style={styles.deviceIdText} numberOfLines={1}>{deviceId}</Text>
        <TouchableOpacity style={styles.copyBtn} onPress={handleCopyDeviceId}>
          <Text style={styles.copyBtnText}>📋 Sao chép Device ID</Text>
        </TouchableOpacity>
      </View>

      {/* Input nhập License Key */}
      <TextInput
        style={styles.input}
        placeholder="Nhập mã bản quyền (VD: LCK-XXXX-YYYY)"
        value={licenseKey}
        onChangeText={setLicenseKey}
        autoCapitalize="characters"
      />

      <TouchableOpacity style={styles.activateBtn} onPress={handleActivate} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.activateText}>KÍCH HOẠT NGAY</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 24, justifyContent: 'center', alignItems: 'center' },
  icon: { fontSize: 50, marginBottom: 12 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginBottom: 6 },
  subtitle: { fontSize: 13, color: '#64748b', marginBottom: 24, textAlign: 'center' },
  deviceBox: { width: '100%', backgroundColor: '#e2e8f0', borderRadius: 10, padding: 14, marginBottom: 20 },
  deviceLabel: { fontSize: 12, color: '#475569', fontWeight: '600' },
  deviceIdText: { fontSize: 13, color: '#0f172a', fontWeight: 'bold', marginVertical: 6 },
  copyBtn: { alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 8, backgroundColor: '#cbd5e1', borderRadius: 6 },
  copyBtnText: { fontSize: 12, color: '#1e293b', fontWeight: '600' },
  input: { width: '100%', borderWidth: 1, borderColor: '#cbd5e1', backgroundColor: '#fff', borderRadius: 10, padding: 14, fontSize: 15, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  activateBtn: { width: '100%', backgroundColor: '#2563eb', padding: 16, borderRadius: 10, alignItems: 'center' },
  activateText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
```

---

### 4.4. Kiểm tra Giờ học / Giờ ngủ (`src/services/timeScheduler.ts`)

```typescript
export interface ScheduleConfig {
  isEnabled: boolean;
  allowedStartTime: string; // "07:00:00"
  allowedEndTime: string;   // "21:00:00"
  daysOfWeek: number[];     // [1, 2, 3, 4, 5, 6, 7]
  lockMessage: string;
}

export const checkIsOutsideAllowedHours = (schedule: ScheduleConfig): { isBlocked: boolean; message: string } => {
  if (!schedule.isEnabled) return { isBlocked: false, message: '' };

  const now = new Date();
  const currentDay = now.getDay() === 0 ? 7 : now.getDay(); // 1 (T2) -> 7 (CN)

  if (!schedule.daysOfWeek.includes(currentDay)) {
    return { isBlocked: true, message: 'Hôm nay không thuộc ngày được phép sử dụng thiết bị.' };
  }

  const [startH, startM] = schedule.allowedStartTime.split(':').map(Number);
  const [endH, endM] = schedule.allowedEndTime.split(':').map(Number);

  const start = new Date();
  start.setHours(startH, startM, 0, 0);

  const end = new Date();
  end.setHours(endH, endM, 0, 0);

  if (now < start || now > end) {
    return {
      isBlocked: true,
      message: schedule.lockMessage || `Chỉ được phép sử dụng từ ${schedule.allowedStartTime.slice(0, 5)} đến ${schedule.allowedEndTime.slice(0, 5)}`,
    };
  }

  return { isBlocked: false, message: '' };
};
```

---

### 4.5. Màn hình Launcher Chính (`src/screens/KidsLauncherScreen.tsx`)

```typescript
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { InstalledApps, RNLauncherKitHelper } from 'react-native-launcher-kit';
import type { AppDetail } from 'react-native-launcher-kit/src/interfaces/InstalledApps';
import { storage, STORAGE_KEYS } from '../services/storage';
import { checkIsOutsideAllowedHours, ScheduleConfig } from '../services/timeScheduler';

export const KidsLauncherScreen = () => {
  const [apps, setApps] = useState<AppDetail[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [lockReason, setLockReason] = useState('');
  
  // Modal PIN
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinAction, setPinAction] = useState<'unlock_temp' | 'open_settings'>('open_settings');

  // 1. Tải và lọc App
  const loadFilteredApps = async () => {
    try {
      const allApps = await InstalledApps.getSortedApps();
      const rawPackages = storage.getString(STORAGE_KEYS.PACKAGE_LIST) || '["com.android.settings"]';
      const blockedPackages: string[] = JSON.parse(rawPackages);
      const mode = storage.getString(STORAGE_KEYS.POLICY_MODE) || 'blacklist';

      const filtered = allApps.filter((app) => {
        if (mode === 'whitelist') {
          return blockedPackages.includes(app.packageName);
        }
        return !blockedPackages.includes(app.packageName);
      });

      setApps(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  // 2. Đặt Default Launcher
  const setupDefaultLauncher = async () => {
    const isDefault = await RNLauncherKitHelper.checkIfDefaultLauncher();
    if (!isDefault) {
      RNLauncherKitHelper.requestSetDefaultLauncher();
    }
  };

  // 3. Kiểm tra khung giờ
  const evaluateSchedule = () => {
    const rawSchedule = storage.getString(STORAGE_KEYS.SCHEDULE);
    const schedule: ScheduleConfig = rawSchedule
      ? JSON.parse(rawSchedule)
      : {
          isEnabled: true,
          allowedStartTime: '07:00:00',
          allowedEndTime: '21:00:00',
          daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
          lockMessage: 'Đã đến giờ đi ngủ hoặc học bài!',
        };

    const status = checkIsOutsideAllowedHours(schedule);
    setIsLocked(status.isBlocked);
    setLockReason(status.message);
  };

  useEffect(() => {
    setupDefaultLauncher();
    loadFilteredApps();
    evaluateSchedule();

    const interval = setInterval(evaluateSchedule, 30000);
    InstalledApps.startListeningForAppInstallations(() => loadFilteredApps());
    InstalledApps.startListeningForAppRemovals(() => loadFilteredApps());

    return () => {
      clearInterval(interval);
      InstalledApps.stopListeningForAppInstallations();
      InstalledApps.stopListeningForAppRemovals();
    };
  }, []);

  const handleLaunch = (pkgName: string) => {
    if (isLocked) {
      Alert.alert('Đang bị khóa', lockReason);
      return;
    }
    RNLauncherKitHelper.launchApplication(pkgName);
  };

  const handleVerifyPin = () => {
    const savedPin = storage.getString(STORAGE_KEYS.PARENT_PIN) || '1234';
    if (pinInput === savedPin) {
      setShowPinModal(false);
      setPinInput('');
      if (pinAction === 'unlock_temp') {
        setIsLocked(false);
        Alert.alert('Thành công', 'Đã mở khóa tạm thời!');
      } else {
        Alert.alert('Cài đặt', 'Mở màn hình Cài đặt của Phụ huynh');
      }
    } else {
      Alert.alert('Lỗi', 'Mã PIN phụ huynh không chính xác!');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Màn hình của Bé</Text>
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => {
            setPinAction('open_settings');
            setShowPinModal(true);
          }}
        >
          <Text style={styles.settingsText}>⚙️ Phụ huynh</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={apps}
        numColumns={4}
        keyExtractor={(item) => item.packageName}
        contentContainerStyle={styles.appList}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.appItem} onPress={() => handleLaunch(item.packageName)}>
            <Image source={{ uri: `data:image/png;base64,${item.icon}` }} style={styles.appIcon} />
            <Text style={styles.appLabel} numberOfLines={1}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {isLocked && (
        <View style={styles.lockOverlay}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.lockTitle}>Thiết bị đang tạm khóa</Text>
          <Text style={styles.lockSubtitle}>{lockReason}</Text>
          <TouchableOpacity
            style={styles.parentUnlockBtn}
            onPress={() => {
              setPinAction('unlock_temp');
              setShowPinModal(true);
            }}
          >
            <Text style={styles.parentUnlockText}>Mở khóa bằng mã PIN</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal nhập PIN */}
      <Modal visible={showPinModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Nhập mã PIN Phụ huynh</Text>
            <TextInput
              style={styles.pinInput}
              keyboardType="numeric"
              secureTextEntry
              maxLength={6}
              value={pinInput}
              onChangeText={setPinInput}
              placeholder="••••"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setShowPinModal(false)}>
                <Text>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.confirmBtn]} onPress={handleVerifyPin}>
                <Text style={{ color: '#fff' }}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8', paddingTop: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' },
  settingsBtn: { padding: 8, backgroundColor: '#e2e8f0', borderRadius: 8 },
  settingsText: { fontSize: 13, fontWeight: '600', color: '#334155' },
  appList: { padding: 16, alignItems: 'center' },
  appItem: { width: 75, alignItems: 'center', margin: 8 },
  appIcon: { width: 52, height: 52, borderRadius: 12 },
  appLabel: { fontSize: 11, marginTop: 4, textAlign: 'center', color: '#334155' },
  lockOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15, 23, 42, 0.96)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  lockIcon: { fontSize: 60, marginBottom: 16 },
  lockTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  lockSubtitle: { fontSize: 14, color: '#94a3b8', textAlign: 'center', marginBottom: 24 },
  parentUnlockBtn: { paddingVertical: 12, paddingHorizontal: 24, backgroundColor: '#3b82f6', borderRadius: 8 },
  parentUnlockText: { color: '#fff', fontWeight: 'bold' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { width: 280, backgroundColor: '#fff', borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  pinInput: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, textAlign: 'center', fontSize: 24, padding: 8, letterSpacing: 8 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  modalBtn: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center', marginHorizontal: 4 },
  cancelBtn: { backgroundColor: '#e2e8f0' },
  confirmBtn: { backgroundColor: '#3b82f6' },
});
```

---

### 4.6. Điều phối luồng khởi động (`App.tsx`)

```typescript
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { licenseService } from './src/services/licenseService';
import { LicenseActivationScreen } from './src/screens/LicenseActivationScreen';
import { KidsLauncherScreen } from './src/screens/KidsLauncherScreen';

export default function App() {
  const [checking, setChecking] = useState(true);
  const [isLicensed, setIsLicensed] = useState(false);

  useEffect(() => {
    const licensed = licenseService.isLocallyLicensed();
    setIsLicensed(licensed);
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!isLicensed) {
    return <LicenseActivationScreen onActivated={() => setIsLicensed(true)} />;
  }

  return <KidsLauncherScreen />;
}
```

---

## 5. HƯỚNG DẪN KIỂM THỬ (TESTING CHECKLIST)

| STT | Kịch bản kiểm thử | Kết quả mong đợi |
| :---: | :--- | :--- |
| **1** | Mở app lần đầu (Chưa kích hoạt) | Hiện màn hình Kích hoạt, hiển thị đúng **Device ID phần cứng**, có nút Copy. |
| **2** | Nhập sai Key hoặc Key đã dùng trên máy khác | Supabase báo lỗi từ chối, không cho vào Launcher. |
| **3** | Nhập đúng License Key được cấp | Kích hoạt thành công, lưu trạng thái vào MMKV và tự động chuyển sang Màn hình Launcher. |
| **4** | Tắt mạng (Offline test) và mở lại app | Ứng dụng vẫn nhận diện bản quyền từ bộ nhớ đệm (MMKV) và mở ngay lập tức không bị đơ. |
| **5** | Kiểm tra nút Home & Ẩn app | Nút Home luôn về Launcher, các app trong danh sách Blacklist bị ẩn hoàn toàn. |
| **6** | Test giờ học / Giờ ngủ | Ngoài giờ quy định hiển thị màn hình khóa; nhập đúng mã PIN `1234` mở khóa thành công. |
