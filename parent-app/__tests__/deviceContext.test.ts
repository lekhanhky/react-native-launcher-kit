import { getDeviceStatusInfo } from '../src/components/DeviceStatusBadge';
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
    const status = getDeviceStatusInfo(device);
    expect(status.label).toBe('Đang Bị Khóa');
    expect(status.state).toBe('locked');
  });

  it('should identify active device correctly', () => {
    const device: ChildDevice = {
      id: '2',
      deviceId: 'dev_2',
      childName: 'Bé Gia Bảo',
      childAvatar: '👦',
      isEmergencyLocked: false,
      isPaired: true,
    };
    const status = getDeviceStatusInfo(device);
    expect(status.label).toBe('Đang Hoạt Động');
    expect(status.state).toBe('active');
  });

  it('should identify unpaired or inactive device correctly', () => {
    const device: ChildDevice = {
      id: '3',
      deviceId: 'dev_3',
      childName: 'Tablet Mới',
      childAvatar: '📱',
      isEmergencyLocked: false,
      isPaired: false,
    };
    const status = getDeviceStatusInfo(device);
    expect(status.label).toBe('Chưa Kích Hoạt');
    expect(status.state).toBe('unpaired');
  });
});
