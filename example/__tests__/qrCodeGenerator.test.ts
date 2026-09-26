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
    const size = matrix.length;

    // Top-left finder pattern 7x7
    for (let r = 0; r < 7; r++) {
      expect(matrix[0][r]).toBe(true);
      expect(matrix[6][r]).toBe(true);
    }

    // Top-right finder pattern 7x7
    for (let r = 0; r < 7; r++) {
      expect(matrix[0][size - 7 + r]).toBe(true);
      expect(matrix[6][size - 7 + r]).toBe(true);
    }

    // Bottom-left finder pattern 7x7
    for (let r = 0; r < 7; r++) {
      expect(matrix[size - 7][r]).toBe(true);
      expect(matrix[size - 1][r]).toBe(true);
    }
  });

  it('xử lý chuỗi JSON payload ghép nối thiết bị', () => {
    const payload = JSON.stringify({
      action: 'KIDS_LAUNCHER_PAIR',
      v: 1,
      device_id: 'ANDR-HBKA1KGG',
      device_name: 'Galaxy Tab của Bé',
      created_at: 1727350000000,
    });
    const matrix = generateQRCodeMatrix(payload);
    expect(Array.isArray(matrix)).toBe(true);
    expect(matrix.length).toBeGreaterThan(25);
    expect(matrix[0].length).toBe(matrix.length);
  });
});
