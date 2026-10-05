import { generateQRCodeMatrix } from '../../example/src/utils/qrCodeGenerator';

const testPayload = JSON.stringify({
  action: 'KIDS_LAUNCHER_PAIR',
  v: 1,
  device_id: 'ANDR-TEST1234',
  device_name: 'Galaxy Tab của Bé',
  created_at: 1727770000000,
});

console.log('Generating QR matrix for payload length:', testPayload.length);
try {
  const matrix = generateQRCodeMatrix(testPayload);
  console.log('Matrix size:', matrix.length, 'x', matrix[0]?.length);
  // Print ASCII representation of QR code
  for (let r = 0; r < matrix.length; r++) {
    let line = '';
    for (let c = 0; c < matrix[r].length; c++) {
      line += matrix[r][c] ? '██' : '  ';
    }
    console.log(line);
  }
} catch (e) {
  console.error('Error generating matrix:', e);
}
