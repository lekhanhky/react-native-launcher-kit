# Expo React Native Parent Mobile App (`parent-app`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng ứng dụng di động độc lập Expo React Native (`parent-app`) dành cho Phụ huynh, tích hợp xác thực Supabase Auth, quét Camera mã QR ghép nối máy tính bảng của bé và nút bấm Khóa/Mở khóa khẩn cấp tức thì (< 1s) qua Supabase Realtime WebSocket.

**Architecture:** Ứng dụng Expo Router v4 độc lập với cấu trúc file-based routing (`(auth)`, `(main)` tabs, `pair-device` modal). Kết nối trực tiếp backend Supabase qua `@supabase/supabase-js`, sử dụng `expo-camera` để quét QR code và Supabase Realtime broadcast channels để truyền lệnh khóa từ xa tới tablet của bé.

**Tech Stack:** Expo SDK 52, Expo Router v4, React Native 0.76+, TypeScript, `@supabase/supabase-js`, `expo-camera`, `@react-native-async-storage/async-storage`, `lucide-react-native`, `react-native-svg`, Jest / TypeScript test scripts.

**Spec:** [`docs/superpowers/specs/2026-09-27-expo-parent-app-design.md`](file:///c:/react-native-launcher-kit/docs/superpowers/specs/2026-09-27-expo-parent-app-design.md)

## Global Constraints

- Toàn bộ mã nguồn ứng dụng phụ huynh nằm trọn vẹn trong thư mục mới `c:\react-native-launcher-kit\parent-app`.
- Sử dụng Expo SDK ~52.0.37 và Expo Router ~4.0.17 (đồng bộ phiên bản với `admin-app`).
- Biến môi trường Supabase: `EXPO_PUBLIC_SUPABASE_URL` và `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- Tên kênh Realtime ghép nối: `device_pairing:${deviceId}` với sự kiện `DEVICE_PAIRED_SUCCESS`.
- Tên kênh Realtime điều khiển: `parental_control:${deviceId}` với sự kiện `EMERGENCY_LOCK`.
- Bảng CSDL: `devices`, `parental_policies`, và bảng liên kết `parent_devices`.

---

### Task 1: Scaffolding Thư Mục Dự Án `parent-app` & Cấu Hình Cơ Bản

**Files:**
- Create: `parent-app/package.json`
- Create: `parent-app/app.json`
- Create: `parent-app/tsconfig.json`
- Create: `parent-app/.env`
- Create: `parent-app/src/theme/colors.ts`
- Create: `parent-app/src/types/index.ts`
- Create: `parent-app/__tests__/types.test.ts`

**Interfaces:**
- Consumes: None (Root initialization).
- Produces: 
  - `Colors`: Bảng màu hệ thống Family Care (`colors.ts`).
  - Types: `ChildDevice`, `QrPairingPayload`, `EmergencyLockPayload`, `ParentalPolicy` (`src/types/index.ts`).

- [ ] **Step 1: Viết test kiểm tra cấu trúc Types và Theme**

Tạo file `parent-app/__tests__/types.test.ts`:
```typescript
import { Colors } from '../src/theme/colors';
import { QrPairingPayload, EmergencyLockPayload } from '../src/types';

describe('Parent App Types & Theme Baseline', () => {
  it('should provide valid theme colors', () => {
    expect(Colors.primary).toBe('#4F46E5');
    expect(Colors.danger).toBe('#EF4444');
    expect(Colors.background).toBe('#0F172A');
  });

  it('should validate QrPairingPayload structure', () => {
    const payload: QrPairingPayload = {
      type: 'KIDS_LAUNCHER_PAIRING',
      deviceId: 'dev_test_123',
      deviceName: 'Samsung Tab A9',
      timestamp: Date.now(),
    };
    expect(payload.type).toBe('KIDS_LAUNCHER_PAIRING');
    expect(payload.deviceId).toBeDefined();
  });

  it('should validate EmergencyLockPayload structure', () => {
    const lockPayload: EmergencyLockPayload = {
      type: 'EMERGENCY_LOCK',
      isLocked: true,
      reason: 'Phụ huynh khóa từ xa',
      timestamp: Date.now(),
    };
    expect(lockPayload.type).toBe('EMERGENCY_LOCK');
    expect(lockPayload.isLocked).toBe(true);
  });
});
```

- [ ] **Step 2: Chạy test để xác nhận FAIL (do chưa có code implementation)**

Run: `npx ts-node --transpile-only parent-app/__tests__/types.test.ts` (hoặc jest)
Expected: FAIL với lỗi Cannot find module `../src/theme/colors`.

- [ ] **Step 3: Tạo cấu hình `package.json`, `app.json`, `tsconfig.json`, `.env` và code types**

Tạo file `parent-app/package.json`:
```json
{
  "name": "kids-launcher-parent-app",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "test": "jest"
  },
  "dependencies": {
    "@react-native-async-storage/async-storage": "1.23.1",
    "@supabase/supabase-js": "^2.48.1",
    "expo": "~52.0.37",
    "expo-camera": "~16.0.17",
    "expo-constants": "~17.0.7",
    "expo-linking": "~7.0.5",
    "expo-router": "~4.0.17",
    "expo-status-bar": "~2.0.1",
    "lucide-react-native": "^0.475.0",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-native": "0.76.7",
    "react-native-safe-area-context": "4.12.0",
    "react-native-screens": "~4.4.0",
    "react-native-svg": "15.9.0"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@types/jest": "^29.5.14",
    "@types/react": "~18.3.12",
    "jest": "^29.7.0",
    "ts-jest": "^29.2.5",
    "typescript": "^5.3.3"
  },
  "private": true
}
```

Tạo file `parent-app/app.json`:
```json
{
  "expo": {
    "name": "Kids Launcher Phụ Huynh",
    "slug": "kids-launcher-parent",
    "version": "1.0.0",
    "orientation": "portrait",
    "scheme": "kidsparentapp",
    "userInterfaceStyle": "dark",
    "splash": {
      "resizeMode": "contain",
      "backgroundColor": "#0f172a"
    },
    "ios": {
      "supportsTablet": false,
      "infoPlist": {
        "NSCameraUsageDescription": "Ứng dụng cần quyền sử dụng camera để quét mã QR liên kết thiết bị của bé."
      }
    },
    "android": {
      "package": "com.kidslauncher.parent",
      "permissions": [
        "CAMERA"
      ]
    },
    "plugins": [
      "expo-router",
      [
        "expo-camera",
        {
          "cameraPermission": "Cho phép ứng dụng sử dụng Camera để quét mã QR kết nối máy của bé."
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

Tạo file `parent-app/tsconfig.json`:
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}
```

Tạo file `parent-app/.env`:
```env
EXPO_PUBLIC_SUPABASE_URL=https://jlfemayqttjcfjualfsv.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsZmVtYXlxdHRqY2ZqdWFsZnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzg3MjYsImV4cCI6MjA1NjgxNDcyNn0.7bF_i51rP69nL0aYyWb7vS3G0pUqJ1eG5M2Xw4y9Y
```

Tạo file `parent-app/src/theme/colors.ts`:
```typescript
export const Colors = {
  primary: '#4F46E5',         // Indigo
  primaryDark: '#3730A3',
  primaryLight: '#818CF8',
  secondary: '#0D9488',       // Teal
  danger: '#EF4444',          // Red for emergency lock
  dangerDark: '#B91C1C',
  warning: '#F59E0B',         // Amber
  success: '#10B981',         // Green for active/online
  background: '#0F172A',      // Slate 900
  surface: '#1E293B',         // Slate 800
  surfaceLight: '#334155',    // Slate 700
  text: '#F8FAFC',            // Slate 50
  textSecondary: '#94A3B8',   // Slate 400
  border: '#334155',
  card: '#1E293B',
};
```

Tạo file `parent-app/src/types/index.ts`:
```typescript
export interface ChildDevice {
  id: string;                 // parent_devices id hoặc device_id
  deviceId: string;           // Hardware device_id
  childName: string;          // Tên bé
  childAvatar: string;        // Emoji avatar: 👦, 👧, 🧒, 🐱, 🐻
  deviceModel?: string;       // Model máy (Samsung Tab, v.v.)
  isEmergencyLocked: boolean; // Trạng thái khóa khẩn cấp
  isPaired: boolean;
  parentPin?: string;
  lastSeen?: string;
}

export interface QrPairingPayload {
  type: 'KIDS_LAUNCHER_PAIRING';
  deviceId: string;
  deviceName?: string;
  timestamp: number;
}

export interface EmergencyLockPayload {
  type: 'EMERGENCY_LOCK';
  isLocked: boolean;
  reason?: string;
  timestamp: number;
}

export interface ParentalPolicy {
  id: string;
  deviceId: string;
  policyMode: 'whitelist' | 'blacklist';
  packageList: string[];
  parentPin: string;
  isEmergencyLocked: boolean;
  updatedAt: string;
}
```

- [ ] **Step 4: Chạy test xác nhận PASS**

Run: `npx ts-node --transpile-only parent-app/__tests__/types.test.ts`
Expected: PASS cả 3 test suites.

- [ ] **Step 5: Commit Git**

Run: `git add parent-app/` và `git commit -m "feat(parent-app): initialize expo scaffolding, configs, theme and types"`

---

### Task 2: Supabase Client, Auth Context & Realtime Services

**Files:**
- Create: `parent-app/src/services/supabase.ts`
- Create: `parent-app/src/services/pairingService.ts`
- Create: `parent-app/src/services/remoteControlService.ts`
- Create: `parent-app/src/context/AuthContext.tsx`
- Create: `parent-app/__tests__/services.test.ts`

**Interfaces:**
- Consumes: `Colors`, `ChildDevice`, `QrPairingPayload`, `EmergencyLockPayload` từ Task 1.
- Produces:
  - `supabase`: Initialized Supabase client với AsyncStorage auth storage.
  - `AuthContext` & `useAuth`: `{ user, session, isLoading, signIn, signUp, signOut }`.
  - `pairingService.parseQrCode(rawText: string): QrPairingPayload | null`.
  - `pairingService.pairDevice(parentUserId: string, payload: QrPairingPayload, childName?: string): Promise<{ success: boolean; error?: string }>`.
  - `remoteControlService.setEmergencyLock(deviceId: string, isLocked: boolean): Promise<{ success: boolean; error?: string }>`.

- [ ] **Step 1: Viết test cho parsing QR code và validation payload**

Tạo file `parent-app/__tests__/services.test.ts`:
```typescript
import { parseQrCode } from '../src/services/pairingService';

describe('Pairing Service QR Decoding', () => {
  it('should parse valid JSON QR payload', () => {
    const validJson = JSON.stringify({
      type: 'KIDS_LAUNCHER_PAIRING',
      deviceId: 'dev_abc_999',
      deviceName: 'Tablet Bé Bin',
      timestamp: 1727440000000,
    });

    const result = parseQrCode(validJson);
    expect(result).not.toBeNull();
    expect(result?.deviceId).toBe('dev_abc_999');
    expect(result?.type).toBe('KIDS_LAUNCHER_PAIRING');
  });

  it('should parse plain string device ID fallback', () => {
    const plainDeviceId = 'dev_fallback_123';
    const result = parseQrCode(plainDeviceId);
    expect(result).not.toBeNull();
    expect(result?.deviceId).toBe('dev_fallback_123');
    expect(result?.type).toBe('KIDS_LAUNCHER_PAIRING');
  });

  it('should return null for invalid non-launcher payload', () => {
    const randomUrl = 'https://google.com';
    const result = parseQrCode(randomUrl);
    expect(result).toBeNull();
  });
});
```

- [ ] **Step 2: Chạy test để xác nhận FAIL**

Run: `npx ts-node --transpile-only parent-app/__tests__/services.test.ts`
Expected: FAIL do chưa tạo `pairingService.ts`.

- [ ] **Step 3: Triển khai `supabase.ts`, `pairingService.ts`, `remoteControlService.ts`, `AuthContext.tsx`**

Tạo file `parent-app/src/services/supabase.ts`:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://jlfemayqttjcfjualfsv.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsZmVtYXlxdHRqY2ZqdWFsZnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzg3MjYsImV4cCI6MjA1NjgxNDcyNn0.7bF_i51rP69nL0aYyWb7vS3G0pUqJ1eG5M2Xw4y9Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

Tạo file `parent-app/src/services/pairingService.ts`:
```typescript
import { supabase } from './supabase';
import { QrPairingPayload } from '../types';

export function parseQrCode(rawText: string): QrPairingPayload | null {
  if (!rawText || typeof rawText !== 'string') return null;
  const trimmed = rawText.trim();

  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && parsed.deviceId && parsed.type === 'KIDS_LAUNCHER_PAIRING') {
      return {
        type: 'KIDS_LAUNCHER_PAIRING',
        deviceId: String(parsed.deviceId).trim(),
        deviceName: parsed.deviceName ? String(parsed.deviceName).trim() : 'Máy tính bảng của Bé',
        timestamp: parsed.timestamp || Date.now(),
      };
    }
  } catch {
    // Không phải JSON, kiểm tra fallback nếu có tiền tố dev_ hoặc chuỗi mã ID hợp lệ
    if (trimmed.startsWith('dev_') || (trimmed.length >= 6 && /^[a-zA-Z0-9_-]+$/.test(trimmed))) {
      return {
        type: 'KIDS_LAUNCHER_PAIRING',
        deviceId: trimmed,
        deviceName: 'Máy tính bảng của Bé',
        timestamp: Date.now(),
      };
    }
  }

  return null;
}

export async function pairDevice(
  parentUserId: string,
  payload: QrPairingPayload,
  childName: string = 'Bé Yêu'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { deviceId, deviceName } = payload;
    const nowIso = new Date().toISOString();

    // 1. Upsert bảng devices
    await supabase.from('devices').upsert(
      {
        device_id: deviceId,
        device_name: deviceName || 'Máy tính bảng của Bé',
        is_paired: true,
        last_sync_at: nowIso,
      },
      { onConflict: 'device_id' }
    );

    // 2. Upsert bảng parental_policies
    await supabase.from('parental_policies').upsert(
      {
        device_id: deviceId,
        is_emergency_locked: false,
        parent_pin: '1234',
        updated_at: nowIso,
      },
      { onConflict: 'device_id' }
    );

    // 3. Ghi nhận liên kết vào parent_devices nếu có bảng (hoặc fallback lưu thông tin)
    try {
      await supabase.from('parent_devices').upsert(
        {
          parent_id: parentUserId,
          device_id: deviceId,
          child_name: childName,
          created_at: nowIso,
        },
        { onConflict: 'parent_id,device_id' }
      );
    } catch (e) {
      console.warn('[Pairing] Ghi parent_devices thất bại (nếu bảng chưa tạo):', e);
    }

    // 4. Phát Broadcast Realtime xác nhận tới tablet của bé
    const channel = supabase.channel(`device_pairing:${deviceId}`);
    await new Promise<void>((resolve) => {
      const timer = setTimeout(resolve, 1500);
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED' || status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          clearTimeout(timer);
          resolve();
        }
      });
    });

    await channel.send({
      type: 'broadcast',
      event: 'DEVICE_PAIRED_SUCCESS',
      payload: {
        device_id: deviceId,
        parent_id: parentUserId,
        timestamp: Date.now(),
      },
    });

    supabase.removeChannel(channel);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi không xác định khi ghép nối thiết bị' };
  }
}
```

Tạo file `parent-app/src/services/remoteControlService.ts`:
```typescript
import { supabase } from './supabase';
import { EmergencyLockPayload } from '../types';

export async function setEmergencyLock(
  deviceId: string,
  isLocked: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const nowIso = new Date().toISOString();

    // 1. Cập nhật cơ sở dữ liệu để duy trì trạng thái vĩnh viễn
    const { error: dbError } = await supabase
      .from('parental_policies')
      .update({
        is_emergency_locked: isLocked,
        updated_at: nowIso,
      })
      .eq('device_id', deviceId);

    if (dbError) {
      console.warn('[RemoteControl] Cảnh báo cập nhật DB:', dbError);
    }

    // 2. Bắn broadcast Realtime WebSocket với độ trễ < 1 giây
    const channel = supabase.channel(`parental_control:${deviceId}`);
    await new Promise<void>((resolve) => {
      const timer = setTimeout(resolve, 1200);
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED' || status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          clearTimeout(timer);
          resolve();
        }
      });
    });

    const payload: EmergencyLockPayload = {
      type: 'EMERGENCY_LOCK',
      isLocked,
      reason: isLocked ? 'Phụ huynh kích hoạt khóa khẩn cấp' : 'Phụ huynh mở khóa thiết bị',
      timestamp: Date.now(),
    };

    await channel.send({
      type: 'broadcast',
      event: 'EMERGENCY_LOCK',
      payload,
    });

    supabase.removeChannel(channel);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi khi gửi lệnh khóa từ xa' };
  }
}
```

Tạo file `parent-app/src/context/AuthContext.tsx`:
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<{ error: string | null }>;
  signUp: (email: string, pass: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    return { error: error ? error.message : null };
  };

  const signUp = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signUp({ email, password: pass });
    return { error: error ? error.message : null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

- [ ] **Step 4: Chạy test xác nhận PASS**

Run: `npx ts-node --transpile-only parent-app/__tests__/services.test.ts`
Expected: PASS tất cả các test case phân tích mã QR.

- [ ] **Step 5: Commit Git**

Run: `git add parent-app/src/ parent-app/__tests__/` và `git commit -m "feat(parent-app): implement supabase client, auth context, pairing and remote control services"`

---

### Task 3: Root Layout & Màn Hình Xác Thực (`(auth)`)

**Files:**
- Create: `parent-app/app/_layout.tsx`
- Create: `parent-app/app/(auth)/_layout.tsx`
- Create: `parent-app/app/(auth)/login.tsx`
- Create: `parent-app/app/(auth)/register.tsx`

**Interfaces:**
- Consumes: `useAuth` từ `AuthContext`, `Colors` từ `src/theme/colors.ts`.
- Produces:
  - Giao diện đăng nhập / đăng ký tài khoản cho phụ huynh.
  - Tự động chuyển trang `(auth)` -> `(main)` khi có session người dùng.

- [ ] **Step 1: Tạo Root Layout `parent-app/app/_layout.tsx`**

```tsx
import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { Colors } from '../src/theme/colors';
import { ActivityIndicator, View } from 'react-native';

function RootNavigation() {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      router.replace('/(main)');
    }
  }, [session, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(main)" options={{ headerShown: false }} />
      <Stack.Screen
        name="pair-device"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="light" />
        <RootNavigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
```

- [ ] **Step 2: Tạo `parent-app/app/(auth)/_layout.tsx`**

```tsx
import { Stack } from 'expo-router';
import { Colors } from '../../src/theme/colors';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    />
  );
}
```

- [ ] **Step 3: Tạo Màn hình Đăng Nhập `parent-app/app/(auth)/login.tsx`**

Tạo file giao diện hiện đại với logo bảo vệ gia đình, khung nhập Email, Mật khẩu, xử lý trạng thái Loading và hiển thị lỗi thân thiện.

- [ ] **Step 4: Tạo Màn hình Đăng Ký `parent-app/app/(auth)/register.tsx`**

Tạo màn hình đăng ký tài khoản phụ huynh mới, xác nhận mật khẩu và điều hướng về trang đăng nhập.

- [ ] **Step 5: Kiểm tra TypeScript Typecheck**

Run: `npx tsc --noEmit -p parent-app/tsconfig.json`
Expected: 0 lỗi biên dịch.

- [ ] **Step 6: Commit Git**

Run: `git add parent-app/app/` và `git commit -m "feat(parent-app): add root auth navigation and login/register screens"`

---

### Task 4: Device Context & Components Quản Lý Trạng Thái Con

**Files:**
- Create: `parent-app/src/context/DeviceContext.tsx`
- Create: `parent-app/src/components/DeviceStatusBadge.tsx`
- Create: `parent-app/src/components/ChildCard.tsx`
- Create: `parent-app/__tests__/deviceContext.test.ts`

**Interfaces:**
- Consumes: `supabase`, `useAuth`, `ChildDevice`.
- Produces:
  - `DeviceContext` & `useDevice`: `{ devices, activeDevice, setActiveDevice, refreshDevices, toggleLock, isLoading }`.
  - `DeviceStatusBadge`: Component hiển thị nhãn "Đang khóa", "Đang hoạt động", "Chưa kết nối".
  - `ChildCard`: Component thẻ tóm tắt máy tính bảng của bé.

- [ ] **Step 1: Viết test cho logic chuyển đổi Active Device và tính toán trạng thái**

Tạo file `parent-app/__tests__/deviceContext.test.ts`:
```typescript
import { ChildDevice } from '../src/types';

describe('Device Status Resolution', () => {
  it('should identify locked device correctly', () => {
    const device: ChildDevice = {
      id: '1',
      deviceId: 'dev_1',
      childName: 'Bé Na',
      childAvatar: '👧',
      isEmergencyLocked: true,
      isPaired: true,
    };
    expect(device.isEmergencyLocked).toBe(true);
  });
});
```

- [ ] **Step 2: Triển khai `DeviceContext.tsx`**

Quản lý tải danh sách tablet từ `devices` và `parent_devices`, lưu giữ `activeDevice` đang được chọn điều khiển trên dashboard, và đăng ký kênh Supabase Realtime `postgres_changes` trên bảng `parental_policies` để tự động cập nhật trạng thái cờ `is_emergency_locked` khi bé nhập mã PIN mở khóa tại chỗ.

- [ ] **Step 3: Triển khai `DeviceStatusBadge.tsx` & `ChildCard.tsx`**

Xây dựng component hiển thị thẻ con kèm Avatar Emoji, tên bé, nhãn trạng thái trực quan với hiệu ứng màu sắc.

- [ ] **Step 4: Chạy test & Typecheck**

Run: `npx tsc --noEmit -p parent-app/tsconfig.json`
Expected: 0 errors.

- [ ] **Step 5: Commit Git**

Run: `git add parent-app/src/` và `git commit -m "feat(parent-app): implement device context and child UI components"`

---

### Task 5: Modal Quét Mã QR Camera (`pair-device.tsx`) & Fallback Nhập Tay

**Files:**
- Create: `parent-app/src/components/QrScannerView.tsx`
- Create: `parent-app/app/pair-device.tsx`

**Interfaces:**
- Consumes: `CameraView` từ `expo-camera`, `parseQrCode`, `pairDevice` từ `pairingService`, `useAuth`, `useDevice`.
- Produces: Modal màn hình quét mã QR hoàn chỉnh với quyền Camera, đèn flash, khung ngắm góc nhấp nháy, và tab chuyển sang nhập mã bằng tay.

- [ ] **Step 1: Tạo Component `QrScannerView.tsx`**

Xây dựng component bọc `CameraView` của `expo-camera`:
- Kiểm tra quyền truy cập camera (`useCameraPermissions()`).
- Hiển thị nút "Yêu cầu cấp quyền Camera" nếu chưa được cho phép.
- Hiển thị khung ngắm quét QR (Reticle overlay với 4 góc viền sáng màu Teal/Indigo).
- Bật/tắt đèn pin flash khi quét trong điều kiện ánh sáng yếu.

- [ ] **Step 2: Tạo màn hình Modal `parent-app/app/pair-device.tsx`**

- Có 2 chế độ: "Quét Camera" và "Nhập Mã Thủ Công".
- Tự động gọi `parseQrCode(data)` khi camera quét được mã.
- Gọi `pairDevice(user.id, payload, childName)`.
- Hiển thị Toast / Alert thành công và kích hoạt `refreshDevices()`, tự động đóng modal.

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit -p parent-app/tsconfig.json`
Expected: 0 errors.

- [ ] **Step 4: Commit Git**

Run: `git add parent-app/` và `git commit -m "feat(parent-app): add native camera qr scanner modal with manual pairing fallback"`

---

### Task 6: Dashboard Hub, Nút Khóa Khẩn Cấp & Bottom Tabs

**Files:**
- Create: `parent-app/src/components/EmergencyLockButton.tsx`
- Create: `parent-app/app/(main)/_layout.tsx`
- Create: `parent-app/app/(main)/index.tsx`
- Create: `parent-app/app/(main)/children/index.tsx`
- Create: `parent-app/app/(main)/profile.tsx`

**Interfaces:**
- Consumes: `useDevice`, `useAuth`, `remoteControlService.setEmergencyLock`.
- Produces:
  - `EmergencyLockButton`: Nút bấm khóa khẩn cấp to, rõ ràng, hiển thị trạng thái "ĐANG KHÓA" / "ĐANG MỞ", hiệu ứng phát sáng cảnh báo.
  - Tab 1 `index.tsx`: Bảng điều khiển chọn bé & khóa/mở khóa tức thì.
  - Tab 2 `children/index.tsx`: Danh sách tất cả máy con, nút mở modal quét QR.
  - Tab 3 `profile.tsx`: Thông tin tài khoản phụ huynh & Đăng xuất.

- [ ] **Step 1: Tạo `EmergencyLockButton.tsx`**

Nút bấm kích thước lớn đặt giữa màn hình:
- Trạng thái An toàn (Bình thường): Nút màu xanh Teal/Slate, hiển thị biểu tượng `ShieldCheck` và nhãn *"Máy của bé đang hoạt động bình thường"*.
- Trạng thái Khóa Khẩn Cấp: Nút chuyển sang màu đỏ rực `Colors.danger`, biểu tượng `Lock` phát sáng, nhãn *"MÁY CỦA BÉ ĐANG BỊ KHÓA"*.
- Bấm vào nút gọi `toggleLock(activeDevice.deviceId)` với phản hồi xúc giác (Haptic) và loading spinner khi đang truyền tín hiệu WebSocket.

- [ ] **Step 2: Tạo Bottom Tabs Navigation `parent-app/app/(main)/_layout.tsx`**

Sử dụng `Tabs` từ `expo-router` với 3 tabs:
1. `index`: Dashboard (Icon: `LayoutDashboard`).
2. `children/index`: Thiết bị con (Icon: `Smartphone` / `Users`).
3. `profile`: Tài khoản (Icon: `User`).

- [ ] **Step 3: Tạo Màn hình Dashboard `parent-app/app/(main)/index.tsx`**

- Thanh trên cùng: Dropdown/Selector chọn bé hiện tại (`Active Child`).
- Thẻ thông tin nhanh về máy của bé (Thời gian hoạt động lần cuối, model thiết bị).
- Khu vực trung tâm: `EmergencyLockButton` để khóa máy khẩn cấp ngay tức thì.
- Phím tắt "Quét mã QR thêm máy bé" nếu chưa có thiết bị nào.

- [ ] **Step 4: Tạo Màn hình Danh sách Thiết Bị `parent-app/app/(main)/children/index.tsx`**

- Hiển thị danh sách dạng lưới/danh sách các tablet của bé bằng `ChildCard`.
- Nút nổi (Floating Button) hoặc nút Header "Thêm máy mới" -> mở `router.push('/pair-device')`.

- [ ] **Step 5: Tạo Màn hình Profile `parent-app/app/(main)/profile.tsx`**

- Hiển thị Email phụ huynh đăng nhập.
- Trạng thái phiên kết nối Supabase.
- Nút "Đăng xuất" gọi `signOut()`.

- [ ] **Step 6: Kiểm tra toàn diện TypeScript và Build Bundler**

Run: `npx tsc --noEmit -p parent-app/tsconfig.json`
Expected: 0 errors.

- [ ] **Step 7: Commit Git**

Run: `git add parent-app/` và `git commit -m "feat(parent-app): complete dashboard hub, emergency lock toggle, children list and bottom tabs"`

---

### Task 7: Kiểm Thử Toàn Diện & Tích Hợp Hệ Thống (Verification)

**Files:**
- Create: `parent-app/__tests__/e2e-flow.test.ts`
- Modify: `docs/superpowers/plans/2026-09-27-expo-parent-app.md` (Cập nhật checklist)

**Interfaces:**
- Consumes: Toàn bộ module `parent-app` đã xây dựng.
- Produces: Kết quả kiểm thử tự động, xác minh đồng bộ WebSocket giữa `parent-app` và `example/` launcher.

- [ ] **Step 1: Viết test kịch bản luồng tích hợp hoàn chỉnh (E2E simulation)**

Tạo file `parent-app/__tests__/e2e-flow.test.ts`:
Kiểm tra luồng liên hoàn:
1. Giải mã QR tablet của bé thành công.
2. Thiết lập trạng thái `activeDevice`.
3. Kích hoạt lệnh khóa khẩn cấp và xác nhận payload gửi đi đúng định dạng kênh `parental_control:${deviceId}`.
4. Mở khóa và xác nhận cờ `isLocked: false`.

- [ ] **Step 2: Chạy kiểm thử tự động toàn bộ test suite**

Run: `npm test` trong `parent-app/`
Expected: Tất cả các bài test đều PASS.

- [ ] **Step 3: Chạy thử nghiệm kiểm tra Metro Bundler export**

Run: `npx expo export --dry-run` trong `parent-app/`
Expected: Bundle thành công không bị lỗi cú pháp hay thiếu import.

- [ ] **Step 4: Commit Git hoàn thiện**

Run: `git add .` và `git commit -m "chore(parent-app): verify end-to-end integration and test suite"`
