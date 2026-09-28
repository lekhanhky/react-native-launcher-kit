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
    expect(result?.deviceName).toBe('Tablet Bé Bin');
  });

  it('should parse plain string device ID fallback', () => {
    const plainDeviceId = 'dev_fallback_123';
    const result = parseQrCode(plainDeviceId);
    expect(result).not.toBeNull();
    expect(result?.deviceId).toBe('dev_fallback_123');
    expect(result?.type).toBe('KIDS_LAUNCHER_PAIRING');
  });

  it('should parse tablet LicenseActivationScreen QR format (action and device_id)', () => {
    const tabletPayload = JSON.stringify({
      action: 'KIDS_LAUNCHER_PAIR',
      v: 1,
      device_id: 'DEV-A9B2-C3D4',
      device_name: 'Galaxy Tab của Bé',
      created_at: 1727448888000,
    });

    const result = parseQrCode(tabletPayload);
    expect(result).not.toBeNull();
    expect(result?.deviceId).toBe('DEV-A9B2-C3D4');
    expect(result?.deviceName).toBe('Galaxy Tab của Bé');
    expect(result?.type).toBe('KIDS_LAUNCHER_PAIRING');
  });

  it('should parse direct 6-digit or alphanumeric manual code', () => {
    const manualCode = '784920';
    const result = parseQrCode(manualCode);
    expect(result).not.toBeNull();
    expect(result?.deviceId).toBe('784920');
  });

  it('should return null for invalid non-launcher payload', () => {
    const randomUrl = 'https://google.com';
    const result = parseQrCode(randomUrl);
    expect(result).toBeNull();
  });
});
