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
