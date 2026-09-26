/**
 * Bộ sinh ma trận mã QR thuần TypeScript (Zero Native Dependencies)
 * Sinh ma trận 2D boolean biểu diễn các điểm ảnh QR Code (true = đen, false = trắng).
 * Tuân thủ tiêu chuẩn ISO/IEC 18004: Byte Mode, Reed-Solomon Error Correction Level L.
 */

// Bảng Galois Field GF(256) cho Reed-Solomon (đa thức nguyên thủy 0x11d)
const EXP_TABLE = new Uint8Array(512);
const LOG_TABLE = new Uint8Array(256);
(function initGalois() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP_TABLE[i] = x;
    EXP_TABLE[i + 255] = x;
    LOG_TABLE[x] = i;
    x = (x << 1) ^ (x & 128 ? 0x11d : 0);
  }
})();

function gfMultiply(x: number, y: number): number {
  if (x === 0 || y === 0) return 0;
  return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
}

function rsGeneratorPoly(degree: number): Uint8Array {
  let poly = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    const factor = EXP_TABLE[i];
    const next = new Uint8Array(poly.length + 1);
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMultiply(poly[j], factor);
    }
    poly = next;
  }
  return poly;
}

function rsCompute(data: Uint8Array, eccCount: number): Uint8Array {
  const gen = rsGeneratorPoly(eccCount);
  const res = new Uint8Array(data.length + eccCount);
  res.set(data);
  for (let i = 0; i < data.length; i++) {
    const coef = res[i];
    if (coef !== 0) {
      for (let j = 1; j < gen.length; j++) {
        res[i + j] ^= gfMultiply(gen[j], coef);
      }
    }
  }
  return res.slice(data.length);
}

function getFormatInfo(ecLevel: number, maskPattern: number): number {
  const data = (ecLevel << 3) | maskPattern;
  let rem = data << 10;
  for (let i = 4; i >= 0; i--) {
    if ((rem >> (i + 10)) & 1) {
      rem ^= 0x537 << i;
    }
  }
  return ((data << 10) | rem) ^ 0x5412;
}

function getVersionInfo(version: number): number {
  let rem = version << 12;
  for (let i = 5; i >= 0; i--) {
    if ((rem >> (i + 12)) & 1) {
      rem ^= 0x1f25 << i;
    }
  }
  return (version << 12) | rem;
}

interface VersionTableEntry {
  version: number;
  totalDataBytes: number;
  ecPerBlock: number;
  blocks: { count: number; dataBytes: number }[];
  alignPos: number[];
}

const VERSION_TABLE: VersionTableEntry[] = [
  { version: 1, totalDataBytes: 19, ecPerBlock: 7, blocks: [{ count: 1, dataBytes: 19 }], alignPos: [] },
  { version: 2, totalDataBytes: 34, ecPerBlock: 10, blocks: [{ count: 1, dataBytes: 34 }], alignPos: [6, 18] },
  { version: 3, totalDataBytes: 55, ecPerBlock: 15, blocks: [{ count: 1, dataBytes: 55 }], alignPos: [6, 22] },
  { version: 4, totalDataBytes: 80, ecPerBlock: 20, blocks: [{ count: 1, dataBytes: 80 }], alignPos: [6, 26] },
  { version: 5, totalDataBytes: 108, ecPerBlock: 26, blocks: [{ count: 1, dataBytes: 108 }], alignPos: [6, 30] },
  { version: 6, totalDataBytes: 136, ecPerBlock: 18, blocks: [{ count: 2, dataBytes: 68 }], alignPos: [6, 34] },
  { version: 7, totalDataBytes: 156, ecPerBlock: 20, blocks: [{ count: 2, dataBytes: 78 }], alignPos: [6, 22, 38] },
  { version: 8, totalDataBytes: 194, ecPerBlock: 24, blocks: [{ count: 2, dataBytes: 97 }], alignPos: [6, 24, 42] },
  { version: 9, totalDataBytes: 232, ecPerBlock: 30, blocks: [{ count: 2, dataBytes: 116 }], alignPos: [6, 26, 46] },
  { version: 10, totalDataBytes: 274, ecPerBlock: 18, blocks: [{ count: 2, dataBytes: 68 }, { count: 2, dataBytes: 69 }], alignPos: [6, 28, 50] },
];

function encodeUtf8(str: string): Uint8Array {
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(str);
  }
  const codePoints: number[] = [];
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i);
    if (c < 0x80) {
      codePoints.push(c);
    } else if (c < 0x800) {
      codePoints.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
    } else if (c < 0xd800 || c >= 0xe000) {
      codePoints.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
    } else {
      i++;
      c = 0x10000 + (((c & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
      codePoints.push(
        0xf0 | (c >> 18),
        0x80 | ((c >> 12) & 0x3f),
        0x80 | ((c >> 6) & 0x3f),
        0x80 | (c & 0x3f)
      );
    }
  }
  return new Uint8Array(codePoints);
}

/**
 * Sinh ma trận QR Code tiêu chuẩn phiên bản tự động điều chỉnh theo độ dài dữ liệu
 * @param text Chuỗi ký tự cần mã hóa vào QR
 * @returns boolean[][] ma trận vuông với true = ô màu đen, false = ô màu trắng
 */
export function generateQRCodeMatrix(text: string): boolean[][] {
  const bytes = encodeUtf8(text);
  const dataLen = bytes.length;

  const verInfo =
    VERSION_TABLE.find((v) => v.totalDataBytes >= dataLen + (v.version < 10 ? 2 : 3)) ||
    VERSION_TABLE[VERSION_TABLE.length - 1];

  const countBits = verInfo.version < 10 ? 8 : 16;
  const bitBuffer: number[] = [];
  const pushBits = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) {
      bitBuffer.push((val >> i) & 1);
    }
  };

  // 1. Chế độ Byte (0100)
  pushBits(0b0100, 4);

  // 2. Độ dài chuỗi
  pushBits(dataLen, countBits);

  // 3. Nội dung byte
  for (let i = 0; i < dataLen; i++) {
    pushBits(bytes[i], 8);
  }

  // 4. Terminator (tối đa 4 bit 0)
  const maxDataBits = verInfo.totalDataBytes * 8;
  const terminatorLen = Math.min(4, maxDataBits - bitBuffer.length);
  if (terminatorLen > 0) {
    pushBits(0, terminatorLen);
  }

  // 5. Làm tròn thành bội số của 8 bit
  while (bitBuffer.length % 8 !== 0 && bitBuffer.length < maxDataBits) {
    bitBuffer.push(0);
  }

  // Gom các bit thành mảng byte
  const rawBytes: number[] = [];
  for (let i = 0; i < bitBuffer.length; i += 8) {
    let b = 0;
    for (let j = 0; j < 8; j++) {
      b = (b << 1) | bitBuffer[i + j];
    }
    rawBytes.push(b);
  }

  // 6. Điền các byte đệm 0xEC, 0x11
  const padBytes = [0xec, 0x11];
  let padIdx = 0;
  while (rawBytes.length < verInfo.totalDataBytes) {
    rawBytes.push(padBytes[padIdx % 2]);
    padIdx++;
  }

  // 7. Chia block và tính mã sửa lỗi Reed-Solomon
  const blockDataList: Uint8Array[] = [];
  const blockEcList: Uint8Array[] = [];
  let offset = 0;
  for (const group of verInfo.blocks) {
    for (let b = 0; b < group.count; b++) {
      const blockData = new Uint8Array(rawBytes.slice(offset, offset + group.dataBytes));
      offset += group.dataBytes;
      const blockEc = rsCompute(blockData, verInfo.ecPerBlock);
      blockDataList.push(blockData);
      blockEcList.push(blockEc);
    }
  }

  // 8. Đan xen dữ liệu (Data interleaving)
  const interleaved: number[] = [];
  let maxDataCodewords = 0;
  for (const b of blockDataList) {
    if (b.length > maxDataCodewords) maxDataCodewords = b.length;
  }
  for (let i = 0; i < maxDataCodewords; i++) {
    for (const b of blockDataList) {
      if (i < b.length) interleaved.push(b[i]);
    }
  }

  // 9. Đan xen mã sửa lỗi (EC interleaving)
  for (let i = 0; i < verInfo.ecPerBlock; i++) {
    for (const ec of blockEcList) {
      interleaved.push(ec[i]);
    }
  }

  // Khởi tạo ma trận QR
  const size = 17 + 4 * verInfo.version;
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const isFunction: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // A. Finder patterns (7x7) kèm separator 1 module tại 3 góc
  const addFinderPattern = (row: number, col: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const nr = row + r;
        const nc = col + c;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
          isFunction[nr][nc] = true;
          if (
            (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
            (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)
          ) {
            matrix[nr][nc] = true;
          } else {
            matrix[nr][nc] = false;
          }
        }
      }
    }
  };

  addFinderPattern(0, 0);
  addFinderPattern(0, size - 7);
  addFinderPattern(size - 7, 0);

  // B. Alignment patterns cho Version >= 2
  if (verInfo.alignPos.length > 0) {
    const isFinderZone = (r: number, c: number) => {
      if (r < 9 && c < 9) return true;
      if (r < 9 && c >= size - 8) return true;
      if (r >= size - 8 && c < 9) return true;
      return false;
    };
    for (const ar of verInfo.alignPos) {
      for (const ac of verInfo.alignPos) {
        if (isFinderZone(ar, ac)) continue;
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            isFunction[ar + r][ac + c] = true;
            matrix[ar + r][ac + c] = Math.max(Math.abs(r), Math.abs(c)) !== 1;
          }
        }
      }
    }
  }

  // C. Timing patterns (Hàng 6 và Cột 6)
  for (let i = 8; i < size - 8; i++) {
    if (!isFunction[6][i]) {
      isFunction[6][i] = true;
      matrix[6][i] = i % 2 === 0;
    }
    if (!isFunction[i][6]) {
      isFunction[i][6] = true;
      matrix[i][6] = i % 2 === 0;
    }
  }

  // D. Dark module cố định tại (size - 8, 8)
  isFunction[size - 8][8] = true;
  matrix[size - 8][8] = true;

  // E. Format info (Level L, Mask 0)
  const formatInfo = getFormatInfo(1, 0);
  const formatCoordsTL: [number, number][] = [
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5],
    [8, 7], [8, 8],
    [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8]
  ];
  for (let i = 0; i < 15; i++) {
    const [r, c] = formatCoordsTL[i];
    isFunction[r][c] = true;
    matrix[r][c] = ((formatInfo >> i) & 1) === 1;
  }

  for (let i = 0; i <= 6; i++) {
    const r = size - 1 - i;
    const c = 8;
    isFunction[r][c] = true;
    matrix[r][c] = ((formatInfo >> i) & 1) === 1;
  }
  for (let i = 7; i <= 14; i++) {
    const r = 8;
    const c = size - 15 + i;
    isFunction[r][c] = true;
    matrix[r][c] = ((formatInfo >> i) & 1) === 1;
  }

  // F. Version info cho Version >= 7
  if (verInfo.version >= 7) {
    const vInfo = getVersionInfo(verInfo.version);
    for (let i = 0; i < 18; i++) {
      const bit = ((vInfo >> i) & 1) === 1;
      const rBL = size - 11 + (i % 3);
      const cBL = Math.floor(i / 3);
      isFunction[rBL][cBL] = true;
      matrix[rBL][cBL] = bit;

      const rTR = Math.floor(i / 3);
      const cTR = size - 11 + (i % 3);
      isFunction[rTR][cTR] = true;
      matrix[rTR][cTR] = bit;
    }
  }

  // G. Đưa dữ liệu vào ma trận theo hình zigzag và áp dụng mặt nạ Mask Pattern 0
  const allBits: number[] = [];
  for (const cw of interleaved) {
    for (let i = 7; i >= 0; i--) {
      allBits.push((cw >> i) & 1);
    }
  }

  let bitIdx = 0;
  let upward = true;
  for (let right = size - 1; right > 0; right -= 2) {
    if (right === 6) right--; // Tránh cột timing pattern
    const rows = upward
      ? Array.from({ length: size }, (_, i) => size - 1 - i)
      : Array.from({ length: size }, (_, i) => i);

    for (const r of rows) {
      for (const c of [right, right - 1]) {
        if (!isFunction[r][c]) {
          const bit = bitIdx < allBits.length ? allBits[bitIdx++] : 0;
          // Mask pattern 0: (r + c) % 2 === 0
          const mask = (r + c) % 2 === 0;
          matrix[r][c] = (bit === 1) !== mask;
        }
      }
    }
    upward = !upward;
  }

  return matrix;
}
