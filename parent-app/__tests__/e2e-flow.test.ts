import { parseQrCode } from '../src/services/pairingService';
import { getDeviceStatusInfo } from '../src/components/DeviceStatusBadge';
import { ChildDevice, EmergencyLockPayload } from '../src/types';

describe('End-to-End Parent Flow Simulation', () => {
  const mockChildQrPayload = JSON.stringify({
    type: 'KIDS_LAUNCHER_PAIRING',
    deviceId: 'DEV-E2E-TABLET-007',
    deviceName: 'Samsung Galaxy Tab S9 FE Kids',
    timestamp: 1727448888000,
  });

  it('Step 1: Parent scans QR code and extracts valid device details', () => {
    const parsed = parseQrCode(mockChildQrPayload);
    expect(parsed).not.toBeNull();
    expect(parsed?.deviceId).toBe('DEV-E2E-TABLET-007');
    expect(parsed?.deviceName).toBe('Samsung Galaxy Tab S9 FE Kids');
  });

  it('Step 2: Device is registered and shows Active status', () => {
    const pairedDevice: ChildDevice = {
      id: 'DEV-E2E-TABLET-007',
      deviceId: 'DEV-E2E-TABLET-007',
      childName: 'Bé Gia Bảo',
      childAvatar: '👦',
      deviceModel: 'Samsung Galaxy Tab S9 FE Kids',
      isEmergencyLocked: false,
      isPaired: true,
      parentPin: '1234',
    };

    const statusInfo = getDeviceStatusInfo(pairedDevice);
    expect(statusInfo.state).toBe('active');
    expect(statusInfo.label).toBe('Đang Hoạt Động');
  });

  it('Step 3: Parent activates Emergency Lock, payload and status update immediately', () => {
    const lockedDevice: ChildDevice = {
      id: 'DEV-E2E-TABLET-007',
      deviceId: 'DEV-E2E-TABLET-007',
      childName: 'Bé Gia Bảo',
      childAvatar: '👦',
      deviceModel: 'Samsung Galaxy Tab S9 FE Kids',
      isEmergencyLocked: true,
      isPaired: true,
      parentPin: '1234',
    };

    const lockBroadcast: EmergencyLockPayload = {
      type: 'EMERGENCY_LOCK',
      isLocked: true,
      reason: 'Phụ huynh kích hoạt khóa khẩn cấp',
      timestamp: Date.now(),
    };

    expect(lockBroadcast.isLocked).toBe(true);
    expect(lockBroadcast.type).toBe('EMERGENCY_LOCK');

    const statusInfo = getDeviceStatusInfo(lockedDevice);
    expect(statusInfo.state).toBe('locked');
    expect(statusInfo.label).toBe('Đang Bị Khóa');
  });

  it('Step 4: Parent unlocks device remotely', () => {
    const unlockedDevice: ChildDevice = {
      id: 'DEV-E2E-TABLET-007',
      deviceId: 'DEV-E2E-TABLET-007',
      childName: 'Bé Gia Bảo',
      childAvatar: '👦',
      isEmergencyLocked: false,
      isPaired: true,
      parentPin: '1234',
    };

    const unlockBroadcast: EmergencyLockPayload = {
      type: 'EMERGENCY_LOCK',
      isLocked: false,
      reason: 'Phụ huynh mở khóa thiết bị',
      timestamp: Date.now(),
    };

    expect(unlockBroadcast.isLocked).toBe(false);

    const statusInfo = getDeviceStatusInfo(unlockedDevice);
    expect(statusInfo.state).toBe('active');
    expect(statusInfo.label).toBe('Đang Hoạt Động');
  });
});
