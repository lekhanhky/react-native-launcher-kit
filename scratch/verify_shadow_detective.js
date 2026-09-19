const fs = require('fs');
const path = require('path');

console.log('=== TEST SUITE: GAME THÁM TỬ SOI ĐÈN PIN (SHADOW DETECTIVE) ===\n');

// 1. Kiểm tra shadowDetectiveData.ts
const dataFilePath = path.join(__dirname, '../example/src/data/shadowDetectiveData.ts');
const dataContent = fs.readFileSync(dataFilePath, 'utf8');

const worlds = ['forest', 'ocean', 'city', 'space'];
worlds.forEach(w => {
  const matches = dataContent.match(new RegExp(`worldId:\\s*'${w}'`, 'g'));
  console.log(`[TEST 1] Thế giới '${w}': ${matches ? matches.length : 0}/10 vụ án`);
  if (!matches || matches.length !== 10) {
    console.error(`Lỗi: Thế giới ${w} không đủ 10 vụ án!`);
    process.exit(1);
  }
});

// 2. Kiểm tra tổng số vụ án
const totalCases = (dataContent.match(/caseNumber:\s*\d+/g) || []).length;
console.log(`[TEST 2] Tổng số vụ án trong dữ liệu: ${totalCases}/40`);
if (totalCases !== 40) {
  console.error('Lỗi: Tổng số vụ án không đúng 40!');
  process.exit(1);
}

// 3. Kiểm tra các trường quan trọng (cluePoem, suspectOptions, funFact, targetWordId)
const clueCount = (dataContent.match(/cluePoem:\s*\[/g) || []).length;
const funFactCount = (dataContent.match(/funFact:\s*'/g) || []).length;
const correctOptionCount = (dataContent.match(/isCorrect:\s*true/g) || []).length;

console.log(`[TEST 3] Thơ manh mối: ${clueCount}/40, Fun Fact: ${funFactCount}/40, Đáp án đúng: ${correctOptionCount}/40`);
if (clueCount !== 40 || funFactCount !== 40 || correctOptionCount !== 40) {
  console.error('Lỗi: Thiếu cluePoem, funFact hoặc đáp án đúng!');
  process.exit(1);
}

// 4. Kiểm tra service
const serviceFilePath = path.join(__dirname, '../example/src/services/shadowDetectiveService.ts');
const serviceContent = fs.readFileSync(serviceFilePath, 'utf8');
const hasStorage = serviceContent.includes('SHADOW_DETECTIVE_PROGRESS');
const hasMarkSolved = serviceContent.includes('markCaseSolved');
const hasRanks = serviceContent.includes('DETECTIVE_RANKS');
console.log(`[TEST 4] Dịch vụ shadowDetectiveService: storage=${hasStorage}, markSolved=${hasMarkSolved}, ranks=${hasRanks}`);
if (!hasStorage || !hasMarkSolved || !hasRanks) {
  console.error('Lỗi trong shadowDetectiveService!');
  process.exit(1);
}

// 5. Kiểm tra đăng ký trong launcher registry
const registryPath = path.join(__dirname, '../example/src/data/launcherGamesRegistry.ts');
const registryContent = fs.readFileSync(registryPath, 'utf8');
const hasRegistry = registryContent.includes("'internal.game.shadowdetective'");
console.log(`[TEST 5] Đăng ký trong launcher registry: ${hasRegistry ? 'PASS' : 'FAIL'}`);
if (!hasRegistry) {
  console.error('Lỗi: Chưa đăng ký trong launcherGamesRegistry!');
  process.exit(1);
}

// 6. Kiểm tra Router trong KidsLauncherScreen
const launcherScreenPath = path.join(__dirname, '../example/src/screens/KidsLauncherScreen.tsx');
const launcherContent = fs.readFileSync(launcherScreenPath, 'utf8');
const hasImport = launcherContent.includes('ShadowDetectiveScreen');
const hasRoute = launcherContent.includes("'internal.game.shadowdetective'");
console.log(`[TEST 6] Router trong KidsLauncherScreen: import=${hasImport}, route=${hasRoute}`);
if (!hasImport || !hasRoute) {
  console.error('Lỗi: Chưa tích hợp router trong KidsLauncherScreen!');
  process.exit(1);
}

console.log('\n=== TẤT CẢ 6 HẠNG MỤC KIỂM THỬ ĐÃ ĐẠT 100% TIÊU CHUẨN NGHIỆM THU! ===');
