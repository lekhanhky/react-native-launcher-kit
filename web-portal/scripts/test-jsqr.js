const jsQR = require('jsqr');
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const tsCode = fs.readFileSync(path.resolve(__dirname, '../../example/src/utils/qrCodeGenerator.ts'), 'utf8');
const jsCode = ts.transpile(tsCode);

const moduleObj = { exports: {} };
const fn = new Function('module', 'exports', 'require', jsCode);
fn(moduleObj, moduleObj.exports, require);

const { generateQRCodeMatrix } = moduleObj.exports;

const payload = JSON.stringify({
  action: 'KIDS_LAUNCHER_PAIR',
  v: 1,
  device_id: 'ANDR-NLJZ5F5Q',
  device_name: 'Galaxy Tab của Bé',
  created_at: 1727770000000,
});

console.log('Testing payload:', payload);
const matrix = generateQRCodeMatrix(payload);
console.log('Matrix generated size:', matrix.length, 'x', matrix.length);

const quietZone = 4;
const scale = 8;
const fullSize = (matrix.length + quietZone * 2) * scale;
const data = new Uint8ClampedArray(fullSize * fullSize * 4);

for (let y = 0; y < fullSize; y++) {
  for (let x = 0; x < fullSize; x++) {
    const modX = Math.floor(x / scale) - quietZone;
    const modY = Math.floor(y / scale) - quietZone;
    let isDark = false;
    if (modX >= 0 && modX < matrix.length && modY >= 0 && modY < matrix.length) {
      isDark = matrix[modY][modX];
    }
    const idx = (y * fullSize + x) * 4;
    const val = isDark ? 0 : 255;
    data[idx] = val;
    data[idx + 1] = val;
    data[idx + 2] = val;
    data[idx + 3] = 255;
  }
}

const code = jsQR(data, fullSize, fullSize);
if (code) {
  console.log('SUCCESS! jsQR decoded data:', code.data);
} else {
  console.error('FAILED! jsQR COULD NOT DECODE THE QR CODE!');
}
