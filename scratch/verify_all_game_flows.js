const fs = require('fs');

console.log('=== TEST SUITE: GAME 100 CÂU ĐỐ KỲ THÚ ===\n');

// 1. Kiểm tra ngân hàng dữ liệu
const dataContent = fs.readFileSync('example/src/data/riddles100Data.ts', 'utf8');

const riddleMatches = dataContent.match(/id:\s*'r_[a-z]_\d{2}'/g) || [];
console.log(`[TEST 1] Đếm số lượng câu đố: ${riddleMatches.length}/100`);
if (riddleMatches.length !== 100) {
  console.error('FAIL: Không đủ 100 câu đố!');
  process.exit(1);
}

// 2. Kiểm tra 5 vùng đất
const worlds = ['animals', 'fruits', 'household', 'vehicles', 'nature'];
worlds.forEach((w) => {
  const count = (dataContent.match(new RegExp(`worldId:\\s*'${w}'`, 'g')) || []).length;
  console.log(`[TEST 2] Vùng đất '${w}': ${count}/20 câu đố`);
  if (count !== 20) {
    console.error(`FAIL: Vùng đất ${w} không đủ 20 câu!`);
    process.exit(1);
  }
});

// 3. Kiểm tra options 3D
const correctCount = (dataContent.match(/isCorrect:\s*true/g) || []).length;
const falseCount = (dataContent.match(/isCorrect:\s*false/g) || []).length;
console.log(`[TEST 3] Tùy chọn đáp án đúng: ${correctCount}/100, tùy chọn gây nhiễu: ${falseCount}/300`);
if (correctCount !== 100 || falseCount !== 300) {
  console.error('FAIL: Tỉ lệ đáp án không đúng chuẩn 1:3!');
  process.exit(1);
}

// 4. Kiểm tra service lưu trữ
const serviceContent = fs.readFileSync('example/src/services/riddleService.ts', 'utf8');
const hasStorage = serviceContent.includes('STORAGE_KEYS.RIDDLE_GAME_PROGRESS');
const hasMarkSolved = serviceContent.includes('markRiddleSolved');
const hasWorldProgress = serviceContent.includes('getWorldProgress');
console.log(`[TEST 4] Dịch vụ RiddleService: storage=${hasStorage}, markSolved=${hasMarkSolved}, worldProgress=${hasWorldProgress}`);
if (!hasStorage || !hasMarkSolved || !hasWorldProgress) {
  console.error('FAIL: Dịch vụ riddleService thiếu các hàm cốt lõi!');
  process.exit(1);
}

// 5. Kiểm tra đăng ký Registry và Router
const registryContent = fs.readFileSync('example/src/data/launcherGamesRegistry.ts', 'utf8');
const isRegisteredInLauncher = registryContent.includes('internal.game.riddles100');
console.log(`[TEST 5] Đăng ký trong Launcher Registry: ${isRegisteredInLauncher ? 'PASS' : 'FAIL'}`);

const launcherContent = fs.readFileSync('example/src/screens/KidsLauncherScreen.tsx', 'utf8');
const hasImport = launcherContent.includes("import { RiddlesGameScreen } from './RiddlesGameScreen';");
const hasRoute = launcherContent.includes("case 'internal.game.riddles100':");
console.log(`[TEST 6] Router trong KidsLauncherScreen: import=${hasImport}, route=${hasRoute}`);

if (!isRegisteredInLauncher || !hasImport || !hasRoute) {
  console.error('FAIL: Chưa liên kết đầy đủ vào KidsLauncherScreen!');
  process.exit(1);
}

console.log('\n=== TẤT CẢ 6 HẠNG MỤC KIỂM THỬ ĐÃ ĐẠT 100% TIÊU CHUẨN NGHIỆM THU! ===');
