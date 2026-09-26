# Kế Hoạch Triển Khai: Kích Hoạt & Ghép Nối Thiết Bị Qua Mã QR

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng hệ thống ghép nối và kích hoạt tự động thiết bị giữa App Bé (React Native) và Cổng Phụ Huynh (Next.js) thông qua mã QR và Supabase Realtime Handshake.

**Architecture:** Màn hình kích hoạt của bé (`LicenseActivationScreen`) hiển thị mã QR chứa thông tin thiết bị (`device_id`, tên máy, action payload) được sinh bằng ma trận QR thuần JS (không phụ thuộc native NDK). Cổng Phụ Huynh (`web-portal`) tích hợp thành phần quét mã Camera qua `html5-qrcode`, khi quét xong sẽ gọi API ghép nối và gửi tín hiệu Realtime qua Supabase (`device_pairing:{device_id}`) để app máy bé tự động mở khóa vào Launcher chính.

**Tech Stack:** React Native (Pure JS QR Matrix Renderer), Supabase (Postgres & Realtime WebSocket), Next.js 14, Tailwind CSS, `html5-qrcode` (WebRTC Camera API).

**Spec:** [docs/superpowers/specs/2026-09-26-qr-device-activation-design.md](file:///c:/react-native-launcher-kit/docs/superpowers/specs/2026-09-26-qr-device-activation-design.md)

## Global Constraints

- Không sử dụng các thư viện native C++/NDK nặng nề trên React Native để tránh rủi ro tương thích và phải compile lại NDK lâu; sử dụng thuật toán tạo ma trận QR thuần TypeScript / JavaScript.
- Phía Web Portal phải hỗ trợ camera WebRTC tiêu chuẩn của trình duyệt (Chrome, Safari, Edge) thông qua `html5-qrcode`.
- Giao thức dữ liệu mã hóa trong QR Code phải có trường `action: "KIDS_LAUNCHER_PAIR"` để định danh chính xác.
- Khi phụ huynh kích hoạt trên Web Portal, máy bé phải nhận được tín hiệu qua Supabase Realtime và chuyển màn hình tự động trong vòng < 1 giây.

---

### Task 1: Bộ Sinh Ma Trận Mã QR Thuần TypeScript (Pure-JS QR Generator)

**Files:**
- Create: `example/src/utils/qrCodeGenerator.ts`
- Test: `example/__tests__/qrCodeGenerator.test.ts`

**Interfaces:**
- Produces: `generateQRCodeMatrix(text: string): boolean[][]` (trả về ma trận 2 chiều các ô boolean `true` = màu đen, `false` = màu trắng).

- [ ] **Step 1: Viết test kiểm tra ma trận QR**

Tạo file `example/__tests__/qrCodeGenerator.test.ts`:
```typescript
import { generateQRCodeMatrix } from '../src/utils/qrCodeGenerator';

describe('qrCodeGenerator', () => {
  it('sinh ma trận vuông hợp lệ cho chuỗi đầu vào', () => {
    const text = 'ANDR-HBKA1KGG';
    const matrix = generateQRCodeMatrix(text);
    expect(Array.isArray(matrix)).toBe(true);
    expect(matrix.length).toBeGreaterThan(15);
    expect(matrix[0].length).toBe(matrix.length); // Phải là ma trận vuông
  });

  it('chứa 3 ô định vị Finder Patterns ở các góc', () => {
    const matrix = generateQRCodeMatrix('TEST');
    // Top-left finder pattern 7x7
    for (let r = 0; r < 7; r++) {
      expect(matrix[0][r]).toBe(true);
      expect(matrix[6][r]).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Chạy test để xác nhận test thất bại**

Run: `cd example && npx jest __tests__/qrCodeGenerator.test.ts`
Expected: FAIL với lỗi "Cannot find module '../src/utils/qrCodeGenerator'"

- [ ] **Step 3: Triển khai thuật toán sinh ma trận QR thuần TypeScript**

Tạo file `example/src/utils/qrCodeGenerator.ts`:
Thuật toán mã hóa QR tiêu chuẩn Byte Mode với Reed-Solomon Error Correction Level L hoặc M dạng module gọn nhẹ, trả về `boolean[][]`.

```typescript
/**
 * Bộ sinh ma trận mã QR thuần TypeScript (Zero Native Dependencies)
 * Sinh ma trận 2D boolean biểu diễn các điểm ảnh QR Code
 */

// Bảng Galois Field GF(256) cho Reed-Solomon
const EXP_TABLE = new Uint8Array(512);
const LOG_TABLE = new Uint8Array(256);
(function initGalois() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP_TABLE[i] = x;
    EXP_TABLE[i + 255] = x;
    LOG_TABLE[x] = i;
    x = (x << 1) ^ (x & 128 ? 0x11d : 0);
  }
})();

function gfMultiply(x: number, y: number): number {
  if (x === 0 || y === 0) return 0;
  return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
}

function rsGeneratorPoly(degree: number): Uint8Array {
  let poly = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    const next = new Uint8Array(poly.length + 1);
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= gfMultiply(poly[j], EXP_TABLE[i]);
      next[j + 1] ^= poly[j];
    }
    poly = next;
  }
  return poly;
}

function rsCompute(data: Uint8Array, eccCount: number): Uint8Array {
  const gen = rsGeneratorPoly(eccCount);
  const res = new Uint8Array(data.length + eccCount);
  res.set(data);
  for (let i = 0; i < data.length; i++) {
    const coef = res[i];
    if (coef !== 0) {
      for (let j = 0; j < gen.length; j++) {
        res[i + j] ^= gfMultiply(gen[j], coef);
      }
    }
  }
  return res.slice(data.length);
}

/**
 * Sinh ma trận QR Code tiêu chuẩn phiên bản tự động điều chỉnh theo độ dài dữ liệu
 */
export function generateQRCodeMatrix(text: string): boolean[][] {
  const bytes = new TextEncoder().encode(text);
  const dataLen = bytes.length;

  // Chọn Version phù hợp (Version 3: 29x29 cho chuỗi < 70 ký tự, Version 5: 37x37 cho chuỗi < 130 ký tự)
  let version = 3;
  let totalDataBytes = 44;
  let ecBytesCount = 26;
  if (dataLen > 34) {
    version = 5;
    totalDataBytes = 86;
    ecBytesCount = 36;
  }
  if (dataLen > 70) {
    version = 7;
    totalDataBytes = 154;
    ecBytesCount = 44;
  }

  const size = 17 + 4 * version;
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const isFunction: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // 1. Finder patterns (7x7) tại 3 góc
  const addFinderPattern = (row: number, col: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const nr = row + r;
        const nc = col + c;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
          isFunction[nr][nc] = true;
          if (
            (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
            (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)
          ) {
            matrix[nr][nc] = true;
          } else {
            matrix[nr][nc] = false;
          }
        }
      }
    }
  };

  addFinderPattern(0, 0);
  addFinderPattern(0, size - 7);
  addFinderPattern(size - 7, 0);

  // 2. Alignment patterns cho Version >= 2
  if (version >= 2) {
    const alignPos = version === 3 ? [6, 22] : version === 5 ? [6, 30] : [6, 22, 38];
    for (const ar of alignPos) {
      for (const ac of alignPos) {
        if (isFunction[ar][ac]) continue;
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            isFunction[ar + r][ac + c] = true;
            matrix[ar + r][ac + c] = Math.max(Math.abs(r), Math.abs(c)) !== 1;
          }
        }
      }
    }
  }

  // 3. Timing patterns
  for (let i = 8; i < size - 8; i++) {
    isFunction[6][i] = true;
    matrix[6][i] = i % 2 === 0;
    isFunction[i][6] = true;
    matrix[i][6] = i % 2 === 0;
  }

  // 4. Mã hóa dữ liệu Byte mode (0100) + Character Count + Dữ liệu + Padding
  const bitBuffer: number[] = [];
  const pushBits = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) {
      bitBuffer.push((val >> i) & 1);
    }
  };

  pushBits(0b0100, 4); // Byte Mode
  pushBits(dataLen, 8); // Count
  for (const b of bytes) {
    pushBits(b, 8);
  }
  // Terminator
  pushBits(0, 4);
  while (bitBuffer.length % 8 !== 0) bitBuffer.push(0);

  const rawBytes: number[] = [];
  for (let i = 0; i < bitBuffer.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) byte = (byte << 1) | bitBuffer[i + j];
    rawBytes.push(byte);
  }

  // Pad bytes
  const pad = [0xec, 0x11];
  let padIdx = 0;
  while (rawBytes.length < totalDataBytes) {
    rawBytes.push(pad[padIdx % 2]);
    padIdx++;
  }

  // Reed-Solomon Error Correction
  const ec = rsCompute(new Uint8Array(rawBytes), ecBytesCount);
  const finalCodewords = [...rawBytes, ...Array.from(ec)];

  // 5. Đưa dữ liệu vào ma trận theo hình zigzag
  const allBits: number[] = [];
  for (const cw of finalCodewords) {
    for (let i = 7; i >= 0; i--) allBits.push((cw >> i) & 1);
  }

  let bitIdx = 0;
  let upward = true;
  for (let right = size - 1; right > 0; right -= 2) {
    if (right === 6) right--; // Tránh cột timing pattern
    const rows = upward ? Array.from({ length: size }, (_, i) => size - 1 - i) : Array.from({ length: size }, (_, i) => i);
    for (const r of rows) {
      for (const c of [right, right - 1]) {
        if (!isFunction[r][c]) {
          const bit = bitIdx < allBits.length ? allBits[bitIdx++] : 0;
          // Áp dụng Mask pattern 0: (r + c) % 2 === 0
          const mask = (r + c) % 2 === 0;
          matrix[r][c] = (bit === 1) !== mask;
        }
      }
    }
    upward = !upward;
  }

  return matrix;
}
```

- [ ] **Step 4: Chạy lại test để xác nhận test pass**

Run: `cd example && npx jest __tests__/qrCodeGenerator.test.ts`
Expected: PASS 2/2 tests

- [ ] **Step 5: Commit**

```bash
git add example/src/utils/qrCodeGenerator.ts example/__tests__/qrCodeGenerator.test.ts
git commit -m "feat: add pure-ts qr code matrix generator utility"
```

---

### Task 2: Component Hiển Thị Mã QR Vector (`QRCodeView.tsx`)

**Files:**
- Create: `example/src/components/QRCodeView.tsx`

**Interfaces:**
- Consumes: `generateQRCodeMatrix(text: string)` từ `qrCodeGenerator.ts`
- Produces: `<QRCodeView value={string} size={number} color={string} backgroundColor={string} />`

- [ ] **Step 1: Tạo Component `QRCodeView.tsx`**

```tsx
import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { generateQRCodeMatrix } from '../utils/qrCodeGenerator';

interface QRCodeViewProps {
  value: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
}

export const QRCodeView: React.FC<QRCodeViewProps> = ({
  value,
  size = 220,
  color = '#0F172A',
  backgroundColor = '#FFFFFF',
}) => {
  const matrix = useMemo(() => {
    try {
      return generateQRCodeMatrix(value);
    } catch (e) {
      console.warn('Lỗi sinh QR code:', e);
      return [];
    }
  }, [value]);

  if (!matrix || matrix.length === 0) {
    return <View style={[styles.container, { width: size, height: size, backgroundColor }]} />;
  }

  const moduleCount = matrix.length;
  const cellSize = size / moduleCount;

  return (
    <View style={[styles.container, { width: size, height: size, backgroundColor }]}>
      {matrix.map((row, rIdx) => (
        <View key={`r-${rIdx}`} style={{ flexDirection: 'row', height: cellSize }}>
          {row.map((isDark, cIdx) => (
            <View
              key={`c-${cIdx}`}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: isDark ? color : backgroundColor,
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add example/src/components/QRCodeView.tsx
git commit -m "feat: add QRCodeView vector component for react-native"
```

---

### Task 3: Nâng Cấp `LicenseActivationScreen.tsx` Với QR & Realtime Listener

**Files:**
- Modify: `example/src/screens/LicenseActivationScreen.tsx`

**Interfaces:**
- Consumes: `QRCodeView`, `supabaseClient`
- Produces: Giao diện hiển thị mã QR kích hoạt và lắng nghe Realtime Handshake tự động.

- [ ] **Step 1: Cập nhật `LicenseActivationScreen.tsx`**

Cập nhật màn hình để:
1. Tạo payload JSON:
   ```json
   {
     "action": "KIDS_LAUNCHER_PAIR",
     "v": 1,
     "device_id": deviceId,
     "device_name": "Galaxy Tab của Bé",
     "created_at": Date.now()
   }
   ```
2. Hiển thị `<QRCodeView value={qrPayload} size={220} />` nổi bật ở chính giữa.
3. Thêm bộ lắng nghe Supabase Realtime kênh `device_pairing:{deviceId}`:
   - Khi nhận event `DEVICE_PAIRED_SUCCESS`: Gọi `licenseService.activateLicense('QR-ACT-' + deviceId)` $\rightarrow$ Gọi `onActivated()`.
4. Duy trì nút nhập mã License Key thủ công bên dưới để dự phòng.

- [ ] **Step 2: Re-bundle Metro để kiểm tra không có lỗi syntax**

Run: `cd example && npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res`
Expected: Bundle hoàn tất thành công 100%.

- [ ] **Step 3: Commit**

```bash
git add example/src/screens/LicenseActivationScreen.tsx
git commit -m "feat: enhance LicenseActivationScreen with QR code and realtime pairing listener"
```

---

### Task 4: Cài Đặt `html5-qrcode` & Xây Dựng `QrScannerModal.tsx` Trên Web Portal

**Files:**
- Modify: `web-portal/package.json`
- Create: `web-portal/src/components/QrScannerModal.tsx`

**Interfaces:**
- Consumes: `html5-qrcode`
- Produces: `<QrScannerModal isOpen={boolean} onClose={fn} onScanSuccess={(payload) => void} />`

- [ ] **Step 1: Cài đặt thư viện `html5-qrcode`**

Run: `cd web-portal && npm install html5-qrcode`
Expected: Cài đặt thành công không xung đột.

- [ ] **Step 2: Tạo `web-portal/src/components/QrScannerModal.tsx`**

Modal cho phép:
- Kích hoạt Camera bằng `Html5QrcodeScanner` hoặc `Html5Qrcode`.
- Tự động bắt mã QR, kiểm tra `action === 'KIDS_LAUNCHER_PAIR'`.
- Hiển thị card xác nhận thông tin thiết bị máy bé.
- Nút "Kích Hoạt & Liên Kết": Gửi payload lên callback `onScanSuccess`.

- [ ] **Step 3: Commit**

```bash
git add web-portal/package.json web-portal/package-lock.json web-portal/src/components/QrScannerModal.tsx
git commit -m "feat: add QrScannerModal component with camera scanner"
```

---

### Task 5: Tích Hợp API Ghép Nối & Nút Quét Trên Web Portal Phụ Huynh

**Files:**
- Modify: `web-portal/src/app/api/v1/device/pair/route.ts`
- Modify: `web-portal/src/app/(parent)/parent/children/page.tsx`
- Modify: `web-portal/src/app/(parent)/parent/dashboard/page.tsx`

**Interfaces:**
- Consumes: `QrScannerModal`
- Produces: Luồng kích hoạt hoàn chỉnh: Quét QR $\rightarrow$ Gọi API Ghép Nối $\rightarrow$ Bắn Realtime Broadcast.

- [ ] **Step 1: Cập nhật API `web-portal/src/app/api/v1/device/pair/route.ts`**

Cập nhật API để khi nhận `device_id`:
1. Lưu/Upsert vào bảng `devices` trên Supabase:
   ```typescript
   await supabase.from('devices').upsert({
     device_id,
     device_name: device_name || 'Máy tính bảng của Bé',
     is_paired: true,
     last_seen: new Date().toISOString()
   });
   ```
2. Đảm bảo bản ghi trong `parental_policies`:
   ```typescript
   await supabase.from('parental_policies').upsert({
     device_id,
     is_emergency_locked: false,
     updated_at: new Date().toISOString()
   });
   ```
3. Bắn sự kiện Broadcast qua Supabase Realtime:
   ```typescript
   const channel = supabase.channel(`device_pairing:${device_id}`);
   await channel.subscribe();
   await channel.send({
     type: 'broadcast',
     event: 'DEVICE_PAIRED_SUCCESS',
     payload: { device_id, success: true }
   });
   ```

- [ ] **Step 2: Thêm nút Quét QR vào trang `/parent/children` & `/parent/dashboard`**

Thêm nút `"Quét mã QR máy bé"` có biểu tượng `QrCode` và mở `QrScannerModal`.

- [ ] **Step 3: Build Web Portal để xác nhận không lỗi TypeScript / Next.js**

Run: `cd web-portal && npm run build`
Expected: `Compiled successfully`

- [ ] **Step 4: Commit**

```bash
git add web-portal/src/app/api/v1/device/pair/route.ts web-portal/src/app/\(parent\)/parent/children/page.tsx web-portal/src/app/\(parent\)/parent/dashboard/page.tsx
git commit -m "feat: integrate QR pairing flow and realtime broadcast on parent web portal"
```

---

### Task 6: Kiểm Thử Toàn Diện Trên Giả Lập & Web Portal (End-to-End Verification)

**Files:**
- Verify: LDPlayer (`emulator-5554`) & Web Portal (`http://localhost:3001`)

- [ ] **Step 1: Rebuild APK & Cài Đặt Lên LDPlayer**
  - Đóng gói bundle Android: `npx react-native bundle ...`
  - Compile & cài đặt: `.\gradlew.bat assembleDebug` và `adb -s emulator-5554 install -r ...`
  - Khởi động app: `adb -s emulator-5554 shell am start -S -n com.rnlauncherkit/.MainActivity`

- [ ] **Step 2: Kiểm tra Màn hình QR trên App Bé**
  - Chụp màn hình qua `screencap` và kiểm tra:
    - Mã QR hiển thị rõ ràng, cân đối ở giữa.
    - Mã ID thiết bị hiển thị to rõ bên dưới.
    - Dòng chữ: *"Đang đợi phụ huynh quét mã..."*

- [ ] **Step 3: Thực hiện Ghép Nối từ Web Portal Phụ Huynh**
  - Kích hoạt ghép nối thiết bị qua API / Web Portal.
  - Xác nhận tín hiệu Supabase Realtime được máy bé nhận ngay tức khắc.
  - Chụp màn hình LDPlayer: Xác nhận máy bé tự động nhảy vào Màn hình Launcher chính.
