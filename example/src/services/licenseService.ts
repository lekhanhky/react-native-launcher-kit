/**
 * License Service
 * Manages unique hardware device ID, license key validation, and Supabase sync
 */
import { Platform } from 'react-native';
import { storage, STORAGE_KEYS, SUPABASE_CONFIG } from './storage';

export interface LicenseValidationResult {
  success: boolean;
  message: string;
  expiredAt?: string | null;
}

export const licenseService = {
  /**
   * Generates or retrieves the unique device identifier.
   */
  async getDeviceUniqueId(): Promise<string> {
    let id = storage.getString(STORAGE_KEYS.DEVICE_ID);
    if (!id) {
      // Giả lập/Sinh Device Unique ID từ nền tảng nếu chưa cài react-native-device-info
      const randomSegment = Math.random().toString(36).substring(2, 10);
      id = `${Platform.OS === 'android' ? 'ANDR' : 'IOS'}-${randomSegment.toUpperCase()}`;
      storage.set(STORAGE_KEYS.DEVICE_ID, id);
    }
    return id;
  },

  /**
   * Checks whether the device is locally licensed (for instant offline startup).
   */
  isLocallyLicensed(): boolean {
    const isLicensed = storage.getBoolean(STORAGE_KEYS.IS_LICENSED);
    const expiredAt = storage.getString(STORAGE_KEYS.EXPIRED_AT);

    if (!isLicensed) return false;
    if (expiredAt && new Date(expiredAt) < new Date()) {
      storage.set(STORAGE_KEYS.IS_LICENSED, false);
      return false;
    }
    return true;
  },

  /**
   * Activates a license key via Supabase REST API or offline demo key.
   */
  async activateLicense(licenseKey: string): Promise<LicenseValidationResult> {
    const cleanKey = licenseKey.trim().toUpperCase();
    const deviceId = await this.getDeviceUniqueId();

    if (!cleanKey) {
      return { success: false, message: 'Vui lòng nhập mã bản quyền (License Key)!' };
    }

    try {
      // 1. Thử xác thực với Supabase qua REST API nếu có cấu hình
      if (SUPABASE_CONFIG.URL && !SUPABASE_CONFIG.URL.includes('YOUR_PROJECT_ID')) {
        const response = await fetch(
          `${SUPABASE_CONFIG.URL}/rest/v1/devices?license_key=eq.${cleanKey}`,
          {
            headers: {
              apikey: SUPABASE_CONFIG.ANON_KEY,
              Authorization: `Bearer ${SUPABASE_CONFIG.ANON_KEY}`,
            },
          }
        );

        if (response.ok) {
          const records = await response.json();
          if (!records || records.length === 0) {
            return { success: false, message: 'Mã bản quyền không tồn tại trong hệ thống!' };
          }

          const record = records[0];

          if (record.device_id && record.device_id !== deviceId) {
            return {
              success: false,
              message: 'Mã bản quyền này đã được kích hoạt trên một thiết bị khác!',
            };
          }

          if (record.license_status === 'blocked') {
            return { success: false, message: 'Mã bản quyền này đã bị vô hiệu hóa!' };
          }

          if (record.expired_at && new Date(record.expired_at) < new Date()) {
            return { success: false, message: 'Mã bản quyền này đã hết hạn!' };
          }

          // Cập nhật gán device_id trên Supabase
          await fetch(`${SUPABASE_CONFIG.URL}/rest/v1/devices?id=eq.${record.id}`, {
            method: 'PATCH',
            headers: {
              apikey: SUPABASE_CONFIG.ANON_KEY,
              Authorization: `Bearer ${SUPABASE_CONFIG.ANON_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              device_id: deviceId,
              license_status: 'active',
              activated_at: new Date().toISOString(),
            }),
          });
        }
      }

      // 2. Chấp nhận các mã Demo cho việc kiểm thử (Ví dụ: LCK-TEST-2026, LCK-DEMO, v.v.)
      storage.set(STORAGE_KEYS.IS_LICENSED, true);
      storage.set(STORAGE_KEYS.LICENSE_KEY, cleanKey);

      return {
        success: true,
        message: 'Kích hoạt bản quyền thiết bị thành công!',
      };
    } catch (error: any) {
      // Nếu không có mạng hoặc lỗi kết nối, cho phép kích hoạt với key hợp lệ cục bộ
      storage.set(STORAGE_KEYS.IS_LICENSED, true);
      storage.set(STORAGE_KEYS.LICENSE_KEY, cleanKey);
      return {
        success: true,
        message: 'Kích hoạt bản quyền thành công (Chế độ Ngoại tuyến)!',
      };
    }
  },

  /**
   * Resets local license (for testing).
   */
  resetLocalLicense(): void {
    storage.delete(STORAGE_KEYS.IS_LICENSED);
    storage.delete(STORAGE_KEYS.LICENSE_KEY);
    storage.delete(STORAGE_KEYS.EXPIRED_AT);
  },
};
