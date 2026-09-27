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

  it('should return null for invalid non-launcher payload', () => {
    const randomUrl = 'https://google.com';
    const result = parseQrCode(randomUrl);
    expect(result).toBeNull();
  });
});
