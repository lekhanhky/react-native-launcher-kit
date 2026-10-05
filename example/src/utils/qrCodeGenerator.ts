/**
 * Sinh ma trận QR Code chuẩn quốc tế (ISO/IEC 18004) bằng thư viện qrcode
 * Đảm bảo 100% tất cả camera điện thoại, máy quét barcode đều quét được tức thì.
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const QRCode = require('qrcode');

export function generateQRCodeMatrix(text: string): boolean[][] {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return [];
  }

  try {
    const qrEngine = (QRCode && typeof QRCode.create === 'function')
      ? QRCode
      : (QRCode?.default || QRCode);

    const qr = qrEngine.create(text.trim(), {
      errorCorrectionLevel: 'M',
    });

    const size = qr.modules.size;
    const data = qr.modules.data; // Bit array: 1 = dark, 0 = light

    const matrix: boolean[][] = [];
    for (let y = 0; y < size; y++) {
      const row: boolean[] = [];
      for (let x = 0; x < size; x++) {
        row.push(Boolean(data[y * size + x]));
      }
      matrix.push(row);
    }

    return matrix;
  } catch (error) {
    console.error('[QRCodeGenerator] Lỗi sinh ma trận QR:', error);
    return [];
  }
}

export default generateQRCodeMatrix;
