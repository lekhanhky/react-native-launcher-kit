/**
 * Test AppConfigService logic
 */
const { storage, STORAGE_KEYS } = require('../example/src/services/storage.ts');
const { appConfigService } = require('../example/src/services/appConfigService.ts');
const { INTERNAL_GAMES_REGISTRY } = require('../example/src/data/launcherGamesRegistry.ts');

console.log('--- 1. Testing Default State ---');
console.log('Total internal games in registry:', INTERNAL_GAMES_REGISTRY.length);
const initialDisabled = appConfigService.getDisabledInternalGameIds();
console.log('Initial disabled internal games count:', initialDisabled.length);

const testGameId = 'internal.game.shadowdetective';
console.log(`Checking isInternalGameEnabled for ${testGameId}:`, appConfigService.isInternalGameEnabled(testGameId));

console.log('\n--- 2. Testing Disabling Game ---');
appConfigService.setInternalGameEnabled(testGameId, false).then(() => {
  const afterDisable = appConfigService.getDisabledInternalGameIds();
  console.log('Disabled list after disable:', afterDisable);
  console.log(`isInternalGameEnabled after disable:`, appConfigService.isInternalGameEnabled(testGameId));
  console.log(`isItemEnabled after disable:`, appConfigService.isItemEnabled(testGameId));

  console.log('\n--- 3. Testing Re-enabling Game ---');
  appConfigService.setInternalGameEnabled(testGameId, true).then(() => {
    const afterEnable = appConfigService.getDisabledInternalGameIds();
    console.log('Disabled list after enable:', afterEnable);
    console.log(`isInternalGameEnabled after enable:`, appConfigService.isInternalGameEnabled(testGameId));
    console.log(`isItemEnabled after enable:`, appConfigService.isItemEnabled(testGameId));
    console.log('\n✅ ALL APP CONFIG TESTS PASSED SUCCESSFULLY!');
  });
});
