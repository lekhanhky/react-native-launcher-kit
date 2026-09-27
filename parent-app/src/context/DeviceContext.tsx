import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from './AuthContext';
import { ChildDevice } from '../types';
import { setEmergencyLock } from '../services/remoteControlService';

interface DeviceContextType {
  devices: ChildDevice[];
  activeDevice: ChildDevice | null;
  isLoading: boolean;
  setActiveDevice: (device: ChildDevice | null) => void;
  refreshDevices: () => Promise<void>;
  toggleLock: (deviceId: string) => Promise<{ success: boolean; error?: string }>;
}

const DeviceContext = createContext<DeviceContextType>({
  devices: [],
  activeDevice: null,
  isLoading: true,
  setActiveDevice: () => {},
  refreshDevices: async () => {},
  toggleLock: async () => ({ success: false }),
});

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [devices, setDevices] = useState<ChildDevice[]>([]);
  const [activeDevice, setActiveDevice] = useState<ChildDevice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDevices = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Lấy thông tin thiết bị từ Supabase (bảng devices & parental_policies)
      const { data: rawDevices, error: devError } = await supabase
        .from('devices')
        .select(`
          device_id,
          device_name,
          device_model,
          is_paired,
          last_sync_at,
          parental_policies (
            is_emergency_locked,
            parent_pin
          )
        `);

      if (devError) {
        console.warn('[DeviceContext] Lỗi fetch devices:', devError);
      }

      const formatted: ChildDevice[] = (rawDevices || []).map((d: any) => {
        const policy = Array.isArray(d.parental_policies)
          ? d.parental_policies[0]
          : d.parental_policies;

        return {
          id: d.device_id,
          deviceId: d.device_id,
          childName: d.device_name || 'Bé Yêu',
          childAvatar: '👦',
          deviceModel: d.device_model || 'Máy tính bảng',
          isEmergencyLocked: Boolean(policy?.is_emergency_locked),
          isPaired: Boolean(d.is_paired),
          parentPin: policy?.parent_pin || '1234',
          lastSeen: d.last_sync_at,
        };
      });

      setDevices(formatted);

      // Nếu chưa có activeDevice hoặc activeDevice không còn trong list, chọn thiết bị đầu tiên
      setActiveDevice((prev) => {
        if (!prev && formatted.length > 0) return formatted[0];
        const updated = formatted.find((item) => item.deviceId === prev?.deviceId);
        return updated || (formatted.length > 0 ? formatted[0] : null);
      });
    } catch (err) {
      console.warn('[DeviceContext] Lỗi tải danh sách thiết bị:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();

    // 2. Đăng ký lắng nghe thay đổi thời gian thực của bảng parental_policies
    const channel = supabase
      .channel('public:parental_policies_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'parental_policies' },
        (payload: any) => {
          const updatedRecord = payload.new;
          if (updatedRecord && updatedRecord.device_id) {
            setDevices((prevList) =>
              prevList.map((item) => {
                if (item.deviceId === updatedRecord.device_id) {
                  return {
                    ...item,
                    isEmergencyLocked: Boolean(updatedRecord.is_emergency_locked),
                    parentPin: updatedRecord.parent_pin || item.parentPin,
                  };
                }
                return item;
              })
            );

            setActiveDevice((prev) => {
              if (prev && prev.deviceId === updatedRecord.device_id) {
                return {
                  ...prev,
                  isEmergencyLocked: Boolean(updatedRecord.is_emergency_locked),
                  parentPin: updatedRecord.parent_pin || prev.parentPin,
                };
              }
              return prev;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchDevices]);

  const toggleLock = async (deviceId: string) => {
    const target = devices.find((d) => d.deviceId === deviceId);
    if (!target) return { success: false, error: 'Không tìm thấy thiết bị' };

    const newLockState = !target.isEmergencyLocked;

    // Optimistic UI update
    setDevices((prev) =>
      prev.map((d) => (d.deviceId === deviceId ? { ...d, isEmergencyLocked: newLockState } : d))
    );
    if (activeDevice?.deviceId === deviceId) {
      setActiveDevice((prev) => (prev ? { ...prev, isEmergencyLocked: newLockState } : null));
    }

    const result = await setEmergencyLock(deviceId, newLockState);

    // Rollback if failed
    if (!result.success) {
      setDevices((prev) =>
        prev.map((d) => (d.deviceId === deviceId ? { ...d, isEmergencyLocked: target.isEmergencyLocked } : d))
      );
      if (activeDevice?.deviceId === deviceId) {
        setActiveDevice((prev) => (prev ? { ...prev, isEmergencyLocked: target.isEmergencyLocked } : null));
      }
    }

    return result;
  };

  return (
    <DeviceContext.Provider
      value={{
        devices,
        activeDevice,
        isLoading,
        setActiveDevice,
        refreshDevices: fetchDevices,
        toggleLock,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => useContext(DeviceContext);
